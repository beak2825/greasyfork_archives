// ==UserScript==
// @name         百度pc首页信息流去除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除百度pc首页信息流
// @author       You
// @match        https://www.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447349/%E7%99%BE%E5%BA%A6pc%E9%A6%96%E9%A1%B5%E4%BF%A1%E6%81%AF%E6%B5%81%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/447349/%E7%99%BE%E5%BA%A6pc%E9%A6%96%E9%A1%B5%E4%BF%A1%E6%81%AF%E6%B5%81%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var dv=document.getElementById("s_wrap");
    dv.innerHTML = "";
})();