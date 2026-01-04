// ==UserScript==
// @name         Kemono2Neko
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Transfer followings from kemono.su to nekohouse.su with a progress bar.
// @author       NBXX
// @match        https://nekohouse.su/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @connect      kemono.su
// @connect      nekohouse.su
// @downloadURL https://update.greasyfork.org/scripts/519167/Kemono2Neko.user.js
// @updateURL https://update.greasyfork.org/scripts/519167/Kemono2Neko.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定位到要嵌入按钮的目标位置
    const targetContainer = document.querySelector('body > div.global-sidebar > div.global-sidebar-entry.stuck-bottom > div');
    if (!targetContainer) {
        console.error('目标容器未找到，无法插入按钮。');
        return;
    }

    // 复制目标位置的格式，创建一个新的按钮容器
    const transferContainer = targetContainer.cloneNode(true);
    transferContainer.innerHTML = ''; // 清空原有内容
    const transferButton = document.createElement('div');
    transferButton.id = 'transfer-button';
    transferButton.innerText = '开始同步';
    transferButton.style.cursor = 'pointer';
    transferContainer.appendChild(transferButton);
    targetContainer.parentNode.insertBefore(transferContainer, targetContainer);

    // 创建一个进度条容器
    const progressBarContainer = document.createElement('div');
    progressBarContainer.id = 'progress-bar-container';
    progressBarContainer.style.display = 'none';
    document.body.appendChild(progressBarContainer);

    GM_addStyle(`
        #progress-bar-container {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 20px;
            background: #000;
            z-index: 10000;
            display: flex;
            overflow: hidden;
        }
        .progress-bar {
            height: 100%;
        }
        .progress-bar.success {
            background: green;
        }
        .progress-bar.failure {
            background: red;
        }
        .progress-bar.pending {
            background: black;
        }
    `);

    transferButton.addEventListener('click', startTransfer);

    function startTransfer() {
        // 显示进度条
        progressBarContainer.style.display = 'flex';

        // 获取 nekohouse.su 的现有关注数据
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://nekohouse.su/api/v1/account/favorites',
            onload: function(response) {
                if (response.status === 200) {
                    const existingFavorites = JSON.parse(response.responseText);
                    const existingIds = new Set(existingFavorites.map(fav => `${fav.service}:${fav.id}`));

                    // 获取 kemono.cr 的关注数据
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://kemono.cr/api/v1/account/favorites?type=artist',
                        onload: function(kemonoResponse) {
                            if (kemonoResponse.status === 200) {
                                let favorites = JSON.parse(kemonoResponse.responseText);

                                // 过滤掉已经存在的关注
                                favorites = favorites.filter(fav => !existingIds.has(`${fav.service}:${fav.id}`));
                                const total = favorites.length;

                                // 创建进度条元素
                                for (let i = 0; i < total; i++) {
                                    const progressBar = document.createElement('div');
                                    progressBar.className = 'progress-bar pending';
                                    progressBar.style.width = `${100 / total}%`;
                                    progressBarContainer.appendChild(progressBar);
                                }

                                // 开始逐个添加关注
                                let completed = 0;
                                favorites.forEach((fav, index) => {
                                    const url = `https://nekohouse.su/favorites/archive/${fav.service}/${fav.id}`;
                                    GM_xmlhttpRequest({
                                        method: 'POST',
                                        url: url,
                                        onload: function(postResponse) {
                                            const progressBar = progressBarContainer.children[index];
                                            if (postResponse.status === 200) {
                                                progressBar.classList.remove('pending');
                                                progressBar.classList.add('success');
                                                transferButton.innerText = `${fav.name} 已添加`;
                                            } else {
                                                progressBar.classList.remove('pending');
                                                progressBar.classList.add('failure');
                                            }
                                            // 检查是否完成
                                            completed++;
                                            if (completed === total) {
                                                setTimeout(() => {
                                                    progressBarContainer.style.display = 'none';
                                                    transferButton.innerText = '开始同步';
                                                }, 2000);
                                            }
                                        },
                                        onerror: function() {
                                            const progressBar = progressBarContainer.children[index];
                                            progressBar.classList.remove('pending');
                                            progressBar.classList.add('failure');
                                            // 检查是否完成
                                            completed++;
                                            if (completed === total) {
                                                setTimeout(() => {
                                                    progressBarContainer.style.display = 'none';
                                                    transferButton.innerText = '开始同步';
                                                }, 2000);
                                            }
                                        }
                                    });
                                });
                            } else {
                                console.error('Failed to fetch kemono favorites:', kemonoResponse);
                            }
                        },
                        onerror: function() {
                            console.error('Error occurred while trying to fetch kemono favorites.');
                        }
                    });
                } else {
                    console.error('Failed to fetch nekohouse favorites:', response);
                }
            },
            onerror: function() {
                console.error('Error occurred while trying to fetch nekohouse favorites.');
            }
        });
    }
})();