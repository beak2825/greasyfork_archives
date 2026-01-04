// ==UserScript==
// @name         战舰世界1.4.8扫雪统计
// @namespace    http://tampermonkey.net/
// @version      2025-08-27
// @description  在军械库中获取战舰世界你每一级的战舰数量(需要登录), 军械库左上角会出现按钮
// @author       HeriX
// @match        https://armory.wowsgame.cn/*
// @match        https://armory.worldofwarships.asia/*
// @match        https://armory.worldofwarships.com/*
// @match        https://armory.worldofwarships.eu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=armory.wowsgame.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547531/%E6%88%98%E8%88%B0%E4%B8%96%E7%95%8C148%E6%89%AB%E9%9B%AA%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/547531/%E6%88%98%E8%88%B0%E4%B8%96%E7%95%8C148%E6%89%AB%E9%9B%AA%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ShipDatas;
    const elements = document.getElementsByClassName('PageHeader_header');
    console.log('PageHeader_header', elements.length)
    if(elements.length > 0){
        const header = elements[0];
        const link = document.createElement('a');
        link.textContent = '舰船统计';
        link.className = 'btn b b-transparent b-md';
        link.style.margin = '10px';
        link.style.position = 'fixed';
        link.style.top = '10px';
        link.style.left = '10px';
        document.body.appendChild(link);//页面左上角增加按钮

        link.addEventListener('click', function() {
            fetch(metashop.settings.urls.accountInventoryVrtx, {//仓库API
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                ShipDatas = data.data.ships;//获取到本人拥有的战舰ID列表
                getShipDb();
            })
            .catch(error => console.error('请求出错:', error));
        });
    }
    function getShipDb() {
        const request = indexedDB.open('WoWS-Entities-Database');//WG缓存的战舰百科数据数据库

        request.onerror = function(event) {
            console.error('Database error:', event.target.errorCode);
        };

        request.onsuccess = function(event) {
            readDb(event.target.result);
        };

        request.onupgradeneeded = function(event) {
            readDb(event.target.result);
        };
    }
    function readDb(db){
        const transaction = db.transaction(['collection']);
        const objectStore = transaction.objectStore('collection');
        const request = objectStore.get('ship');//舰船百科

        request.onerror = function(event) {
            console.error('Unable to retrieve data', event.target.errorCode);
        };

        request.onsuccess = function(event) {
            if (request.result) {
                getShipDetails( request.result.data);//获取到百科舰船列表, 其中有每个舰船ID对应的等级信息
            } else {
                console.log('Data not found');
            }
        };
    }
    function getShipDetails(shipDict) {//计算每个等级的数目
        let count = [0,0,0,0,0,0,0,0,0,0,0];
        const tokens = [0,0,0,0,25,35,50,75,100,125,0];
        let total_tokens = 0;
        for(let ship of ShipDatas){
            const shipDetail = shipDict[ship];
            if(shipDetail){
                total_tokens += tokens[shipDetail.level-1];
                count[shipDetail.level-1]++;
            }
        }
        let str = `你一共有${ShipDatas.length}条船`;
        for(let i=1;i<count.length;i++){
            str += `\r\n${i+1}级船数量: ${count[i]}`;
        }
        str += `\n扫雪总共可以获得代币${total_tokens}`;
        alert(str)
    }
})();