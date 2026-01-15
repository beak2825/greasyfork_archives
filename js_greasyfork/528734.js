// ==UserScript==
// @name         Komica: F5 AI優化版
// @version      1.1.2
// @description  Instant jump to top and fast refresh on F5.
// @author       Hayao-Gai
// @namespace    https://github.com/HayaoGai
// @icon https://www.google.com/s2/favicons?sz=64&domain=komica1.org
// @match        *://*.komica*.org/*
// @match        *://*.komica1.org/*
// @exclude      *://*.komica1.org/*/src/*
// @exclude      *://*.komica1.org/*/thumb/*
// @exclude      *://*.komica1.org/*/pixmicat.php?mode=module*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528734/Komica%3A%20F5%20AI%E5%84%AA%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/528734/Komica%3A%20F5%20AI%E5%84%AA%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Komica F5: Script started');

    const redArrow = `
        <svg width="45" height="45" viewBox="0 0 128 128">
            <path fill="#800000" d="M64 10c29.8 0 54 24.2 54 54s-24.2 54-54 54S10 93.8 10 64 34.2 10 64 10zm0 20c-8.3 0-15 6.7-15 15v30l-15-15-7.1 7.1L64 104l37.1-37.1-7.1-7.1-15 15V45c0-8.3-6.7-15-15-15z"/>
        </svg>
    `;

    let ctrl = false;
    let r = false;

    // 使用 requestAnimationFrame 確保初始化在下一個畫面框架
    window.requestAnimationFrame(() => {
        console.log('Komica F5: Window loaded');
        initialize();
    });

    function initialize() {
        console.log('Komica F5: Initializing...');
        try {
            defineCSS();
            createArrowButton();
            setupKeyListeners();
            console.log('Komica F5: Script fully loaded');
        } catch (error) {
            console.error('Komica F5: Initialization Error:', error);
        }
    }

    function createArrowButton() {
        if (!document.body) {
            console.error('Komica F5: document.body not available');
            return;
        }
        const div = document.createElement('div');
        div.classList.add('arrow');
        div.innerHTML = redArrow;
        div.addEventListener('click', fastRefresh, { passive: true });
        document.body.appendChild(div);
        console.log('Komica F5: Arrow button created');
    }

    function fastRefresh() {
        console.log('Komica F5: Initiating fast refresh');
        // 立即跳到頂部
        window.scrollTo({
            top: 0,
            behavior: 'instant' // 確保即時跳轉
        });

        // 添加時間戳避免緩存
        const url = new URL(location.href);
        url.searchParams.set('t', Date.now());

        // 使用 replaceState 避免創建新的歷史記錄
        history.replaceState(null, '', url);
        location.reload(true); // true 強制從服務器重新加載
    }

    function setupKeyListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                console.log('Komica F5: Refresh key detected');
                e.preventDefault();
                fastRefresh();
            }
        }, { passive: false });
    }

    function defineCSS() {
        const style = document.createElement('style');
        style.textContent = `
            .arrow {
                position: fixed;
                right: 50px;
                bottom: 30px;
                cursor: pointer;
                z-index: 9999;
                width: 45px;
                height: 45px;
                background-color: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                touch-action: manipulation; /* 優化移動端響應 */
            }
            .arrow svg {
                width: 100%;
                height: 100%;
                display: block;
            }
        `;
        document.head.appendChild(style);
        console.log('Komica F5: CSS defined');
    }
})();