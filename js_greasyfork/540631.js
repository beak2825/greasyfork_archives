// ==UserScript==
// @name         coolpc case filter
// @namespace    http://tampermonkey.net/
// @description  原價屋機殼簡易篩選器
// @author       ezio
// @match        https://www.coolpc.com.tw/eachview.*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coolpc.com.tw
// @grant        none
// @license      MIT
// @version      1.0.0
// @downloadURL https://update.greasyfork.org/scripts/540631/coolpc%20case%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/540631/coolpc%20case%20filter.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 創建樣式
    function createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 搜尋欄樣式 */
            .case-search-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: #333;
                padding: 6px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                z-index: 1000;
                border-bottom: 3px solid #5a6fd8;
            }

            .case-search-container {
                max-width: 1200px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr auto;
                gap: 15px;
                align-items: end;
            }

            .case-search-group {
                display: flex;
                flex-direction: column;
            }

            .case-search-group label {
                color: white;
                font-weight: bold;
                margin-bottom: 5px;
                font-size: 14px;
            }

            .case-price-inputs {
                display: flex;
                gap: 8px;
            }

            .case-search-group input {
                padding: 10px 12px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                background: rgba(255,255,255,0.95);
                color: #333;
                transition: all 0.3s ease;
            }

            .case-search-group input:focus {
                outline: none;
                background: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }

            .case-search-btn {
                padding: 8px 20px;
                background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 16px;
                height: fit-content;
            }

            .case-search-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(255,107,107,0.4);
                background: linear-gradient(45deg, #ee5a24, #ff6b6b);
            }

            .case-search-btn:active {
                transform: translateY(0);
            }

            /* 搜尋結果樣式 */
            .case-search-result {
                background: #333;
                color: white;
                padding: 6px;
                text-align: center;
                font-weight: bold;
                margin-bottom: 6px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                animation: slideInFromTop 0.5s ease;
            }

            .case-search-result.no-results {
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            }

            /* 隱藏狀態 */
            .case-hidden {
                display: none !important;
            }

            /* 動畫效果 */
            @keyframes slideInFromTop {
                0% {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* 響應式設計 */
            @media (max-width: 768px) {
                .case-search-container {
                    grid-template-columns: 1fr;
                    gap: 10px;
                }

                .case-price-inputs {
                    flex-direction: column;
                }

                .case-search-bar {
                    padding: 6px;
                }
            }

            @media (max-width: 480px) {
                .case-search-group input {
                    font-size: 16px; /* 防止 iOS 縮放 */
                }
            }
        `;

        document.head.appendChild(style);
    }

    // 創建搜尋欄
    function createSearchBar() {
        const searchBar = document.createElement('div');
        searchBar.className = 'case-search-bar';
        searchBar.id = 'caseSearchBar';

        searchBar.innerHTML = `
            <div class="case-search-container">
                <div class="case-search-group">
                    <label>價格區間 (NT$)</label>
                    <div class="case-price-inputs">
                        <input type="number" id="caseMinPrice" placeholder="最低價格" min="0">
                        <input type="number" id="caseMaxPrice" placeholder="最高價格" min="0">
                    </div>
                </div>

                <div class="case-search-group">
                    <label>關鍵字 1</label>
                    <input type="text" id="caseKeyword1" placeholder="輸入關鍵字...">
                </div>

                <div class="case-search-group">
                    <label>關鍵字 2</label>
                    <input type="text" id="caseKeyword2" placeholder="輸入關鍵字...">
                </div>

                <div class="case-search-group">
                    <label>關鍵字 3</label>
                    <input type="text" id="caseKeyword3" placeholder="輸入關鍵字...">
                </div>

                <button class="case-search-btn" id="caseSearchBtn">🔍 搜尋</button>
            </div>
        `;

        document.body.insertBefore(searchBar, document.body.firstChild);
    }

    // 調整主內容區域的 padding-top
    function adjustMainPadding() {
        const searchBar = document.getElementById('caseSearchBar');
        const main = document.querySelector('.main');

        if (searchBar && main) {
            const searchBarHeight = searchBar.offsetHeight;
            main.style.paddingTop = (searchBarHeight + 20) + 'px';
        }
    }

    // 綁定事件
    function bindEvents() {
        // 搜尋按鈕點擊事件
        const searchBtn = document.getElementById('caseSearchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }

        // 輸入框 Enter 鍵事件
        const inputs = document.querySelectorAll('#caseMinPrice, #caseMaxPrice, #caseKeyword1, #caseKeyword2, #caseKeyword3');
        inputs.forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        });

        // 視窗大小變化事件
        window.addEventListener('resize', adjustMainPadding);
    }

    // 執行搜尋功能
    function performSearch() {
        // 獲取搜尋條件
        const minPrice = parseFloat(document.getElementById('caseMinPrice').value) || 0;
        const maxPrice = parseFloat(document.getElementById('caseMaxPrice').value) || Infinity;
        const keyword1 = document.getElementById('caseKeyword1').value.trim().toLowerCase();
        const keyword2 = document.getElementById('caseKeyword2').value.trim().toLowerCase();
        const keyword3 = document.getElementById('caseKeyword3').value.trim().toLowerCase();

        // 獲取所有產品項目
        const allSpans = document.querySelectorAll('.main > span');
        let visibleCount = 0;

        allSpans.forEach(span => {
            // 獲取產品資訊
            const productText = span.textContent.toLowerCase();
            const priceElement = span.querySelector('.x');

            if (!priceElement) {
                span.classList.add('case-hidden');
                return;
            }

            const priceText = priceElement.textContent;
            const priceMatch = priceText.match(/nt(\d+)/i);
            const productPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;

            // 檢查價格範圍
            const priceInRange = productPrice >= minPrice && productPrice <= maxPrice;

            // 檢查關鍵字
            const hasKeyword1 = !keyword1 || productText.includes(keyword1);
            const hasKeyword2 = !keyword2 || productText.includes(keyword2);
            const hasKeyword3 = !keyword3 || productText.includes(keyword3);

            // 決定是否顯示
            const shouldShow = priceInRange && hasKeyword1 && hasKeyword2 && hasKeyword3;

            if (shouldShow) {
                span.classList.remove('case-hidden');
                visibleCount++;
            } else {
                span.classList.add('case-hidden');
            }
        });

        // 顯示搜尋結果統計
        showSearchResults(visibleCount);

        // 添加搜尋動畫效果
        addSearchAnimation();
    }

    // 顯示搜尋結果統計
    function showSearchResults(count) {
        // 移除之前的結果提示
        const existingResult = document.querySelector('.case-search-result');
        if (existingResult) {
            existingResult.remove();
        }

        // 創建結果提示
        const resultDiv = document.createElement('div');
        resultDiv.className = 'case-search-result';

        if (count === 0) {
            resultDiv.classList.add('no-results');
            resultDiv.textContent = '很抱歉，沒有找到符合條件的產品。請調整搜尋條件再試一次。';
        } else {
            resultDiv.textContent = `搜尋結果：找到 ${count} 個符合條件的產品`;
        }

        // 插入到主內容區域的開頭
        const main = document.querySelector('.main');
        if (main) {
            main.insertBefore(resultDiv, main.firstChild);
        }
    }

    // 添加搜尋動畫效果
    function addSearchAnimation() {
        const searchBtn = document.getElementById('caseSearchBtn');
        if (searchBtn) {
            searchBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                searchBtn.style.transform = 'scale(1)';
            }, 150);
        }
    }

    // 清除搜尋（可選功能，可在控制台呼叫）
    window.clearCaseSearch = function() {
        document.getElementById('caseMinPrice').value = '';
        document.getElementById('caseMaxPrice').value = '';
        document.getElementById('caseKeyword1').value = '';
        document.getElementById('caseKeyword2').value = '';
        document.getElementById('caseKeyword3').value = '';

        // 顯示所有產品
        const allSpans = document.querySelectorAll('.main > span');
        allSpans.forEach(span => {
            span.classList.remove('case-hidden');
        });

        // 移除搜尋結果提示
        const existingResult = document.querySelector('.case-search-result');
        if (existingResult) {
            existingResult.remove();
        }
    };

    // 公開搜尋函數（可在控制台呼叫）
    window.performCaseSearch = performSearch;

    function init() {
        createStyles();
        createSearchBar();
        adjustMainPadding();
        bindEvents();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();