// ==UserScript==
// @name         手动更新住小橙Cookie2
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @connect      118.25.14.156
// @description  在网页右上角显示一个小窗口
// @author       Your name
// @match        https://jia.bnq.com.cn/*
// @match        https://jia.bnq.com.cn/*/*
// @match        https://jia.bnq.com.cn/*/*/*
// @match        https://jia.bnq.com.cn/*/*/*/*

// @match        https://geadmin.bnq.com.cn/*
// @match        https://geadmin.bnq.com.cn/*/*
// @match        https://geadmin.bnq.com.cn/*/*/*
// @match        https://geadmin.bnq.com.cn/*/*/*/*

// @match        https://jia.bnq.com.cn/*
// @match        https://jia.bnq.com.cn/*/*
// @match        https://jia.bnq.com.cn/*/*/*
// @match        https://jia.bnq.com.cn/*/*/*/*

// @match        https://customer.bnq.com.cn/*
// @match        https://customer.bnq.com.cn/*/*
// @match        https://customer.bnq.com.cn/*/*/*
// @match        https://customer.bnq.com.cn/*/*/*/*
// @match        https://z.bnq.com.cn/homepage
// @match        https://dcmall.bnq.com.cn/*
// @match        https://dcmall.bnq.com.cn/*/*
// @match        https://dcmall.bnq.com.cn/*/*/*
// @match        https://dcmall.bnq.com.cn/*/*/*/*
// @match        https://finance.bnq.com.cn/welcome
// @match        https://finance.bnq.com.cn/*
// @match        https://finance.bnq.com.cn/*/*
// @match        https://finance.bnq.com.cn/*/*/*
// @match        https://finance.bnq.com.cn/*/*/*/*


// @match        https://hrm.bnq.com.cn/*
// @match        https://hrm.bnq.com.cn/*/*
// @match        https://hrm.bnq.com.cn/*/*/*
// @match        https://hrm.bnq.com.cn/*/*/*/*
// @license       MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/517873/%E6%89%8B%E5%8A%A8%E6%9B%B4%E6%96%B0%E4%BD%8F%E5%B0%8F%E6%A9%99Cookie2.user.js
// @updateURL https://update.greasyfork.org/scripts/517873/%E6%89%8B%E5%8A%A8%E6%9B%B4%E6%96%B0%E4%BD%8F%E5%B0%8F%E6%A9%99Cookie2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function updateCookieInfo() {
    const url = 'http://118.25.14.156:9091/api/db/update/';
    const data = {
        table_name: "zxc_cookie_info",
        values: {
            cookie_info: 26
        },
        conditions: "id = 3"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log('更新结果:', result);
        return result;
    } catch (error) {
        console.error('更新失败:', error);
        throw error;
    }
}

// 调用示例
updateCookieInfo()
    .then(result => {
        // 处理成功响应
    })
    .catch(error => {
        // 处理错误
    });


    // 在创建 titleBar 后添加更新标题的函数
    function updateTitleBar(lastUpdateTime) {
        question.textContent = `最后一次更新时间 :\n(${lastUpdateTime})`;
    }

    // 在 popup 初始化后立即发送请求获取最后更新时间
    const postData = {
        table_name: "zxc_cookie_info",
        fields: ["last_update_time"],
        conditions: "id =  2"
    };

    GM_xmlhttpRequest({
        method: "POST",
        url: "http://118.25.14.156:9091/api/db/query/",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(postData),
        onload: function(response) {
            try {
                const data = JSON.parse(response.responseText);
                if (data && data.data && data.data.length > 0) {
                    const lastUpdateTime = data.data[0].last_update_time;
                    updateTitleBar(lastUpdateTime);
                }
            } catch (error) {
                console.error('解析数据时出错:', error);
            }
        },
        onerror: function(error) {
            console.error('请求失败:', error);
        }
    });


    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 200px;
        padding: 15px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 9999;
        cursor: move;
    `;

    const titleContainer = document.createElement('div');
    titleContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        margin: -15px -15px 10px -15px;
        background: #f0f0f0;
        border-radius: 5px 5px 0 0;
        cursor: move;
        user-select: none;
    `;

    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
        padding: 5px;
        margin: 0px 0px 0px 0px;
        background: #f0f0f0;
        border-radius: 5px 5px 0 0;
        cursor: move;
        user-select: none;
    `;

    titleBar.textContent = '更新住小橙COOKIE';

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
        padding: 0 5px;
    `;

    closeButton.addEventListener('click', () => {
        popup.remove();
    });

    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    titleBar.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - popup.offsetLeft;
        initialY = e.clientY - popup.offsetTop;

        if (e.target === titleBar) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            popup.style.transition = 'none';
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            const maxX = window.innerWidth - popup.offsetWidth;
            const maxY = window.innerHeight - popup.offsetHeight;

            currentX = Math.min(Math.max(0, currentX), maxX);
            currentY = Math.min(Math.max(0, currentY), maxY);

            popup.style.left = currentX + 'px';
            popup.style.top = currentY + 'px';
            popup.style.right = 'auto';

            hideDirection = null;
            popup.style.transform = 'none';
        }
    }

    function dragEnd() {
        isDragging = false;
    }

    let hideDirection = null;
    const hideThreshold = 10;

    popup.addEventListener('mouseenter', () => {
        if (hideDirection) {
            popup.style.transition = 'transform 0.3s ease, border-radius 0.3s ease';
            popup.style.borderRadius = '5px';
            switch (hideDirection) {
                case 'left':
                    popup.style.transform = 'translateX(0)';

                    break;
                case 'right':
                    popup.style.transform = 'translateX(0)';
                    break;
                case 'top':
                    popup.style.transform = 'translateY(0)';
                    break;
            }
            hideDirection = null;
            updateTitleBar(lastUpdateTime);
        }
    });

    popup.addEventListener('mouseleave', () => {
        const rect = popup.getBoundingClientRect();
        const distanceToRight = window.innerWidth - rect.right;
        const distanceToLeft = rect.left;
        const distanceToTop = rect.top;

        popup.style.transition = 'transform 0.3s ease, border-radius 0.3s ease';

        if (distanceToRight < hideThreshold) {
            popup.style.transform = 'translateX(calc(100% - 30px))';
            popup.style.borderRadius = '5px 0 0 5px';
            hideDirection = 'right';
        } else if (distanceToLeft < hideThreshold) {
            popup.style.transform = 'translateX(calc(-100% + 30px))';
            popup.style.borderRadius = '0 5px 5px 0';
            hideDirection = 'left';
        } else if (distanceToTop < hideThreshold) {
            popup.style.transform = 'translateY(calc(-100% + 30px))';
            popup.style.borderRadius = '0 0 5px 5px';
            hideDirection = 'top';
        }
        updateTitleBar(lastUpdateTime);

    });

    const question = document.createElement('p');
    question.style.cssText = `
        margin-bottom: 10px;
        word-break: break-all;
        white-space: pre-wrap;
        font-size: 12px;
    `;
    question.textContent = '最后一次更新时间：\n';

    const button = document.createElement('button');
    button.textContent = '更新';
    button.style.cssText = `
        padding: 5px 10px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        transition: background-color 0.3s;
    `;

    // 添加获取Cookie的函数
    function getZxcCookies() {
        const cookies = document.cookie;
        if (cookies) {
            console.log('Cookies:', cookies);
            return { cookie_info: cookies };
        } else {
            alert('未正常获取到Cookies');
            return null;
        }
    }

    // 修改发送Cookie的函数
    function openGetCookiesWindow() {
        const cookieData = getZxcCookies();
        if (cookieData) {
            // 发送更新请求
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://118.25.14.156:9091/api/db/update/",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    table_name: "zxc_cookie_info",
                    values:cookieData,
                    conditions: "id = 2"
                }),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        console.log('更新结果:', data);

                        // 更新按钮状态
                        button.style.backgroundColor = '#2196F3';
                        button.textContent = '已更新';

                        // 获取最新的更新时间
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: "http://118.25.14.156:9091/api/db/query/",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            data: JSON.stringify({
                                table_name: "zxc_cookie_info",
                                fields: ["last_update_time"],
                                conditions: "id = 2"
                            }),
                            onload: function(response) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    if (data && data.data && data.data.length > 0) {
                                        const lastUpdateTime = data.data[0].last_update_time;
                                        updateTitleBar(lastUpdateTime);
                                    }
                                } catch (error) {
                                    console.error('解析数据时出错:', error);
                                }
                            }
                        });

                    } catch (error) {
                        console.error('更新失败:', error);
                    }
                },
                onerror: function(error) {
                    console.error('请求失败:', error);
                }
            });

            // 3秒后恢复按钮状态
            setTimeout(() => {
                button.style.backgroundColor = '#4CAF50';
                button.textContent = '更新';
            }, 3000);
        }
    }

    // 修改按钮点击事件
    button.addEventListener('click', function() {
        openGetCookiesWindow();
    });

    titleContainer.appendChild(titleBar);
    titleContainer.appendChild(closeButton);
    popup.appendChild(titleContainer);
    popup.appendChild(question);
    popup.appendChild(button);
    document.body.appendChild(popup);


})();
