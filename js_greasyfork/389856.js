// ==UserScript==
// @name         刺猬猫
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去下方打开弹幕的div
// @author       憨批一个
// @match        https://www.ciweimao.com/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/389856/%E5%88%BA%E7%8C%AC%E7%8C%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/389856/%E5%88%BA%E7%8C%AC%E7%8C%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var m = document.getElementById("J_BarrageBox");
    m.parentNode.removeChild(m);

    var n = document.getElementsByClassName("barrage-inner")[0];
    n.parentNode.removeChild(n);
})();