// ==UserScript==
// @name         网页基于xpath|文本的自动点击（优化版）
// @namespace    https://game.lpengine.cn/*
// @version      1.0.2
// @description  根据输入的XPath定位元素进行循环点击及按指定文本查找点击元素，优化了遍历框架查找元素、点击停止功能、执行顺序及延时机制，设置成分区形式，美化按钮样式，并添加每次点击时间显示功能，同时添加脚本保活机制。
// @author       toyourtomorrow
// @match        https://fz.lpengine.cn/*
// @match        https://game.lpengine.cn/*
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/520464/%E7%BD%91%E9%A1%B5%E5%9F%BA%E4%BA%8Expath%7C%E6%96%87%E6%9C%AC%E7%9A%84%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/520464/%E7%BD%91%E9%A1%B5%E5%9F%BA%E4%BA%8Expath%7C%E6%96%87%E6%9C%AC%E7%9A%84%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%EF%BC%88%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建用于输入XPath、延时、指定文本以及显示状态的HTML元素，并设置样式使其在最上方显示，同时设置初始为可拖动状态，设置分区形式
    const inputDiv = document.createElement('div');
    inputDiv.style.position = 'fixed';
    inputDiv.style.top = '10px';
    inputDiv.style.left = '10px';
    inputDiv.style.zIndex = '9999';
    inputDiv.style.backgroundColor = '#f8f9fa';
    inputDiv.style.padding = '10px';
    inputDiv.style.borderRadius = '5px';
    inputDiv.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.2)';
    inputDiv.style.userSelect = 'none';  // 防止文本被误选
    inputDiv.draggable = true;  // 设置可拖动

    inputDiv.innerHTML = `
        <div style="display: flex; flex-direction: column;">
            <!-- XPath 分区 -->
            <div style="background-color: #e9ecef; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <label for="xpathInput" style="margin-right: 10px;">XPath表达式:</label>
                    <input type="text" id="xpathInput" style="padding: 5px; border: 1px solid #ced4da; border-radius: 3px; width: 300px;" />
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <label for="xpathDelayInput" style="margin-right: 10px;">XPath延时（毫秒）:</label>
                    <input type="number" id="xpathDelayInput" style="padding: 5px; border: 1px solid #ced4da; border-radius: 3px; width: 100px;" value="300" />
                </div>
                <div style="display: flex; align-items: center;">
                    <button id="startXPathButton" style="padding: 5px 10px; border: none; border-radius: 3px; background-color: #007bff; color: white; cursor: pointer;">开始点击（XPath）</button>
                    <button id="stopXPathButton" style="padding: 5px 10px; border: none; border-radius: 3px; background-color: #dc3545; color: white; cursor: pointer;">停止点击（XPath）</button>
                </div>
                <span id="xpathStatus" style="margin-left: 10px; color: #6c757d; margin-top: 10px;">状态: 未开始</span>
                <span id="xpathLastClickTime" style="margin-left: 10px; color: #6c757d; margin-top: 5px;">上次点击时间（XPath）: -</span>
                <span id="xpathNextClickTime" style="margin-left: 10px; color: 6c757d; margin-top: 5px;">下次点击时间（XPath）: -</span>
            </div>
            <!-- 文本分区 -->
            <div style="background-color: #e9ecef; padding: 10px; border-radius: 5px;">
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <label for="textInput" style="margin-right: 10px;">指定文本:</label>
                    <input type="text" id="textInput" style="padding: 5px; border: 1px solid #ced4da; border-radius: 3px; width: 200px;" />
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <label for="textDelayInput" style="margin-right: 10px;">文本延时（毫秒）:</label>
                    <input type="number" id="textDelayInput" style="padding: 5px; border: 1px solid #ced4da; border-radius: 3px; width: 100px;" value="300" />
                </div>
                <div style="display: flex; align-items: center;">
                    <button id="startTextButton" style="padding: 5px 10px; border: none; border-radius: 3px; background-color: #28a745; color: white; cursor: pointer;">开始点击（文本）</button>
                    <button id="stopTextButton" style="padding: 5px 10px; border: none; border-radius: 3px; background-color: #6c757d; color: white; cursor: pointer;">停止点击（文本）</button>
                </div>
                <span id="textStatus" style="margin-left: 10px; color: #6c757d; margin-top: 10px;">状态: 未开始</span>
                <span id="textLastClickTime" style="margin-left: 10px; color: #6c757d; margin-top: 5px;">上次点击时间（文本）: -</span>
                <span id="textNextClickTime" style="margin-left: 10px; color: 6c757d; margin-top: 5px;">下次点击时间（文本）: -</span>
            </div>
            <button id="closeButton" style="padding: 5px 10px; border: none; border-radius: 3px; background-color: #6c757d; color: white; cursor: pointer; margin-top: 15px;">关闭</button>
            <button id="minimizeButton" style="padding: 5px 10px; border: none; border-radius: 3px; background-color: #6c757d; color: white; cursor: pointer; margin-top: 5px;">缩小</button>
        </div>
    `;
    document.body.appendChild(inputDiv);

    // 用于记录鼠标按下时的坐标，实现拖动功能
    let startX, startY;

    // 为可拖动元素添加鼠标按下、移动和抬起事件监听器，正确实现拖动功能
    inputDiv.addEventListener('mousedown', function (e) {
        startX = e.clientX;
        startY = e.clientY;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    });

    function drag(e) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        inputDiv.style.left = (parseInt(inputDiv.style.left) || 0) + dx + 'px';
        inputDiv.style.top = (parseInt(inputDiv.style.top) || 0) + dy + 'px';
        startX = e.clientX;
        startY = e.clientY;
    }

    function stopDrag() {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }

    // 记录界面是否最小化
    let isMinimized = false;

    // 缩小按钮点击事件处理函数
    function minimize() {
        if (isMinimized) {
            // 如果已最小化，恢复原始大小，并重新显示文字相关元素
            inputDiv.style.width = 'auto';
            inputDiv.style.height = 'auto';
            inputDiv.querySelectorAll('span').forEach(span => span.style.display = '');
            isMinimized = false;
        } else {
            // 如果未最小化，缩小界面并隐藏文字相关元素
            inputDiv.style.width = '30px';
            inputDiv.style.height = '30px';
            inputDiv.querySelectorAll('span').forEach(span => span.style.display = 'none');
            isMinimized = true;
        }
    }

    // 获取相关DOM元素
    const xpathInput = document.getElementById('xpathInput');
    const xpathDelayInput = document.getElementById('xpathDelayInput');
    const startXPathButton = document.getElementById('startXPathButton');
    const stopXPathButton = document.getElementById('stopXPathButton');
    const textInput = document.getElementById('textInput');
    const textDelayInput = document.getElementById('textDelayInput');
    const startTextButton = document.getElementById('startTextButton');
    const stopTextButton = document.getElementById('stopTextButton');
    const closeButton = document.getElementById('closeButton');
    const minimizeButton = document.getElementById('minimizeButton');
    const xpathStatusSpan = document.getElementById('xpathStatus');
    const xpathLastClickTimeSpan = document.getElementById('xpathLastClickTime');
    const xpathNextClickTimeSpan = document.getElementById('xpathNextClickTime');
    const textStatusSpan = document.getElementById('textStatus');
    const textLastClickTimeSpan = document.getElementById('textLastClickTime');
    const textNextClickTimeSpan = document.getElementById('textNextClickTime');

    // 初始化保存的XPath值、延时值和指定文本值（如果存在）
    (async () => {
        const savedXPath = await GM.getValue('savedXPath', '');
        const savedXPathDelay = await GM.getValue('savedXPathDelay', 300);
        const savedText = await GM.getValue('savedText', '');
        const savedTextDelay = await GM.getValue('savedTextDelay', 300);
        xpathInput.value = savedXPath;
        xpathDelayInput.value = savedXPathDelay;
        textInput.value = savedText;
        textDelayInput.value = savedTextDelay;
    })();

    // 用于存储基于XPath点击的定时器标识和基于文本点击的定时器标识
    let xPathIntervalId = null;
    let textIntervalId = null;

    // 递归遍历所有节点（包括跨iframe、处理Shadow DOM等）查找元素的函数（XPath方式），优化错误处理
    function findElementsByXPathInAllContexts(xpath, context = document) {
        const results = [];
        const iterate = (node) => {
            try {
                const elements = document.evaluate(xpath, node, null, XPathResult.ANY_TYPE, null).iterateNext();
                while (elements) {
                    results.push(elements);
                    elements = document.evaluate(xpath, node, null, XPathResult.ANY_TYPE, null).iterateNext();
                }
            } catch (error) {
                console.error('XPath查找元素出现错误:', error);
            }
            const shadowRoots = node.querySelectorAll('*');
            shadowRoots.forEach((element) => {
                if (element.shadowRoot) {
                    iterate(element.shadowRoot);
                }
            });
            const iframes = node.querySelectorAll('iframe');
            for (const iframe of iframes) {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    iterate(iframeDoc);
                } catch (error) {
                    console.error('处理iframe时出现错误:', error);
                    continue;
                }
            }
        };
        iterate(context);
        return results;
    }

    // 递归遍历所有节点（包括跨iframe、处理Shadow DOM等）查找包含指定文本元素的函数，优化错误处理
    function findElementsByTextInAllContexts(text, context = document) {
        const results = [];
        const iterate = (node) => {
            const elements = node.querySelectorAll('*');
            elements.forEach((element) => {
                try {
                    if (element.textContent.includes(text)) {
                        results.push(element);
                    }
                } catch (error) {
                    console.error('文本查找元素出现错误:', error);
                }
            });
            const shadowRoots = node.querySelectorAll('*');
            shadowRoots.forEach((element) => {
                if (element.shadowRoot) {
                    iterate(element.shadowRoot);
                }
            });
            const iframes = node.querySelectorAll('iframe');
            for (const iframe of iframes) {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    iterate(iframeDoc);
                } catch (error) {
                    console.error('处理iframe时出现错误:', error);
                    continue;
                }
            }
        };
        iterate(context);
        return results;
    }

    // 等待页面加载完成（包括所有资源、iframe等加载完毕）后再执行查找等操作的函数
    function waitForPageLoad(callback) {
        if (document.readyState === 'complete') {
            callback();
        } else {
            window.addEventListener('load', callback);
        }
    }

    // 开始点击的函数（基于XPath），优化执行顺序和时间显示
    async function startClickingByXPath() {
        const xpath = xpathInput.value;
        const delay = parseInt(xpathDelayInput.value, 10);
        GM_setValue('savedXPath', xpath);
        GM_setValue('savedXPathDelay', delay);

        try {
            waitForPageLoad(() => {
                const startTime = Date.now();
                const doClick = async () => {
                    const elements = findElementsByXPathInAllContexts(xpath);
                    if (elements.length > 0) {
                        for (const element of elements) {
                            element.click();
                        }
                        const currentTime = Date.now();
                        xpathLastClickTimeSpan.textContent = `上次点击时间（XPath）: ${new Date(currentTime).toLocaleString()}`;
                        xpathNextClickTimeSpan.textContent = `下次点击时间（XPath）: ${new Date(currentTime + delay).toLocaleString()}`;
                    } else {
                        clearInterval(xPathIntervalId);
                        alert('未找到匹配XPath的元素，已停止点击。');
                        xpathStatusSpan.textContent = '状态: 已停止（未找到元素）';
                    }
                };
                doClick();
                xPathIntervalId = setInterval(doClick, delay);
                xpathStatusSpan.textContent = '状态: 正在点击（XPath）';
            });
        } catch (error) {
            clearInterval(xPathIntervalId);
            alert('执行过程出现错误，请检查XPath表达式是否正确。');
            xpathStatusSpan.textContent = '状态: 已停止（出错）';
        }
    }

    // 开始点击的函数（基于指定文本），优化执行顺序和时间显示
    async function startClickingByText() {
        const text = textInput.value;
        const delay = parseInt(textDelayInput.value, 10);
        GM_setValue('savedText', text);
        GM_setValue('savedTextDelay', delay);

        try {
            waitForPageLoad(() => {
                const startTime = Date.now();
                const doClick = async () => {
                    const elements = findElementsByTextInAllContexts(text);
                    if (elements.length > 0) {
                        for (const element of elements) {
                            element.click();
                        }
                        const currentTime = Date.now();
                        textLastClickTimeSpan.textContent = `上次点击时间（文本）: ${new Date(currentTime).toLocaleString()}`;
                        textNextClickTimeSpan.textContent = `下次点击时间（文本）: ${new Date(currentTime + delay).toLocaleString()}`;
                    } else {
                        clearInterval(textIntervalId);
                        alert('未找到包含指定文本的元素，已停止点击。');
                        textStatusSpan.textContent = '状态: 已停止（未找到元素）';
                    }
                };
                doClick();
                textIntervalId = setInterval(doClick, delay);
                textStatusSpan.textContent = '状态: 正在点击（文本）';
            });
        } catch (error) {
            clearInterval(textIntervalId);
            alert('执行过程出现错误，请检查输入的文本是否正确。');
            textStatusSpan.textContent = '状态: 已停止（出错）';
        }
    }

    // 为开始按钮（XPath方式）添加点击事件监听器
    startXPathButton.addEventListener('click', startClickingByXPath);

    // 为停止按钮（XPath方式）添加点击事件监听器
    stopXPathButton.addEventListener('click', () => {
        if (xPathIntervalId) {
            clearInterval(xPathIntervalId);
            xPathIntervalId = null;
            xpathStatusSpan.textContent = '状态: 已停止';
        }
    });

    // 为开始按钮（文本方式）添加点击事件监听器
    startTextButton.addEventListener('click', startClickingByText);

    // 为停止按钮（文本方式）添加点击事件监听器
    stopTextButton.addEventListener('click', () => {
        if (textIntervalId) {
            clearInterval(textIntervalId);
            textIntervalId = null;
            textStatusSpan.textContent = '状态: 已停止';
        }
    });

    // 为关闭按钮添加点击事件监听器，点击后移除整个输入框区域
    closeButton.addEventListener('click', () => {
        inputDiv.remove();
    });

    // 为缩小按钮添加点击事件监听器
    minimizeButton.addEventListener('click', minimize);

    // 脚本保活机制，定期执行一个简单的函数来保持脚本活跃，这里简单打印个信息示例，可按需调整具体逻辑
    setInterval(() => {
        console.log('脚本保持活跃');
    }, 60000);  // 每60秒执行一次，可根据实际情况调整时间间隔

})();