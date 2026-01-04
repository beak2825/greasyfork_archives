// ==UserScript==
// @name         超级复制
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  本地文件解除不可选中和复制
// @author       shouhutsh
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458263/%E8%B6%85%E7%BA%A7%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/458263/%E8%B6%85%E7%BA%A7%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    var eles = document.getElementsByTagName('*');
    for (var i = 0; i < eles.length; i++) {
        eles[i].style.userSelect = 'text';
    }
})();