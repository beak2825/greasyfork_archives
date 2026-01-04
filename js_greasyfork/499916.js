// ==UserScript==
// @name         タイトルの改良
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  入力されている全文をポップアップ表示し、ポップアップ内で編集可能。不要なスペースと重複ワードの検出・削除。全角スペースを半角に。文字数カウンターを追加。ブラウザタブタイトルにコードを追加。
// @license      MIT
// @match        *://plus-nao.com/forests/*/mainedit/*
// @match        *://plus-nao.com/forests/*/registered_mainedit/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/499916/%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%81%AE%E6%94%B9%E8%89%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/499916/%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%81%AE%E6%94%B9%E8%89%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.title += "/" + window.location.href.split('/').pop();

    const MAX_LENGTH = 255;
    let isEditingPopup = false;

    const style = document.createElement('style');
    style.textContent = `
        .cursor-warning {
            color: red;
        }
    `;

    document.head.appendChild(style);

    window.addEventListener('load', function() {
        const targetTd = document.querySelector('td[colspan="3"]:has(input[name="data[TbMainproduct][daihyo_syohin_name]"])');
        if (targetTd) {
            const computedStyle = window.getComputedStyle(targetTd);
            const paddingTop = computedStyle.paddingTop;

            if (paddingTop === '7px') {
                targetTd.style.position = 'relative';
                targetTd.style.paddingTop = '30px';
            }
        }

        const inputFieldId = 'TbMainproductDaihyoSyohinName';
        const inputField = document.getElementById(inputFieldId);
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
        popup.className = 'title-popup';
        popup.style.cssText = popupStyle;
        popup.contentEditable = true;
        wrapperDiv.appendChild(popup);

        function syncPopupToInput() {
            const updatedText = popup.textContent.replace(/\n/g, ' ');
            inputField.value = updatedText;
            updateButtonVisibility();
            updateCursorPosition(true);
        }

        function updatePopup() {
            if (inputField === document.activeElement && inputField.value.trim() !== '') {
                popup.textContent = inputField.value;
                popup.style.display = 'block';
                updatePopupText();
            } else {
                popup.style.display = 'none';
            }
        }

        function updatePopupText() {
            const text = inputField.value;
            popup.textContent = text;
        }

        const popupElement = document.querySelector('#popup');

        const observer = new MutationObserver(function(mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (popupElement.style.display === 'none') {
                        popup.style.display = 'none';
                    }
                }
            }
        });

        if (popupElement) {
            observer.observe(popupElement, { attributes: true });
        }

        document.addEventListener('click', function(event) {
            if (popup.style.display === 'block' &&
                !popup.contains(event.target) &&
                !inputField.contains(event.target) &&
                !event.target.closest('.suggest-popup')) {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const startContainer = range.startContainer;
                    const endContainer = range.endContainer;

                    if (wrapperDiv.contains(startContainer) || wrapperDiv.contains(endContainer)) {
                        return;
                    }
                }

                popup.style.display = 'none';
                inputField.blur();
                updateButtonVisibility();
                updateCursorPosition(false);
            }
        });

        const textObserver = new MutationObserver(() => {
            const updatedText = popup.textContent.replace(/\n/g, ' ');
            inputField.value = updatedText;
            updateButtonVisibility();
            updateCursorPosition(true);
        });

        if (popup) {
            textObserver.observe(popup, { childList: true, subtree: true, characterData: true });
        }

        popup.addEventListener('mouseup', () => {
            updateCursorPosition(true);
        });

        popup.addEventListener('focus', function() {
            isEditingPopup = true;
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
            isEditingPopup = false;
            updateCursorPosition(false);
        });

        popup.addEventListener('keydown', function (event) {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const cursorOffset = range.startOffset;

            if (event.key === 'Enter') {
                const beforeCursor = popup.textContent.slice(0, cursorOffset);
                const afterCursor = popup.textContent.slice(cursorOffset);

                popup.textContent = beforeCursor + ' ' + afterCursor;

                const newRange = document.createRange();
                const firstChild = popup.firstChild;

                if (firstChild && firstChild.nodeType === 3) {
                    const newCursorPosition = beforeCursor.length + 1;
                    newRange.setStart(firstChild, newCursorPosition);
                    newRange.collapse(true);

                    selection.removeAllRanges();
                    selection.addRange(newRange);

                    setTimeout(() => {
                        updateCursorPosition(document.activeElement === popup, newCursorPosition);
                    }, 0);
                }

                inputField.value = popup.textContent;

                event.preventDefault();
            } else {
                setTimeout(() => {
                    updateCursorPosition(document.activeElement === popup);
                }, 0);
            }
        });

        popup.addEventListener('paste', function (event) {
            event.preventDefault();

            const clipboardData = event.clipboardData || window.clipboardData;
            const pasteText = clipboardData.getData('text/plain');

            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const cursorOffset = range.startOffset;

            range.deleteContents();

            const beforeCursor = popup.textContent.slice(0, cursorOffset);
            const afterCursor = popup.textContent.slice(cursorOffset);

            const updatedPasteText = pasteText.replace(/\n/g, ' ');

            popup.textContent = beforeCursor + updatedPasteText + afterCursor;

            const newCursorPosition = beforeCursor.length + updatedPasteText.length;

            const newRange = document.createRange();
            newRange.setStart(popup.firstChild, newCursorPosition);
            newRange.collapse(true);

            selection.removeAllRanges();
            selection.addRange(newRange);

            inputField.value = popup.textContent;

            updateButtonVisibility();
            updateCursorPosition(true);
        });

        popup.addEventListener('input', () => {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const startOffset = range.startOffset;
            const startNode = range.startContainer;

            const text = popup.textContent;

            const updatedText = text.replace(/\n/g, ' ');
            inputField.value = updatedText;

            updateButtonVisibility();
            updateCursorPosition(true);

            const newRange = document.createRange();
            newRange.setStart(startNode, Math.min(startOffset, text.length));
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
        });

        let lastCursorPosition = null;

        const suggestPopupElements = document.querySelectorAll('.suggest-popup');

        suggestPopupElements.forEach(suggestPopup => {
            suggestPopup.addEventListener('mousedown', (e) => {
                if (!isEditingPopup) return;
                e.preventDefault();

                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    lastCursorPosition = {
                        node: range.startContainer,
                        offset: range.startOffset,
                    };
                }
            });

            suggestPopup.addEventListener('click', (e) => {
                if (!isEditingPopup) return;
                if (e.target.classList.contains('add-word-button')) return;

                if (lastCursorPosition) {
                    const selection = window.getSelection();
                    const newRange = document.createRange();
                    newRange.setStart(lastCursorPosition.node, lastCursorPosition.offset);
                    newRange.collapse(true);

                    selection.removeAllRanges();
                    selection.addRange(newRange);

                    updateCursorPosition(true);
                }
            });
        });

        function updateInputField() {
            inputField.value = popup.textContent;
            updateButtonVisibility();
            updateCursorPosition(true);
        }

        function updateInputFieldCursorFromPopup() {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const offset = range.startOffset;
            const text = popup.textContent;
            const cursorPos = getCharacterOffsetFromPopup(text, offset);
            inputField.setSelectionRange(cursorPos, cursorPos);
            inputField.focus();
            updateCursorPosition(true);
        }

        function getCharacterOffsetFromPopup(text, offset) {
            return offset;
        }

        const spaceFixButton = createButton('スペース修正');
        const removeDuplicatesButton = createButton('重複削除');
        const cursorPosition = createCursorPosition();
        wrapperDiv.appendChild(cursorPosition);

        addHighlightStyles();

        if (isRegisteredEditPage()) {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.position = 'absolute';
            buttonContainer.style.top = '-29px';
            buttonContainer.style.right = '55px';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.flexDirection = 'row';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.zIndex = '1000';

            inputField.parentNode.style.position = 'relative';
            inputField.parentNode.appendChild(buttonContainer);

            setButtonStyles(removeDuplicatesButton, {
                backgroundColor: 'transparent',
                color: '#000000',
                border: '1px solid #ccc',
                padding: '0px 7px',
                marginLeft: '5px',
                marginTop: '4px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px',
                visibility: 'hidden',
                transition: 'background-color 0.3s, transform 0.1s',
            });

            setButtonStyles(spaceFixButton, {
                backgroundColor: 'transparent',
                color: '#000000',
                border: '1px solid #ccc',
                padding: '0px 7px',
                marginLeft: '5px',
                marginTop: '4px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px',
                visibility: 'hidden',
                transition: 'background-color 0.3s, transform 0.1s',
            });

            buttonContainer.appendChild(spaceFixButton);
            buttonContainer.appendChild(removeDuplicatesButton);

            updateButtonVisibility();

        } else if (isMainEditPage()) {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.position = 'absolute';
            buttonContainer.style.top = '-29px';
            buttonContainer.style.right = '55px';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.flexDirection = 'row';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.zIndex = '1000';

            inputField.parentNode.style.position = 'relative';
            inputField.parentNode.appendChild(buttonContainer);

            setButtonStyles(removeDuplicatesButton, {
                backgroundColor: 'transparent',
                color: '#000000',
                border: '1px solid #ccc',
                padding: '0px 7px',
                marginLeft: '5px',
                marginTop: '4px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px',
                visibility: 'hidden',
                transition: 'background-color 0.3s, transform 0.1s',
            });

            setButtonStyles(spaceFixButton, {
                backgroundColor: 'transparent',
                color: '#000000',
                border: '1px solid #ccc',
                padding: '0px 7px',
                marginLeft: '5px',
                marginTop: '4px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '12px',
                visibility: 'hidden',
                transition: 'background-color 0.3s, transform 0.1s',
            });

            buttonContainer.appendChild(spaceFixButton);
            buttonContainer.appendChild(removeDuplicatesButton);

            updateButtonVisibility();
        }

        inputField.addEventListener('blur', function() {
            updateCursorPosition(false);
        });
        inputField.addEventListener('focus', function() {
            updatePopup();
            updateCursorPosition(true);
        });
        inputField.addEventListener('input', function() {
            updatePopup();
        });

        inputField.addEventListener('keyup', function() {
            updateCursorPosition(true);
        });
        inputField.addEventListener('click', function() {
            updateCursorPosition(true);
        });

        spaceFixButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            handleSpaceFixClick(inputField, spaceFixButton);
            addClickFeedback(spaceFixButton);
        });

        removeDuplicatesButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            handleRemoveDuplicatesClick(inputField, removeDuplicatesButton);
            addClickFeedback(removeDuplicatesButton);
        });

        removeDuplicatesButton.addEventListener('mouseover', function() {
            const duplicates = getDuplicateWords(inputField.value);
            if (duplicates.length > 0) {
                removeDuplicatesButton.title = `重複ワード: ${duplicates.join(', ')}`;
            } else {
                removeDuplicatesButton.title = '';
            }
        });

        function addClickFeedback(button) {
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);
        }

        function attachContainerToElement(container, selector) {
            const targetButton = document.querySelector(selector);
            if (targetButton) {
                const wrapper = document.createElement('div');
                wrapper.style.display = 'inline-flex';
                wrapper.style.alignItems = 'flex-end';

                targetButton.parentNode.insertBefore(wrapper, targetButton.nextSibling);
                wrapper.appendChild(targetButton);
                wrapper.appendChild(container);
            }
        }

        function createButton(textContent) {
            const btn = document.createElement('button');
            btn.textContent = textContent;
            return btn;
        }

        function createCursorPosition() {
            const span = document.createElement('span');
            span.style.marginLeft = '3px';
            span.style.fontSize = '11px';
            span.style.verticalAlign = 'middle';
            return span;
        }

        function addHighlightStyles() {
            const style = document.createElement('style');
            style.innerHTML = `
                .highlight {
                    border: 2px solid #ff0000;
                    background-color: #fff5f5;
                }
            `;
            document.head.appendChild(style);
        }

        function isRegisteredEditPage() {
            return window.location.href.includes('/forests/TbMainproducts/registered_mainedit/') ||
                window.location.href.includes('/forests/tb_mainproducts/registered_mainedit/');
        }

        function isMainEditPage() {
            return window.location.href.includes('/forests/TbMainproducts/mainedit/') ||
                window.location.href.includes('/forests/tb_mainproducts/mainedit/');
        }

        function setButtonStyles(button, styles) {
            Object.assign(button.style, styles);

            button.addEventListener('mouseover', function() {
                button.style.backgroundColor = '#f0f0f0';
            });
            button.addEventListener('mouseout', function() {
                button.style.backgroundColor = 'transparent';
            });

            button.addEventListener('mousedown', function() {
                button.style.transform = 'scale(0.95)';
            });
            button.addEventListener('mouseup', function() {
                button.style.transform = 'scale(1)';
            });
        }

        function attachButtonToElement(button, selector, callback) {
            const targetButton = document.querySelector(selector);
            if (targetButton) {
                targetButton.parentNode.insertBefore(button, targetButton.nextSibling);
                callback();
            }
        }

        function attachButtonToElementInTd(button, tagName, includeText1, includeText2, callback) {
            const parentTd = inputField.closest('td');
            if (!parentTd) {
                return;
            }

            const targetElements = parentTd.getElementsByTagName(tagName);
            for (let i = 0; i < targetElements.length; i++) {
                if (targetElements[i].innerHTML.includes(includeText1) && targetElements[i].innerHTML.includes(includeText2)) {
                    targetElements[i].appendChild(button);
                    callback();
                    return;
                }
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

        function validatePopupInput() {
            let currentText = popup.textContent;
            currentText = currentText.replace(/\n/g, ' ');
            if (currentText.length > MAX_LENGTH) {
                currentText = currentText.substring(0, MAX_LENGTH);
                popup.textContent = currentText;
                inputField.value = currentText;
            }
        }

        function updateButtonVisibility() {
            if (isEditingPopup) {
                return;
            }

            const value = inputField.value;
            const hasSpaceIssues = value.match(/\s{2,}|　|^[\s　]+|[\s　]+$/);
            const hasDuplicates = hasDuplicateWords(value);

            if (hasSpaceIssues) {
                spaceFixButton.style.visibility = 'visible';
                inputField.classList.add('highlight');
            } else {
                spaceFixButton.style.visibility = 'hidden';
            }

            if (hasDuplicates) {
                removeDuplicatesButton.style.visibility = 'visible';
                inputField.classList.add('highlight');
            } else {
                removeDuplicatesButton.style.visibility = 'hidden';
                if (!hasSpaceIssues) {
                    inputField.classList.remove('highlight');
                }
            }

            updateCursorPosition(document.activeElement === inputField);
        }

        function handleSpaceFixClick(inputField, button) {
            const trimmedValue = inputField.value.trim();
            let processedValue = trimmedValue.replace(/\s{2,}/g, ' ');
            processedValue = processedValue.replace(/　/g, ' ');
            inputField.value = processedValue;
            button.style.visibility = 'hidden';
            updateButtonVisibility();
            updatePopupContent();
            updateCursorPosition(document.activeElement === inputField);
        }

        function updatePopupContent() {
            const text = inputField.value;
            popup.textContent = text;
        }

        function handleRemoveDuplicatesClick(inputField, button) {
            const value = inputField.value;
            const words = value.split(/\s+/);
            const uniqueWords = [...new Set(words)];
            const processedValue = uniqueWords.join(' ');
            if (value !== processedValue) {
                inputField.value = processedValue;
                inputField.classList.add('highlight');
                updatePopupContent();
            } else {
                inputField.classList.remove('highlight');
            }
            button.style.visibility = 'hidden';
            updateButtonVisibility();
            updateCursorPosition(document.activeElement === inputField);
        }

        function hasDuplicateWords(value) {
            const words = value.split(/\s+/).filter(word => word.trim() !== '');
            const uniqueWords = new Set(words);
            return uniqueWords.size < words.length;
        }

        function getDuplicateWords(value) {
            const words = value.split(/\s+/).filter(word => word.trim() !== '');
            const wordCount = {};
            const duplicates = [];

            words.forEach(word => {
                wordCount[word] = (wordCount[word] || 0) + 1;
            });

            for (const word in wordCount) {
                if (wordCount[word] > 1) {
                    duplicates.push(word);
                }
            }

            return duplicates;
        }
    });
})();