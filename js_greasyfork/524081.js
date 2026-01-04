// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-01-17
// @description  绕开chrome单次下载数量限制
// @author       whq
// @match        https://ncm.worthsee.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worthsee.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524081/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/524081/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.alert("csss");



   window.downloadAll=function () {
    var els = document.getElementsByClassName("result-download-link");
    var index = 0;

    function downloadNext() {
        if (index < els.length) {
            els[index].click();
            index++;
            setTimeout(downloadNext, 100); // 延迟100毫秒后下载下一个文件
        }
    }
    downloadNext();
}
})();