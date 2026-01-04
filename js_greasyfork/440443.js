// ==UserScript==
// @name         CSDN解除代码复制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  CSDN, 解除代码复制
// @author       恭喜发财
// @match        https://blog.csdn.net/*
// @icon         https://placeimg.com/640/480/nature
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440443/CSDN%E8%A7%A3%E9%99%A4%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/440443/CSDN%E8%A7%A3%E9%99%A4%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let dom = document.getElementsByTagName('code');
    for (let i = 0; i < dom.length; i++) {
        dom[i].style.cssText="user-select:all!important;"
    }
})();