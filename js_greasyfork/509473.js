// ==UserScript==
// @name         会计数字转换器
// @namespace    0
// @version      1.0
// @description  用于处理会计数字，方便快捷。
// @author       Yurui
// @match        http://171.221.247.141:8012/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/509473/%E4%BC%9A%E8%AE%A1%E6%95%B0%E5%AD%97%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/509473/%E4%BC%9A%E8%AE%A1%E6%95%B0%E5%AD%97%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查脚本是否在主页面（顶层窗口）中执行。如果不是，则立即返回。共享平台中有两个框架，不写这个会出现两个小窗。
    if (window.top !== window.self) { return; }

    // Create the container element
    const container = document.createElement('div');
    container.id = 'container';
    container.style.display = 'none';
    container.style.textAlign = 'center';
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.width = '300px';
    container.style.height = 'auto';
    container.style.lineHeight= 'normal';
    container.style.backgroundColor = 'white';
    container.style.padding = '10px 15px 15px 15px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    container.style.fontSize = '15px';
    container.style.zIndex = '999'; // 显示在最上层。
    container.style.cursor = '';

    const right_top = document.createElement('div');
    right_top.id = 'right-top';

    // Add content to the container
    container.innerHTML = `
    <style>
        #container {
            user-select: none; /* 禁止选中 */
            -webkit-user-select: none; /* 针对 WebKit 浏览器 */
            -moz-user-select: none; /* 针对 Firefox */
            -ms-user-select: none; /* 针对 IE 10+ */
            }

        #right-top{
            position:fixed;
            right:10px;
            top:0;
            height:15px;
            width:10px;
            background-color: #ddd;
            border:1px solid #ddd;
            cursor:pointer;
            box-shadow:0 2px 2px rgba(0, 0, 0, 0.1);
            z-index:100;
        }

        #copyMessage {
            color: green;
            margin-top: 10px;
        }

        .tab-content input[type="text"] {
            width: 200px;
            padding: 10px;
            margin-top: 10px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .tabs {
            display: flex;
            justify-content: center;
            margin-bottom: 0px;
        }

        .tab {
            padding: 5px 10px;
            cursor: pointer;
            border: 1px solid #ddd;
            border-radius: 4px 4px 0 0;
            background-color: #f1f1f1;
            font-size: 15px;
        }

        .tab.active {
            background-color: white;
            border-bottom: 1px solid white;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        #result, #trimResult {
            user-select: text; /* 允许选中 */
            -webkit-user-select: text; /* 针对 WebKit 浏览器 */
            -moz-user-select: text; /* 针对 Firefox */
            -ms-user-select: text; /* 针对 IE 10+ */
        }
    </style>
    <div  style="display: flex; justify-content: flex-end; padding-right:1px; font-family:苹方-简;"><div id="close" style="cursor: pointer;">X</div></div>
        <h1 style="font-family: 隶书; margin-bottom:10px">会计数字转换器</h1>
        <div class="tabs" style="display: flex; justify-content: center;">
            <div id="tab1" class="tab active" title="将单位为元的会计数字转化为以万元为单位并且保留两位小数（四舍五入）。">化为万元</div>
            <div id="tab2" class="tab" title="移除会计数字中的空格以及逗号，单位并不发生改变。">去除空格和逗号</div>
        </div>
        <div id="accounting" class="tab-content active">
            <input type="text" title="" id="accountingNumberInput" autofocus placeholder="按回车执行操作"/>
            <div id="resultArea" style="display: block;">
                结果: <span id="result"></span>万元
            </div>
        </div>
        <div id="trim" class="tab-content">
            <input type="text" title="" id="trimInput" placeholder="按回车执行操作"/>
            <div id="trimResultArea" style="display: block;">
                结果: <span id="trimResult">元</span>
            </div>
        </div>
        <p id="copyMessage" style="display:none;">已复制: <span id="copiedResult"></span></p>
    `;

    // Append the container to the body
    document.body.appendChild(container);
    document.body.appendChild(right_top);

    //-------以下
    // 功能：鼠标可以拖动，但在输入框内时无法拖动。

    // 获取所有的 input 元素
    const inputElements = document.querySelectorAll('input');

    // 用于存储当前鼠标所在的 input 元素
    let currentInputElement = null;

    // 为每个 input 元素添加事件监听器
    inputElements.forEach(inputElement => {
        inputElement.addEventListener('mouseenter', () => {
            currentInputElement = inputElement;
            isDragging = false; // 禁用拖动
        });

        inputElement.addEventListener('mouseleave', () => {
            if (currentInputElement === inputElement) {
                currentInputElement = null;
                isDragging = false; // 重新启用拖动
            }
        });
    });

    // 拖动逻辑
    let isDragging = false;
    let offsetX, offsetY;

    container.addEventListener('mousedown', (e) => {
        if (currentInputElement) return; // 如果在 input 内，不执行拖动
        isDragging = true;
        offsetX = e.clientX - container.offsetLeft;
        offsetY = e.clientY - container.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging && !currentInputElement) {

            requestAnimationFrame(() => { //用 requestAnimationFrame 来优化拖动逻辑，确保元素能够平滑地跟随鼠标移动。
                let left = e.clientX - offsetX;
                let top = e.clientY - offsetY;

                // 防止拖出可视范围
                if (left < 0) left = 0;
                if (top < 0) top = 0;
                if (left + container.offsetWidth > window.innerWidth) {
                    left = window.innerWidth - container.offsetWidth;
                }
                if (top + container.offsetHeight > window.innerHeight) {
                    top = window.innerHeight - container.offsetHeight;
                }

                container.style.left = left + 'px';
                container.style.top = top + 'px';
            })
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    //-------以上





    // Function to switch tabs
    function switchTab(event, tabName) {
        let i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].classList.remove("active");
        }
        tablinks = document.getElementsByClassName("tab");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].classList.remove("active");
        }
        document.getElementById(tabName).classList.add("active");
        event.currentTarget.classList.add("active");
    };

    // Function to convert to ten thousand
    let convertToTenThousand = function(numStr) { // 转换为万元（保留两位小数）。
        let cleanNumStr = numStr.replace(/[^0-9.]+/g, ""); ///[^0-9.]+/g 表示匹配除了数字 (0-9)、小数点 (.) 之外的任何字符。
        let number = parseFloat(cleanNumStr);
        let result = (number / 10000).toFixed(2);
        return result;
    };

    // Function to trim and remove commas
    let trimAndRemoveCommas = function(str) { // 去除逗号和空格。
        return str.replace(/ /g, '').replace(/,/g, '').replace(/，/g, '');
    };

    // Function to copy and notify

    /*-------------------------------------------------------
    let copyAndNotify = function(result) {
        navigator.clipboard.writeText(result)
            .then(() => {
            document.getElementById('copyMessage').style.display = 'block';
            document.getElementById('copiedResult').innerText = result;
            setTimeout(function() {
                document.getElementById('copyMessage').style.display = 'none';
            }, 5000);
        })
            .catch(err => console.error('复制失败: ', err));
    };
    *///--------------------------------------------------------

    //---------------------------------------
    function fallbackCopyTextToClipboard(text) { // 兼容性考虑，navigator.clipboard 只能在 https 下使用，http 下要另换方法，用此函数。
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {const successful = document.execCommand('copy');
             const msg = successful ? '成功' : '失败';
             console.log('Fallback: Copying text command was ' + msg); }
        catch (err) {
            console.error('Fallback: Oops, unable to copy', err); }
        document.body.removeChild(textArea);
    }

    function copyAndNotify(result) {
        if (navigator.clipboard) { // 支持 navigator.clipboard 这个就用这个，不支持就用 fallbackCopyTextToClipboard 函数。
            navigator.clipboard.writeText(result)
                .then(() => {
                document.getElementById('copyMessage').style.display = 'block';
                document.getElementById('copiedResult').innerText = result;
                setTimeout(function() {document.getElementById('copyMessage').style.display = 'none';}, 5000);
            })
                .catch(err => {
                console.error('复制失败: ', err);
                fallbackCopyTextToClipboard(result);});
        } else {
            fallbackCopyTextToClipboard(result);
            document.getElementById('copyMessage').style.display = 'block';
            document.getElementById('copiedResult').innerText = result;
            setTimeout(function() {document.getElementById('copyMessage').style.display = 'none';}, 5000);
        }
    }
    //---------------------------------------

    let accountingNumberInput = document.getElementById('accountingNumberInput');
    let trimInput = document.getElementById('trimInput');
    let close = document.getElementById('close');
    let tab1 = document.getElementById('tab1');
    let tab2 = document.getElementById('tab2');

    tab1.onclick = function(event) { // 点击第一个选项卡功能
        switchTab(event, 'accounting');
        accountingNumberInput.focus(); // 焦点放到对应的input里，不能删掉注释掉。
        accountingNumberInput.setSelectionRange(0, accountingNumberInput.value.length); // 全选input内容
    };

    tab2.onclick = function(event) { // 点击第二个选项卡功能
        switchTab(event, 'trim');
        trimInput.focus(); // 焦点放到对应的input里，不能删掉注释掉。
        trimInput.setSelectionRange(0, trimInput.value.length); // 全选input内容
    };

    // Event listeners for input fields
    accountingNumberInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            let input = event.target.value.trim();
            if (input === '') {
                console.info('test');
                // alert('hello');
                document.getElementById('copyMessage').style.display = 'block';
                document.getElementById('copyMessage').innerText = '请输入数字！';
                document.getElementById('resultArea').style.display = 'none';
                setTimeout(function() {
                    document.getElementById('copyMessage').style.display = 'none';
                }, 2000);
                return;
            } else {
                trimInput.select();
                let result = convertToTenThousand(input);
                document.getElementById('result').innerText = result;
                document.getElementById('resultArea').style.display = 'block';
                copyAndNotify(result);
            }
        }
    });

    trimInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            let input = event.target.value.trim();
            if (input === '') {
                document.getElementById('copyMessage').style.display = 'block';
                document.getElementById('copyMessage').innerText = '请输入数字！';
                document.getElementById('resultArea').style.display = 'none';
                setTimeout(function() {
                    document.getElementById('copyMessage').style.display = 'none';
                }, 2000);
                return;
            } else {
                trimInput.select();
                let result = trimAndRemoveCommas(input);
                document.getElementById('trimResult').innerText = result;
                document.getElementById('trimResultArea').style.display = 'block';
                copyAndNotify(result);
            }
        }
    });

    // Hide container on Esc key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            container.style.display = 'none';
            right_top.style.display = 'block';
        }
    });

    // Show container on Ctrl + ` key press
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === '`') {
            container.style.display = 'block';
            right_top.style.display = 'none';
            accountingNumberInput.focus();
        }
    });

    right_top.onclick = function() {
        container.style.display = 'block';
        right_top.style.display = 'none';
    }

    close.onclick = function() {
        right_top.style.display = 'block';
        container.style.display = 'none';
    }

    // Show container on click in Tampermonkey dropdown
    GM_registerMenuCommand('显示会计数字转换器', function() {
        window.onload = function() {
            accountingNumberInput.focus();
        };
        container.style.display = 'block';
        right_top.style.display = 'none';
    });

    GM_registerMenuCommand('隐藏会计数字转换器', function() {
        right_top.style.display = 'block';
        container.style.display = 'none';
    });


})();