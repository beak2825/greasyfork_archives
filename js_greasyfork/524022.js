// ==UserScript==
// @name         网页反色
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  提供一个菜单来切换网页反色效果, 有记忆功能
// @author       xxnuo
// @license      MIT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/524022/%E7%BD%91%E9%A1%B5%E5%8F%8D%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/524022/%E7%BD%91%E9%A1%B5%E5%8F%8D%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前网站的host
    const host = window.location.host;

    // 从存储中获取反色状态
    let isInverted = GM_getValue(`isInverted_${host}`, false);

    // 初始化页面状态
    if (isInverted) {
        document.documentElement.style.filter = 'invert(1)';
    }

    // 切换反色效果的函数
    function toggleInvert() {
        if (isInverted) {
            document.documentElement.style.filter = 'none';
            isInverted = false;
        } else {
            document.documentElement.style.filter = 'invert(1)';
            isInverted = true;
        }
        // 保存当前状态,使用host作为key
        GM_setValue(`isInverted_${host}`, isInverted);
    }

    // 删除当前网站设置的函数
    function clearSetting() {
        GM_deleteValue(`isInverted_${host}`);
        document.documentElement.style.filter = 'none';
        isInverted = false;
    }

    GM_registerMenuCommand(`切换网页反色 (${host})`, toggleInvert);

    // 只在有存储数据时显示菜单
    if(GM_getValue(`isInverted_${host}`) !== undefined) {
        GM_registerMenuCommand(`删除当前网站反色设置 (${host})`, clearSetting);
    }
})();
