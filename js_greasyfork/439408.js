// ==UserScript==
// @name         百度搜索手机版去信息流
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  去广告
// @author       jan
// @match        *://*.baidu.com/
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439408/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%89%8B%E6%9C%BA%E7%89%88%E5%8E%BB%E4%BF%A1%E6%81%AF%E6%B5%81.user.js
// @updateURL https://update.greasyfork.org/scripts/439408/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%89%8B%E6%9C%BA%E7%89%88%E5%8E%BB%E4%BF%A1%E6%81%AF%E6%B5%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var temp1 = document.getElementsByClassName("blank-frame")[0];
    temp1.parentNode.removeChild(temp1);
    var temp2 = document.getElementById("bottom");
    temp2.parentNode.removeChild(temp2);
    var temp3 = document.getElementById("navs");
    temp3.parentNode.removeChild(temp3);
})();