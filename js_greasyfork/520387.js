// ==UserScript==
// @name         拓元 step2 購買哪區位置
// @namespace    http://tampermonkey.net/
// @version      2.9
// @license      MIT
// @description  自動跳轉網址並控制頁面層級執行腳本的範圍，並在停止時提醒用戶。
// @author       你
// @match        https://tixcraft.com/ticket/area/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/520387/%E6%8B%93%E5%85%83%20step2%20%E8%B3%BC%E8%B2%B7%E5%93%AA%E5%8D%80%E4%BD%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/520387/%E6%8B%93%E5%85%83%20step2%20%E8%B3%BC%E8%B2%B7%E5%93%AA%E5%8D%80%E4%BD%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const choseGroup = 0; // 使否選擇區域 0關閉 1開啟
    const currentUrl = window.location.href; // 記錄當前網址

    let eventCount = localStorage.getItem('eventCount');
    let day = localStorage.getItem('day') || 0;
    let groupList
    const groupSet=[0,1,2,3]
    // 嘗試從 localStorage 中獲取已儲存的 urls 列表
    let urls = JSON.parse(localStorage.getItem('urls'));

    // 如果 urls 不存在或為空，則從當前網址生成新的網址列表
    if (!urls || urls.length === 0) {
        const match = currentUrl.match(/\/(\d+)$/); // 匹配網址最後的數字
        const baseEventId = match ? parseInt(match[1]) : null;

        if (baseEventId !== null) {
            // 設定生成的場次數量

            const baseUrl = currentUrl.replace(/\/\d+$/, ''); // 去除最後的數字部分

            // 生成連續的網址
            urls = [];
            for (let i = 0; i < eventCount - day; i++) {
                urls.push(`${baseUrl}/${baseEventId + i}`);
            }
            // 將生成的網址列表存入 localStorage
            localStorage.setItem('urls', JSON.stringify(urls));
        }
    }

    // 從 localStorage 中獲取網址列表
    const storedUrls = JSON.parse(localStorage.getItem('urls')) || [];

    const intervalId = setInterval(function() {
        groupList = Array.from(document.querySelectorAll('.area-list ul')).map(ul => ul.id).filter(id => id);
        if(groupList){
            clickset()
        }

        window.addEventListener('beforeunload', () => {
            clearInterval(intervalId); // 點擊後停止定時器
        });

    }, 1000); // 每秒執行一次

    function clickset(){
        let nolink=true
    if (choseGroup == 0) {
        const link = document.querySelector(`.area-list a`);
        if (link) {
            link.click();
            nolink=false;
        }
    } else {
        for (let set of groupSet) {
            console.log(groupList[set])
            const link = document.querySelector(`#${groupList[set]} a`);
            if (link) {
                console.log("click")
                link.click();
                nolink=false;
                return;
            }
        }
        if(nolink){
            const link = document.querySelector(`.area-list a`);
            if (link) {
                link.click();
                nolink=false;
            }
        }
    }
    if(nolink){
            let index = parseInt(localStorage.getItem('urlIndex')) || 0;
           window.location.href = storedUrls[index];
            index = (index + 1) % storedUrls.length;
            localStorage.setItem('urlIndex', index);
        }

    }

})();
