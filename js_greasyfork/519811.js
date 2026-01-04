// ==UserScript==
// @name         MSU 包包小精靈
// @namespace    http://tampermonkey.net/
// @version      0.64
// @author       Alex from MyGOTW
// @description  擷取 MSU.io 物品價格與庫存
// @match        https://msu.io/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519811/MSU%20%E5%8C%85%E5%8C%85%E5%B0%8F%E7%B2%BE%E9%9D%88.user.js
// @updateURL https://update.greasyfork.org/scripts/519811/MSU%20%E5%8C%85%E5%8C%85%E5%B0%8F%E7%B2%BE%E9%9D%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector) {
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

    async function initialize() {
        console.log('Initialize being called with URL:', window.location.href);
        if (!window.location.href.includes('/marketplace/inventory/')) {
            return;
        }

        // 添加 API 監聽
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const [resource, config] = args;
            
            // 檢查是否為目標 API
            if (typeof resource === 'string' && 
                resource.includes('/marketplace/api/marketplace/inventory/') && 
                resource.includes('/owned')) {
                
                try {
                    const response = await originalFetch.apply(this, args);
                    const clone = response.clone();
                    const jsonData = await clone.json();
                    
                    // 將數據保存在全局變數中
                    window.inventoryData = jsonData;
                    console.log('已保存背包資料:', jsonData);
                    
                    return response;
                } catch (error) {
                    console.error('監聽 API 時發生錯誤:', error);
                    return originalFetch.apply(this, args);
                }
            }
            
            return originalFetch.apply(this, args);
        };

        try {
            // 等待目標元素出現
            const targetNode = await waitForElement('div[class*="item-list"]');
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        getNFTitem();
                    }
                });
            });

            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
            
            // 初始執行一次
            getNFTitem();
        } catch (error) {
            console.error('Error initializing:', error);
        }
    }

    const getNFTitem = () => {
        addStyleToHead();
        const articles = document.querySelectorAll('div[class*="item-list"] > article');
        let currentActiveBtn = null;
        let isClickable = true;
        let allButtons = []; // 新增儲存所有按鈕的陣列

        articles.forEach((article, index) => {
            if (article.querySelector('.click-btn')) return;

            const nameSpanElement = article.querySelector('.leave-box div div span:first-child');
            if (nameSpanElement && nameSpanElement.innerText) {
                const fragment = document.createDocumentFragment();

                let textDiv = document.createElement('div');
                textDiv.textContent = '查看市場價格';
                textDiv.className = 'click-btn';
                allButtons.push(textDiv); // 將按鈕加入陣列

                textDiv.onclick = async () => {
                    if (!isClickable) return;

                    isClickable = false;
                    // 設定所有按鈕為禁用狀態
                    allButtons.forEach(btn => {
                        btn.style.cursor = 'not-allowed';
                    });

                    const originalText = textDiv.textContent;
                    textDiv.textContent = '';
                    textDiv.classList.add('loading');
                    const itemName = filterNFTitem(nameSpanElement.innerText);
                    const itemCategoryNo =  window.inventoryData.records[index].category.categoryNo
                    const searchItem = {
                        name:itemName,
                        categoryNo:itemCategoryNo ? itemCategoryNo : null
                    }
                    const result = await fetchItme(searchItem);
                    textDiv.classList.remove('loading');
                    textDiv.textContent = result;

                    setTimeout(() => {
                        isClickable = true;
                        // 恢復所有按鈕的狀態
                        allButtons.forEach(btn => {
                            btn.style.cursor = 'pointer';
                        });
                        textDiv.textContent = originalText;
                    }, 3000);
                }

                fragment.appendChild(textDiv);
                article.insertBefore(fragment.firstChild, article.firstChild);

                article.addEventListener('mouseenter', () => {
                    if (currentActiveBtn && currentActiveBtn !== textDiv) {
                        currentActiveBtn.style.display = 'none';
                    }
                    textDiv.style.display = 'block';
                    currentActiveBtn = textDiv;
                });
            }
        });
    }

    const filterNFTitem = (name) =>{
        const match = name.match(/^(.*?)(?=#|$)/);
        if (match) {
            return match[1].trim(); // 保留中間的空格，但去除前後空格
        }
        return name;
    }
    const addStyleToHead = () => {
        const style = document.createElement('style');
        const css = `
            .click-btn {
                width: 100%;
                background-color: rebeccapurple;
                border-radius: 5px;
                cursor: pointer;
                color: white;
                padding: 5px;
                text-align: center;
                margin-top: 5px;
                transition: background-color 0.3s, cursor 0.3s;
                display: none;
                z-index: 9999;
            }
            .click-btn:hover {
                background-color: #663399;
            }

            /* 新增載入動畫相關樣式 */
            .loading {
                position: relative;
                min-height: 24px;
            }
            .loading::after {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                top: 50%;
                left: 50%;
                margin-top: -10px;
                margin-left: -10px;
                border: 2px solid #ffffff;
                border-radius: 50%;
                border-top-color: transparent;
                animation: spin 0.8s linear infinite;
            }
            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
        `;
        style.textContent = css;
        document.head.appendChild(style);
    }

    const getLowestPriceItem = (priceData, exactName) => {
        console.log(exactName)
        if (!priceData?.items || priceData.items.length === 0) {
            return null;
        }

        // 只篩選完全符合名稱的物品
        const exactMatches = priceData.items.filter(item => item.name === exactName);

        if (exactMatches.length === 0) {
            return null;
        }

        return exactMatches.reduce((lowest, current) => {
            const currentPrice = BigInt(current.salesInfo?.priceWei || '0');
            const lowestPrice = BigInt(lowest.salesInfo?.priceWei || '0');

            return currentPrice < lowestPrice ? current : lowest;
        }, exactMatches[0]);
    }

    const fetchItme = async(item) => {
        try {
            const searchResult = await fetch("https://msu.io/marketplace/api/marketplace/explore/items", {
                headers: {
                    "accept": "*/*",
                    "cache-control": "no-cache",
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                body: JSON.stringify({
                    filter: { 
                        name:item.name,
                        categoryNo:item.categoryNo,
                        level:{min:0, max: 250},
                        potential:{min:0, max: 4},
                        price:{min:0, max: 10000000000},
                        starforce:{min:0, max: 25}
                     },
                    sorting: "ExploreSorting_LOWEST_PRICE",
                    paginationParam: { pageNo: 1, pageSize: 135 }
                }),
                method: "POST",
                mode: "cors",
                credentials: "include"
            });

            const priceData = await searchResult.json();
            const lowestPriceItem = getLowestPriceItem(priceData, item.name);
            const fullPrice = lowestPriceItem ?
                (BigInt(lowestPriceItem.salesInfo.priceWei) / BigInt(1e18))
                .toString() + '.' +
                (BigInt(lowestPriceItem.salesInfo.priceWei) % BigInt(1e18))
                .toString()
                .padStart(18, '0')
                .slice(0, 6)
                .replace(/\.?0+$/, '')
                :
                null;
            return fullPrice ? `${fullPrice} Neso` : '無上架資料'
        } catch (error) {
            console.error(`查詢 ${itemName} 價格時發生錯誤:`, error);
            return '查詢錯誤，被鎖啦'
        }
    }
    initialize()
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

