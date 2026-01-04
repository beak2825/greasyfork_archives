// ==UserScript==
// @name         噗浪輸入框格式化標記按鈕
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  透過按鈕就能快速地使用粗體、斜體、刪除線、超連結的標記！
// @author       方格子
// @match        https://www.plurk.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528157/%E5%99%97%E6%B5%AA%E8%BC%B8%E5%85%A5%E6%A1%86%E6%A0%BC%E5%BC%8F%E5%8C%96%E6%A8%99%E8%A8%98%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/528157/%E5%99%97%E6%B5%AA%E8%BC%B8%E5%85%A5%E6%A1%86%E6%A0%BC%E5%BC%8F%E5%8C%96%E6%A8%99%E8%A8%98%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定義按鈕的標籤和功能
    const buttons = [
        { text: '粗體', tag: '**', title: '插入粗體標記' },
        { text: '斜體', tag: '*', title: '插入斜體標記' },
        { text: '刪除線', tag: '--', title: '插入刪除線標記' },
        { text: '超連結', tag: '', title: '插入超連結' } // 新增超連結按鈕
    ];

    // 添加按鈕到指定的輸入框
    function addButtons(inputBox) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '2px';
        buttonContainer.style.display = 'flex'; // 使用 flexbox 來排列按鈕

        // 創建一個可展開的選單
        const toggleButton = document.createElement('button');
        toggleButton.innerText = '格式化選項';
        toggleButton.style.fontSize = '12px';
        toggleButton.style.backgroundColor = '#4c6391';
        toggleButton.style.padding = '6px';
        toggleButton.style.marginRight = '5px'; // 右邊留點空間
        toggleButton.onclick = () => {
            buttonList.style.display = buttonList.style.display === 'none' ? 'flex' : 'none'; // 切換顯示狀態
        };
        buttonContainer.appendChild(toggleButton);

        const buttonList = document.createElement('div');
        buttonList.style.display = 'none'; // 初始隱藏
        buttonList.style.flexDirection = 'row'; // 水平排列按鈕
        buttonList.style.alignItems = 'center'; // 垂直居中對齊
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.innerText = button.text;
            btn.title = button.title;
            btn.style.backgroundColor = '#547bc7';
            btn.style.padding = '6px';
            btn.style.marginRight = '5px';
            btn.onclick = () => {
                if (button.text === '超連結') {
                    insertLink(inputBox); // 處理超連結的插入
                } else {
                    insertTag(inputBox, button.tag);
                }
            };
            buttonList.appendChild(btn);
        });

        buttonContainer.appendChild(buttonList);
        // 將按鈕容器添加到輸入框上方
        inputBox.parentNode.insertBefore(buttonContainer, inputBox);
    }


    // 插入標記的功能
    function insertTag(inputBox, tag) {
        const start = inputBox.selectionStart;
        const end = inputBox.selectionEnd;
        const text = inputBox.value;

        // 獲取選取的文字
        const selectedText = text.slice(start, end);

        // 如果有選取文字，則在前後添加標記
        if (selectedText) {
            inputBox.value = text.slice(0, start) + tag + selectedText + tag + text.slice(end);
            inputBox.selectionStart = start + tag.length; // 將光標移到標記後
            inputBox.selectionEnd = start + tag.length + selectedText.length; // 選取的文字後
        } else {
            // 如果沒有選取文字，則直接插入標記
            inputBox.value = text.slice(0, start) + tag + tag + text.slice(end);
            inputBox.selectionStart = inputBox.selectionEnd = start + tag.length; // 將光標移到標記後
        }

        inputBox.focus();
    }

    // 插入超連結的功能
    function insertLink(inputBox) {
        const url = prompt('請輸入超連結的 URL:');
        const title = prompt('請輸入顯示的文字:');
        if (url && title) {
            const linkText = `[${title}](${url})`; // Markdown 語法
            const start = inputBox.selectionStart;
            const end = inputBox.selectionEnd;
            const text = inputBox.value;
            inputBox.value = text.slice(0, start) + linkText + text.slice(end);
            inputBox.selectionStart = inputBox.selectionEnd = start + linkText.length; // 將光標移到標記後
            inputBox.focus();
        }
    }

    // 監聽輸入框的變化
    const observer = new MutationObserver(() => {
        const inputBig = document.getElementById('input_big');
        const inputSmall = document.getElementById('input_small');
        const cboxInput = document.getElementById('cbox_input');

        if (inputBig && !inputBig.previousElementSibling) {
            addButtons(inputBig);
        }

        if (inputSmall && !inputSmall.previousElementSibling) {
            addButtons(inputSmall);
        }

        if (cboxInput && !cboxInput.previousElementSibling) {
            addButtons(cboxInput);
        }
    });

    // 開始觀察 Plurk 的輸入框
    observer.observe(document.body, { childList: true, subtree: true });
})();
