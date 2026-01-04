// ==UserScript==
// @name         破解电影先生弹框问题
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://dyxs28.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490962/%E7%A0%B4%E8%A7%A3%E7%94%B5%E5%BD%B1%E5%85%88%E7%94%9F%E5%BC%B9%E6%A1%86%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/490962/%E7%A0%B4%E8%A7%A3%E7%94%B5%E5%BD%B1%E5%85%88%E7%94%9F%E5%BC%B9%E6%A1%86%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

  // 关闭弹框
    function closePopups() {
        const popups = document.querySelectorAll('.popup.popup-ts.popup-tc.popupicon.open');
        const popupss = document.querySelectorAll('.popup.popup-tips.popupicon.open');
        const loads = document.querySelectorAll('#load');
        const load = document.querySelectorAll('#load_main');
        popups.forEach(popup => {
            popup.style.display = 'none';
        });
        popupss.forEach(popup => {
            popup.style.display = 'none';
        });
         loads.forEach(popup => {
            popup.style.display = 'none';
        });
         load.forEach(popup => {
            popup.style.display = 'none';
        });
    }

    closePopups();
    // 监听页面加载完成事件
    //window.addEventListener('load', closePopups);

})();