// ==UserScript==
// @name         碧藍幻想共斗篩選
// @namespace    見ろ，人がゴミのようだ
// @version      0.1
// @description  共斗篩選
// @author       Ironys
// @match        *://game.granbluefantasy.jp/
// @match        *://gbf.game.mbga.jp/*
// @icon         https://wallpaperaccess.com/full/2286860.jpg
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488354/%E7%A2%A7%E8%97%8D%E5%B9%BB%E6%83%B3%E5%85%B1%E6%96%97%E7%AF%A9%E9%81%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/488354/%E7%A2%A7%E8%97%8D%E5%B9%BB%E6%83%B3%E5%85%B1%E6%96%97%E7%AF%A9%E9%81%B8.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //設定
    const opacity = GM_getValue('gbf_assist_opacity', 0.25);
    const targetNode = document.querySelector("#wrapper>.contents");
    const config = { childList: true, subtree: true };

    let selectedRooms = GM_getValue('selectedRooms', []);
    //切換選擇狀態
    function toggleRoom(roomId) {
        if (selectedRooms.includes(roomId)) {
            selectedRooms = selectedRooms.filter(id => id !== roomId);
        } else {
            selectedRooms.push(roomId);
        }
        GM_setValue('selectedRooms', selectedRooms);
        observer.disconnect();
        observer.observe(targetNode, config);
        }
    //觀察器修改透明度
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            let room_list = mutation.target.querySelectorAll(".btn-wanted-room");
            for (let room of room_list) {
                let roomImage = room.querySelector(".img-quest-thumb").getAttribute("src");
                if (!selectedRooms.includes(roomImage)) {
                    room.style.opacity = opacity;
                }
            }
        }
    });
    //圖片ID與名稱的映射
    const roomMap = {
        'https://prd-game-a1-granbluefantasy.akamaized.net/assets/img/sp/quest/assets/lobby/305581.png': '极路',
        'https://prd-game-a1-granbluefantasy.akamaized.net/assets/img/sp/quest/assets/lobby/305491.png': '天元'
    };
    //按鈕，修改在刷新後生效
    GM_registerMenuCommand('查看已選擇的房', () => {
        let selectedRoomNames = selectedRooms.map(roomId => roomMap[roomId]);
        alert(`查看已選擇的房：\n${selectedRoomNames.join("\n")}`);
    });
    GM_registerMenuCommand('极路', () => toggleRoom('https://prd-game-a1-granbluefantasy.akamaized.net/assets/img/sp/quest/assets/lobby/305581.png'));
    GM_registerMenuCommand('天元', () => toggleRoom('https://prd-game-a1-granbluefantasy.akamaized.net/assets/img/sp/quest/assets/lobby/305491.png'));
    //頁面加載完成後啟動觀察器
    window.addEventListener('DOMContentLoaded', () => observer.observe(targetNode, config));
})();