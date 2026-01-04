// ==UserScript==
// @name         屏蔽bilibili旧版动态页的“体验新版”按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide the shit button.
// @author       Astrallation
// @match       *://t.bilibili.com/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492136/%E5%B1%8F%E8%94%BDbilibili%E6%97%A7%E7%89%88%E5%8A%A8%E6%80%81%E9%A1%B5%E7%9A%84%E2%80%9C%E4%BD%93%E9%AA%8C%E6%96%B0%E7%89%88%E2%80%9D%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/492136/%E5%B1%8F%E8%94%BDbilibili%E6%97%A7%E7%89%88%E5%8A%A8%E6%80%81%E9%A1%B5%E7%9A%84%E2%80%9C%E4%BD%93%E9%AA%8C%E6%96%B0%E7%89%88%E2%80%9D%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
window.onload = function()
{
    'use strict';
    let elements = document.getElementsByClassName('bili-dyn-version-control');
    for (let el of elements) {
        el.style.display = 'none';
    }
};