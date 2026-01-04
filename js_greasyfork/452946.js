// ==UserScript==
// @name         age动漫链接跳转优化
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  将番剧点击链接换为打开新标签页，优化点击逻辑
// @author       You
// @match        https://www.agemys.cc/
// @match        https://www.agemys.net/
// @match        http://www.ntyou.cc/
// @match        http://www.ntdm8.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agemys.cc
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452946/age%E5%8A%A8%E6%BC%AB%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/452946/age%E5%8A%A8%E6%BC%AB%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let blocks = document.getElementsByClassName("blockcontent");
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const links = block.getElementsByTagName("a");
        for (let j = 0; j < links.length; j++) {
            const element = links[j];
            element.setAttribute('target', '_blank')

        }
    }

})();