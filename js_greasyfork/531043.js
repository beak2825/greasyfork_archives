// ==UserScript==
// @name         動畫瘋 回頁頂按鈕
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  為 動畫瘋 加上回頁頂按鈕
// @license      MIT
// @author       movwei
// @match        https://ani.gamer.com.tw/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531043/%E5%8B%95%E7%95%AB%E7%98%8B%20%E5%9B%9E%E9%A0%81%E9%A0%82%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/531043/%E5%8B%95%E7%95%AB%E7%98%8B%20%E5%9B%9E%E9%A0%81%E9%A0%82%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const quickToolWrapper = document.createElement('div');
    quickToolWrapper.className = 'baha_quicktool';
    const backToTopButton = document.createElement('div');
    backToTopButton.className = 'quicktool iconbtn hidden';
    backToTopButton.innerHTML = `
        <svg viewBox="0 0 26.95 22.21" style="pointer-events: none;">
            <g>
                <path d="M26.37,7.06L13.55,0,.73,7.06c-.54,.3-.74,.98-.44,1.53l.31,.56c.3,.54,.98,.74,1.53,.44L13.55,3.29l11.43,6.3c.54,.3,1.23,.1,1.53-.44l.31-.56c.3-.54,.1-1.23-.44-1.53Z"></path>
                <g>
                    <path d="M8.26,13.95v1.79h-3.24v6.47h-1.79v-6.47H0v-1.79H8.26Z"></path>
                    <path d="M15.66,13.95c.93,0,1.7,.76,1.7,1.7v4.87c0,.94-.77,1.7-1.7,1.7h-4.87c-.94,0-1.7-.76-1.7-1.7v-4.87c0-.94,.76-1.7,1.7-1.7h4.87Zm-4.78,6.47h4.68v-4.68h-4.68v4.68Z"></path>
                    <path d="M25.17,13.96c.94,0,1.71,.77,1.71,1.7v2.13c0,.93-.77,1.7-1.71,1.7h-4.77s.03,.03,.03,.08c0,0-.02,0-.03-.01v2.65h-1.78V13.96h6.55Zm-4.77,3.74h4.68v-1.96h-4.68v1.96Z"></path>
                </g>
            </g>
        </svg>
    `;
    GM_addStyle(`
        .baha_quicktool {
            position: fixed;
            right: 44px;
            bottom: 20px;
            display: flex;
            flex-direction: column;
            z-index: 1000;
        }
        .baha_quicktool .quicktool {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px 0;
            cursor: pointer;
            width: 60px;
            height: 58px;
            background-color: #272728;
            border-radius: 8px;
            transition: background-color 0.3s ease;
        }
        .baha_quicktool .quicktool:hover {
            background-color: #00B0B6;
        }
        .baha_quicktool .quicktool svg {
            width: 26px;
            height: 22px;
            fill: white;
        }
        .baha_quicktool .quicktool.hidden {
            display: none;
        }
        .top-btn {
            display: none !important;
        }
    `);
    quickToolWrapper.appendChild(backToTopButton);
    document.body.appendChild(quickToolWrapper);

    function adjustButtonVisibility() {
        const promotionButton = document.querySelector('.fab-seasonal-promotion');

        if (window.pageYOffset > 300) {
            backToTopButton.classList.remove('hidden');
            if (promotionButton) {
                promotionButton.style.bottom = '75px';
            }
        } else {
            backToTopButton.classList.add('hidden');
            if (promotionButton) {
                promotionButton.style.bottom = '';
            }
        }
    }

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    });

    adjustButtonVisibility();

    window.addEventListener('scroll', adjustButtonVisibility);

    const intervalCheck = setInterval(adjustButtonVisibility, 1000);

    window.addEventListener('beforeunload', () => {
        clearInterval(intervalCheck);
    });
})();