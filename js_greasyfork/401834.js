// ==UserScript==
// @name         双击关闭页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  双击页面任意位置即可关闭页面
// @author       inch
// @match        http*://*/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/401834/%E5%8F%8C%E5%87%BB%E5%85%B3%E9%97%AD%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/401834/%E5%8F%8C%E5%87%BB%E5%85%B3%E9%97%AD%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function () {
    document.addEventListener('dblclick', function (e) {
        window.close();
    });
})();