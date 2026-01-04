// ==UserScript==
// @name         Zddhub Watermark Remover
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  去除zddhub的水印
// @author       Indekkusu
// @license      MIT
// @match        https://zddhub.com/watermark/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zddhub.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/462574/Zddhub%20Watermark%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/462574/Zddhub%20Watermark%20Remover.meta.js
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(`#root {
    position: relative;
    z-index: 1;
  }`);

})();
