// ==UserScript==
// @name         在雪球首页显示CNN恐惧与贪婪指数
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  在雪球网显示CNN恐慌贪婪指数
// @author       Wab
// @match        https://*.xueqiu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      GPL-3.0
// @connect      i@zyzhang.com
// @connect      zhunzhua.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/513484/%E5%9C%A8%E9%9B%AA%E7%90%83%E9%A6%96%E9%A1%B5%E6%98%BE%E7%A4%BACNN%E6%81%90%E6%83%A7%E4%B8%8E%E8%B4%AA%E5%A9%AA%E6%8C%87%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/513484/%E5%9C%A8%E9%9B%AA%E7%90%83%E9%A6%96%E9%A1%B5%E6%98%BE%E7%A4%BACNN%E6%81%90%E6%83%A7%E4%B8%8E%E8%B4%AA%E5%A9%AA%E6%8C%87%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createCNNDiv() {
        return new Promise((resolve) => {
            const waitForElement = setInterval(() => {
                const targetContainer = document.querySelector('.user__col--con');

                if (targetContainer) {
                    clearInterval(waitForElement);

                    if (document.getElementById('cnn-index')) {
                        resolve(document.getElementById('cnn-index'));
                        return;
                    }

                    const width = targetContainer.offsetWidth;

                    const cnnDiv = document.createElement('div');
                    cnnDiv.id = 'cnn-index';
                    cnnDiv.style.cssText = `
                        width: ${width * 0.8}px; 
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        font-size: 16px;
                        font-weight: bold;
                        margin: 10px 0;
                        border-radius: 20px; 
                        position: relative;
                        z-index: 1000;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        background: #ffffff; 
                    `;

                    const titleDiv = document.createElement('div');
                    titleDiv.style.cssText = `
                        font-size: 12px;
                        color: #666;
                        text-align: center;
                        margin-top: 5px; 
                    `;
                    titleDiv.textContent = '恐惧贪婪指数';

                    const wrapper = document.createElement('div');
                    wrapper.style.cssText = `
                        margin: 5px 0;
                        padding: 10px;
                        background: #ffffff;
                    `;

                    wrapper.appendChild(cnnDiv);
                    wrapper.appendChild(titleDiv); 

                    const friendsDiv = targetContainer.querySelector('.user__col--friends');
                    if (friendsDiv) {
                        friendsDiv.parentNode.insertBefore(wrapper, friendsDiv.nextSibling);
                    } else {
                        targetContainer.appendChild(wrapper);
                    }

                    cnnDiv.innerHTML = '<a href="https://zhunzhua.com/data/brand.php?brand=cnn" target="_blank">加载中...</a>';
                    resolve(cnnDiv);
                }
            }, 500);
        });
    }

    function fetchCNNData(cnnDiv) {
        const timestamp = new Date().getTime();
        const url = 'https://zhunzhua.com/cnn/cnn.txt';

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${url}?t=${timestamp}`,
                headers: {
                    'Accept': 'text/plain',
                    'Cache-Control': 'no-cache'
                },
                timeout: 10000,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const lines = response.responseText.trim().split('\n');
                            if (lines.length > 0) {
                                const firstLine = lines[0];
                                const matches = firstLine.match(/(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2})\s+(\d+)/);

                                if (matches) {
                                    const value = parseInt(matches[2]);
                                    let status, color;

                                    if (value <= 25) {
                                        status = '极度恐惧';
                                        color = '#ff4444';
                                    } else if (value <= 45) {
                                        status = '恐惧';
                                        color = '#ffa726';
                                    } else if (value <= 55) {
                                        status = '中立';
                                        color = 'transparent';
                                    } else if (value <= 75) {
                                        status = '贪婪';
                                        color = '#66bb6a';
                                    } else {
                                        status = '极度贪婪';
                                        color = '#42a5f5';
                                    }

                                    cnnDiv.style.backgroundColor = color;
                                    cnnDiv.style.border = color === 'transparent' ? '1px solid #e9e9e9' : 'none';
                                    cnnDiv.style.color = color === 'transparent' ? '#333' : '#fff';
                                    cnnDiv.innerHTML = `<a href="https://zhunzhua.com/data/brand.php?brand=cnn" target="_blank" style="color: inherit; text-decoration: none;">${value} (${status})</a>`;
                                    resolve(true);
                                } else {
                                    throw new Error('数据格式不匹配');
                                }
                            } else {
                                throw new Error('响应内容为空');
                            }
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        reject(new Error(`HTTP 错误: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(error);
                },
                ontimeout: function() {
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    async function init() {
        try {
            const cnnDiv = await createCNNDiv();

            async function updateData() {
                try {
                    await fetchCNNData(cnnDiv);
                } catch (error) {
                    console.error('数据更新失败:', error);
                    cnnDiv.innerHTML = '<a href="https://zhunzhua.com/data/brand.php?brand=cnn" target="_blank" style="color: inherit; text-decoration: none;">数据获取失败</a>';
                }
            }

            await updateData();
            setInterval(updateData, 5 * 60 * 1000);

        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 1000);
        }
    }).observe(document, { subtree: true, childList: true });
})();