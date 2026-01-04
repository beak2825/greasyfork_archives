// ==UserScript==
// @name         VSCode Marketplace – Direct VSIX Download
// @namespace    https://github.com/sreyemnayr
// @version      0.2.1
// @description  Adds a “Download VSIX” button to VS Code Marketplace pages, keeps it there, and saves the file with a proper name.
// @author       Ryan Meyers (sreyemnayr)
// @match        https://marketplace.visualstudio.com/items*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541728/VSCode%20Marketplace%20%E2%80%93%20Direct%20VSIX%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/541728/VSCode%20Marketplace%20%E2%80%93%20Direct%20VSIX%20Download.meta.js
// ==/UserScript==

async function injectDownloadButton () {
  /*—-1-— make sure we’re on an extension-detail page —*/
  const params   = new URLSearchParams(location.search);
  const itemName = params.get('itemName');                       // e.g. Balastrong.close-tabs
  if (!itemName || !itemName.includes('.')) return;

  /* If the button is already in the DOM, nothing to do */
  if (document.getElementById('vsix-download-container')) return;

  const [publisher, extension] = itemName.split('.');

  /*—-2-— pull metadata for latest VSIX —*/
  const apiUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/vscode/${publisher}/${extension}/latest`;
  let latest, version, vsixUrl;
  try {
    const json = await fetch(apiUrl).then(r => r.json());
    latest  = json?.versions?.[0];
    version = latest?.version ?? '0.0.0';
    vsixUrl = latest?.files?.find(f => f.assetType === 'Microsoft.VisualStudio.Services.VSIXPackage')?.source;
    if (!vsixUrl) return;
  } catch (e) {
    console.error('[VSIX] metadata fetch failed:', e);
    return;
  }

  /*—-3-— find the Install button so we can clone its look —*/
  const install   = document.querySelector('.install');
  const container = install?.closest('.ux-oneclick-install-button-container')?.parentNode;
  if (!install || !container) return;

  const dlBtn = install.cloneNode(true);
  dlBtn.id = 'vsix-download-button';
  dlBtn.querySelector('*').textContent = 'Download VSIX';
  dlBtn.removeAttribute('href');               // we handle click ourselves
  dlBtn.style.pointerEvents = 'auto';

  dlBtn.addEventListener('click', async ev => {
    ev.preventDefault();
    const label = dlBtn.querySelector('*');
    const originalText = label.textContent;
    label.textContent = 'Fetching…';

    try {
      const buffer = await fetch(vsixUrl).then(r => r.arrayBuffer());
      const blob   = new Blob([buffer], { type: 'application/octet-stream' });
      const url    = URL.createObjectURL(blob);

      const tmp = document.createElement('a');
      tmp.href = url;
      tmp.download = `${publisher}.${extension}.${version}.vsix`;
      document.body.appendChild(tmp);
      tmp.click();
      tmp.remove();
      URL.revokeObjectURL(url);

      label.textContent = 'Downloaded ✔';
      setTimeout(() => (label.textContent = originalText), 2500);
    } catch (err) {
      console.error('[VSIX] download failed:', err);
      label.textContent = 'Error – try again';
      setTimeout(() => (label.textContent = originalText), 3000);
    }
  });

  const wrap = document.createElement('div');
  wrap.id = 'vsix-download-container';
  wrap.appendChild(dlBtn);
  container.appendChild(wrap);

  console.log('[VSIX] Download button added →', vsixUrl);
}

/*—-4-— keep the button present even if the page rewrites the DOM —*/
setInterval(injectDownloadButton, 1000);       // every second
window.addEventListener('popstate', injectDownloadButton); // SPA navigation support
