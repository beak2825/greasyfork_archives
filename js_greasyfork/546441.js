// ==UserScript==
// @name        360photocam.com - Download panorama button
// @description Adds a button to 360photocam.com's panorama viewer to download the panorama image
// @namespace   me.netux.site/user-scripts/360-photocam/download-panorama
// @match       https://360photocam.com/online-viewer*
// @grant       none
// @version     1.0.0
// @author      Netux
// @license     MIT
// @run-at      document-end
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2.2.1
// @downloadURL https://update.greasyfork.org/scripts/546441/360photocamcom%20-%20Download%20panorama%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/546441/360photocamcom%20-%20Download%20panorama%20button.meta.js
// ==/UserScript==

(() => {
  let panoUrl;

  for (const scriptEl of document.querySelectorAll('script')) {
    const match = scriptEl.textContent.match(/const imageData\s*=\s*(["'])(?<panoUrl>data:image\\\/jpeg;base64,.+)\1/);
    if (match) {
      panoUrl = eval(`"${match.groups.panoUrl}"`);
      break;
    }
  }

  const buttonsRowEl = document.querySelector('.second-section .conatiner.frm__btnn .row');
  {
    const eightColButtonContainerEl = buttonsRowEl.querySelector('.col-md-8');
    eightColButtonContainerEl.classList.remove('col-md-8');
    eightColButtonContainerEl.classList.add('col-md-4');
  }

  const downloadButtonEl = VM.hm('button', { class: 'make__button' }, 'Download panorama');
  downloadButtonEl.addEventListener('click', async () => {
    const blob = await fetch(panoUrl).then((res) => res.blob());
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, /* target: */ '_blank');
  });

  buttonsRowEl.append(
    VM.hm('div', { class: 'col-md-4' }, [
      VM.hm('div', { class: 'make_btn' }, [
        downloadButtonEl
      ])
    ])
  );
})();
