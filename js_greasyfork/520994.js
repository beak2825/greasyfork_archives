// ==UserScript==
// @name         MSU 掛幣檢測器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       Alex from MyGOTW
// @description  查詢是否買幣
// @match        https://msu.io/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520994/MSU%20%E6%8E%9B%E5%B9%A3%E6%AA%A2%E6%B8%AC%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/520994/MSU%20%E6%8E%9B%E5%B9%A3%E6%AA%A2%E6%B8%AC%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'msu_activity_data';
    const MAX_PAGES = 10;

    function weiToEth(wei) {
        const eth = Number(wei) / Math.pow(10, 18);
        
        if (!eth || eth < 0.0001) {
            return NaN;
        }
        
        return parseFloat(eth.toFixed(4));
    }

    async function initialize() {
        console.log('Initialize being called with URL:', window.location.href);
        const matchUrl = /\?tab=activity(?:&page=\d+)?$/;
        if (!window.location.href.includes('/marketplace/inventory/')) {
            return;
        }
        else if(matchUrl.test(window.location.search) || window.location.search.includes('activityType=ActivityType_Buy') || window.location.search.includes('activityType=ActivityType_Sell')){
            try {
                console.log('啟動掛幣檢測器');
                
                // 先顯示讀取中 UI
                createLoadingUI();
                
                const data = await getHistoryData();
                if (data && data.length > 0) {
                    const suspiciousActivities = filterSuspiciousActivities(data);
                    console.log('可疑交易清單:', suspiciousActivities);
                    console.log(`找到 ${suspiciousActivities.length} 筆可疑交易`);
                    
                    // 移除讀取中 UI，顯示結果
                    const loadingElement = document.getElementById('msu-notification');
                    if (loadingElement) {
                        loadingElement.remove();
                    }
                    createNotificationUI(suspiciousActivities);
                }

            } catch (error) {
                console.error('getHistoryData error:', error);
                // 發生錯誤時也要移除讀取中 UI
                const loadingElement = document.getElementById('msu-notification');
                if (loadingElement) {
                    loadingElement.remove();
                }
                // 顯示錯誤通知
                createErrorUI();
            }
        }
    }

    const getHistoryData = async () => {
        try {
            const pathName = window.location.pathname;
            const walletAddress = pathName.split('/')[3];
            console.log('walletAddress:', walletAddress)
            
            if(walletAddress){
                // 檢查 localStorage 中的錢包地址是否相同
                const storedData = getStoredData();
                if(storedData?.walletAddress !== walletAddress) {
                    clearStoredData();
                }
                
                if(storedData?.data && storedData.walletAddress === walletAddress) {
                    console.log('使用已儲存的資料:', storedData.data);
                    // 即使使用快取資料，也稍微延遲一下以顯示讀取動畫
                    await new Promise(resolve => setTimeout(resolve, 500));
                    return storedData.data;
                }

                let fullData = [];
                const firstData = await fetchData(walletAddress, 1);
                if(!firstData) return;
                
                fullData.push(firstData);
                
                const totalPages = Math.min(
                    Math.ceil(firstData.paginationResult.totalCount / firstData.paginationResult.pageSize),
                    MAX_PAGES
                );

                for(let i = 2; i <= totalPages; i++){
                    const data = await fetchData(walletAddress, i);
                    if(data) {
                        fullData.push(data);
                    }
                    await new Promise(resolve => setTimeout(resolve, 50));
                }

                saveData(walletAddress, fullData);
                console.log('完整資料:', fullData);
                return fullData;
            }
        } catch (error) {
            console.error('getHistoryData error:', error);
            throw error; // 向上拋出錯誤以觸發錯誤處理
        }
    }

    // localStorage 相關函數
    function getStoredData() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('讀取儲存資料錯誤:', error);
            return null;
        }
    }

    function saveData(walletAddress, data) {
        try {
            const saveObj = {
                walletAddress,
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saveObj));
        } catch (error) {
            console.error('儲存資料錯誤:', error);
        }
    }

    function clearStoredData() {
        localStorage.removeItem(STORAGE_KEY);
    }

    const fetchData = async (walletAddress, pageNo = 1) => {
        try {
            const response = await fetch(`https://msu.io/marketplace/api/marketplace/inventory/${walletAddress}/activities?activityType=ActivityType_All&tokenType=items&paginationParam.pageNo=${pageNo}&paginationParam.pageSize=30`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "zh-TW,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "content-type": "application/json",
                    "priority": "u=1, i"
                },
                "referrer": `https://msu.io/marketplace/inventory/${walletAddress}?tab=activity`,
                "referrerPolicy": "origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('fetchData error:', error);
            return null;
        }
    }

    function filterSuspiciousActivities(fullData) {
        try {
            // 整合所有頁面的 activities，並保留頁數資訊
            const allActivities = fullData.reduce((acc, page) => {
                const activitiesWithPage = page.activities.map(activity => ({
                    ...activity,
                    pageInfo: {
                        pageNo: page.paginationResult.currPageNo,
                        totalCount: page.paginationResult.totalCount,
                        pageSize: page.paginationResult.pageSize,
                        isLastPage: page.paginationResult.isLastPage
                    }
                }));
                return acc.concat(activitiesWithPage);
            }, []);

            // 篩選可疑交易
            const suspiciousActivities = allActivities.filter(activity => {
                const ethPrice = weiToEth(activity.priceWei);
                return activity.activityType === "ActivityType_Sell" && ethPrice >= 100;
            });

            // 保留完整資料並格式化
            const formattedActivities = suspiciousActivities.map(activity => ({
                // 物品資訊
                tokenId: activity.tokenId,
                name: activity.name,
                imageUrl: activity.imageUrl,
                mintingNo: activity.mintingNo,
                potentialGrade: activity.potentialGrade,
                
                // 交易資訊
                price: {
                    wei: activity.priceWei,
                    eth: weiToEth(activity.priceWei)
                },
                quantity: activity.quantity,
                activityType: activity.activityType,
                
                // 賣家資訊
                seller: {
                    address: activity.walletAddrFrom,
                    nickname: activity.nicknameFrom,
                    profileUrl: `https://msu.io/marketplace/inventory/${activity.walletAddrFrom}`
                },
                
                // 買家資訊
                buyer: {
                    address: activity.walletAddrTo,
                    nickname: activity.nicknameTo,
                    profileUrl: `https://msu.io/marketplace/inventory/${activity.walletAddrTo}`
                },
                
                // 時間資訊
                time: {
                    original: activity.createdAt,
                    formatted: new Date(activity.createdAt).toLocaleString('zh-TW')
                },
                
                // 物品連結
                itemUrl: `https://msu.io/marketplace/nft/${activity.tokenId}`,
                
                // 分頁資訊
                pageInfo: activity.pageInfo,
                activityUrl: `https://msu.io/marketplace/inventory/${activity.walletAddrFrom}?tab=activity&page=${activity.pageInfo.pageNo}`
            }));

            console.log('可疑交易清單:', formattedActivities);
            console.log(`找到 ${formattedActivities.length} 筆可疑交易`);

            // 建立通知 UI
            createNotificationUI(formattedActivities);
            
            return formattedActivities;
        } catch (error) {
            console.error('篩選可疑交易時發生錯誤:', error);
            return [];
        }
    }

    function createNotificationUI(suspiciousActivities) {
        // 檢查是否已存在通知 UI
        if (document.getElementById('msu-notification')) {
            return;
        }

        // 創建樣式
        const style = document.createElement('style');
        style.textContent = `
            #msu-notification {
                position: fixed;
                left: 20px;
                bottom: 20px;
                z-index: 9999;
                font-family: Arial, sans-serif;
            }

            .notification-btn {
                padding: 10px 20px;
                border-radius: 5px;
                border: none;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
            }

            .normal-btn {
                background-color: #4CAF50;
                color: white;
            }

            .warning-btn {
                background-color: #ff4444;
                color: white;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }

            .detail-window {
                display: none;
                position: fixed;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                background: #1b1b1b;
                color: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
                max-width: 80vw;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 10000;
            }

            .detail-window h2 {
                color: white;
                margin-bottom: 20px;
            }

            .detail-window.show {
                display: block;
            }

            .close-btn {
                position: absolute;
                right: 10px;
                top: 10px;
                cursor: pointer;
                font-size: 20px;
                color: #ffffff;
            }

            .suspicious-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
                color: white;
            }

            .suspicious-table th, .suspicious-table td {
                padding: 10px;
                border: 1px solid #333;
                text-align: left;
            }

            .suspicious-table th {
                background-color: #2d2d2d;
                color: white;
            }

            .suspicious-table tr {
                background-color: #1b1b1b;
            }

            .suspicious-table tr:hover {
                background-color: #2d2d2d;
            }

            .item-image {
                width: 50px;
                height: 50px;
                object-fit: contain;
                border-radius: 5px;
            }

            .address-link {
                color: #66b3ff;
                text-decoration: none;
            }

            .address-link:hover {
                text-decoration: underline;
                color: #99ccff;
            }

            .overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 9999;
            }

            .overlay.show {
                display: block;
            }

            /* 捲軸樣式 */
            .detail-window::-webkit-scrollbar {
                width: 8px;
            }

            .detail-window::-webkit-scrollbar-track {
                background: #2d2d2d;
                border-radius: 4px;
            }

            .detail-window::-webkit-scrollbar-thumb {
                background: #4d4d4d;
                border-radius: 4px;
            }

            .detail-window::-webkit-scrollbar-thumb:hover {
                background: #666;
            }

            /* 一般連結樣式 */
            .detail-window a {
                color: #66b3ff;
                text-decoration: none;
            }

            .detail-window a:hover {
                color: #99ccff;
                text-decoration: underline;
            }
        `;
        document.head.appendChild(style);

        // 創建通知按鈕和詳細資訊視窗
        const notificationDiv = document.createElement('div');
        notificationDiv.id = 'msu-notification';

        const buttonText = suspiciousActivities.length > 0 
            ? `疑似買幣 (${suspiciousActivities.length})`
            : '帳戶正常';
        const buttonClass = suspiciousActivities.length > 0 
            ? 'warning-btn'
            : 'normal-btn';

        notificationDiv.innerHTML = `
            <button class="notification-btn ${buttonClass}">${buttonText}</button>
            <div class="overlay"></div>
            <div class="detail-window">
                <span class="close-btn">&times;</span>
                <h2>可疑交易清單</h2>
                <table class="suspicious-table">
                    <thead>
                        <tr>
                            <th>物品</th>
                            <th>名稱</th>
                            <th>價格</th>
                            <th>賣家</th>
                            <th>買家</th>
                            <th>時間</th>
                            <th>頁數</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${suspiciousActivities.map(activity => `
                            <tr>
                                <td>
                                    <a href="${activity.itemUrl}" target="_blank">
                                        <img src="${activity.imageUrl}" class="item-image" alt="${activity.name}">
                                    </a>
                                </td>
                                <td>
                                    <a href="${activity.itemUrl}" target="_blank">
                                        ${activity.name} #${activity.mintingNo}
                                    </a>
                                </td>
                                <td>${activity.price.eth} ETH</td>
                                <td>
                                    <a href="${activity.seller.profileUrl}" target="_blank" class="address-link">
                                        ${activity.seller.nickname || '未知'}<br>
                                        ${activity.seller.address.slice(0, 6)}...${activity.seller.address.slice(-4)}
                                    </a>
                                </td>
                                <td>
                                    <a href="${activity.buyer.profileUrl}" target="_blank" class="address-link">
                                        ${activity.buyer.nickname || '未知'}<br>
                                        ${activity.buyer.address.slice(0, 6)}...${activity.buyer.address.slice(-4)}
                                    </a>
                                </td>
                                <td>${activity.time.formatted}</td>
                                <td>
                                    <a href="${activity.activityUrl}" target="_blank">
                                        第 ${activity.pageInfo.pageNo} 頁
                                    </a>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        document.body.appendChild(notificationDiv);

        // 事件處理
        const button = notificationDiv.querySelector('.notification-btn');
        const detailWindow = notificationDiv.querySelector('.detail-window');
        const overlay = notificationDiv.querySelector('.overlay');
        const closeBtn = notificationDiv.querySelector('.close-btn');

        button.addEventListener('click', () => {
            if (suspiciousActivities.length > 0) {
                detailWindow.classList.add('show');
                overlay.classList.add('show');
            }
        });

        closeBtn.addEventListener('click', () => {
            detailWindow.classList.remove('show');
            overlay.classList.remove('show');
        });

        overlay.addEventListener('click', () => {
            detailWindow.classList.remove('show');
            overlay.classList.remove('show');
        });
    }

    // 先建立一個簡單的讀取中 UI
    function createLoadingUI() {
        // 檢查是否已存在
        if (document.getElementById('msu-notification')) {
            return;
        }

        const style = document.createElement('style');
        style.textContent = `
            .loading-btn {
                background-color: #666 !important;
                position: relative;
                cursor: wait !important;
            }

            .loading-btn::after {
                content: '';
                position: absolute;
                width: 16px;
                height: 16px;
                top: 50%;
                right: 10px;
                transform: translateY(-50%);
                border: 2px solid #ffffff;
                border-radius: 50%;
                border-right-color: transparent;
                animation: rotate 1s linear infinite;
            }

            @keyframes rotate {
                from { transform: translateY(-50%) rotate(0deg); }
                to { transform: translateY(-50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        const notificationDiv = document.createElement('div');
        notificationDiv.id = 'msu-notification';
        notificationDiv.innerHTML = `
            <button class="notification-btn loading-btn">資料讀取中...</button>
        `;
        document.body.appendChild(notificationDiv);
    }

    // 新增錯誤通知 UI
    function createErrorUI() {
        const notificationDiv = document.createElement('div');
        notificationDiv.id = 'msu-notification';
        notificationDiv.innerHTML = `
            <button class="notification-btn" style="background-color: #ff4444;">
                資料載入失敗
            </button>
        `;
        document.body.appendChild(notificationDiv);
        
        // 3秒後自動移除錯誤通知
        setTimeout(() => {
            const errorElement = document.getElementById('msu-notification');
            if (errorElement) {
                errorElement.remove();
            }
        }, 3000);
    }

    initialize();

    // URL 變化監聽
    const originalPushState = history.pushState;  
    const originalReplaceState = history.replaceState;  
    
    history.pushState = function (...args) {  
        originalPushState.apply(this, args);  
        handleUrlChange('pushState');
    };  
    
    history.replaceState = function (...args) {  
        originalReplaceState.apply(this, args);  
        handleUrlChange('replaceState');
    };  
    
    window.addEventListener('popstate', function () {  
        handleUrlChange('popstate');  
    });  
    
    function handleUrlChange(method) {  
        console.log(`小精靈通知: [${method}] URL 已變化: ${window.location.href}`);  
        initialize();
    }

})();

