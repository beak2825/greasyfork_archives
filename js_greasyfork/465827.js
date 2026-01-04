// ==UserScript==
// @name         pasteUpload
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add paste upload function to input
// @author       gahing
// @license      MIT
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465827/pasteUpload.user.js
// @updateURL https://update.greasyfork.org/scripts/465827/pasteUpload.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 添加全局样式，鼠标 hover 高亮 input 容器
     */
    const highlightCls = "__input--highlight";
    const addGlobalStyle = () => {
        const styleDom = document.createElement("style");
        styleDom.innerHTML = `.${highlightCls} { outline: 1.5px dashed rgba(0, 0, 0, 0.8) !important; \n background: rgb(154, 185, 227) !important; }`;
        document.head.appendChild(styleDom);
    };

    // 记录当前的 input[type=file] 元素
    let currentInputFileDOM = null;
    /**
     * 处理鼠标移入事件，记录 input[type=file] 元素并为容器增加高亮样式
     * @param e
     */
    const handleMouseEnter = (el) => {
        if (!el.classList) {
            return;
        }
        // 当前元素为 input[type=file] 时处理
        if (el.nodeName === "INPUT" && el.type === "file") {
            currentInputFileDOM = el;
            el.classList.add(highlightCls);
        } else {
            const inputFiles = el.querySelectorAll("input[type=file]");
            // 当前 DOM 节点有且仅有一个 input[type=file] 子元素时处理
            if (inputFiles.length === 1) {
                currentInputFileDOM = inputFiles[0];
                el.classList.add(highlightCls);
            }
        }
    };

    /**
     * 处理鼠标移出事件，移出高亮样式
     * @param e
     */
    const handleMouseLeave = (el) => {
        if (!el.classList) {
            return;
        }
        if (el.classList.contains(highlightCls)) {
            currentInputFileDOM = null;
            el.classList.remove(highlightCls);
        }
    };

    /**
     * 处理粘贴事件
     * @param e
     */
    const handlePaste = (e, warn = console.log) => {
        const clipboardFiles = e.clipboardData.files;
        if (!clipboardFiles) {
            warn("当前浏览器不支持 clipboardData");
            return;
        }
        const clipboardFile = Array.from(clipboardFiles).find((item) =>
            item.type.includes("image")
        );
        if (!clipboardFile) {
            warn("当前剪切板内容非图片文件");
            return;
        }

        if (!currentInputFileDOM) {
            warn("未找到 input[type=file] 元素");
            return;
        }
        // 修改文件输入框取值
        let newFilelist = new DataTransfer();
        // 如果 input 多选，需要将旧值先进行复制
        if (currentInputFileDOM.multiple) {
            [...currentInputFileDOM.files].forEach((item) =>
                newFilelist.items.add(item)
            );
        }
        newFilelist.items.add(clipboardFile);
        currentInputFileDOM.files = newFilelist.files;
        console.log("修改 fileList 成功");
        // 手动触发 change 事件
        currentInputFileDOM.dispatchEvent(
            new Event("change", {
                bubbles: true
            })
        );
    };

    // 下面代码用于给外部脚本使用
    const _handleMouseEnter = (e) => {
        return handleMouseEnter(e.target);
    };
    const _handleMouseLeave = (e) => {
        return handleMouseLeave(e.target);
    };
    /**
     * 监听事件
     */
    const listenEvent = () => {
        // 由于绑定的是全局，这里使用 mouseover / mouseout 事件，子元素间移动才会触发事件
        document.addEventListener("mouseover", _handleMouseEnter);
        document.addEventListener("mouseout", _handleMouseLeave);
        document.addEventListener("paste", handlePaste);
    };

    /**
     * 重置状态
     */
    const resetEvent = () => {
        document.removeEventListener("mouseover", _handleMouseEnter);
        document.removeEventListener("mouseout", _handleMouseLeave);
        document.removeEventListener("paste", handlePaste);
    };
    /**
     * 创建开关按钮
     * @returns 
     */
    const createSwitchButton = () => {
        const button = document.createElement('button')
        button.innerText = '开启粘贴上传'
        button.style = 'position: fixed; bottom: 20px; right: 20px;'
        document.body.appendChild(button)
        let enablePaste = false
        button.addEventListener('click', () => {
            enablePaste = !enablePaste
            if (enablePaste) {
                listenEvent()
                button.innerText = '关闭粘贴上传'
            } else {
                resetEvent()
                button.innerText = '开启粘贴上传'
            }
        })
    }

    addGlobalStyle();
    createSwitchButton()

})();