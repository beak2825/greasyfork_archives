// ==UserScript==
// @name         Cracking SVG Downloading
// @namespace    http://tampermonkey.net/
// @version      2024-03-20
// @description  Cracking SVG Downloading. Click the SVG icon after login to download the SVG file for free.
// @author       yusanshi
// @match        https://www.flaticon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flaticon.com
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490357/Cracking%20SVG%20Downloading.user.js
// @updateURL https://update.greasyfork.org/scripts/490357/Cracking%20SVG%20Downloading.meta.js
// ==/UserScript==

(function () {
  'use strict';

  document.arrive('#download-free', function () {
    this.click();
  });

  document.arrive('#download > a.btn-svg', { existing: true }, function () {
    this.querySelector('i').remove();
    this.addEventListener('click', async () => {
      const imageId = window.location.pathname.split('_').at(-1);
      const data = await fetch(
        `https://www.flaticon.com/editor/icon/svg/${imageId}?type=standard`
      ).then((e) => e.json());

      // https://stackoverflow.com/questions/3749231/download-file-using-javascript-jquery
      fetch(data.url)
        .then((resp) => resp.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `${window.location.pathname.split('/').at(-1)}.svg`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        });
    });
  });
})();
