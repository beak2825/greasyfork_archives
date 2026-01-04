// ==UserScript==
// @name         文小言检测是否有删除确认键
// @description  文小言检测是否有删除确认键1
// @match        https://yiyan.baidu.com/
// @license      GPL-3.0 License
// @version 0.0.1.20240923084800
// @namespace https://greasyfork.org/users/1256247
// @downloadURL https://update.greasyfork.org/scripts/535779/%E6%96%87%E5%B0%8F%E8%A8%80%E6%A3%80%E6%B5%8B%E6%98%AF%E5%90%A6%E6%9C%89%E5%88%A0%E9%99%A4%E7%A1%AE%E8%AE%A4%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/535779/%E6%96%87%E5%B0%8F%E8%A8%80%E6%A3%80%E6%B5%8B%E6%98%AF%E5%90%A6%E6%9C%89%E5%88%A0%E9%99%A4%E7%A1%AE%E8%AE%A4%E9%94%AE.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    window.onload = function () {
setInterval(function() {
    let cc = document.querySelector(".WOyOqERf");
    if (!!cc) {
        cc.click()
    }
},1500)
    }
})();