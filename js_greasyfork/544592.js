// ==UserScript==
// @name         Torn Floating Text Panel
// @namespace    http://tampermonkey.net/
// @version      1.5
// @license      MIT
// @description  A movable panel to manage text Copy Paste Format with fill feature.
// @author       NootNoot4 [3754506]
// @match        *://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544592/Torn%20Floating%20Text%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/544592/Torn%20Floating%20Text%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION --- //
    const defaultMessages = [
        {
            label: 'Open Bazaar With Xan',
            text: `[S]BAZAAR OPEN!!
sell cheap 🧸🌺💿🔋 in my bazaar under MV ⬇️.
💊xan 813k💊
Check it in here
https://t.ly/Xn9mV`
        },
        {
            label: 'Buy Items',
            text: `[B] 💿dvd🔋cans
flw🌸plsh🧸alc🍺etc 96% MV
xan 800k
Mug free!
Price
https://t.ly/4cdiZ
Trade
https://t.ly/PA6v6`
        }
    ];
    const TORN_ICON_SVG = `<svg viewbox="0 0 24 24" width="20" height="20" fill="white" style="display: block;"><path d="M3 3h18v4H3z M10 8h4v13h-4z"></path></svg>`;
    // --- UPDATED: More reliable selector for the chat's send button ---
    const CHAT_SEND_BUTTON_SELECTOR = 'button[class*="iconWrapper___tyRRU"]';

    // --- SCRIPT STATE --- //
    let messages = [];
    let mainContainer, floatingButton;
    let isMinimized = false;
    let isDragging = false;
    let rfcvToken = null;

    // Intercept network requests to capture the live rfcv token
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0] instanceof Request ? args[0].url : args[0];
        if (typeof url === 'string' && url.includes('rfcv=')) {
            const match = url.match(/rfcv=([a-zA-Z0-9]+)/);
            if (match && match[1]) { rfcvToken = match[1]; }
        }
        return originalFetch.apply(this, args);
    };
    const originalXhrOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(...args) {
        const url = args[1];
        if (typeof url === 'string' && url.includes('rfcv=')) {
            const match = url.match(/rfcv=([a-zA-Z0-9]+)/);
            if (match && match[1]) { rfcvToken = match[1]; }
        }
        return originalXhrOpen.apply(this, args);
    };

    // --- HELPER FUNCTIONS --- //

    function showFlashMessage(text, isError = false, duration = 2500) {
        const flashDiv = document.createElement('div');
        flashDiv.textContent = text;
        Object.assign(flashDiv.style, {
            position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
            padding: '12px 20px', borderRadius: '8px',
            backgroundColor: isError ? '#f44336' : '#4CAF50', color: 'white',
            zIndex: '99999999', fontSize: '16px', fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)', opacity: '0',
            transition: 'opacity 0.4s ease-in-out'
        });
        document.body.appendChild(flashDiv);
        setTimeout(() => flashDiv.style.opacity = '1', 10);
        setTimeout(() => {
            flashDiv.style.opacity = '0';
            setTimeout(() => flashDiv.remove(), 400);
        }, duration);
    }

    function simulateUserInput(textarea, text) {
        const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = textarea.value.substring(0, start) + text + textarea.value.substring(end);
        nativeTextareaValueSetter.call(textarea, newText);
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
    }

    function openModal(message = null, index = null) {
        const isEditing = message !== null;
        const backdrop = document.createElement('div');
        Object.assign(backdrop.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: '9999990'
        });
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '90%', maxWidth: '500px', background: '#282c34', color: 'white',
            borderRadius: '8px', padding: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            display: 'flex', flexDirection: 'column', gap: '10px', zIndex: '9999991'
        });
        const labelInput = document.createElement('input');
        if (!isEditing) {
            labelInput.placeholder = 'Enter Label for new button...';
            Object.assign(labelInput.style, { padding: '10px', fontSize: '14px', border: '1px solid #555', borderRadius: '5px', background: '#333', color: 'white' });
            modal.appendChild(labelInput);
        }
        const textArea = document.createElement('textarea');
        textArea.value = isEditing ? message.text : '';
        textArea.placeholder = 'Enter text to copy...';
        textArea.maxLength = 125;
        Object.assign(textArea.style, { width: '100%', height: '200px', boxSizing: 'border-box', fontSize: '14px', fontFamily: 'monospace', padding: '10px', background: '#333', color: 'white', border: '1px solid #555' });
        const charCounter = document.createElement('div');
        Object.assign(charCounter.style, { textAlign: 'right', fontSize: '12px', color: '#aaa', fontFamily: 'monospace', marginTop: '-5px' });
        const updateCounter = () => {
            const currentLength = textArea.value.length;
            charCounter.textContent = `${currentLength} / 125`;
            charCounter.style.color = currentLength >= 125 ? '#f44336' : '#aaa';
        };
        textArea.addEventListener('input', updateCounter);
        const buttonDiv = document.createElement('div');
        Object.assign(buttonDiv.style, { display: 'flex', justifyContent: 'flex-end', gap: '10px' });
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        Object.assign(saveButton.style, { padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' });
        saveButton.onclick = async () => {
            if (isEditing) messages[index].text = textArea.value;
            else {
                const newLabel = labelInput.value.trim();
                if (!newLabel) { alert('Label cannot be empty.'); return; }
                messages.push({ label: newLabel, text: textArea.value });
            }
            await GM_setValue('savedMessages', JSON.stringify(messages));
            showFlashMessage('Saved successfully!');
            backdrop.remove();
            renderUI();
        };
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        Object.assign(cancelButton.style, { padding: '10px 20px', background: '#888', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' });
        cancelButton.onclick = () => backdrop.remove();
        buttonDiv.append(cancelButton, saveButton);
        modal.append(textArea, charCounter, buttonDiv);
        backdrop.append(modal);
        document.body.append(backdrop);
        updateCounter();
        (isEditing ? textArea : labelInput).focus();
    }

    function makeDraggable(element, handle, storageKey) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.addEventListener('mousedown', dragStart);
        handle.addEventListener('touchstart', dragStart, { passive: false });

        function dragStart(e) {
            isDragging = false;
            if (e.type === 'touchstart') {
                pos3 = e.touches[0].clientX;
                pos4 = e.touches[0].clientY;
            } else {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
            }
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('touchend', dragEnd);
            document.addEventListener('mousemove', elementDrag);
            document.addEventListener('touchmove', elementDrag, { passive: false });
        }

        function elementDrag(e) {
            e.preventDefault();
            isDragging = true;
            let clientX, clientY;
            if (e.type.includes('touch')) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            pos1 = pos3 - clientX;
            pos2 = pos4 - clientY;
            pos3 = clientX;
            pos4 = clientY;

            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;

            const screenW = window.innerWidth;
            const screenH = window.innerHeight;
            const elemW = element.offsetWidth;
            const elemH = element.offsetHeight;

            if (newLeft < 0) newLeft = 0;
            if (newTop < 0) newTop = 0;
            if (newLeft + elemW > screenW) newLeft = screenW - elemW;
            if (newTop + elemH > screenH) newTop = screenH - elemH;

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
        }

        async function dragEnd() {
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchend', dragEnd);
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('touchmove', elementDrag);
            if (isDragging) {
                await GM_setValue(storageKey, JSON.stringify({ top: element.style.top, left: element.style.left }));
            }
            setTimeout(() => { isDragging = false; }, 0);
        }
    }

    // --- UI & VISIBILITY --- //

    function renderUI() {
        if (!mainContainer) return;
        mainContainer.innerHTML = '';

        const panelHeader = document.createElement('div');
        Object.assign(panelHeader.style, {
            padding: '10px 15px', backgroundColor: '#333', color: 'white', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center', cursor: 'move',
            borderTopLeftRadius: '8px', borderTopRightRadius: '8px', flexShrink: '0'
        });
        const title = document.createElement('span');
        title.textContent = 'Quick Text Panel';
        title.style.fontWeight = 'bold';

        const minimizeButton = document.createElement('button');
        minimizeButton.innerHTML = TORN_ICON_SVG;
        Object.assign(minimizeButton.style, {
            background: '#555', color: 'white', border: 'none', borderRadius: '50%',
            cursor: 'pointer', width: '28px', height: '28px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', transform: 'rotate(180deg)',
            transition: 'transform 0.3s ease-in-out'
        });
        minimizeButton.addEventListener('click', () => {
            if (isDragging) return;
            setTimeout(async () => {
                const currentPosition = { top: mainContainer.style.top, left: mainContainer.style.left };
                floatingButton.style.top = currentPosition.top;
                floatingButton.style.left = currentPosition.left;
                await GM_setValue('iconPosition', JSON.stringify(currentPosition));
                toggleMinimize(true);
            }, 0);
        });

        panelHeader.append(title, minimizeButton);
        mainContainer.appendChild(panelHeader);

        const contentWrapper = document.createElement('div');
        Object.assign(contentWrapper.style, { padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', flexGrow: '1' });

        messages.forEach((message, index) => {
            const card = document.createElement('div');
            Object.assign(card.style, { background: '#333', border: '1px solid #555', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' });

            const cardHeader = document.createElement('div');
            Object.assign(cardHeader.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #555', paddingBottom: '10px' });

            const cardLabel = document.createElement('span');
            cardLabel.textContent = message.label;
            Object.assign(cardLabel.style, { fontWeight: 'bold', fontSize: '16px' });

            const headerActions = document.createElement('div');
            Object.assign(headerActions.style, { display: 'flex', gap: '8px' });

            const editButton = document.createElement('button');
            editButton.textContent = '✏️';
            Object.assign(editButton.style, {
                background: '#555', color: 'white', border: 'none',
                borderRadius: '5px', cursor: 'pointer', width: '28px', height: '28px',
                fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            });
            editButton.onclick = () => openModal(message, index);

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '🗑️';
            Object.assign(deleteButton.style, {
                background: '#dc3545', color: 'white', border: 'none',
                borderRadius: '5px', cursor: 'pointer', width: '28px', height: '28px',
                fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            });
            deleteButton.onclick = async () => {
                if (confirm(`Are you sure you want to delete the message: "${message.label}"?`)) {
                    messages.splice(index, 1);
                    await GM_setValue('savedMessages', JSON.stringify(messages));
                    showFlashMessage('Message deleted.');
                    renderUI();
                }
            };

            headerActions.append(editButton, deleteButton);
            cardHeader.append(cardLabel, headerActions);

            const toolbar = document.createElement('div');
            Object.assign(toolbar.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
            const leftButtons = document.createElement('div');
            Object.assign(leftButtons.style, { display: 'flex', gap: '8px' });

            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            Object.assign(copyButton.style, { padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' });
            copyButton.onclick = () => navigator.clipboard.writeText(message.text).then(() => showFlashMessage(`Copied "${message.label}"!`)).catch(err => showFlashMessage('Failed to copy.', true));

            const fillButton = document.createElement('button');
            fillButton.textContent = 'Fill';
            Object.assign(fillButton.style, { padding: '5px 10px', background: '#6f42c1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' });
            fillButton.onclick = () => {
                const chatInput = document.querySelector('#chatRoot textarea');
                if (chatInput) {
                    simulateUserInput(chatInput, message.text);
                    showFlashMessage(`Filled chat with "${message.label}"!`);
                } else {
                    showFlashMessage('Torn chat input not found.', true);
                }
            };

            const sendButton = document.createElement('button');
            sendButton.textContent = 'Send';
            Object.assign(sendButton.style, { padding: '5px 10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' });
            sendButton.onclick = () => {
                const tornSendButton = document.querySelector(CHAT_SEND_BUTTON_SELECTOR);
                if (tornSendButton && !tornSendButton.disabled) {
                    tornSendButton.click();
                    showFlashMessage('Message sent!');
                } else {
                    showFlashMessage('Send button not found or is disabled.', true);
                }
            };

            leftButtons.append(copyButton, fillButton, sendButton);
            toolbar.append(leftButtons);

            const textPreview = document.createElement('pre');
            textPreview.textContent = message.text;
            Object.assign(textPreview.style, {
                margin: '0', padding: '10px', background: '#222', color: 'white',
                borderRadius: '5px', fontSize: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
            });
            card.append(cardHeader, toolbar, textPreview);
            contentWrapper.appendChild(card);
        });

        const bottomToolbar = document.createElement('div');
        Object.assign(bottomToolbar.style, { marginTop: '10px', display: 'flex', gap: '10px' });
        const addButton = document.createElement('button');
        addButton.textContent = 'Add New Message';
        Object.assign(addButton.style, { padding: '8px 10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', flexGrow: '1' });
        addButton.onclick = () => openModal();
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset All';
        Object.assign(resetButton.style, { padding: '8px 10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' });
        resetButton.onclick = async () => {
            if (confirm('Are you sure you want to reset everything? This will reset all text and panel positions.')) {
                await GM_setValue('savedMessages', JSON.stringify(defaultMessages));
                await GM_setValue('containerPosition', null);
                await GM_setValue('iconPosition', null);
                await GM_setValue('isMinimized', false);
                showFlashMessage('Reset complete. Reloading...');
                setTimeout(() => location.reload(), 1500);
            }
        };
        bottomToolbar.append(addButton, resetButton);
        contentWrapper.appendChild(bottomToolbar);
        mainContainer.appendChild(contentWrapper);
        makeDraggable(mainContainer, panelHeader, 'containerPosition');
    }

    async function toggleMinimize(minimize) {
        isMinimized = minimize;
        mainContainer.style.display = isMinimized ? 'none' : 'flex';
        floatingButton.style.display = isMinimized ? 'flex' : 'none';
        await GM_setValue('isMinimized', isMinimized);
    }

    async function initialize() {
        try {
            const initialRfcvMatch = document.documentElement.innerHTML.match(/var rfcv = "(\w+)"/);
            if (initialRfcvMatch && initialRfcvMatch[1]) { rfcvToken = initialRfcvMatch[1]; }
        } catch(e) { /* Fail silently */ }

        messages = JSON.parse(await GM_getValue('savedMessages', null)) || defaultMessages;
        isMinimized = await GM_getValue('isMinimized', false);

        mainContainer = document.createElement('div');
        Object.assign(mainContainer.style, {
            position: 'fixed', zIndex: '999990', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
            display: 'none', flexDirection: 'column', maxHeight: '85vh',
            background: 'rgba(15, 15, 15, 0.95)', width: '250px'
        });
        const savedPosition = JSON.parse(await GM_getValue('containerPosition', null));
        if (savedPosition) { mainContainer.style.top = savedPosition.top; mainContainer.style.left = savedPosition.left; }
        else { mainContainer.style.top = '80px'; mainContainer.style.left = '20px'; }

        floatingButton = document.createElement('button');
        floatingButton.innerHTML = TORN_ICON_SVG;
        Object.assign(floatingButton.style, {
            position: 'fixed', zIndex: '999990', background: '#333', border: '2px solid #555',
            color: 'white', borderRadius: '50%', cursor: 'pointer', width: '44px', height: '44px',
            display: 'none', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        });
        const iconSavedPosition = JSON.parse(await GM_getValue('iconPosition', null));
        if (iconSavedPosition) { floatingButton.style.top = iconSavedPosition.top; floatingButton.style.left = iconSavedPosition.left; }
        else { floatingButton.style.bottom = '20px'; floatingButton.style.left = '20px'; }

        floatingButton.addEventListener('click', () => {
            if (isDragging) return;
            setTimeout(async () => {
                const currentPosition = { top: floatingButton.style.top, left: floatingButton.style.left };
                mainContainer.style.top = currentPosition.top;
                mainContainer.style.left = currentPosition.left;
                await GM_setValue('containerPosition', JSON.stringify(currentPosition));
                toggleMinimize(false);
            }, 0);
        });
        makeDraggable(floatingButton, floatingButton, 'iconPosition');

        document.body.append(mainContainer, floatingButton);

        renderUI();
        toggleMinimize(isMinimized);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();