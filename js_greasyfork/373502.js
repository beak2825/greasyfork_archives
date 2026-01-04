// ==UserScript==
// @name         VG Thumbnails
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show thumbnail in ViperGirls search result
// @author       metafox12345
// @match        https://vipergirls.to/search.php?searchid=*
// @match        https://vipergirls.to/forumdisplay.php?f=*
// @match        https://vipergirls.to/forums/*/page*?prefixid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373502/VG%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/373502/VG%20Thumbnails.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // const $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);
  const trimLeftLen = "return overlib('".length;
  const trimRightLen = "');".length;

  function addStyles() {
    const css = document.createElement('style');
    css.innerHTML = `
    .vg-preview-section {
      background: #eee;
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-around;
      padding: 16px 0;
    }

    .vg-preview-section img {
      max-width: 240px;
      max-height: 240px;
      box-shadow: 0 0 5px 0px #adadad;
    }
    `;
    document.head.appendChild(css);
  }

  function happy() {
    addStyles();

    const threads = $$('.threadbit');
    if (threads === null) {
      return;
    }

    for (const thread of threads) {
      const anchor = thread.querySelector('h3 .title[onmouseover]');

      if (!anchor) {
        continue;
      }

      // something like "return overlib('....');"
      const mouseOver = anchor.getAttribute('onmouseover');
      const innerHTML = mouseOver.substring(trimLeftLen, mouseOver.length - trimRightLen);
      anchor.removeAttribute('onmouseover');

      // extract thumbnail URLs.
      const html = document.createElement('div');
      html.innerHTML = innerHTML;
      const thumbs = html.querySelectorAll('img');
      const thumbUrls = Array.from(thumbs).map(thumb => thumb.getAttribute('src'));

      // generate the preview section for the thread
      const thumbsPreview = document.createElement('div');
      thumbsPreview.className = "vg-preview-section";
      for (const thumbUrl of thumbUrls) {
        // preview > a > img
        const thumb = document.createElement('img');
        thumb.src = thumbUrl;

        const thumbAnchor = document.createElement('a');
        thumbAnchor.href = thumbUrl;

        thumbAnchor.appendChild(thumb);
        thumbsPreview.appendChild(thumbAnchor);
      }
      thread.appendChild(thumbsPreview);
    }
  }

  happy();
})();