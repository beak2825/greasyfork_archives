// ==UserScript==
// @name        OC Presentation Download Button
// @namespace   Violentmonkey Scripts
// @match       https://oc-presentation.ltcc.tuwien.ac.at/*/watch.html
// @run-at      document-end
// @grant       none
// @version     1.1
// @author      oodeagleoo
// @description Adds a simple button to start downloading the currently selected video.
// @downloadURL https://update.greasyfork.org/scripts/434636/OC%20Presentation%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/434636/OC%20Presentation%20Download%20Button.meta.js
// ==/UserScript==

const TIMEOUT = 10000;

async function waitForElement(selector, timeout) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
    } else {
      const observer = new MutationObserver((_, observer) => {
        Array.from(document.querySelectorAll(selector)).forEach(element => {
          clearTimeout(timeoutHandle);
          observer.disconnect();
          resolve(element);
        });
      });
      
      let timeoutHandle;
      if (timeout) {
        timeoutHandle = setTimeout(() => {
          observer.disconnect();
          reject('Element not found. Timed out');
        }, timeout);
      }
      
      observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    }
  });
}

async function addDownloadButton() {
  const plugins = await waitForElement('.playbackBarPlugins', TIMEOUT);
  const button = createDownloadButton();
  plugins.appendChild(button);
}

function createDownloadButton() {
  const button = document.createElement('button');
  button.innerHTML = 'Download';
  button.type = 'button';
  button.classList.add('buttonPlugin', 'right', 'downloadButton');
  button.style.color = 'white';
  button.addEventListener('click', fetchSourceAndStartDownload);
  return button;
}

async function fetchSourceAndStartDownload() {
  const [source, title] = await Promise.all(['video > source', 'head > title'].map(selector => waitForElement(selector, TIMEOUT)));
  const a = document.createElement('a');
  a.href = source.src;
  a.download = title.innerText ?? 'video';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

(async () => {
  const playButton = await waitForElement('#lazyLoadThumbnailContainer', TIMEOUT);
  playButton.addEventListener('click', addDownloadButton);
})(); 
