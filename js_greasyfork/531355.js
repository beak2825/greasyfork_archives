// ==UserScript==
// @name         Text Saver
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Saves text for easy access.
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531355/Text%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/531355/Text%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let savedTexts = GM_getValue('savedTexts', []);
    let isModalVisible = false;
    let dragOffset = { x: 0, y: 0 };
    let lastCopiedIndex = -1;
    let editingIndex = -1;

    if (savedTexts.length > 0) {
        const shouldRestore = confirm('Restore previous session?');
        if (!shouldRestore) {
            savedTexts = [];
            GM_setValue('savedTexts', []);
        }
    }

    const button = document.createElement('button');
    button.textContent = '<';
    button.style.position = 'fixed';
    button.style.top = '50%';
    button.style.right = '10px';
    button.style.transform = 'translateY(-50%)';
    button.style.zIndex = '1000';
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    button.style.padding = '10px 15px';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    document.body.appendChild(button);

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '100px';
    modal.style.right = '50px';
    modal.style.width = '200px';
    modal.style.backgroundColor = 'white';
    modal.style.zIndex = '1001';
    modal.style.display = 'none';
    modal.style.border = '1px solid #ccc';
    modal.style.borderRadius = '5px';
    modal.style.padding = '10px';
    modal.style.transition = 'transform 0.3s ease-out';
    document.body.appendChild(modal);

    const modalHeader = document.createElement('div');
    modalHeader.style.backgroundColor = '#ddd';
    modalHeader.style.color = 'black';
    modalHeader.style.padding = '5px';
    modalHeader.style.cursor = 'move';
    modal.appendChild(modalHeader);

    modalHeader.addEventListener('mousedown', (e) => {
        let isDragging = true;
        let dragOffset = { x: 0, y: 0 };

        dragOffset.x = e.clientX - modal.offsetLeft;
        dragOffset.y = e.clientY - modal.offsetTop;

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            modal.style.right = 'auto';
            modal.style.left = (e.clientX - dragOffset.x) + 'px';
            modal.style.top = (e.clientY - dragOffset.y) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        document.addEventListener('mouseleave', () => {
            isDragging = false;
        });
    });

    const textContainer = document.createElement('div');
    textContainer.style.maxHeight = '300px';
    textContainer.style.overflowY = 'auto';
    modal.appendChild(modalHeader);
    modal.appendChild(textContainer);

    GM_addStyle(`
        .saved-text-item {
            cursor: pointer;
            margin-bottom: 5px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 14px;
            word-break: break-word;
        }

        .saved-text-item:hover {
            background-color: #f0f0f0;
        }

        .selected-text-item {
            background-color: #add8e6;
        }

        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 0.5;
            }
            50% {
                transform: scale(1.1);
                opacity: 1;
            }
            100% {
                transform: scale(1);
                opacity: 0.5;
            }
        }

        .modal-enter {
            animation: pulse 0.5s ease-in-out;
        }

        .modal-exit {
            transform: scale(0.5);
            opacity: 0;
        }

        .editing-text-item {
             background-color: yellow;
        }
    `);

    function updateTextContainer() {
        textContainer.innerHTML = '';

        savedTexts.forEach((text, index) => {
            const textItem = document.createElement('div');
            textItem.classList.add('saved-text-item');
            textItem.textContent = text;

            if (index === lastCopiedIndex) {
                textItem.classList.add('selected-text-item');
            }

            if (index === editingIndex) {
                textItem.classList.add('editing-text-item');
            }

            textItem.addEventListener('click', (event) => {
                if (event.detail === 2) {
                    startEditing(index);
                } else {
                     copyText(index);
                }
            });

            textContainer.appendChild(textItem);
        });
    }

    function showMessage(message, type = 'success') {
        GM_notification({
            title: 'Text Saver',
            text: message,
            timeout: 3000
        });
    }

    function copyText(index) {
        if (index >= 0 && index < savedTexts.length) {
            const text = savedTexts[index];
            GM_setClipboard(text);
            lastCopiedIndex = index;
            updateTextContainer();
            showMessage(`Text copied: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
        }
    }

    function deleteText(index) {
        if (index >= 0 && index < savedTexts.length) {
            const deletedText = savedTexts[index];
            savedTexts.splice(index, 1);

            if (lastCopiedIndex === index) {
                lastCopiedIndex = -1;
            } else if (lastCopiedIndex > index) {
                lastCopiedIndex--;
            }

            if (editingIndex === index) {
                editingIndex = -1;
            } else if (editingIndex > index) {
                editingIndex--;
            }
            updateTextContainer();
            showMessage(`Text deleted: ${deletedText.substring(0, 50)}${deletedText.length > 50 ? '...' : ''}`, 'error');
        }
    }

   function startEditing(index) {
        if (index >= 0 && index < savedTexts.length) {
            editingIndex = index;
            updateTextContainer();

            const textItem = textContainer.children[index];
            if (textItem) {
                textItem.contentEditable = 'true';
                textItem.focus();

                textItem.addEventListener('blur', () => {
                    stopEditing(index, textItem.textContent);
                }, { once: true });
            }
        }
    }

    function stopEditing(index, newText) {
        if (index >= 0 && index < savedTexts.length) {
            savedTexts[index] = newText;
            editingIndex = -1;
            updateTextContainer();
            showMessage(`Text changed: ${newText.substring(0, 50)}${newText.length > 50 ? '...' : ''}`);
        }
    }

    function deleteAllTexts() {
        savedTexts = [];
        lastCopiedIndex = -1;
        editingIndex = -1;
        updateTextContainer();
        showMessage('All texts deleted!', 'error');
    }

    function addTextToClipboard(text) {
        const trimmedText = text.trim();
        if (trimmedText !== "") {
            savedTexts.push(trimmedText);
            lastCopiedIndex = savedTexts.length - 1;
            updateTextContainer();
            GM_setValue('savedTexts', savedTexts);
        }
    }

    document.addEventListener('copy', (event) => {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            addTextToClipboard(selectedText);
        }
    });

    button.addEventListener('click', () => {
        if (!isModalVisible) {
            modal.classList.remove('modal-exit');
            modal.classList.add('modal-enter');
            modal.style.display = 'block';
        } else {
            modal.classList.remove('modal-enter');
            modal.classList.add('modal-exit');
            setTimeout(() => {
                modal.style.display = 'none';
                modal.classList.remove('modal-exit');
            }, 300);
        }
        isModalVisible = !isModalVisible;
        updateTextContainer();
    });

     updateTextContainer();

})();