// ==UserScript==
// @name         CSDN复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不用登录就可以复制CSDN的代码
// @author       小白
// @match        https://blog.csdn.net/*
// @icon         https://img-home.csdnimg.cn/images/20210810112254.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433196/CSDN%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/433196/CSDN%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByTagName('style')[0].remove();
})();