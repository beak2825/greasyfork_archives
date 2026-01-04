// ==UserScript==
// @name         小册每日自动请求（终极完成版）
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  检查登录状态和本地存储后自动完成每日请求（支持subType并过滤已完成任务）
// @author       江南小虫虫
// @match        https://xiaoce.fun/daily
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      xiaoce.fun
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532407/%E5%B0%8F%E5%86%8C%E6%AF%8F%E6%97%A5%E8%87%AA%E5%8A%A8%E8%AF%B7%E6%B1%82%EF%BC%88%E7%BB%88%E6%9E%81%E5%AE%8C%E6%88%90%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/532407/%E5%B0%8F%E5%86%8C%E6%AF%8F%E6%97%A5%E8%87%AA%E5%8A%A8%E8%AF%B7%E6%B1%82%EF%BC%88%E7%BB%88%E6%9E%81%E5%AE%8C%E6%88%90%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储键名
    const STORAGE_KEY = 'xiaoce_daily_completed';
    
    // 检查用户登录状态
    async function checkLoginStatus() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://xiaoce.fun/api/v0/xiaoce/user/getUserId",
                headers: {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "fun-device": "web",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                referrer: "https://xiaoce.fun/daily",
                referrerPolicy: "strict-origin-when-cross-origin",
                credentials: "include",
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success && data.data) {
                            resolve(true); // 已登录
                        } else {
                            resolve(false); // 未登录
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 检查是否已经完成所有任务（本地存储）
    function checkAllCompletedToday() {
        const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const storedData = GM_getValue(STORAGE_KEY, null);
        
        if (storedData && storedData.date === today && storedData.allCompleted) {
            return true;
        }
        return false;
    }

    // 记录所有任务已完成
    function recordAllCompleted() {
        const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
        GM_setValue(STORAGE_KEY, {
            date: today,
            allCompleted: true
        });
    }

    // 清除存储记录（用于测试）
    function clearStorage() {
        GM_deleteValue(STORAGE_KEY);
    }

    // 提示用户登录
    function promptLogin() {
        // 查找登录按钮
        const loginBtn = document.querySelector('.ant-badge');
        
        if (loginBtn) {
            // 创建提示元素
            const prompt = document.createElement('div');
            prompt.style.position = 'fixed';
            prompt.style.top = '50%';
            prompt.style.left = '50%';
            prompt.style.transform = 'translate(-50%, -50%)';
            prompt.style.backgroundColor = 'rgba(0,0,0,0.8)';
            prompt.style.color = 'white';
            prompt.style.padding = '20px';
            prompt.style.borderRadius = '5px';
            prompt.style.zIndex = '99999';
            prompt.style.textAlign = 'center';
            prompt.style.maxWidth = '80%';
            prompt.innerHTML = `
                <h3 style="margin-top:0;">请先登录</h3>
                <p>检测到您未登录，请点击右上角登录按钮</p>
                <p>登录后脚本会自动继续执行</p>
                <button id="retryBtn" style="padding:5px 15px;background:#1890ff;color:white;border:none;border-radius:4px;cursor:pointer;">我已登录</button>
            `;
            
            // 高亮登录按钮
            loginBtn.style.boxShadow = '0 0 0 2px #1890ff';
            loginBtn.style.transition = 'box-shadow 0.3s';
            
            document.body.appendChild(prompt);
            
            // 添加重试按钮事件
            document.getElementById('retryBtn').addEventListener('click', async () => {
                prompt.remove();
                loginBtn.style.boxShadow = '';
                
                try {
                    const isLoggedIn = await checkLoginStatus();
                    if (isLoggedIn) {
                        showNotification('登录成功，开始执行任务', 'success');
                        await main();
                    } else {
                        showNotification('仍未检测到登录状态', 'error');
                        promptLogin();
                    }
                } catch (error) {
                    console.error('Error checking login status:', error);
                    showNotification('检查登录状态出错', 'error');
                }
            });
            
            // 5秒后自动检查登录状态
            setTimeout(async () => {
                try {
                    const isLoggedIn = await checkLoginStatus();
                    if (isLoggedIn) {
                        prompt.remove();
                        loginBtn.style.boxShadow = '';
                        showNotification('登录成功，开始执行任务', 'success');
                        await main();
                    }
                } catch (error) {
                    console.error('Error checking login status:', error);
                }
            }, 5000);
        } else {
            showNotification('未找到登录按钮，请手动登录', 'error');
        }
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            error: '#f44336',
            warning: '#FF9800'
        };
        
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.style.color = 'white';
        notification.style.padding = '15px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.maxWidth = '300px';
        notification.style.wordBreak = 'break-word';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 5000);
    }

    // 获取当前日期
    async function getCurrentDate() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://xiaoce.fun/api/v0/quiz/daily/getDateV1",
                headers: {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "fun-device": "web",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success) {
                            resolve(data.data);
                        } else {
                            reject(new Error("Failed to get date"));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 获取已完成的任务列表
    async function getCompletedTasks(date) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://xiaoce.fun/api/v0/quiz/daily/checkSuccess?date=${date}`,
                headers: {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "fun-device": "web",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                referrer: "https://xiaoce.fun/daily",
                referrerPolicy: "strict-origin-when-cross-origin",
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success) {
                            // 提取type（去掉小数点后面的部分）
                            const completedTypes = data.data.map(item => {
                                const dotIndex = item.indexOf('.');
                                return dotIndex === -1 ? item : item.substring(0, dotIndex);
                            });
                            resolve(new Set(completedTypes)); // 使用Set便于快速查找
                        } else {
                            reject(new Error("Failed to get completed tasks"));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 获取类型列表（包含subType）
    async function getTypeList() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://xiaoce.fun/api/v0/quiz/daily/list",
                headers: {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9",
                    "fun-device": "web",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success) {
                            // 返回包含type和subType的对象数组
                            resolve(data.data.map(item => ({
                                type: item.type,
                                subType: item.subType
                            })));
                        } else {
                            reject(new Error("Failed to get type list"));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // 发送每日请求（支持subType）
    function sendDailyRequest(typeInfo, date) {
        let url = `https://xiaoce.fun/api/v0/quiz/daily/addRecord?type=${typeInfo.type}&date=${date}&status=success`;
        
        // 如果subType有值，则添加到URL中
        if (typeInfo.subType) {
            url += `&subType=${encodeURIComponent(typeInfo.subType)}`;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "fun-device": "web",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            referrerPolicy: "strict-origin-when-cross-origin",
            onload: function(response) {
                console.log(`Request for ${typeInfo.type}${typeInfo.subType ? ` (subType: ${typeInfo.subType})` : ''} completed:`, response);
            },
            onerror: function(error) {
                console.error(`Request for ${typeInfo.type}${typeInfo.subType ? ` (subType: ${typeInfo.subType})` : ''} failed:`, error);
            }
        });
    }

    // 主函数
    async function main() {
        try {
            // 检查是否已经完成所有任务
            if (checkAllCompletedToday()) {
                showNotification('今日所有任务已完成（本地存储记录），无需执行', 'info');
                return;
            }

            const date = await getCurrentDate();
            const completedTypes = await getCompletedTasks(date);
            const typeInfos = await getTypeList();
            
            console.log("Current date:", date);
            console.log("Completed types:", completedTypes);
            console.log("All available types:", typeInfos);
            
            // 过滤掉已完成的类型
            const typesToSend = typeInfos.filter(typeInfo => !completedTypes.has(typeInfo.type));
            
            console.log("Types to send requests:", typesToSend);
            
            if (typesToSend.length > 0) {
                // 为每个未完成的类型发送请求
                typesToSend.forEach(typeInfo => {
                    sendDailyRequest(typeInfo, date);
                });
                showNotification(`已自动发送 ${typesToSend.length} 个未完成的每日请求`, 'success');
            } else {
                // 记录所有任务已完成
                recordAllCompleted();
                showNotification('所有每日任务已完成，已记录到本地存储', 'success');
            }
            
        } catch (error) {
            console.error("Error in main function:", error);
            showNotification('自动请求失败，请查看控制台', 'error');
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', async function() {
        setTimeout(async () => {
            try {
                const isLoggedIn = await checkLoginStatus();
                if (isLoggedIn) {
                    await main();
                } else {
                    promptLogin();
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                showNotification('检查登录状态出错', 'error');
            }
        }, 2000); // 延迟2秒执行，确保页面完全加载
    });
})();