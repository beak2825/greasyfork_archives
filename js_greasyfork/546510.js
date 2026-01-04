// ==UserScript==
// @name 乾淨的YouTube Shorts影片
// @namespace https://github.com/Max46656
// @version 1.0.1
// @description 把影片標題、創作者資訊與更多有的沒的改成透明，直到你將滑鼠指向該區域
// @author Max
// @supportURL https://github.com/Max46656/EverythingInGreasyFork/issues
// @license MPL2.0
// @grant GM_addStyle
// @run-at document-start
// @match https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/546510/%E4%B9%BE%E6%B7%A8%E7%9A%84YouTube%20Shorts%E5%BD%B1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/546510/%E4%B9%BE%E6%B7%A8%E7%9A%84YouTube%20Shorts%E5%BD%B1%E7%89%87.meta.js
// ==/UserScript==

(function() {
let css = `
    :root {
        --default-opacity: 0;   /* 預設透明度 */
        --hover-opacity: 0.8;   /* 滑鼠懸停時的透明度 */
    }

    ytd-reel-player-overlay-renderer .metadata-container.style-scope {
        opacity: var(--default-opacity) !important;
        transition: opacity 0.3s ease !important;
    }

    ytd-reel-player-overlay-renderer .metadata-container.style-scope:hover {
        opacity: var(--hover-opacity) !important;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
