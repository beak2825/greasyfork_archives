// ==UserScript==
// @name         TikTok 小助手
// @namespace    http://tampermonkey.net/
// @version      5.18
// @description  获取 ttk 数据！
// @author
// @match        https://www.tiktok.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @icon         https://iili.io/dy5xjOg.jpg
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.js
// @resource     TOASTIFY_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @downloadURL https://update.greasyfork.org/scripts/511957/TikTok%20%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/511957/TikTok%20%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 加载 Toastify.js 的 CSS
    const toastifyCSS = GM_getResourceText('TOASTIFY_CSS');
    GM_addStyle(toastifyCSS);

    // 现在可以使用 Toastify.js 了

    let currentUrl = window.location.href;
    let retryCount = 0;
    let dataDisplayed = false; // 新增标志位

    // 获取设置值，默认值为 false
    let autoShowDataPanel = GM_getValue('autoShowDataPanel', false);

    // 在脚本菜单中添加选项以设置是否自动弹出数据面板
    GM_registerMenuCommand('切换自动弹出数据面板', () => {
        autoShowDataPanel = !autoShowDataPanel;
        GM_setValue('autoShowDataPanel', autoShowDataPanel);
        alert(`自动弹出数据面板已${autoShowDataPanel ? '启用' : '禁用'}`);
    });

    // 注入按钮样式到页面
    function injectButtonStyles() {
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.textContent = `
.button-87 {
  margin: 0px;
  padding: 10px 20px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  border-radius: 10px;
  display: block;
  border: 0px;
  font-weight: 700;
  box-shadow: 0px 0px 14px -7px #f09819;
  background-image: linear-gradient(45deg, #FF512F 0%, #F09819  51%, #FF512F  100%);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-87:hover {
  background-position: right center;
  /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
}

.button-87:active {
  transform: scale(0.95);
}
            `;
        document.head.appendChild(styleElement);
    }

    // 创建用于显示数据面板的按钮
    function createButton(parsedData) {
        const existingButton = document.querySelector('#tiktokDataButton');
        if (existingButton) {
            existingButton.remove();
        }

        // 创建新的按钮，使用您提供的样式类
        const button = document.createElement('button');
        button.id = 'tiktokDataButton';
        button.className = 'button-87';
        button.innerHTML = '🤓';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '200px';
        button.style.zIndex = '10001';

        button.addEventListener('click', () => {
            toggleDataDisplay(parsedData);
        });

        document.body.appendChild(button);
        console.log('Button created and appended to the page.');

        createRefreshButton();
        injectButtonStyles(); // 注入样式
    }

    // 创建手动刷新数据的按钮
    function createRefreshButton() {
        const existingRefreshButton = document.querySelector('#tiktokRefreshButton');
        if (existingRefreshButton) {
            existingRefreshButton.remove();
        }

        const refreshButton = document.createElement('button');
        refreshButton.id = 'tiktokRefreshButton';
        refreshButton.className = 'button-87';
        refreshButton.innerHTML = '🔄 刷新数据';
        refreshButton.style.position = 'fixed';
        refreshButton.style.top = '10px';
        refreshButton.style.right = '280px';
        refreshButton.style.zIndex = '10001';

        refreshButton.addEventListener('click', () => {
            console.log('Manual refresh button clicked.');
            retryCount = 0;
            currentUrl = window.location.href;
            dataDisplayed = false; // 重置标志位
            extractStats(true);
        });

        document.body.appendChild(refreshButton);
    }

    // 切换数据面板的显示和隐藏
    function toggleDataDisplay(parsedData) {
        console.log('toggleDataDisplay called');
        let dataContainer = document.querySelector('#tiktokDataContainer');
        if (dataContainer) {
            dataContainer.style.transform = 'translateX(100%)';
            dataContainer.style.opacity = '0';
            setTimeout(() => {
                dataContainer.remove();
            }, 500);
            return;
        }

        dataContainer = document.createElement('div');
        dataContainer.id = 'tiktokDataContainer';
        dataContainer.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
        dataContainer.style.transform = 'translateX(100%)';
        dataContainer.style.opacity = '0';
        dataContainer.style.position = 'fixed';
        dataContainer.style.top = '60px';
        dataContainer.style.right = '20px';
        dataContainer.style.width = '300px';
        dataContainer.style.maxHeight = '400px';
        dataContainer.style.overflowY = 'auto';
        dataContainer.style.backgroundColor = '#ffffff';
        dataContainer.style.border = '1px solid #ccc';
        dataContainer.style.borderRadius = '8px';
        dataContainer.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
        dataContainer.style.padding = '15px';
        dataContainer.style.zIndex = '10000';

        const title = document.createElement('h2');
        title.textContent = '🎉 好！发现了';
        title.style.color = '#000000';
        title.style.marginBottom = '10px';
        dataContainer.appendChild(title);

        createJsonElement(parsedData, dataContainer);
        document.body.appendChild(dataContainer);
        setTimeout(() => {
            dataContainer.style.transform = 'translateX(0)';
            dataContainer.style.opacity = '1';
        }, 10);
    }

    // 创建用于显示数据的元素
    function createJsonElement(data, container) {
        const fields = ['diggCount', 'playCount', 'commentCount', 'shareCount', 'collectCount', 'createTime'];

        // 提取账户名，去掉 @ 符号
        const accountName = window.location.pathname.split('/')[1].replace('@', '');

        // Base64 编码的复制图标
        const base64CopyIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAYUlEQVR4nGNgGE7Am4GB4QkDA8N/MjFB8JgCw/8TNp4EheQCulvgTWacgILakxgLKImTR8RYAOP7kIhxBvWoBT6jQeQzmor+0zqjoYOhb8Fjahd26MCTTEtAhnsQY8HQAABVctFxfxXV5QAAAABJRU5ErkJggg==";

        // 创建账户名和复制图标
        const accountRow = document.createElement('div');
        accountRow.style.display = 'flex';
        accountRow.style.alignItems = 'center';
        accountRow.style.marginBottom = '5px';

        const accountNameElement = document.createElement('div');
        accountNameElement.style.fontWeight = 'bold';
        accountNameElement.style.fontSize = '20px';
        accountNameElement.textContent = `${accountName}`;

        const copyAccountIcon = document.createElement('img');
        copyAccountIcon.src = base64CopyIcon;
        copyAccountIcon.style.cursor = 'pointer';
        copyAccountIcon.style.width = '20px';
        copyAccountIcon.style.marginLeft = '10px';

        copyAccountIcon.addEventListener('click', (event) => {
            event.preventDefault();
            navigator.clipboard.writeText(accountName).then(() => {
                showNotification('已复制到剪贴板: ' + accountName);
            }).catch(err => {
                console.error('复制失败: ', err);
            });
        });

        accountRow.appendChild(accountNameElement);
        accountRow.appendChild(copyAccountIcon);
        container.appendChild(accountRow);

        // 创建粉丝数和复制图标
        const followerCountRow = document.createElement('div');
        followerCountRow.style.display = 'flex';
        followerCountRow.style.alignItems = 'center';
        followerCountRow.style.marginBottom = '10px';

        const followerCountText = document.createElement('div');
        followerCountText.textContent = `粉丝数: ${data.followerCount || '未知'}`;

        const copyFollowerIcon = document.createElement('img');
        copyFollowerIcon.src = base64CopyIcon;
        copyFollowerIcon.style.cursor = 'pointer';
        copyFollowerIcon.style.width = '20px';
        copyFollowerIcon.style.marginLeft = '10px';

        copyFollowerIcon.addEventListener('click', (event) => {
            event.preventDefault();
            navigator.clipboard.writeText(data.followerCount).then(() => {
                showNotification('已复制到剪贴板: ' + followerCountText.textContent);
            }).catch(err => {
                console.error('复制失败: ', err);
            });
        });

        followerCountRow.appendChild(followerCountText);
        followerCountRow.appendChild(copyFollowerIcon);
        container.appendChild(followerCountRow);

        // 创建其他统计信息
        fields.forEach(field => {
            if (data.hasOwnProperty(field)) {
                if (field === 'createTime' && data[field] === 0) {
                    return; // 如果 createTime 为 0，则跳过
                }

                const item = document.createElement('div');
                item.style.marginBottom = '10px';
                item.style.display = 'flex';
                item.style.alignItems = 'center';

                let text = '';
                if (field === 'diggCount') {
                    text = `点赞数: ${data[field]}`;
                } else if (field === 'playCount') {
                    text = `播放数: ${data[field]}`;
                } else if (field === 'commentCount') {
                    text = `评论数: ${data[field]}`;
                } else if (field === 'shareCount') {
                    text = `分享数: ${data[field]}`;
                } else if (field === 'collectCount') {
                    text = `收藏数: ${data[field]}`;
                } else if (field === 'createTime') {
                    const date = new Date(data[field] * 1000);
                    text = `创建时间: ${date.toLocaleString()}`;
                }

                const textElement = document.createElement('span');
                textElement.textContent = text;
                textElement.style.color = '#000000';
                item.appendChild(textElement);

                const copyButtonIcon = document.createElement('img');
                copyButtonIcon.src = base64CopyIcon;
                copyButtonIcon.style.cursor = 'pointer';
                copyButtonIcon.style.width = '20px';
                copyButtonIcon.style.marginLeft = '10px';

                copyButtonIcon.addEventListener('click', (event) => {
                    event.preventDefault();
                    if (field === 'createTime') {
                        const date = new Date(data[field] * 1000);
                        const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
                        navigator.clipboard.writeText(formattedDate).then(() => {
                            showNotification('已复制到剪贴板: ' + formattedDate);
                        }).catch(err => {
                            console.error('复制失败: ', err);
                        });
                    } else {
                        navigator.clipboard.writeText(data[field]).then(() => {
                            showNotification('已复制到剪贴板: ' + data[field]);
                        }).catch(err => {
                            console.error('复制失败: ', err);
                        });
                    }
                });

                item.appendChild(copyButtonIcon);
                container.appendChild(item);
            }
        });
    }

    // 提取视频统计信息
    function extractStats(isManual = false) {
        fetch(window.location.href)
            .then(response => response.text())
            .then(responseText => {
                const scriptMatch = responseText.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">([\s\S]*?)<\/script>/);
                if (scriptMatch) {
                    try {
                        const jsonData = JSON.parse(scriptMatch[1]);
                        console.log('Attempting to extract data from script tag:', jsonData);
                        const stats = findStats(jsonData);
                        if (stats) {
                            console.log('Video stats found:', stats);
                            extractFollowerCount(stats, () => {
                                if (autoShowDataPanel && !dataDisplayed) {
                                    toggleDataDisplay(stats);
                                    dataDisplayed = true;
                                }
                            });
                            if (isManual) {
                                showNotification('数据已成功刷新');
                            }
                        } else {
                            console.warn('No relevant stats found in the script tag.');
                        }
                    } catch (e) {
                        console.error('Error parsing script tag:', e);
                    }
                } else {
                    console.warn('Script tag "__UNIVERSAL_DATA_FOR_REHYDRATION__" not found.');
                    if (!isManual) {
                        retryExtractStats();
                    }
                }
            });
    }

    // 重试提取数据
    function retryExtractStats() {
        if (retryCount < 5) {
            setTimeout(() => {
                console.log('Retrying data extraction...');
                retryCount++;
                extractStats();
            }, 2000);
        } else {
            console.warn('Max retry attempts reached. Data extraction failed.');
        }
    }

    // 提取粉丝数量
    function extractFollowerCount(stats, callback) {
        const userUrl = `https://www.tiktok.com/${window.location.pathname.split('/')[1]}`;

        fetch(userUrl)
            .then(response => response.text())
            .then(responseText => {
                const scriptMatch = responseText.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">([\s\S]*?)<\/script>/);
                if (scriptMatch) {
                    try {
                        const obj = JSON.parse(scriptMatch[1]);
                        const followerCount = findFollowerCount(obj);
                        if (followerCount !== null) {
                            stats.followerCount = followerCount;
                            createButton(stats);
                            if (typeof callback === 'function') {
                                callback();
                            }
                        } else {
                            console.warn('未找到粉丝计数。');
                        }
                    } catch (error) {
                        console.error('解析 JSON 时出错:', error);
                    }
                } else {
                    console.log('未找到包含页面数据的 <script> 标签。');
                }
            })
            .catch(error => {
                console.error('请求用户页面时出错:', error);
            });
    }

    // 在页面加载完成后运行 extractStats
    window.addEventListener('load', () => {
        console.log('Page fully loaded, attempting to extract stats.');
        extractStats();
    });

    // 监听 URL 变化并重新运行 extractStats
    setInterval(() => {
        if (currentUrl !== window.location.href) {
            console.log('URL changed, attempting to extract stats again.');
            currentUrl = window.location.href;
            retryCount = 0;
            dataDisplayed = false; // 重置标志位
            extractStats();
        }
    }, 1000);

    // 查找视频统计信息
    function findStats(jsonData) {
        let result = null;
        function recursiveSearch(obj) {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    recursiveSearch(obj[key]);
                } else if ((key === 'diggCount' || key === 'playCount' || key === 'commentCount' || key === 'shareCount' || key === 'collectCount' || key === 'createTime') && obj[key] !== 0) {
                    if (!result) {
                        result = {};
                    }
                    result[key] = obj[key];
                }
            }
        }
        recursiveSearch(jsonData);
        return result;
    }

    // 查找粉丝数量
    function findFollowerCount(jsonData) {
        let followerCount = null;
        function recursiveSearch(obj) {
            for (const key in obj) {
                if (key === 'followerCount') {
                    followerCount = obj[key];
                    return;
                }
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    recursiveSearch(obj[key]);
                }
            }
        }
        recursiveSearch(jsonData);
        return followerCount;
    }

// 显示通知
function showNotification(message) {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: 'top', // `top` 或 `bottom`
        position: 'center', // `left`, `center` 或 `right`
        style: {
            background: getRandomGradientColor(),
            color: '#FFFFFF', // 可选，设置文字颜色为白色
            borderRadius: '5px',
        },
        stopOnFocus: true, // 鼠标悬停时停止关闭
    }).showToast();
}

    // 获取随机的渐变颜色
    function getRandomGradientColor() {
        const gradients = [
            'linear-gradient(to right, #FF512F, #F09819)',
            'linear-gradient(to right, #00b09b, #96c93d)',
            'linear-gradient(to right, #ff5f6d, #ffc371)',
            'linear-gradient(to right, #2193b0, #6dd5ed)',
            'linear-gradient(to right, #cc2b5e, #753a88)',
            'linear-gradient(to right, #ee9ca7, #ffdde1)',
            'linear-gradient(to right, #b92b27, #1565C0)',
            'linear-gradient(to right, #373B44, #4286f4)',
            'linear-gradient(to right, #ff7e5f, #feb47b)',
            'linear-gradient(to right, #8360c3, #2ebf91)'
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    }


})();
