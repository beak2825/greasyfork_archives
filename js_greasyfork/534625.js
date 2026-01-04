// ==UserScript==
// @name         禁漫去广告
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  18comic.vip 禁漫 去广告
// @author       uncharity
// @match        https://18comic.vip/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=18comic.vip
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534625/%E7%A6%81%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/534625/%E7%A6%81%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function injectCSS() {
    const style = document.createElement("style");
    style.textContent = `
            #Comic_Top_Nav {
                top: 0 !important;
                margin-bottom: 0 !important;
            }
            [style*="position: fixed"][style*="overflow: hidden"][style*="margin: 0px auto"][style*="transform: translate3d(0px, 0px, 0px) translateX(-50%)"][style*="height: auto"][style*="box-sizing: border-box"][style*="display: flex"][style*="bottom: 0px"][style*="left: 50%"] {
                display: none !important;
            }
        `;
    document.head.appendChild(style);
  }
  injectCSS();
  function hideElements() {
    const selectors = [
      `[data-group="photo_center_games_1"]`, //最上面的广告
      `[data-group="photo_center_1"]`, //中间的广告
      `[data-group="photo_bottom1"]`, //最底下的广告
      `[data-group="photo_bottom2"]`, //最底下的广告
      `[data-group="photo_bottom3"]`, //最底下的广告
      `[data-group="photo_bottom4"]`, //最底下的广告
      `[style*="text-align:center"][style*="margin: 0 auto"][style*="max-width: 100%"]`, //播放完的广告
      ".float_right", //靠右的三个操作按钮
      ".center.scramble-page.thewayhome", //回家的路
      ".mobile-ad",
      `div[class$="b_sticky2"]`,
      `[data-group="album_related1"]`,
      `[data-group="album_related2"]`,
      `[data-group="album_related3"]`,
      `[data-group="album_related4"]`,
      `[data-group="all_bottom1"]`,
      `[data-group="all_bottom2"]`,
      `[data-group="all_bottom3"]`,
      `[data-group="all_bottom4"]`,
      `[data-group="all_bottom5"]`,
      `[data-group="all_bottom6"]`,
      `[data-group="all_bottom7"]`,
      `[data-group="all_bottom8"]`,
      ".top-nav",
      ".div-bf-pv",
    ];
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.remove();
      });
    });
  }
  hideElements();
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        hideElements();
      }
    });
  });
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }
  window.addEventListener("load", hideElements);
})();
