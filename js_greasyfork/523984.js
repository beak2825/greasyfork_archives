// ==UserScript==
// @name         暴力防止在其他台輸入"小葵"相關敏感關鍵字
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  當你在別的聊天室輸入敏感關鍵字時直接移除整個聊天室輸入欄元素
// @author       鮪魚大師
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523984/%E6%9A%B4%E5%8A%9B%E9%98%B2%E6%AD%A2%E5%9C%A8%E5%85%B6%E4%BB%96%E5%8F%B0%E8%BC%B8%E5%85%A5%22%E5%B0%8F%E8%91%B5%22%E7%9B%B8%E9%97%9C%E6%95%8F%E6%84%9F%E9%97%9C%E9%8D%B5%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/523984/%E6%9A%B4%E5%8A%9B%E9%98%B2%E6%AD%A2%E5%9C%A8%E5%85%B6%E4%BB%96%E5%8F%B0%E8%BC%B8%E5%85%A5%22%E5%B0%8F%E8%91%B5%22%E7%9B%B8%E9%97%9C%E6%95%8F%E6%84%9F%E9%97%9C%E9%8D%B5%E5%AD%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targetSelector = 'div[role="textbox"][contenteditable="true"]';
    const containerSelector = '#live-page-chat > div > div > div.Layout-sc-1xcs6mc-0.iTiPMO.chat-shell.chat-shell__expanded > div > div > section > div > seventv-container';
    const sensitiveKeywords = [
        '小葵', '葵寶', '葵神', '倉鼠', '阿葵', '可愛派對', '卡哇伊派對', 'kwaiparty',//小葵相關關鍵字
        'kwaiWhat', 'kwaiSullen', 'kwaiHAHA', 'kwaiSor', 'kwaiCute', 'kwaiNote',//層1貼圖
        'kwaiFat1', 'kwaiRRR', 'kwaiZzz', 'kwaiYa', 'kwaiGood', 'kwaiNo', 'kwaiOrz',
        'kwaiBOT', 'kwaiSofa', 'kwaiCute2', 'kwaiStare', 'kwaiSAD', 'kwaiQAQ', 'kwaiShiny',
        'kwaiSlippers', 'kwaiLook', 'kwaiStaring', 'kwaiKappa', 'kwaiOwO', 'kwaiMad',
        'kwaiNana', 'kwaiLike', 'kwaiSmirk', 'kwaiHaosiong', 'kwai777', 'kwaiLove',
        'kwaiDancing', 'kwaiYeeeee', 'kwaiPupupu', 'kwaiQuilt', 'kwaiLoading', 'kwaiRIP',
        'kwaiJump', 'kwaiBlabla', 'kwaiFaint', 'kwaiShiny2', 'kwaiSleep', 'kwaiAttack',
        'kwaiTouchhead', 'kwaiBob', 'kwaiHEY1', 'kwaiTuT', 'kwaiStartle', 'kwaiHeart',
        'kwaiCar',//1000小奇點貼圖
        'kwaiPu',//層2貼圖
        'KwaiWww', 'KwaiX'//層3貼圖
    ];
    let isComposing = false;

    function checkAndRemoveContainer() {
        if (location.href.includes('https://www.twitch.tv/kwaiparty')) {
            return;
        }

        const inputBox = document.querySelector(targetSelector);
        if (inputBox) {
            const textContent = inputBox.textContent;

            if (sensitiveKeywords.some(keyword => textContent.includes(keyword))) {
                console.log(`偵測到敏感關鍵字 "${textContent}", 移除整個元素...`);
                const container = document.querySelector(containerSelector);
                if (container) {
                    container.parentElement.removeChild(container);
                }
            }
        }
    }

    document.addEventListener('compositionstart', () => {
        isComposing = true;
    });

    document.addEventListener('compositionend', () => {
        isComposing = false;
    });

    setInterval(checkAndRemoveContainer, 500);
})();
