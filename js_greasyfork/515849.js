// ==UserScript==
// @name         Base64编码解码
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  为水源恢复Base64解码和编码
// @author       艾伦·走路人 & Rosmontis
// @match        https://shuiyuan.sjtu.edu.cn/*
// @license      WTFPL
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/515849/Base64%E7%BC%96%E7%A0%81%E8%A7%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/515849/Base64%E7%BC%96%E7%A0%81%E8%A7%A3%E7%A0%81.meta.js
// ==/UserScript==

// 创建观察者实例
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
            const list = document.querySelector(
                '.dropdown-menu[data-identifier="toolbar-menu__options"]'
            );
            if (list) {
                let encodeIcon = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "use"
                );
                encodeIcon.setAttribute("href", "#far-eye-slash");
                let base64EncodeIcon = encodeIcon.outerHTML;
                addButtonToList(
                    list,
                    "base64-encode",
                    base64EncodeIcon,
                    "Base64编码",
                    encode
                );
                let decodeIcon = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "use"
                );
                decodeIcon.setAttribute("href", "#far-eye");
                let base64DecodeIcon = decodeIcon.outerHTML;
                addButtonToList(
                    list,
                    "base64-decode",
                    base64DecodeIcon,
                    "Base64解码",
                    decode
                );
            }
        }
    }
});

// 开始观察文档的子节点变化
observer.observe(document.body, { childList: true, subtree: true });

// 添加按钮的函数
function addButtonToList(list, id, icon, text, action) {
    // 检查按钮是否已经存在
    let found = false;

    // 遍历 list 的所有子元素
    for (let item of list.children) {
        // 检查 item 的 children 中是否存在符合条件的元素
        let element = item.querySelector('.btn.btn-icon-text.no-text.no-text[title="' + id + '"]');
        if (element) {
            found = true;
            break; // 如果找到，退出循环
        }
    }
    if (!found) {
        // 创建新的li元素
        const newItem = document.createElement("li");
        newItem.setAttribute("class", "dropdown-menu__item");

        const newButton = document.createElement("button");
        newButton.setAttribute("class", "btn btn-icon-text no-text");
        newButton.setAttribute("title", id);
        newButton.setAttribute("type", "button");

        // 添加图标
        const iconSvg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        iconSvg.classList.add("fa", "d-icon", `d-icon-${id}` , "svg-icon", "svg-string");
        iconSvg.setAttribute("aria-hidden", "true");
        iconSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        iconSvg.innerHTML = icon;
        newButton.appendChild(iconSvg);

        // 添加文字
        const textSpan = document.createElement("span");
        textSpan.classList.add("d-button-label");
        const textSpanInner = document.createElement("span");
        textSpanInner.classList.add("d-button-label__text");
        textSpanInner.textContent = text;
        textSpan.appendChild(textSpanInner);
        newButton.appendChild(textSpan);

        newItem.appendChild(newButton);
        // 添加点击事件
        newButton.addEventListener("click", () => {
            // 获取当前的 textarea
            let textarea = document.querySelector("textarea");
            let start = textarea.selectionStart;
            let end = textarea.selectionEnd;
            let selectedText = textarea.value.substring(start, end);
            let newText = action(selectedText);
            textarea.value =
                textarea.value.substring(0, start) +
                newText +
                textarea.value.substring(end);
            simulateTypeAndDelete(textarea);
            textarea.selectionStart = start;
            textarea.selectionEnd = start + newText.length;
        });

        // 将新元素添加到列表中
        list.appendChild(newItem);
    }
}

function encode(str) {
    return btoa(encodeURIComponent(str));
}

function decode(base64) {
    return decodeURIComponent(atob(base64));
}

function simulateTypeAndDelete(textareaElement) {
    // 将 textarea 设置为焦点
    textareaElement.focus();

    // 模拟输入 '0'
    let inputEvent = new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: "0",
    });

    // 创建一个键盘事件，模拟按下 '0' 键
    let keydownEvent = new KeyboardEvent("keydown", {
        key: "0",
        keyCode: 48,
        which: 48,
        bubbles: true,
        cancelable: true,
    });

    // 派发键盘事件和输入事件，模拟输入 '0'
    textareaElement.dispatchEvent(keydownEvent);
    textareaElement.dispatchEvent(inputEvent);

    // 模拟 Backspace 键盘事件
    let backspaceEvent = new KeyboardEvent("keydown", {
        key: "Backspace",
        keyCode: 8,
        which: 8,
        bubbles: true,
        cancelable: true,
    });

    // 派发 Backspace 键盘事件
    textareaElement.dispatchEvent(backspaceEvent);
}