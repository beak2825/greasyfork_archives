// ==UserScript==
// @name         MSU 緞帶肥肥小錢包
// @namespace    http://tampermonkey.net/
// @version      0.13
// @author       Alex from MyGOTW
// @description  錢包地址管理助手
// @match        https://msu.io/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520383/MSU%20%E7%B7%9E%E5%B8%B6%E8%82%A5%E8%82%A5%E5%B0%8F%E9%8C%A2%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/520383/MSU%20%E7%B7%9E%E5%B8%B6%E8%82%A5%E8%82%A5%E5%B0%8F%E9%8C%A2%E5%8C%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const waitForElement = (selector) => {
        return new Promise(resolve => {
            // 如果元素已存在，直接返回
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            // 建立 observer 監聽 DOM 變化
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }


    const createWalletHelper = () => {
        // 檢查是否已存在錢包小幫手
        if (document.querySelector('#msu-wallet-helper')) {
            console.log('錢包小幫手已存在，跳過創建');
            return;
        }
        
        console.log('開始創建錢包小幫手...');
        try {
            // 從 localStorage 獲取保存的錢包資料
            let savedWallets = [];
            try {
                const storedData = localStorage.getItem('walletAddresses');
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    // 檢查是否為舊格式（純地址陣列）
                    if (Array.isArray(parsedData) && typeof parsedData[0] === 'string') {
                        // 轉換舊格式到新格式
                        savedWallets = parsedData.map((address, index) => ({
                            name: `錢包 ${index + 1}`,
                            address: address
                        }));
                        // 保存新格式
                        localStorage.setItem('walletAddresses', JSON.stringify(savedWallets));
                    } else {
                        savedWallets = parsedData;
                    }
                }
            } catch (e) {
                console.error('解析儲存的錢包資料時發生錯誤:', e);
            }

            // 如果沒有資料，使用預設值
            if (savedWallets.length === 0) {
                savedWallets = [{
                    name: '贊助AA🙏',
                    address: '0xfc64f99069FFb79b4B6C1BF9C3579B7fA9cb9B08'
                }];
                localStorage.setItem('walletAddresses', JSON.stringify(savedWallets));
            }

            // 創建主容器
            const container = document.createElement('div');
            container.id = 'msu-wallet-helper';  // 添加 ID 以便檢查
            container.style.cssText = `
                position: fixed;
                right: -300px;
                top: 10vw;
                background: #ffffff;
                padding: 20px;
                border-radius: 12px 0 0 12px;
                box-shadow: -2px 0 15px rgba(0,0,0,0.1);
                z-index: 9999;
                width: 300px;
                transition: right 0.3s ease;
                font-family: Arial, sans-serif;
            `;

            // 創建切換按鈕
            const toggleButton = document.createElement('div');
            toggleButton.style.cssText = `
                width: 40px;
                position: absolute;
                left: -40px;
                top: 15%;
                transform: translateY(-50%);
                background: linear-gradient(180deg, #acc631, #769700);
                color: white;
                padding: 12px;
                cursor: pointer;
                border-radius: 6px 0 0 6px;
                box-shadow: -2px 0 8px rgba(0,0,0,0.2);
                font-size: 20px;
                transition: all 0.3s ease;
            `;
            toggleButton.textContent = '👛';
            toggleButton.onmouseover = () => toggleButton.style.transform = 'translateY(-50%) scale(1.1)';
            toggleButton.onmouseout = () => toggleButton.style.transform = 'translateY(-50%)';

            // 標題
            const title = document.createElement('h3');
            title.textContent = '錢包地址管理';
            title.style.cssText = `
                margin: 0 0 15px 0;
                color: #333;
                font-size: 18px;
                border-bottom: 2px solid #4CAF50;
                padding-bottom: 10px;
            `;

            const hint = document.createElement('div');
            hint.textContent = '💡 點擊錢包地址即可複製';
            hint.style.cssText = `
                color: #666;
                font-size: 13px;
                margin-bottom: 15px;
                padding: 8px;
                background: #f0f0f0;
                border-radius: 4px;
            `;

            // 地址列表容器
            const addressList = document.createElement('div');
            addressList.style.cssText = `
                max-height: 300px;
                overflow-y: auto;
                margin-top: 15px;
            `;

            // 新增地址輸入區
            const inputContainer = document.createElement('div');
            inputContainer.style.cssText = `
                display: none;
                gap: 8px;
                margin-bottom: 15px;
                flex-wrap: wrap;
            `;

            const nameInput = document.createElement('input');
            nameInput.style.cssText = `
                width: 120px;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                color: #000000;
            `;
            nameInput.placeholder = '錢包名稱...';

            const addressInput = document.createElement('input');
            addressInput.style.cssText = `
                flex: 1;
                min-width: 200px;
                padding: 6px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
                color: #000000;
                cursor: pointer;
                transition: background-color 0.3s ease;
            `;
            addressInput.placeholder = '輸入錢包地址...';

            // 添加點擊複製功能
            addressInput.onclick = () => {
                navigator.clipboard.writeText(wallet.address);
                
                // 創建提示容器
                const copyTip = document.createElement('div');
                copyTip.style.cssText = `
                    position: absolute;
                    background: #4CAF50;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    white-space: nowrap;
                    left: 50%;
                    transform: translateX(-50%);
                    top: 50%;
                    z-index: 1000;
                `;
                copyTip.textContent = '已複製✓';
                
                // 將提示加入到輸入框的父元素中
                addressInput.parentElement.appendChild(copyTip);
                
                // 添加綠色漸變背景動畫
                addressInput.style.background = 'linear-gradient(to right, #4CAF50, #45a049)';
                
                // 1秒後移除提示和背景效果
                setTimeout(() => {
                    copyTip.remove();
                    addressInput.style.background = 'white';
                }, 1000);
            };

            const addButton = document.createElement('button');
            addButton.textContent = '新增錢包';
            addButton.style.cssText = `
                background: #4CAF50;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.3s;
                margin-bottom: 15px;
            `;
            addButton.onmouseover = () => addButton.style.background = '#45a049';
            addButton.onmouseout = () => addButton.style.background = '#4CAF50';

            const confirmButton = document.createElement('button');
            confirmButton.textContent = '確認';
            confirmButton.style.cssText = `
                background: #cccccc;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: not-allowed;
                transition: all 0.3s;
            `;

            // 監聽輸入框的變化
            const updateConfirmButton = () => {
                const hasAddress = addressInput.value.trim() !== '';
                if (hasAddress) {
                    confirmButton.style.background = '#4CAF50';
                    confirmButton.style.cursor = 'pointer';
                } else {
                    confirmButton.style.background = '#cccccc';
                    confirmButton.style.cursor = 'not-allowed';
                }
            };

            // 添加輸入事件監聽
            addressInput.addEventListener('input', updateConfirmButton);

            // 渲染地址列表
            const renderWallets = () => {
                addressList.innerHTML = '';
                savedWallets.forEach((wallet, index) => {
                    const walletItem = document.createElement('div');
                    walletItem.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 8px;
                        background: #f5f5f5;
                        border-radius: 4px;
                        margin-bottom: 8px;
                        flex-wrap: wrap;
                        position: relative;
                    `;

                    const nameContainer = document.createElement('div');
                    nameContainer.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        position: relative;
                    `;

                    const nameInput = document.createElement('input');
                    nameInput.value = wallet.name;
                    nameInput.readOnly = true;
                    nameInput.style.cssText = `
                        width: 100px;
                        padding: 6px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #000000;
                    `;

                    // 新增包包連結
                    const bagLink = document.createElement('a');
                    bagLink.href = `https://msu.io/marketplace/inventory/${wallet.address}`;
                    bagLink.target = "_blank";
                    bagLink.innerHTML = "🔍";
                    bagLink.style.cssText = `
                        text-decoration: none;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 4px;
                        transition: transform 0.2s ease;
                    `;

                    // 添加懸停效果
                    bagLink.onmouseover = () => bagLink.style.transform = 'scale(1.2)';
                    bagLink.onmouseout = () => bagLink.style.transform = 'scale(1)';

                    // 將元素添加到 nameContainer
                    nameContainer.append(nameInput, bagLink);

                    const addressInput = document.createElement('input');
                    addressInput.value = wallet.address;
                    addressInput.readOnly = true;
                    addressInput.style.cssText = `
                        flex: 1;
                        min-width: 200px;
                        padding: 6px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        font-size: 14px;
                        color: #000000;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    `;

                    // 添加點擊複製功能
                    addressInput.onclick = () => {
                        navigator.clipboard.writeText(wallet.address);
                        
                        // 創建提示容器
                        const copyTip = document.createElement('div');
                        copyTip.style.cssText = `
                            position: absolute;
                            background: black;
                            color: white;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-size: 12px;
                            white-space: nowrap;
                            left: 50%;
                            transform: translateX(-50%);
                            top: 50%;
                            z-index: 1000;
                        `;
                        copyTip.textContent = '已複製✓';
                        
                        // 將提示加入到輸入框的父元素中
                        addressInput.parentElement.appendChild(copyTip);
                        
                        // 添加綠色漸變背景動畫
                        addressInput.style.background = 'rgb(186 224 188)';
                        // 1秒後移除提示和背景效果
                        setTimeout(() => {
                            copyTip.remove();
                            addressInput.style.background = 'white';
                        }, 1000);
                    };

                    // 防止輸入框被編輯
                    addressInput.readOnly = true;
                    const deleteButton = document.createElement('div');
                    deleteButton.innerHTML = '✕';
                    deleteButton.style.cssText = `
                        background: #666666;
                        color: white;
                        cursor: pointer;
                        width: 20px;
                        height: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 4px;
                        font-size: 14px;
                        font-weight: bold;
                        transition: all 0.2s ease;
                        line-height: 1;
                        z-index: 1;
                        margin-left: auto;
                    `;

                    // hover 效果
                    deleteButton.onmouseover = () => {
                        deleteButton.style.background = '#ff4444';
                        deleteButton.style.transform = 'scale(1.1)';
                    };
                    deleteButton.onmouseout = () => {
                        deleteButton.style.background = '#666666';
                        deleteButton.style.transform = 'scale(1)';
                    };

                    // 刪除功能
                    deleteButton.onclick = () => {
                        savedWallets.splice(index, 1);
                        localStorage.setItem('walletAddresses', JSON.stringify(savedWallets));
                        renderWallets();
                    };

                    // 編輯功能
                    nameInput.onchange = () => {
                        savedWallets[index].name = nameInput.value;
                        localStorage.setItem('walletAddresses', JSON.stringify(savedWallets));
                    };

                    addressInput.onchange = () => {
                        savedWallets[index].address = addressInput.value;
                        localStorage.setItem('walletAddresses', JSON.stringify(savedWallets));
                    };

                    walletItem.append(nameContainer, addressInput, deleteButton);
                    addressList.appendChild(walletItem);
                });
            };

            // 新增錢包功能
            addButton.onclick = () => {
                inputContainer.style.display = 'flex';
                addButton.style.display = 'none';
            };

            confirmButton.onclick = () => {
                const newName = nameInput.value.trim();
                const newAddress = addressInput.value.trim();
                if (newAddress) {
                    savedWallets.push({
                        name: newName || `錢包 ${savedWallets.length + 1}`,
                        address: newAddress
                    });
                    localStorage.setItem('walletAddresses', JSON.stringify(savedWallets));
                    nameInput.value = '';
                    addressInput.value = '';
                    renderWallets();
                    
                    // 重置顯示狀態
                    inputContainer.style.display = 'none';
                    addButton.style.display = 'block';
                    
                    // 重置確認按鈕狀態
                    updateConfirmButton();
                }
            };

            // 切換顯示/隱藏的功能
            let isVisible = false;
            toggleButton.onclick = () => {
                isVisible = !isVisible;
                container.style.right = isVisible ? '0' : '-300px';
            };

            // 組裝 DOM
            container.appendChild(toggleButton);
            container.appendChild(title);
            container.appendChild(hint);
            container.appendChild(addButton);
            inputContainer.append(nameInput, addressInput, confirmButton);
            container.append(inputContainer, addressList);
            document.body.appendChild(container);

            // 初始渲染錢包列表
            renderWallets();

            console.log('錢包小幫手已成功插入 DOM');
        } catch (error) {
            console.error('創建錢包小幫手時發生錯誤:', error);
        }
    };

    const initialize = async () => {
        console.log('Initialize being called with URL:', window.location.href);

        // 新增 URL 檢查的除錯訊息
        if (!window.location.href.includes('/marketplace/inventory/')) {
            console.log('URL 不符合條件，退出初始化');
            return;
        }

        try {
            console.log('開始等待目標元素...');
            // 等待目標元素出現
            const targetNode = await waitForElement('div[class*="item-list"]');
            console.log('目標元素已找到:', targetNode);

            // 直接創建 helper
            createWalletHelper();

            // 設置 observer 監聽後續變化
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        console.log('DOM 變化偵測到，但 helper 應該已經創建');
                    }
                });
            });

            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });

        } catch (error) {
            console.error('Error initializing:', error);
        }
    }

    const handleUrlChange = (method) => {
        console.log(`小精靈通知: [${method}] URL 已變化: ${window.location.href}`);
        initialize();
    };

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
        originalPushState.apply(history, args);
        handleUrlChange('pushState');
    };

    history.replaceState = function(...args) {
        originalReplaceState.apply(history, args);
        handleUrlChange('replaceState');
    };

    window.addEventListener('popstate', () => {
        handleUrlChange('popstate');
    });
})();