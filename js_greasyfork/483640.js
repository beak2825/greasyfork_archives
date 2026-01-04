// ==UserScript==
// @name         😍ChatGPT - Prompt便签
// @version      6.0
// @description  一个帮助用户在ChatGPT原生网页添加可移动且大小可调的便签，用于快速选择和添加prompt的脚本。
// @author       futureo0
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.6.4.min.js
// @match        https://chat.openai.com/*
// @match        https://chat.openai.com/c/*
// @match        https://chat.openai.com/?*
// @match        https://neu.learnwithgpt.beauty/
// @match        https://neu.learnwithgpt.beauty/c
// @match        https://neu.learnwithgpt.beauty/c/*
// @match        *://chatgpt.com/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/1242018
// @downloadURL https://update.greasyfork.org/scripts/483640/%F0%9F%98%8DChatGPT%20-%20Prompt%E4%BE%BF%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/483640/%F0%9F%98%8DChatGPT%20-%20Prompt%E4%BE%BF%E7%AD%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $(document).ready(function() {
        const stickyNoteHtml = `
        <div id="stickyNoteContainer" style="position: fixed; top: 20px; right: 20px; width: 300px; min-height: 300px; background-color: lightyellow; border: 1px solid black; padding-bottom: 10px; box-shadow: 3px 3px 5px rgba(0,0,0,0.2); z-index: 1000; resize: both; overflow: auto; color: black;">
            <div id="stickyNoteHeader" style="cursor: move; background-color: #ddd; height: 10px; width: 100%;"></div>
            <input type="text" id="newPromptInput" placeholder="输入新prompt" style="width: calc(100% - 20px); margin: 10px;">
            <button id="savePromptButton" style="width: calc(100% - 20px); margin: 0 10px;">保存</button>
            <div id="promptsList" style="margin: 5px 10px;"></div>
        </div>
    `;
        $('body').append(stickyNoteHtml);

        dragElement(document.getElementById("stickyNoteContainer"), document.getElementById("stickyNoteHeader"));

        loadPrompts();

        $('#savePromptButton').click(function() {
            const newPrompt = $('#newPromptInput').val().trim();
            if(newPrompt) {
                addPromptToStickyNote(newPrompt);
                savePrompt(newPrompt);
                $('#newPromptInput').val('');
            }
        });

        // MutationObserver to monitor DOM changes and re-insert the sticky note if it’s removed
        const observer = new MutationObserver(() => {
            if (!document.getElementById("stickyNoteContainer")) {
                $('body').append(stickyNoteHtml); // Re-append the sticky note
                dragElement(document.getElementById("stickyNoteContainer"), document.getElementById("stickyNoteHeader"));
                loadPrompts();
            }
        });

        // Start observing the body for changes
        observer.observe(document.body, { childList: true, subtree: true });
    });


    function loadPrompts() {
        const prompts = JSON.parse(GM_getValue('prompts', '[]'));
        prompts.forEach(prompt => {
            addPromptToStickyNote(prompt);
        });
    }

    function addPromptToStickyNote(promptText) {
        const promptHtml = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <button class="deletePromptButton" style="cursor: pointer; background: none; border: none; color: grey; margin-right: 5px;">×</button>
                <div style="cursor: pointer; flex-grow: 1;">${promptText}</div>
            </div>
        `;
        $('#promptsList').prepend(promptHtml);

        $('#promptsList .deletePromptButton:first').click(function() {
            const promptText = $(this).siblings('div').text(); // 获取被点击的Prompt的文本内容
            removePromptByText(promptText); // 用文本内容删除Prompt
            $(this).parent().remove(); // 从UI中删除
        });

        // Use mousedown event to prevent focus loss
        $('#promptsList div:first').on('mousedown', function(e) {
            e.preventDefault(); // Prevent the div from stealing focus
            const inputField = getActiveInputField();
            if (inputField) {
                insertAtCursor(inputField, promptText);
            } else {
                console.error('No input field found to insert text into.');
            }
        });
    }

    function removePromptByText(promptText) {
        let prompts = JSON.parse(GM_getValue('prompts', '[]'));
        const promptIndex = prompts.indexOf(promptText); // 根据文本内容找到Prompt的索引
        if (promptIndex !== -1) {
            prompts.splice(promptIndex, 1); // 删除匹配的Prompt
            GM_setValue('prompts', JSON.stringify(prompts)); // 更新存储
        }
    }

    function savePrompt(promptText) {
        let prompts = JSON.parse(GM_getValue('prompts', '[]'));
        prompts.push(promptText);
        GM_setValue('prompts', JSON.stringify(prompts));
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

    function getActiveInputField() {
        // Get the currently focused element
        let activeElement = document.activeElement;

        // If it's a textarea or contenteditable div, return it
        if ((activeElement.tagName.toLowerCase() === 'textarea') || activeElement.isContentEditable) {
            return activeElement;
        }

        // No suitable input field found
        return null;
    }

    function insertAtCursor(myField, myValue) {
        // Ensure the field is focused
        myField.focus();

        if (myField.isContentEditable) {
            // For contenteditable elements
            var sel = window.getSelection();
            if (sel.rangeCount > 0) {
                var range = sel.getRangeAt(0);
                // Ensure the selection is within myField
                if (myField.contains(range.commonAncestorContainer)) {
                    range.deleteContents();

                    var textNode = document.createTextNode(myValue);
                    range.insertNode(textNode);

                    // Move the cursor after the inserted text node
                    range.setStartAfter(textNode);
                    range.setEndAfter(textNode);
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else {
                    // If selection is not in myField, place cursor at the end
                    var newRange = document.createRange();
                    newRange.selectNodeContents(myField);
                    newRange.collapse(false); // collapse to end
                    var textNode = document.createTextNode(myValue);
                    newRange.insertNode(textNode);
                    // Move the cursor after the inserted text node
                    newRange.setStartAfter(textNode);
                    newRange.setEndAfter(textNode);
                    sel.removeAllRanges();
                    sel.addRange(newRange);
                }
            } else {
                // No selection, insert at end
                var newRange = document.createRange();
                newRange.selectNodeContents(myField);
                newRange.collapse(false); // collapse to end
                var textNode = document.createTextNode(myValue);
                newRange.insertNode(textNode);
                // Move the cursor after the inserted text node
                newRange.setStartAfter(textNode);
                newRange.setEndAfter(textNode);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(newRange);
            }
        } else if (myField.tagName.toLowerCase() === 'textarea' || myField.tagName.toLowerCase() === 'input') {
            // For input or textarea elements
            if (myField.selectionStart || myField.selectionStart == '0') {
                var startPos = myField.selectionStart;
                var endPos = myField.selectionEnd;
                myField.value = myField.value.substring(0, startPos)
                    + myValue
                    + myField.value.substring(endPos, myField.value.length);
                myField.selectionStart = myField.selectionEnd = startPos + myValue.length;
            } else {
                myField.value += myValue;
            }
        } else {
            console.error('Unsupported input field.');
        }

        // Trigger input event to ensure changes are recognized
        var event = new Event('input', { bubbles: true });
        myField.dispatchEvent(event);
    }
})();
