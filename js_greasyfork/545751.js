// ==UserScript==
// @name         Hi-PDA 大图 (限制宽高)
// @namespace    http://tampermonkey.net/
// @version      2025-08-13
// @description  Hi-PDA 大图爽爽看
// @author       ChatGPT
// @match        *://www.4d4y.com/*
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545751/Hi-PDA%20%E5%A4%A7%E5%9B%BE%20%28%E9%99%90%E5%88%B6%E5%AE%BD%E9%AB%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545751/Hi-PDA%20%E5%A4%A7%E5%9B%BE%20%28%E9%99%90%E5%88%B6%E5%AE%BD%E9%AB%98%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function replaceImages() {
    const images = document.querySelectorAll("img");

    images.forEach((img) => {
      let src = img.src;

      if (
        src.toLowerCase().endsWith(".thumb.jpg") ||
        src.toLowerCase().endsWith(".thumb.png")
      ) {
        let newSrc = src.replace(/\.thumb\.(jpg|png)$/i, "");
        img.src = newSrc;

        // 限制最大宽度和最大高度
        img.style.maxWidth = "min(600px, 50vw)";
        img.style.maxHeight = "min(800px, 90vh)";
        img.style.height = "auto";
        img.style.width = "auto";

        img.onclick = function () {
          window.open(this.src, "_blank");
        };
      }
    });
  }

  const observer = new MutationObserver(() => {
    replaceImages();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener("load", replaceImages);
})();
