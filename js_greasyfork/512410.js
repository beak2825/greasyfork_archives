// ==UserScript==
// @name [开发向]方便的运行JS和添加CSS
// @namespace JS_CSS
// @version 1
// @description 右下角添加两个按钮，一个运行JS代码，一个添加CSS样式
// @author LWF
// @license MIT
// @grant none
// @match *://*/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/512410/%5B%E5%BC%80%E5%8F%91%E5%90%91%5D%E6%96%B9%E4%BE%BF%E7%9A%84%E8%BF%90%E8%A1%8CJS%E5%92%8C%E6%B7%BB%E5%8A%A0CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/512410/%5B%E5%BC%80%E5%8F%91%E5%90%91%5D%E6%96%B9%E4%BE%BF%E7%9A%84%E8%BF%90%E8%A1%8CJS%E5%92%8C%E6%B7%BB%E5%8A%A0CSS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement("style");
    style.innerHTML = `
        #js-runner-btn, #css-runner-btn {
            position: fixed;
            bottom: 20px;
            width: 56px;
            height: 56px;
            color: white;
            border-radius: 50%;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 24px;
            z-index: 1001;
            transition: box-shadow 0.3s;
        }

        #js-runner-btn {
            right: 20px;
            background-color: #00897B;
        }

        #js-runner-btn:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
        }

        #css-runner-btn {
            right: 90px;
            background-color: #6E57B0;
        }

        #css-runner-btn:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
        }

        /* 遮罩层样式 */
        #runner-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6); /* 半透明黑色 */
            z-index: 1000;
        }

        #js-runner-dialog, #css-runner-dialog {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 400px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            z-index: 1002; /* 高于遮罩层 */
        }

        #js-runner-header, #css-runner-header {
            padding: 12px;
            color: white;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            position: relative;
        }

        #js-runner-header {
            background-color: #00897B;
        }

        #css-runner-header {
            background-color: #6E57B0;
        }

        /* 增大关闭按钮尺寸 */
        #js-runner-close, #css-runner-close {
            position: absolute;
            top: 8px;
            right: 12px;
            font-size: 24px; /* 增大关闭按钮的字体大小 */
            cursor: pointer;
        }

        #js-runner-body, #css-runner-body {
            padding: 16px;
        }

        #js-runner-input, #css-runner-input {
            width: 100%;
            height: 100px;
            padding: 8px;
            font-size: 14px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
            box-sizing: border-box;
        }

        #js-runner-footer, #css-runner-footer {
            padding: 12px;
            text-align: right;
        }

        #js-runner-run-btn, #css-runner-run-btn {
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        }

        #js-runner-run-btn {
            background-color: #00897B;
        }

        #js-runner-run-btn:hover {
            background-color: #00695C;
        }

        #css-runner-run-btn {
            background-color: #6E57B0;
        }

        #css-runner-run-btn:hover {
            background-color: #4B3B8D;
        }
    `;
    document.head.appendChild(style);

    // 创建遮罩层
    const overlay = document.createElement("div");
    overlay.id = "runner-overlay";
    document.body.appendChild(overlay);

    // 创建 JS 按钮
    const jsButton = document.createElement("div");
    jsButton.id = "js-runner-btn";
    jsButton.textContent = "⚙";
    document.body.appendChild(jsButton);

    // 创建 CSS 按钮
    const cssButton = document.createElement("div");
    cssButton.id = "css-runner-btn";
    cssButton.textContent = "🎨";
    document.body.appendChild(cssButton);

    // 创建 JS 弹出框
    const jsDialog = document.createElement("div");
    jsDialog.id = "js-runner-dialog";
    jsDialog.innerHTML = `
        <div id="js-runner-header">
            运行 JavaScript 代码
            <span id="js-runner-close">×</span>
        </div>
        <div id="js-runner-body">
            <textarea id="js-runner-input" placeholder="在此输入 JavaScript 代码"></textarea>
        </div>
        <div id="js-runner-footer">
            <button id="js-runner-run-btn">运行</button>
        </div>
    `;
    document.body.appendChild(jsDialog);

    // 创建 CSS 弹出框
    const cssDialog = document.createElement("div");
    cssDialog.id = "css-runner-dialog";
    cssDialog.innerHTML = `
        <div id="css-runner-header">
            添加 CSS 样式
            <span id="css-runner-close">×</span>
        </div>
        <div id="css-runner-body">
            <textarea id="css-runner-input" placeholder="在此输入 CSS 样式"></textarea>
        </div>
        <div id="css-runner-footer">
            <button id="css-runner-run-btn">添加</button>
        </div>
    `;
    document.body.appendChild(cssDialog);

    // 显示 JS 对话框和遮罩层
    jsButton.addEventListener("click", () => {
        overlay.style.display = "block";
        jsDialog.style.display = "block";
    });

    // 显示 CSS 对话框和遮罩层
    cssButton.addEventListener("click", () => {
        overlay.style.display = "block";
        cssDialog.style.display = "block";
    });

    // 运行 JS 代码并关闭对话框和遮罩层
    document.getElementById("js-runner-run-btn").addEventListener("click", () => {
        const code = document.getElementById("js-runner-input").value;
        try {
            eval(code);
        } catch (error) {
            alert("执行出错：" + error.message);
        }
        jsDialog.style.display = "none";
        overlay.style.display = "none";
        document.getElementById("js-runner-input").value = ""; // 清空输入框
    });

    // 添加 CSS 样式并关闭对话框和遮罩层
    document.getElementById("css-runner-run-btn").addEventListener("click", () => {
        const cssCode = document.getElementById("css-runner-input").value;
        const cssStyle = document.createElement("style");
        cssStyle.innerHTML = cssCode;
        document.head.appendChild(cssStyle);
        cssDialog.style.display = "none";
        overlay.style.display = "none";
        document.getElementById("css-runner-input").value = ""; // 清空输入框
    });

    // 关闭 JS 对话框和遮罩层
    document.getElementById("js-runner-close").addEventListener("click", () => {
        jsDialog.style.display = "none";
        overlay.style.display = "none";
    });

    // 关闭 CSS 对话框和遮罩层
    document.getElementById("css-runner-close").addEventListener("click", () => {
        cssDialog.style.display = "none";
        overlay.style.display = "none";
    });
})();
