// ==UserScript==
// @name         Kobo download all boks
// @namespace    http://tampermonkey.net/
// @version      2024-06-20_2
// @description  Add a "Download all books" button on left of sorting controls to download all the .acsm file of current page.
// @author       You
// @match        https://www.kobo.com/tw/zh/library/books*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kobo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498399/Kobo%20download%20all%20boks.user.js
// @updateURL https://update.greasyfork.org/scripts/498399/Kobo%20download%20all%20boks.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const cssContent = `
.download-all-button {
  color: #444444;
  font-weight: 700;
  font-size: 1.4rem;
  font-family: "Trebuchet MS", Trebuchet, Arial, Helvetica, sans-serif;
  border: 1px solid rgb(0, 0, 0);
}

.download-all-button:hover {
  background-color: rgba(0, 0, 0, .04);
}
`;
  function main() {
    loadCss(cssContent);

    const controlsContainer = document.querySelector('.secondary-controls');
    const button = document.createElement('button');
    button.className = 'download-all-button';
    button.innerText = 'Download all books';
    button.onclick = downloadAllBooks;
    controlsContainer.insertBefore(button, controlsContainer.firstChild);
  }

  function downloadAllBooks() {
    const elements = Array.from(document.querySelectorAll('[data-kobo-gizmo-config*="downloadUrls"]'));
    const bookUrls = new Set();
    elements.forEach((element) => {
      const configString = element.getAttribute('data-kobo-gizmo-config');
      const config = JSON.parse(configString);
      const url = config.downloadUrls.map((u) => u.url).filter((u) => u)[0];
      bookUrls.add(url);
    });
    bookUrls.forEach((url) => downloadFile(url));
  }

  function downloadFile(url, fileName) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = fileName;
    a.target = '_blank';
    a.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  function loadCss(css) {
    const styleElement = document.createElement('style');
    styleElement.innerText = css;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }

  main();
})();
