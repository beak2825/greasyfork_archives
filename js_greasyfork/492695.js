// ==UserScript==
// @name         E站在新标签中打开漫画
// @namespace    http://tampermonkey.net/
// @version      2024-04-16
// @description  open a new page to load comic
// @author       You
// @match        https://e-hentai.org/?*
// @match        https://e-hentai.org/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-hentai.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492695/E%E7%AB%99%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E4%B8%AD%E6%89%93%E5%BC%80%E6%BC%AB%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/492695/E%E7%AB%99%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E4%B8%AD%E6%89%93%E5%BC%80%E6%BC%AB%E7%94%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let a_elements = document.querySelectorAll(".glname>a");

    for (let a_e of a_elements)
    {
        a_e.target = "_blank";
    }
})();