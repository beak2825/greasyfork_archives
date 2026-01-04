// ==UserScript==
// @name         清除eyny個人頁面背景
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清除eyny個人頁面背景 讓他變黑色
// @author       CK Aznable
// @match        http://*.eyny.com/space-uid-*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eyny.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461159/%E6%B8%85%E9%99%A4eyny%E5%80%8B%E4%BA%BA%E9%A0%81%E9%9D%A2%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/461159/%E6%B8%85%E9%99%A4eyny%E5%80%8B%E4%BA%BA%E9%A0%81%E9%9D%A2%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("ct").setAttribute("style", "background-image: unset !important; background-color: black !important")
    document.getElementById("hd").remove()
})();