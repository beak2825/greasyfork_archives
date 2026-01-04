// ==UserScript==
// @name         企管帮日报提交
// @name:zh-CN   企管帮日报提交
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  修改设计列表保存接口的状态参数
// @description:zh-CN  修改设计列表保存接口的状态参数
// @author       焦灼
// @license      MIT
// @match        *://qiguanbang.com/*
// @match        *://*.qiguanbang.com/*
// @grant        GM_addStyle
// @grant        GM_notification
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/531455/%E4%BC%81%E7%AE%A1%E5%B8%AE%E6%97%A5%E6%8A%A5%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/531455/%E4%BC%81%E7%AE%A1%E5%B8%AE%E6%97%A5%E6%8A%A5%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加 unsafeWindow 引用
    const w = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
    
    function init() {
        // 添加样式
        GM_addStyle(`
            .custom-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999998;
            }
            .custom-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 999999;
                width: 300px;
            }
            .modal-title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 15px;
                text-align: center;
            }
            .modal-buttons {
                display: flex;
                justify-content: space-around;
                margin-top: 20px;
            }
            .modal-button {
                padding: 8px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            .original-button {
                background: #f5f5f5;
                color: #666;
            }
            .modified-button {
                background: #7087ff;
                color: white;
            }
            .float-button {
                position: fixed;
                left: 20px;
                bottom: 50%;
                width: 50px;
                height: 50px;
                background: #7087ff;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 999997;
                font-size: 24px;
                border: none;
                transition: transform 0.2s;
            }
            .float-button:hover {
                transform: scale(1.1);
            }
        `);
        // 创建弹窗
        function createModal() {
            return new Promise((resolve) => {
                const overlay = document.createElement('div');
                overlay.className = 'custom-modal-overlay';

                const modal = document.createElement('div');
                modal.className = 'custom-modal';
                modal.innerHTML = `
                    <div class="modal-title">请选择参数处理方式</div>
                    <div class="modal-buttons">
                        <button class="modal-button original-button">草稿</button>
                        <button class="modal-button modified-button">提交</button>
                    </div>
                `;

                overlay.appendChild(modal);
                document.body.appendChild(overlay);

                const buttons = modal.querySelectorAll('button');
                buttons[0].onclick = () => {
                    document.body.removeChild(overlay);
                    resolve(false);
                };
                buttons[1].onclick = () => {
                    document.body.removeChild(overlay);
                    resolve(true);
                };
            });
        }

        // 修改拦截器代码
        const originalXHR = w.XMLHttpRequest;
        w.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            const originalSend = xhr.send;

            xhr.open = function() {
                this._url = arguments[1];
                return originalOpen.apply(this, arguments);
            };

            xhr.send = async function(data) {
                if (this._url && this._url.includes('gateway.jingyingbang.com/lowcode/v2/table/data/save')) {
                    try {
                        const shouldModify = await createModal();
                        if (shouldModify) {
                            let modifiedData = JSON.parse(data);
                            modifiedData.state = 1;
                            console.log('已修改状态参数:', modifiedData);
                            data = JSON.stringify(modifiedData);
                            GM_notification({
                                text: '已将状态参数修改为1',
                                title: '参数修改成功',
                                timeout: 2000
                            });
                        }
                    } catch (e) {
                        console.error('数据处理失败:', e);
                    }
                }
                return originalSend.call(this, data);
            };

            return xhr;
        };

        // 修改 Fetch 拦截器
        const originalFetch = w.fetch;
        w.fetch = async function(url, options = {}) {
            if (typeof url === 'string' && url.includes('gateway.jingyingbang.com/lowcode/v2/table/data/save')) {
                try {
                    const shouldModify = await createModal();
                    if (shouldModify) {
                        const modifiedOptions = {...options};
                        if (modifiedOptions.body) {
                            let data = JSON.parse(modifiedOptions.body);
                            data.state = 1;
                            console.log('已修改状态参数:', data);
                            modifiedOptions.body = JSON.stringify(data);
                            GM_notification({
                                text: '已将状态参数修改为1',
                                title: '参数修改成功',
                                timeout: 2000
                            });
                            return originalFetch(url, modifiedOptions);
                        }
                    }
                } catch (e) {
                    console.error('数据处理失败:', e);
                }
            }
            return originalFetch.apply(w, arguments);
        };

        // 创建并显示 toast 提示
        function showToast(message) {
            GM_addStyle(`
                .custom-toast {
                    position: fixed;
                    bottom: 50%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 4px;
                    z-index: 999999;
                }
            `);

            const toast = document.createElement('div');
            toast.className = 'custom-toast';
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                document.body.removeChild(toast);
            }, 3000);
        }

        // 将控制台日志改为 toast 提示
        showToast('企管帮日报提交脚本已启动');
        console.log('企管帮日报提交脚本已启动');
    }

    // 使用 setTimeout 确保在页面加载完成后执行
    setTimeout(init, 2000);
})();