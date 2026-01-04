// ==UserScript==
// @name         碧藍幻想召喚篩選
// @namespace    見ろ，人がゴミのようだ
// @version      0.3
// @description  篩選需要的友召,根據碧藍幻想救援篩選(https://greasyfork.org/zh-TW/scripts/465142)修改而成
// @author       Ironys
// @match        *://game.granbluefantasy.jp/
// @match        *://gbf.game.mbga.jp/*
// @icon         https://wallpaperaccess.com/full/2286860.jpg
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475252/%E7%A2%A7%E8%97%8D%E5%B9%BB%E6%83%B3%E5%8F%AC%E5%96%9A%E7%AF%A9%E9%81%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/475252/%E7%A2%A7%E8%97%8D%E5%B9%BB%E6%83%B3%E5%8F%AC%E5%96%9A%E7%AF%A9%E9%81%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //設定
    const opacity = GM_getValue('gbf_assist_opacity', 0.25);
    const targetNode = document.querySelector("#wrapper>.contents");
    const config = { childList: true, subtree: true };

    let selectedSummons = GM_getValue('selectedSummons', []);
    //切換召喚的選擇狀態
    function toggleSummon(summonId) {
        if (selectedSummons.includes(summonId)) {
            selectedSummons = selectedSummons.filter(id => id !== summonId);
        } else {
            selectedSummons.push(summonId);
        }
        GM_setValue('selectedSummons', selectedSummons);
        observer.disconnect();
        observer.observe(targetNode, config);
        }
    //觀察器修改透明度
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            let summon_list = mutation.target.querySelectorAll(".btn-supporter");
            for (let summon of summon_list) {
                let summonImage = summon.querySelector(".prt-summon-image").getAttribute("data-image");
                if (!selectedSummons.includes(summonImage)) {
                    summon.style.opacity = opacity;
                }
            }
        }
    });
    //召喚圖片ID與名稱的映射
    const summonMap = {
        '2040080000_02': '光主',
        '2040080000_03': '限超光主',
        '2040080000_04': '170光主',
        '2040090000_02': '暗主',
        '2040090000_03': '限超暗主',
        '2040090000_04': '170暗主',
        '2040094000_02': '火主',
        '2040094000_03': '限超火主',
        '2040094000_04': '170火主',
        '2040100000_02': '水主',
        '2040100000_03': '限超水主',
        '2040100000_04': '170水主',
        '2040098000_02': '風主',
        '2040098000_03': '限超風主',
        '2040098000_04': '170風主',
        '2040020000_02': '風方',
        '2040084000_02': '土主',
        '2040084000_03': '限超土主',
        '2040084000_04': '170土主',
        '2040056000_04': '路',
        '2040003000_04': '巴哈',
        '2040114000': '輝夜',
        '2040290000': '老頭',
        '2040157000': '黃龍',
        '2040158000': '麒麟'
    };
    //按鈕，修改在刷新後生效
    GM_registerMenuCommand('查看已選擇的召喚', () => {
        let selectedSummonNames = selectedSummons.map(summonId => summonMap[summonId]);
        alert(`查看已選擇的召喚：\n${selectedSummonNames.join("\n")}`);
    });
    GM_registerMenuCommand('光主', () => toggleSummon('2040080000_02'));
    GM_registerMenuCommand('限超光主', () => toggleSummon('2040080000_03'));
    GM_registerMenuCommand('170光主', () => toggleSummon('2040080000_04'));
    GM_registerMenuCommand('暗主', () => toggleSummon('2040090000_02'));
    GM_registerMenuCommand('限超暗主', () => toggleSummon('2040090000_03'));
    GM_registerMenuCommand('170暗主', () => toggleSummon('2040090000_04'));
    GM_registerMenuCommand('火主', () => toggleSummon('2040094000_02'));
    GM_registerMenuCommand('限超火主', () => toggleSummon('2040094000_03'));
    GM_registerMenuCommand('170火主', () => toggleSummon('2040094000_04'));
    GM_registerMenuCommand('水主', () => toggleSummon('2040100000_02'));
    GM_registerMenuCommand('限超水主', () => toggleSummon('2040100000_03'));
    GM_registerMenuCommand('170水主', () => toggleSummon('2040100000_04'));
    GM_registerMenuCommand('風主', () => toggleSummon('2040098000_02'));
    GM_registerMenuCommand('限超風主', () => toggleSummon('2040098000_03'));
    GM_registerMenuCommand('170風主', () => toggleSummon('2040098000_04'));
    GM_registerMenuCommand('風方', () => toggleSummon('2040020000_02'));
    GM_registerMenuCommand('土主', () => toggleSummon('2040084000_02'));
    GM_registerMenuCommand('限超土主', () => toggleSummon('2040084000_03'));
    GM_registerMenuCommand('170土主', () => toggleSummon('2040084000_04'));
    GM_registerMenuCommand('路', () => toggleSummon('2040056000_04'));
    GM_registerMenuCommand('巴哈', () => toggleSummon('2040003000_04'));
    GM_registerMenuCommand('輝夜', () => toggleSummon('2040114000'));
    GM_registerMenuCommand('老頭', () => toggleSummon('2040290000'));
    GM_registerMenuCommand('黃龍', () => toggleSummon('2040157000'));
    GM_registerMenuCommand('麒麟', () => toggleSummon('2040158000'));
    //頁面加載完成後啟動觀察器
    window.addEventListener('DOMContentLoaded', () => observer.observe(targetNode, config));
})();