// ==UserScript==
// @name         应届生求职网直接跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  直接跳转网站，不用等待
// @author       You
// @match        http://www.yingjiesheng.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yingjiesheng.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448347/%E5%BA%94%E5%B1%8A%E7%94%9F%E6%B1%82%E8%81%8C%E7%BD%91%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/448347/%E5%BA%94%E5%B1%8A%E7%94%9F%E6%B1%82%E8%81%8C%E7%BD%91%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var data = document.getElementsByClassName('el')[0].getElementsByTagName('a')[0];
    data.href = data.text;
    // Your code here...
})();