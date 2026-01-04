// ==UserScript==
// @name         Overleaf - Paste Images from Clipboard
// @namespace    https://github.com/BLumbye/overleaf-userscripts
// @version      0.7
// @description  Paste images from your clipboard directly into Overleaf (Community Edition, Cloud and Pro)
// @author       Sebastian Haas, Benjamin Lumbye
// @license      GPL-3
// @match        https://www.overleaf.com/project/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461190/Overleaf%20-%20Paste%20Images%20from%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/461190/Overleaf%20-%20Paste%20Images%20from%20Clipboard.meta.js
// ==/UserScript==

// Based on https://github.com/cmprmsd/Overleaf-Image-Helper

'use strict';

const assetsFolder = 'assets';

// Parse images from the clipboard
function retrieveImageFromClipboardAsBlob(pasteEvent, callback) {
  if (pasteEvent.clipboardData === false) return;
  const items = pasteEvent.clipboardData.items;
  if (items === undefined) return;

  for (let i = 0; i < items.length; i++) {
    // Skip content if not image
    if (items[i].type.indexOf('image') == -1) continue;
    // Retrieve image on clipboard as blob
    const blob = items[i].getAsFile();
    callback(blob);
  }
}

// Upload the image blob
async function uploadImage(imageBlob, hash) {
  try {
    const headers = new Headers();
    headers.append('x-csrf-token', csrfToken);

    const name = `${hash}.png`;
    const formData = new FormData();
    formData.append('relativePath', null);
    formData.append('name', name);
    formData.append('type', 'image/png');
    formData.append('qqfile', imageBlob, name);

    const result = await fetch(
      `${document.location.pathname}/upload?` +
        new URLSearchParams({
          folder_id: _ide.fileTreeManager.findEntityByPath(assetsFolder).id,
        }),
      {
        method: 'POST',
        body: formData,
        headers,
      },
    );
    const json = await result.json();
    console.log('Pasted image asset uploaded, entity id:', json.entity_id);
  } catch (e) {
    console.log(e);
  }
}

async function checkAndCreateAssetsFolder() {
  if (_ide.fileTreeManager.findEntityByPath(assetsFolder)) return;

  console.log('Creating missing assets folder...');
  try {
    await _ide.fileTreeManager.createFolder(assetsFolder, '/');
  } catch (e) {
    console.log(e);
  }
}

document.querySelector('#editor').addEventListener('paste', (e) => {
  retrieveImageFromClipboardAsBlob(e, async (blob) => {
    await checkAndCreateAssetsFolder();
    const reader = new FileReader();
    reader.readAsBinaryString(blob);
    reader.onloadend = () => {
      const hash = CryptoJS.SHA256(reader.result).toString().substring(0, 8);
      console.log('Uploading image...');
      uploadImage(blob, hash);
      const view = _ide.$scope.editor.sharejs_doc.cm6.view;
      const state = view.state;
      const changeSet = state.replaceSelection(`\\begin{figure}[h!]
    \\centering
    \\includegraphics[width=0.66\\textwidth]{assets/${hash}.png}
    \\caption{Caption...}
    \\label{fig:${hash}}
\\end{figure}`);
      changeSet.selection.ranges.map((range) => {
        range.from -= 14 + hash.length;
        range.to -= 14;
      });
      view.dispatch(changeSet);
    };
  });
});
