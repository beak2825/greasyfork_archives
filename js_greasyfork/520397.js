// ==UserScript==
// @name         MSU 去去廣告走
// @namespace    http://tampermonkey.net/
// @version      0.21
// @author       Alex from MyGOTW
// @description  去除MSU每日廣告
// @match        https://msu.io/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520397/MSU%20%E5%8E%BB%E5%8E%BB%E5%BB%A3%E5%91%8A%E8%B5%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/520397/MSU%20%E5%8E%BB%E5%8E%BB%E5%BB%A3%E5%91%8A%E8%B5%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
            const checklocal = window.localStorage.getItem('GEAR_UP_MODAL_CHECKED');
            const isChecked = checklocal === 'true';
            if(isChecked){
                console.log('checklocal', checklocal)
                console.log('今日已清除廣告')
                return
            }
    let isRemoved = false;
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

    const initialize = async () => {
        console.log('Initialize being called with URL:', window.location.href);
        try {
            console.log('開始等待目標元素...');
            // 等待目標元素出現
            const targetNode = await waitForElement('div[class*="msu-modal"]');
            const blackModal = await waitForElement('div[class*="msu-screen-blocker"]');
            console.log('目標元素已找到:', targetNode);

            // 將該元素設置為 display: none
            targetNode.style.display = 'none';
            blackModal.style.display = 'none';
            window.localStorage.setItem('GEAR_UP_MODAL_CHECKED', 'true');
            isRemoved = true;
            document.body.style.overflow = 'auto';
            console.log('目標元素已被隱藏');

            // 設置 observer 監聽後續變化
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        // 檢查是否有新的 modal container 被添加
                        mutation.addedNodes.forEach(node => {
                            if (node.id === 'async-modal-container') {
                                node.style.display = 'none';
                                console.log('新增的 modal container 已被隱藏');
                            }
                        });
                    }
                });
            });

            // 監聽 document.body 以捕捉任何新增的 modal
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

        } catch (error) {
            console.error('Error initializing:', error);
        }
    }

    const handleUrlChange = (method) => {
        console.log(`小精靈通知: [${method}] URL 已變化: ${window.location.href}`);
        if (!isRemoved) {
            initialize();
        }
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