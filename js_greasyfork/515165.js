// ==UserScript==
// @name         快速采集
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  采集
// @author       Rayu
// @match        https://*.yangkeduo.com/*
// @match        https://*.taobao.com/*
// @match        https://*.1688.com/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/515165/%E5%BF%AB%E9%80%9F%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/515165/%E5%BF%AB%E9%80%9F%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isProcessing = false;

    document.addEventListener('keydown', function(event) {
        if ((event.key === 'F2' || event.key === 'F3') && !isProcessing) {
            isProcessing = true;

            // 查找所有按钮中，文本等于“开始采集”的按钮（保持不变）
            const buttons = Array.from(document.querySelectorAll('button'));
            const fetchButton = buttons.find(btn => btn.textContent.trim() === '开始采集');

            if (fetchButton) {
                fetchButton.click();
                console.log('开始采集按钮已点击 (按键: ' + event.key + ')');

                if (event.key === 'F2') {
                    // F2: 按600毫秒后返回上一页
                    setTimeout(() => {
                        window.history.back();
                        console.log('600毫秒后返回上一页');
                        isProcessing = false;
                    }, 600);
                } else if (event.key === 'F3') {
                    // F3: 等待弹窗出现并点击“取消”按钮
                    
                    const maxWait = 1000;       // 最大等待时间1秒
                    const intervalTime = 100;   // 每100ms检测一次
                    let waited = 0;

                    const tryClickCancel = () => {
                        const modal = document.querySelector('.modal-alert');
                        if (modal) {
                            const cancelBtn = modal.querySelector('button.dxm-btn-gray');
                            if (cancelBtn) {
                                cancelBtn.click();
                                console.log('弹窗“取消”按钮已点击');
                                isProcessing = false;
                                return;
                            }
                        }
                        waited += intervalTime;
                        if (waited < maxWait) {
                            setTimeout(tryClickCancel, intervalTime);
                        } else {
                            console.log('弹窗未出现，或未找到取消按钮，结束等待');
                            isProcessing = false;
                        }
                    };

                    // 延迟100ms后开始检测弹窗
                    setTimeout(tryClickCancel, intervalTime);
                }

            } else {
                console.log('未找到“开始采集”按钮');
                isProcessing = false;
            }
        }
    });
})();

