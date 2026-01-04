// ==UserScript==
// @name         lolcast macro
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Create and manage chat command shortcuts
// @match        https://insagirl-toto.appspot.com/chatting/lgic/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/505975/lolcast%20macro.user.js
// @updateURL https://update.greasyfork.org/scripts/505975/lolcast%20macro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOCAL_STORAGE_KEY = 'lc_chat_shortcuts';
    const MAX_SHORTCUTS = 15;
    const COMMAND_DELAY_MS = 200;
    const CSS_PREFIX = 'lc-';

    let shortcuts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

    function saveShortcuts() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(shortcuts));
    }

    function getChatInput() {
        return document.querySelector('#ichatinput');
    }

    function executeCommandSequence(command) {
        const chatInput = getChatInput();
        if (!chatInput) {
            alert('채팅창을 찾을 수 없습니다!');
            return;
        }

        const commands = command.split('\n');
        commands.forEach((cmd, index) => {
            setTimeout(async () => {
                try {
                    chatInput.value = '';
                    chatInput.focus();
                    await simulateUserInput(chatInput, cmd.trim());
                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        bubbles: true,
                        composed: true
                    });
                    chatInput.dispatchEvent(enterEvent);
                } catch (error) {
                    console.error('Error:', error);
                }
            }, index * COMMAND_DELAY_MS);
        });
    }

    async function simulateUserInput(inputElement, text) {
        return new Promise(resolve => {
            inputElement.value = text;
            const events = [
                new Event('input', { bubbles: true }),
                new Event('change', { bubbles: true }),
                new KeyboardEvent('keydown', { bubbles: true }),
                new KeyboardEvent('keyup', { bubbles: true })
            ];
            events.forEach(event => inputElement.dispatchEvent(event));
            setTimeout(resolve, 50);
        });
    }

    function createShortcutButton(shortcut) {
        const button = document.createElement('button');
        button.textContent = shortcut.label;
        button.className = `${CSS_PREFIX}shortcut-btn`;
        button.addEventListener('click', () => {
            executeCommandSequence(shortcut.command);
        });
        return button;
    }

    function renderShortcutBar() {
        const existingContainer = document.querySelector(`.${CSS_PREFIX}shortcut-container`);
        if (existingContainer) existingContainer.remove();

        const container = document.createElement('div');
        container.className = `${CSS_PREFIX}shortcut-container`;

        shortcuts.slice(0, MAX_SHORTCUTS).forEach(shortcut => {
            container.appendChild(createShortcutButton(shortcut));
        });

        document.body.appendChild(container);
    }

    function openSettingsModal() {
        console.log('단축키 설정');
        if (!document.body) {
        console.error('에러');
        return;
    }
        const modal = document.createElement('div');
        modal.className = `${CSS_PREFIX}settings-modal`;

        modal.innerHTML = `
            <h2>단축키 설정(${shortcuts.length}/${MAX_SHORTCUTS})</h2>
            <div class="${CSS_PREFIX}shortcut-list"></div>
            <div class="${CSS_PREFIX}add-form">
                <input type="text" class="${CSS_PREFIX}text-input" placeholder="단축키 이름">
                <textarea class="${CSS_PREFIX}command-input" placeholder="명령어(여려줄 가능)"></textarea>
                <button class="${CSS_PREFIX}add-button">추가</button>
                <button class="${CSS_PREFIX}close-button">닫기</button>
            </div>
        `;

        const list = modal.querySelector(`.${CSS_PREFIX}shortcut-list`);
        shortcuts.forEach((shortcut, index) => {
            const item = document.createElement('div');
            item.className = `${CSS_PREFIX}list-item`;
            item.innerHTML = `
                <div class="${CSS_PREFIX}item-content">
                    <span class="${CSS_PREFIX}item-label">${shortcut.label}</span>
                    <pre class="${CSS_PREFIX}item-command">${shortcut.command}</pre>
                </div>
                <div class="${CSS_PREFIX}item-controls">
                    <button class="${CSS_PREFIX}move-up" ${index === 0 ? 'disabled' : ''}>▲</button>
                    <button class="${CSS_PREFIX}move-down" ${index === shortcuts.length - 1 ? 'disabled' : ''}>▼</button>
                    <button class="${CSS_PREFIX}delete-btn">삭제</button>
                </div>
            `;

            item.querySelector(`.${CSS_PREFIX}move-up`).addEventListener('click', () => moveShortcut(index, index - 1));
            item.querySelector(`.${CSS_PREFIX}move-down`).addEventListener('click', () => moveShortcut(index, index + 1));
            item.querySelector(`.${CSS_PREFIX}delete-btn`).addEventListener('click', () => deleteShortcut(index));

            list.appendChild(item);
        });

        const addButton = modal.querySelector(`.${CSS_PREFIX}add-button`);
        const labelInput = modal.querySelector(`.${CSS_PREFIX}text-input`);
        const commandInput = modal.querySelector(`.${CSS_PREFIX}command-input`);

        addButton.addEventListener('click', () => {
            const label = labelInput.value.trim();
            const command = commandInput.value.trim();

            if (!label || !command) {
                alert('이름과 명령어를 모두 입력해주세요.');
                return;
            }

            if (shortcuts.length >= MAX_SHORTCUTS) {
                alert(`최대 ${MAX_SHORTCUTS} 개까지 등록 가능합니다.`);
                return;
            }

            if (shortcuts.some(s => s.label === label)) {
                alert('이미 존재하는 단축키 이름입니다.');
                return;
            }

            shortcuts.push({ label, command });
            saveShortcuts();
            renderShortcutBar();

            renderShortcutList(modal);
        });

        modal.querySelector(`.${CSS_PREFIX}close-button`).addEventListener('click', () => modal.remove());

        document.body.appendChild(modal);
    }

    function moveShortcut(fromIndex, toIndex) {
        if (toIndex < 0 || toIndex >= shortcuts.length) return;
        [shortcuts[fromIndex], shortcuts[toIndex]] = [shortcuts[toIndex], shortcuts[fromIndex]];
        saveShortcuts();
        renderShortcutBar();
        const modal = document.querySelector(`.${CSS_PREFIX}settings-modal`);
        if (modal) {
            renderShortcutList(modal);
        }
    }

    function deleteShortcut(index) {
        shortcuts.splice(index, 1);
        saveShortcuts();
        renderShortcutBar();
        const modal = document.querySelector(`.${CSS_PREFIX}settings-modal`);
        if (modal) {
            renderShortcutList(modal);
        }
    }

    function renderShortcutList(modal) {
        const list = modal.querySelector(`.${CSS_PREFIX}shortcut-list`);
        list.innerHTML = '';
        shortcuts.forEach((shortcut, index) => {
            const item = document.createElement('div');
            item.className = `${CSS_PREFIX}list-item`;
            item.innerHTML = `
                <div class="${CSS_PREFIX}item-content">
                    <span class="${CSS_PREFIX}item-label">${shortcut.label}</span>
                    <pre class="${CSS_PREFIX}item-command">${shortcut.command}</pre>
                </div>
                <div class="${CSS_PREFIX}item-controls">
                    <button class="${CSS_PREFIX}move-up" ${index === 0 ? 'disabled' : ''}>▲</button>
                    <button class="${CSS_PREFIX}move-down" ${index === shortcuts.length - 1 ? 'disabled' : ''}>▼</button>
                    <button class="${CSS_PREFIX}delete-btn">삭제</button>
                </div>
            `;

            item.querySelector(`.${CSS_PREFIX}move-up`).addEventListener('click', () => moveShortcut(index, index - 1));
            item.querySelector(`.${CSS_PREFIX}move-down`).addEventListener('click', () => moveShortcut(index, index + 1));
            item.querySelector(`.${CSS_PREFIX}delete-btn`).addEventListener('click', () => deleteShortcut(index));

            list.appendChild(item);
        });
    }

    GM_addStyle(`
        .${CSS_PREFIX}shortcut-container {
            position: fixed;
            top: 14px;
            left: 0;
            right: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            padding: 8px;
            background: transparent;
            z-index: 1000;
        }

        .${CSS_PREFIX}shortcut-btn {
            padding: 5px 10px;
            background-color: #4CAF50;
            border: none;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
        }

        .${CSS_PREFIX}settings-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 500px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            padding: 20px;
            z-index: 10000;
        }

        .${CSS_PREFIX}shortcut-list {
            max-height: 50vh;
            overflow-y: auto;
            margin-bottom: 15px;
            border: 1px solid #eee;
            border-radius: 6px;
            padding: 10px;
        }

        .${CSS_PREFIX}list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            margin-bottom: 8px;
            background: #f8f8f8;
            border-radius: 4px;
        }

        .${CSS_PREFIX}item-content {
            flex-grow: 1;
            margin-right: 15px;
        }

        .${CSS_PREFIX}item-label {
            display: block;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 4px;
        }

        .${CSS_PREFIX}item-command {
            margin: 0;
            font-size: 0.9em;
            color: #666;
            white-space: pre-wrap;
            font-family: monospace;
        }

        .${CSS_PREFIX}item-controls {
            display: flex;
            gap: 5px;
        }

        .${CSS_PREFIX}move-up,
        .${CSS_PREFIX}move-down {
            padding: 5px 8px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }

        .${CSS_PREFIX}move-up:disabled,
        .${CSS_PREFIX}move-down:disabled {
            background: #bdc3c7;
            cursor: not-allowed;
        }

        .${CSS_PREFIX}delete-btn {
            background: #e74c3c;
            padding: 5px 10px;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }

        .${CSS_PREFIX}add-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .${CSS_PREFIX}text-input,
        .${CSS_PREFIX}command-input {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }

        .${CSS_PREFIX}command-input {
            height: 80px;
            resize: vertical;
        }

        .${CSS_PREFIX}add-button {
            background: #2ecc71;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .${CSS_PREFIX}add-button:hover {
            background: #27ae60;
        }

        .${CSS_PREFIX}close-button {
            width: 100%;
            margin-top: 15px;
            padding: 10px;
            background: #95a5a6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    `);

    GM_registerMenuCommand('단축키 설정', openSettingsModal);
    renderShortcutBar();
})();