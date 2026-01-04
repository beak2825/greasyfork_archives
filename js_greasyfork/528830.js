// ==UserScript==
// @name         ASMRONE跳转Kikoeru
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  检测页面中的RJ号，并在每个RJ号旁边显示跳转按钮，同时根据资源存在情况改变按钮颜色和文本。在 127.0.0.1:8889 页面中创建跳转到 ASMRONE 的按钮。
// @author       你的名字
// @match        *://asmr-300.com/*
// @match        *://asmr-200.com/*
// @match        *://asmr-100.com/*
// @match        *://asmr.one/*
// @match        *://127.0.0.1:8889/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/528830/ASMRONE%E8%B7%B3%E8%BD%ACKikoeru.user.js
// @updateURL https://update.greasyfork.org/scripts/528830/ASMRONE%E8%B7%B3%E8%BD%ACKikoeru.meta.js
// ==/UserScript==

// 使用严格模式，避免代码中的潜在问题
(function () {
    'use strict';

    // 判断当前页面是否为 127.0.0.1:8889
    const isLocalhost8889 = window.location.hostname === '127.0.0.1' && window.location.port === '8889';

    // 如果不是 127.0.0.1:8889，执行原代码
    if (!isLocalhost8889) {
        // 定义按钮的样式
        const style = `
            .rdl-button {
                display: inline-block; /* 按钮显示为行内块元素 */
                padding: 1px 1px; /* 按钮内边距 */
                text-decoration: none; /* 去掉文字装饰（如下划线） */
                margin-left: 10px; /* 按钮左边距 */
                cursor: pointer; /* 鼠标悬停时显示为手型 */
                border: none; /* 去掉边框 */
                border-radius: 4px; /* 圆角边框 */
                font-size: 13px; /* 字体大小 */
                color: white; /* 文字颜色为白色 */
            }
            .rdl-button_green {
                background-color: #67c23a; /* 绿色背景 */
            }
            .rdl-button_red {
                background-color: #f56c6c; /* 红色背景 */
            }
            .rdl-button_blue {
                background-color: #409eff; /* 蓝色背景 */
            }
        `;

        // 创建一个 <style> 元素，用于将样式添加到页面中
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css"; // 设置样式表类型
        styleSheet.innerText = style; // 将样式内容添加到 <style> 元素
        document.head.appendChild(styleSheet); // 将 <style> 元素添加到页面的 <head> 中

        // 检测页面中的RJ号并创建按钮
        const checkPageAndCreateButtons = async () => {
            console.log('checkPageAndCreateButtons called'); // 打印日志，表示函数被调用

            // 查找所有包含RJ号的元素
            const rjElements = document.querySelectorAll('.q-chip__content.col.row.no-wrap.items-center.q-anchor--skip');
            rjElements.forEach(element => {
                // 检查是否已经处理过这个元素
                if (element.dataset.processed) {
                    return; // 如果已经处理过，跳过
                }

                const text = element.innerText; // 获取元素的文本内容
                const rjRegex = /RJ(\d{6,8})/i; // 正则表达式，匹配RJ号
                const match = text.match(rjRegex); // 在文本中查找RJ号

                if (match) {
                    let rjNumber = match[1]; // 提取RJ号的数字部分
                    if (rjNumber.length === 6) {
                        rjNumber = rjNumber; // 如果RJ号是6位数，直接使用
                    } else if (rjNumber.length === 8) {
                        rjNumber = rjNumber.slice(1); // 如果RJ号是8位数，去掉第一位
                    }

                    // 检查是否已经存在按钮
                    const existingButton = element.parentElement.querySelector('.kikoeru-jump-button');
                    if (existingButton) {
                        return; // 如果按钮已经存在，跳过
                    }

                    // 创建按钮
                    const button = document.createElement('a'); // 创建一个 <a> 元素
                    button.className = 'rdl-button rdl-button_red kikoeru-jump-button'; // 设置按钮的类名
                    button.textContent = '正在检查...'; // 设置按钮的文本
                    button.target = "_blank"; // 设置按钮点击后在新标签页中打开

                    // 将按钮添加到元素的右边
                    element.parentElement.appendChild(button);

                    // 标记这个元素已经处理过
                    element.dataset.processed = 'true';

                    // 检查资源是否存在
                    checkResource(rjNumber, button);
                }
            });
        };

        // 检查资源是否存在
        async function checkResource(rj, button) {
            const url = `http://127.0.0.1:8889/api/search?keyword=${rj}`; // 构造请求URL
            GM_xmlhttpRequest({
                method: 'GET', // 使用GET方法发送请求
                url: url, // 请求的URL
                onload: function (response) { // 请求成功时的回调函数
                    try {
                        const works = JSON.parse(response.responseText).works; // 解析响应数据
                        if (works.length > 0) { // 如果资源存在
                            button.textContent = '跳转kikoeru'; // 设置按钮文本
                            button.href = `http://127.0.0.1:8889/work/${rj}`; // 设置按钮跳转链接
                            button.className = "rdl-button rdl-button_green"; // 设置按钮为绿色

                            // 添加点击事件监听器，确保跳转行为
                            button.addEventListener('click', (event) => {
                                event.preventDefault(); // 阻止默认行为
                                window.open(button.href, '_blank'); // 在新标签页中打开链接
                            });
                        } else { // 如果资源不存在
                            button.textContent = '资源不存在'; // 设置按钮文本
                            button.href = '#'; // 禁用链接
                            button.className = "rdl-button rdl-button_red"; // 设置按钮为红色
                        }
                    } catch (error) { // 如果解析响应数据失败
                        button.textContent = '请求失败'; // 设置按钮文本
                        button.href = '#'; // 禁用链接
                        button.className = "rdl-button rdl-button_red"; // 设置按钮为红色
                    }
                },
                onerror: function () { // 请求失败时的回调函数
                    button.textContent = '请求失败'; // 设置按钮文本
                    button.href = '#'; // 禁用链接
                    button.className = "rdl-button rdl-button_red"; // 设置按钮为红色
                }
            });
        }

        // 初始化时检测一次页面
        checkPageAndCreateButtons();

        // 使用 MutationObserver 动态监测 DOM 变化
        const observer = new MutationObserver(checkPageAndCreateButtons);
        observer.observe(document.body, { childList: true, subtree: true }); // 监听 body 元素的变化
    }

    // 如果是 127.0.0.1:8889 页面，执行新增的代码
    if (isLocalhost8889) {
        // 创建跳转到 ASMRONE 的按钮
        const createAsmrOneButton = (url) => {
            const rjRegex = /work\/(\d{6,7})/i; // 匹配 6 位或 7 位的 RJ 号
            const match = url.match(rjRegex);

            if (match) {
                let rjNumber = match[1];
                if (rjNumber.length === 6) {
                    rjNumber = `RJ${rjNumber}`; // 6 位数直接使用
                } else if (rjNumber.length === 7) {
                    rjNumber = `RJ0${rjNumber}`; // 7 位数补 0 为 8 位
                }

                const jumpUrl = `https://asmr-200.com/work/${rjNumber}`;

                const existingButton = document.getElementById('asmr-one-jump-button');
                if (existingButton) {
                    existingButton.remove();
                }

                const targetRow = document.querySelector('.row.items-center.q-gutter-xs');
                if (targetRow) {
                    console.log('Target row found');
                    const button = document.createElement('a');
                    button.id = 'asmr-one-jump-button'; // 设置按钮的 ID，用于唯一标识该按钮
                    button.textContent = 'ASMRONE'; // 设置按钮上显示的文本内容
                    button.style.marginLeft = '10px'; // 设置按钮左边距为 10px，使其与左侧元素保持一定距离
                    button.style.textDecoration = 'none'; // 移除按钮文本的下划线（通常用于链接）
                    button.style.cursor = 'pointer'; // 设置鼠标悬停时的光标样式为指针（表示可点击）
                    button.style.backgroundColor = '#31ccec'; // 设置背景颜色为绿色
                    button.style.color = 'white'; // 设置文字颜色为白色
                    button.style.border = 'none'; // 移除边框
                    button.style.padding = '6px 12px'; // 设置内边距
                    button.style.borderRadius = '4px'; // 设置圆角
                    button.style.fontSize = '13px'; // 设置字体大小
                    button.style.width = 'auto'; // 宽度自适应内容
                    button.style.height = 'auto'; // 高度自适应内容
                    button.target = "_blank"; // 在新标签页中打开
                    button.href = jumpUrl; // 设置按钮点击后跳转的链接地址

                    // 设置样式为蓝色
                    button.className = 'rdl-button rdl-button_blue';

                    // 添加到目标行的最后
                    targetRow.appendChild(button);
                } else {
                    console.log('Target row not found');
                }
            } else {
                console.log('No RJ number in URL');
                const existingButton = document.getElementById('asmr-one-jump-button');
                if (existingButton) {
                    existingButton.remove();
                }
            }
        };

        // 初始化时执行一次创建 ASMRONE 按钮的逻辑
        createAsmrOneButton(window.location.href);

        // 监听 AJAX 请求完成事件，确保在内容加载完成后再执行按钮创建逻辑
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
            this.addEventListener('load', () => {
                if (this.responseURL.includes('/work/')) {
                    createAsmrOneButton(window.location.href);
                }
            });
            originalOpen.apply(this, arguments);
        };
    }
})();