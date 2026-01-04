// ==UserScript==
// @name         解除痞客邦無法選取
// @version      0.1
// @description  解除不能選取複製的問題
// @author       John
// @match        *://*.pixnet.net/*
// @grant         none
// @license       MIT License
// @namespace
// @namespace https://greasyfork.org/users/814278
// @downloadURL https://update.greasyfork.org/scripts/448546/%E8%A7%A3%E9%99%A4%E7%97%9E%E5%AE%A2%E9%82%A6%E7%84%A1%E6%B3%95%E9%81%B8%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/448546/%E8%A7%A3%E9%99%A4%E7%97%9E%E5%AE%A2%E9%82%A6%E7%84%A1%E6%B3%95%E9%81%B8%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var bodyObj = document.getElementById('article-main');
    bodyObj.onselectstart = function(){};
    bodyObj.oncontextmenu = function(){};
    bodyObj.ondragstart = function(){};
})();