// ==UserScript==
// @name         備考欄の改良
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  入力されている全文をポップアップ表示し、ポップアップ内で編集可能。改行表示の設定を追加。文字数カウンターを追加。備考欄にヘルプを追加。
// @license      MIT
// @match        *://plus-nao.com/forests/*/mainedit/*
// @match        *://plus-nao.com/forests/*/registered_mainedit/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502064/%E5%82%99%E8%80%83%E6%AC%84%E3%81%AE%E6%94%B9%E8%89%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/502064/%E5%82%99%E8%80%83%E6%AC%84%E3%81%AE%E6%94%B9%E8%89%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const helpLinkHTML = `
        (=> <a href="http://tk2-217-18298.vs.sakura.ne.jp/projects/newproducts/wiki/%E5%82%99%E8%80%83%E6%AC%84%E3%83%98%E3%83%AB%E3%83%97" target="_blank">ヘルプ</a> )
    `;

    const MAX_LENGTH = 255;

    const style = document.createElement('style');
    style.textContent = `
        .cursor-warning {
            color: red;
        }
        .space-settings-button {
            position: absolute;
            font-size: 12px;
            top: -12px;
            right: -10px;
            background: transparent;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 5px;
            cursor: pointer;
        }
        .space-settings-popup {
            position: absolute;
            top: 50px;
            right: 10px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            z-index: 1000;
            display: none;
        }
        .space-settings-popup label {
            display: block;
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('load', function() {
        const remarksHeader = [...document.querySelectorAll('th[scope="row"]')].find(th => th.textContent.includes("備考"));

        if (remarksHeader) {
            const helpLinkSpan = document.createElement('span');
            helpLinkSpan.innerHTML = helpLinkHTML;
            remarksHeader.appendChild(helpLinkSpan);
        }

        const inputField = document.getElementById('TbMainproduct備考');
        if (!inputField) return;

        const wrapperDiv = document.createElement('div');
        wrapperDiv.style.position = 'relative';
        inputField.parentNode.insertBefore(wrapperDiv, inputField);
        wrapperDiv.appendChild(inputField);
        inputField.style.width = 'calc(100% - 60px)';

        const popupStyle = `
            position: absolute;
            background-color: white;
            border: 2px solid #ccc;
            border-radius: 5px;
            padding: 4px 10px;
            z-index: 1000;
            display: none;
            overflow: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
            box-sizing: border-box;
            width: calc(100% - 60px);
        `;

        const popup = document.createElement('div');
        popup.className = 'remarks-popup';
        popup.style.cssText = popupStyle;
        popup.contentEditable = true;
        wrapperDiv.appendChild(popup);

        const cursorPosition = createCursorPosition();
        wrapperDiv.appendChild(cursorPosition);

        const settingsButton = document.createElement('button');
        settingsButton.className = 'space-settings-button';
        settingsButton.textContent = '⚙️';
        wrapperDiv.appendChild(settingsButton);

        const settingsPopup = document.createElement('div');
        settingsPopup.className = 'space-settings-popup';
        settingsPopup.innerHTML = `
            <label title="チェックを入れると、入力欄の半角スペースをポップアップ内で改行として表示します。">
            <input type="checkbox" id="spaceAsNewlineToggle">
            半角スペースを改行として表示
            </label>
        `;
        wrapperDiv.appendChild(settingsPopup);

        const spaceAsNewlineToggle = document.getElementById('spaceAsNewlineToggle');
        let spaceAsNewline = localStorage.getItem('spaceAsNewline') === 'true';
        spaceAsNewlineToggle.checked = spaceAsNewline;

        settingsButton.addEventListener('click', (event) => {
            event.preventDefault();
            settingsPopup.style.display = settingsPopup.style.display === 'block' ? 'none' : 'block';
        });

        spaceAsNewlineToggle.addEventListener('change', () => {
            spaceAsNewline = spaceAsNewlineToggle.checked;
            localStorage.setItem('spaceAsNewline', spaceAsNewline);
            updatePopup();
        });

        function updatePopup() {
            if (inputField === document.activeElement && inputField.value.trim() !== '') {
                popup.textContent = spaceAsNewline
                    ? inputField.value.replace(/ /g, '\n')
                : inputField.value;
                popup.style.display = 'block';
            } else {
                popup.style.display = 'none';
            }
        }

        function updateCursorPosition(focused, customPosition = null) {
            let position;
            let totalLength;

            if (focused && inputField === document.activeElement) {
                position = inputField.selectionStart;
                totalLength = inputField.value.length;
            } else if (focused && popup === document.activeElement) {
                const selection = window.getSelection();
                position = customPosition !== null ? customPosition : selection.anchorOffset;
                totalLength = popup.textContent.length;
            } else {
                position = 0;
                totalLength = inputField.value.length;
            }

            cursorPosition.textContent = focused ? `${position}/${totalLength}` : `${totalLength}`;

            if (totalLength > MAX_LENGTH) {
                cursorPosition.classList.add('cursor-warning');
            } else {
                cursorPosition.classList.remove('cursor-warning');
            }
        }

        updateCursorPosition(false);

        function createCursorPosition() {
            const span = document.createElement('span');
            span.style.marginLeft = '3px';
            span.style.fontSize = '11px';
            span.style.verticalAlign = 'middle';
            return span;
        }

        function validatePopupInput() {
            let currentText = popup.textContent;
            currentText = currentText.replace(/\n/g, ' ');
            if (currentText.length > MAX_LENGTH) {
                currentText = currentText.substring(0, MAX_LENGTH);
                popup.textContent = currentText;
                inputField.value = currentText;
            }
        }

        let isComposing = false;

        popup.addEventListener('compositionstart', function() {
            isComposing = true;
        });

        popup.addEventListener('compositionupdate', function(event) {
            const updatedText = popup.textContent.replace(/\n/g, ' ');
            inputField.value = updatedText;

            setTimeout(() => {
                updateCursorPosition(true);
            }, 0);
        });

        popup.addEventListener('compositionend', function(event) {
            isComposing = false;

            const updatedText = popup.textContent.replace(/\n/g, ' ');
            inputField.value = updatedText;

            setTimeout(() => {
                updateCursorPosition(true);
            }, 0);
        });


        inputField.addEventListener('blur', function() {
            updateCursorPosition(false);
        });

        inputField.addEventListener('keyup', function() {
            updateCursorPosition(true);
        });

        inputField.addEventListener('click', function() {
            updateCursorPosition(true);
        });

        inputField.addEventListener('focus', updatePopup);

        inputField.addEventListener('input', function() {
            updatePopup();
            updateCursorPosition(true);
        });

        let shouldRedraw = false;

        popup.addEventListener('mouseup', () => {
            updateCursorPosition(true);
        });

        popup.addEventListener('focus', function() {
            updateCursorPosition(true);
        });

        popup.addEventListener('blur', function() {
            if (popup.textContent.length > MAX_LENGTH) {
                alert(`入力可能な文字数を超えています。256字以降は切り捨てられます。`);
            }

            const updatedText = popup.textContent.replace(/\n/g, ' ');
            popup.textContent = updatedText;
            inputField.value = updatedText;
            validatePopupInput();
            updateCursorPosition(false);
        });

        popup.addEventListener('keydown', function (event) {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const cursorOffset = range.startOffset;
            const isPopupActive = document.activeElement === popup;
            const targetElement = isPopupActive ? popup : inputField;
            const isLastCharacter = cursorOffset === targetElement.textContent.length;

            if (event.key === 'Enter') {
                let beforeCursor = targetElement.textContent.slice(0, cursorOffset);
                let afterCursor = targetElement.textContent.slice(cursorOffset);

                if (isLastCharacter && !targetElement.textContent.endsWith('\n')) {
                    if (isPopupActive) {
                        targetElement.textContent = beforeCursor + '\n\n' + afterCursor;
                    } else {
                        targetElement.value = beforeCursor + '  ' + afterCursor;
                    }
                } else {
                    if (isPopupActive) {
                        targetElement.textContent = beforeCursor + '\n' + afterCursor;
                    } else {
                        targetElement.value = beforeCursor + ' ' + afterCursor;
                    }
                }

                const newRange = document.createRange();
                const firstChild = targetElement.firstChild;

                if (firstChild && firstChild.nodeType === 3) {
                    const newCursorPosition = beforeCursor.length + (isPopupActive ? 1 : 0);
                    newRange.setStart(firstChild, newCursorPosition);
                    newRange.collapse(true);

                    selection.removeAllRanges();
                    selection.addRange(newRange);

                    setTimeout(() => updateCursorPosition(isPopupActive, newCursorPosition), 0);
                }

                event.preventDefault();
            } else {
                setTimeout(() => updateCursorPosition(isPopupActive), 0);
            }
        });

        popup.addEventListener('input', () => {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const startOffset = range.startOffset;
            const startNode = range.startContainer;

            const text = popup.textContent;

            const updatedText = text.replace(/\n/g, ' ');
            inputField.value = updatedText;

            updateCursorPosition(true);

            const newRange = document.createRange();
            newRange.setStart(startNode, Math.min(startOffset, text.length));
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
        });

        popup.addEventListener('click', function() {
            updateCursorPosition(true);
        });

        document.addEventListener('click', event => {
            if (window.getSelection().type === "Range") {
                return;
            }

            if (!popup.contains(event.target) && !inputField.contains(event.target)) {
                popup.style.display = 'none';
                inputField.blur();
            }
        });
    });
})();