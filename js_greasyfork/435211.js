// ==UserScript==
// @name         禁用alt切换百分比操作
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  禁用本地设计稿alt切换时会变成烦人的百分比的功能
// @author       mars
// @match        *://192.168.200.9/**
// @match        *://files.slbsz.com/**
// @grant        unsafeWindow
// @grant        GM_openInTab
// @icon         https://www.google.com/s2/favicons?domain=200.9
// @downloadURL https://update.greasyfork.org/scripts/435211/%E7%A6%81%E7%94%A8alt%E5%88%87%E6%8D%A2%E7%99%BE%E5%88%86%E6%AF%94%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/435211/%E7%A6%81%E7%94%A8alt%E5%88%87%E6%8D%A2%E7%99%BE%E5%88%86%E6%AF%94%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    window.addEventListener('keydown', function (e) {
        e.stopPropagation()
    },true)
})();