// ==UserScript==
// @name         🤤Claude - Prompt便签
// @version      1.2
// @description  一个帮助用户在Claude原生网页添加可移动且大小可调的便签，用于快速选择和添加prompt的脚本。
// @author       futureo0
// @license      MIT
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.6.4.min.js
// @match        https://claude.ai/*
// @match        https://claude.ai/chats/*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/1242018
// @downloadURL https://update.greasyfork.org/scripts/518680/%F0%9F%A4%A4Claude%20-%20Prompt%E4%BE%BF%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/518680/%F0%9F%A4%A4Claude%20-%20Prompt%E4%BE%BF%E7%AD%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待页面完全加载并确保输入框存在
    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // 获取当前活动的输入区域
    function getActiveInputField() {
        // 获取当前焦点元素
        let activeElement = document.activeElement;

        // 如果是textarea或可编辑div，直接返回
        if ((activeElement.tagName.toLowerCase() === 'textarea') ||
            (activeElement.classList.contains('ProseMirror') && activeElement.isContentEditable)) {
            return activeElement;
        }

        // 获取所有可能的输入区域
        const allInputs = Array.from(document.querySelectorAll('textarea, .ProseMirror[contenteditable="true"]'))
            .filter(input => input.offsetParent !== null);

        // 检查是否有输入框包含当前选区
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            for (const input of allInputs) {
                if (input.contains(range.commonAncestorContainer)) {
                    return input;
                }
            }
        }

        // 如果没有找到，返回最后一个可见的输入框
        return allInputs[allInputs.length - 1] || null;
    }

    function insertAtCursor(myField, myValue) {
        // 确保输入区域获得焦点
        myField.focus();

        if (myField.classList.contains('ProseMirror') && myField.isContentEditable) {
            // 处理 ProseMirror 编辑器
            const sel = window.getSelection();
            if (sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);

                // 确保选区在目标输入框内
                if (myField.contains(range.commonAncestorContainer)) {
                    // 删除当前选中内容
                    range.deleteContents();

                    // 创建并插入文本节点
                    const textNode = document.createTextNode(myValue);
                    range.insertNode(textNode);

                    // 移动光标到插入文本之后
                    range.setStartAfter(textNode);
                    range.setEndAfter(textNode);
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else {
                    // 如果选区不在输入框内，在末尾插入
                    const newRange = document.createRange();
                    const lastChild = myField.lastChild;

                    if (lastChild) {
                        if (lastChild.nodeType === Node.TEXT_NODE) {
                            newRange.setStartAfter(lastChild);
                            newRange.setEndAfter(lastChild);
                        } else {
                            newRange.selectNodeContents(myField);
                            newRange.collapse(false);
                        }
                    } else {
                        newRange.selectNodeContents(myField);
                        newRange.collapse(false);
                    }

                    const textNode = document.createTextNode(myValue);
                    newRange.insertNode(textNode);

                    // 移动光标到插入文本之后
                    newRange.setStartAfter(textNode);
                    newRange.setEndAfter(textNode);
                    sel.removeAllRanges();
                    sel.addRange(newRange);
                }
            }
        } else if (myField.tagName.toLowerCase() === 'textarea') {
            // 处理普通 textarea
            const startPos = myField.selectionStart;
            const endPos = myField.selectionEnd;

            // 在光标位置插入文本
            myField.value = myField.value.substring(0, startPos) +
                           myValue +
                           myField.value.substring(endPos);

            // 更新光标位置
            myField.selectionStart = myField.selectionEnd = startPos + myValue.length;
        }

        // 触发输入事件
        const event = new Event('input', { bubbles: true });
        myField.dispatchEvent(event);
    }

    // 初始化便签
    async function initStickyNote() {
        // 等待输入框加载完成
        await waitForElement('.ProseMirror[contenteditable="true"]');

        // 检查是否已存在便签
        if (document.getElementById('stickyNoteContainer')) {
            return;
        }

        const stickyNoteHtml = `
        <div id="stickyNoteContainer" style="position: fixed; top: 40px; left: calc(100vw - 350px); width: 300px; min-height: 300px; background-color: lightyellow; border: 1px solid black; padding-bottom: 10px; box-shadow: 3px 3px 5px rgba(0,0,0,0.2); z-index: 10000; resize: both; overflow: auto; color: black;">
            <div id="stickyNoteHeader" style="cursor: move; background-color: #ddd; height: 10px; width: 100%;"></div>
            <input type="text" id="newPromptInput" placeholder="输入新prompt" style="width: calc(100% - 20px); margin: 10px;">
            <button id="savePromptButton" style="width: calc(100% - 20px); margin: 0 10px;">保存</button>
            <div id="promptsList" style="margin: 5px 10px;"></div>
        </div>
        `;

        // 将便签添加到body中
        $('body').append(stickyNoteHtml);

        // 初始化拖拽功能
        dragElement(document.getElementById("stickyNoteContainer"), document.getElementById("stickyNoteHeader"));

        // 加载已保存的prompts
        loadPrompts();

        // 绑定保存按钮事件
        $('#savePromptButton').click(function() {
            const newPrompt = $('#newPromptInput').val().trim();
            if(newPrompt) {
                addPromptToStickyNote(newPrompt);
                savePrompt(newPrompt);
                $('#newPromptInput').val('');
            }
        });

        // 绑定回车键保存
        $('#newPromptInput').keypress(function(e) {
            if(e.which == 13) {
                $('#savePromptButton').click();
            }
        });
    }

    function addPromptToStickyNote(promptText) {
        const promptHtml = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <button class="deletePromptButton" style="cursor: pointer; background: none; border: none; color: grey; margin-right: 5px;">×</button>
                <div style="cursor: pointer; flex-grow: 1; word-break: break-all;">${promptText}</div>
            </div>
        `;
        $('#promptsList').prepend(promptHtml);

        // 删除按钮事件
        $('#promptsList .deletePromptButton:first').click(function(e) {
            e.stopPropagation();
            const promptText = $(this).siblings('div').text();
            removePromptByText(promptText);
            $(this).parent().remove();
        });

        // 使用 mousedown 事件来预防焦点丢失
        $('#promptsList div:first').on('mousedown', function(e) {
            e.preventDefault();
            const inputField = getActiveInputField();
            if (inputField) {
                insertAtCursor(inputField, promptText);
            }
        });
    }

    function loadPrompts() {
        const prompts = JSON.parse(GM_getValue('prompts', '[]'));
        $('#promptsList').empty();
        prompts.forEach(prompt => {
            addPromptToStickyNote(prompt);
        });
    }

    function removePromptByText(promptText) {
        let prompts = JSON.parse(GM_getValue('prompts', '[]'));
        const promptIndex = prompts.indexOf(promptText);
        if (promptIndex !== -1) {
            prompts.splice(promptIndex, 1);
            GM_setValue('prompts', JSON.stringify(prompts));
        }
    }

    function savePrompt(promptText) {
        let prompts = JSON.parse(GM_getValue('prompts', '[]'));
        if (!prompts.includes(promptText)) {
            prompts.push(promptText);
            GM_setValue('prompts', JSON.stringify(prompts));
        }
    }

    function dragElement(elmnt, header) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (e.target === header) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 页面加载完成后初始化便签
    window.addEventListener('load', function() {
        setTimeout(initStickyNote, 1000);
    });

    // 监听URL变化，在切换页面时重新初始化便签
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(initStickyNote, 1000);
        }
    }).observe(document, {subtree: true, childList: true});

})();