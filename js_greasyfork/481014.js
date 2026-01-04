// ==UserScript==
// @name         しずかなインターネット to Misskey.io
// @namespace    https://x.com/euro_s
// @version      0.1.0
// @description  しずかなインターネットのXへのシェアボタンをmisskey.ioへのシェアに変更します。
// @author       https://sizu.me/euro
// @match        https://sizu.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sizu.me
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481014/%E3%81%97%E3%81%9A%E3%81%8B%E3%81%AA%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%8D%E3%83%83%E3%83%88%20to%20Misskeyio.user.js
// @updateURL https://update.greasyfork.org/scripts/481014/%E3%81%97%E3%81%9A%E3%81%8B%E3%81%AA%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%8D%E3%83%83%E3%83%88%20to%20Misskeyio.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const replaceUrl = "https://misskey.io/share"
  const miSvg = `
  <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="width: 16px; height: 16px; opacity: 1;" xml:space="preserve">
  <style type="text/css">
    .st0{fill:#4B4B4B;}
  </style>
  <g>
    <path class="st0" d="M512,230.431L283.498,44.621v94.807C60.776,141.244-21.842,307.324,4.826,467.379
      c48.696-99.493,149.915-138.677,278.672-143.14v92.003L512,230.431z" style="fill: rgb(75, 75, 75);"></path>
  </g>
  </svg>
  `;

  function replaceShareHref() {
    const shareLink = document.querySelector('footer > div.shrink-0 a');
    if (shareLink) {
      // replace svg
      const svg = shareLink.querySelector('svg');
      if (svg) {
        svg.outerHTML = miSvg;
      }
      shareLink.href = shareLink.href.replace("https://twitter.com/intent/tweet", replaceUrl);
    } else {
      setTimeout(replaceShareHref, 100);
    }
  }

  function watchButton() {
    const btn = document.querySelector('footer > div.shrink-0 > button');
    if (btn) {
      btn.addEventListener('click', replaceShareHref);
    }
    setTimeout(watchButton, 100);
  }

  watchButton();
})();
