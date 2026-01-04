// ==UserScript==
// @name         云盘1去掉弹窗
// @namespace    http://tampermonkey.net/
// @version      2024-06-01
// @description  去掉yunpan1.co网站的骚扰关注弹窗
// @author       Hinjin
// @license      MIT
// @match        https://yunpan1.co
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yunpan1.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496751/%E4%BA%91%E7%9B%981%E5%8E%BB%E6%8E%89%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/496751/%E4%BA%91%E7%9B%981%E5%8E%BB%E6%8E%89%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        let input = document.querySelector('#secretCode');
        if (input) {
            input.parentElement.parentElement.remove();
        }
    });

})();