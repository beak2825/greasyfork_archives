// ==UserScript==
// @name         Filter killer 
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Delete all CSS filters | 删除网页中的所有CSS滤镜
// @author       icicleling
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455784/Filter%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/455784/Filter%20killer.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
        * {
            filter: none !important
        }
    `;
  const head = document.querySelector("head");
  head.appendChild(styleEl);
})();
