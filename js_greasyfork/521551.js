// ==UserScript==
// @name         Discord DM Sender with Input Box and Toggle
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Send DM messages via Discord API with toggle visibility, customizable button names, and instructions. Supports "Shift + Enter" for new line and "Enter" for sending messages.
// @author       Your Name
// @match        https://discord.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      You can modify as long as you credit me
// @downloadURL https://update.greasyfork.org/scripts/521551/Discord%20DM%20Sender%20with%20Input%20Box%20and%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/521551/Discord%20DM%20Sender%20with%20Input%20Box%20and%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isBoxVisible = GM_getValue('isBoxVisible', true);
    let isTokenVisible = GM_getValue('isTokenVisible', true);
    let areChannelsVisible = GM_getValue('areChannelsVisible', true);
    let channelId = '';

    const initialWidth = '280px';
    const initialHeight = '500px';

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.left = '10px';
    container.style.backgroundColor = '#2f3136';
    container.style.color = '#ffffff';
    container.style.padding = '10px';
    container.style.borderRadius = '5px';
    container.style.zIndex = '1000';
    container.style.width = initialWidth;
    container.style.height = initialHeight;
    container.style.maxHeight = '90vh';
    container.style.overflow = 'auto';
    container.style.display = isBoxVisible ? 'block' : 'none';
    document.body.appendChild(container);

    makeElementDraggable(container);

    const hideTokenButton = document.createElement('button');
    hideTokenButton.innerText = isTokenVisible ? 'Hide Token' : 'View Token';
    hideTokenButton.style.marginBottom = '10px';
    hideTokenButton.style.width = '100%';
    hideTokenButton.style.backgroundColor = '#575757';
    hideTokenButton.style.color = '#ffffff';
    hideTokenButton.style.border = 'none';
    hideTokenButton.style.borderRadius = '3px';
    hideTokenButton.style.cursor = 'pointer';
    hideTokenButton.addEventListener('click', () => {
        isTokenVisible = !isTokenVisible;
        GM_setValue('isTokenVisible', isTokenVisible);
        tokenBox.style.display = isTokenVisible ? 'block' : 'none';
        hideTokenButton.innerText = isTokenVisible ? 'Hide Token' : 'View Token';
    });
    container.appendChild(hideTokenButton);

    const tokenBox = document.createElement('textarea');
    tokenBox.placeholder = 'Enter your token';
    tokenBox.style.width = '100%';
    tokenBox.style.height = '40px';
    tokenBox.style.resize = 'none';
    tokenBox.style.backgroundColor = '#000000';
    tokenBox.style.color = '#00FF00';
    tokenBox.style.display = isTokenVisible ? 'block' : 'none';
    tokenBox.value = GM_getValue('tokenBoxValue', '');
    tokenBox.addEventListener('input', () => {
        GM_setValue('tokenBoxValue', tokenBox.value);
    });
    container.appendChild(tokenBox);

    const toggleChannelsButton = document.createElement('button');
    toggleChannelsButton.innerText = areChannelsVisible ? 'Hide Channel IDs' : 'View Channel IDs';
    toggleChannelsButton.style.marginTop = '10px';
    toggleChannelsButton.style.width = '100%';
    toggleChannelsButton.style.backgroundColor = '#575757';
    toggleChannelsButton.style.color = '#ffffff';
    toggleChannelsButton.style.border = 'none';
    toggleChannelsButton.style.borderRadius = '3px';
    toggleChannelsButton.style.cursor = 'pointer';
    toggleChannelsButton.addEventListener('click', () => {
        areChannelsVisible = !areChannelsVisible;
        GM_setValue('areChannelsVisible', areChannelsVisible);
        channelBoxes.forEach((channelBox) => {
            channelBox.style.display = areChannelsVisible ? 'block' : 'none';
        });
        toggleChannelsButton.innerText = areChannelsVisible ? 'Hide Channel IDs' : 'View Channel IDs';
    });
    container.appendChild(toggleChannelsButton);

    const channelBoxes = [];
    const channelBoxPlaceholders = [
        '荒らし雑談用匿名BOTのDMチャンネルIDを入力',
        '情勢雑談用BOTの匿名BOTのDMチャンネルIDを入力',
        '依頼支部用匿名BOTのDMチャンネルIDを入力'
    ];

    channelBoxPlaceholders.forEach((placeholder, index) => {
        const channelBox = document.createElement('textarea');
        channelBox.placeholder = placeholder;
        channelBox.style.width = '100%';
        channelBox.style.height = '40px';
        channelBox.style.resize = 'none';
        channelBox.style.backgroundColor = '#000000';
        channelBox.style.color = '#00FF00';
        channelBox.style.display = areChannelsVisible ? 'block' : 'none';
        channelBox.value = GM_getValue(`channelBox${index + 1}Value`, '');
        channelBox.addEventListener('input', () => {
            GM_setValue(`channelBox${index + 1}Value`, channelBox.value);
        });
        channelBoxes.push(channelBox);
        container.appendChild(channelBox);
    });

    const inputBox = document.createElement('textarea');
    inputBox.placeholder = 'Enter message (⚠️：初回はcaptchaにかかる事がある為、初回送信時はbotに1回手動でDMを送ってから使用してください。DMチャンネルIDはBOT IDではありません)';
    inputBox.style.width = '100%';
    inputBox.style.height = '100px';
    inputBox.style.resize = 'none';
    inputBox.style.backgroundColor = '#000000';
    inputBox.style.color = '#00FF00';
    inputBox.style.marginTop = '10px';
    inputBox.value = GM_getValue('inputBoxValue', '');
    inputBox.addEventListener('input', () => {
        GM_setValue('inputBoxValue', inputBox.value);
    });
    inputBox.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); 
            
            const token = tokenBox.value.trim();
            if (!token) {
                alert('Token is required');
                return;
            }

            const message = inputBox.value.trim();
            if (!message) {
                alert('Message cannot be empty');
                return;
            }

            sendMessage(channelId, message, token).then((success) => {
                if (success) {
                    inputBox.value = '';
                    GM_setValue('inputBoxValue', '');
                } else {
                    alert('Failed to send message');
                }
            });
        }
    });
    container.appendChild(inputBox);

    const selectChannelsLabel = document.createElement('div');
    selectChannelsLabel.innerText = 'Select channels';
    selectChannelsLabel.style.marginTop = '10px';
    selectChannelsLabel.style.marginBottom = '5px';
    selectChannelsLabel.style.fontSize = '14px';
    selectChannelsLabel.style.textAlign = 'left';
    container.appendChild(selectChannelsLabel);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';

    const buttonNames = ['荒らし雑談', '情勢雑談', '依頼支部'];

    channelBoxes.forEach((channelBox, index) => {
        const channelButton = document.createElement('button');
        channelButton.innerText = buttonNames[index];
        channelButton.style.width = '30%';
        channelButton.style.backgroundColor = '#575757';
        channelButton.style.color = '#ffffff';
        channelButton.style.border = 'none';
        channelButton.style.borderRadius = '3px';
        channelButton.style.cursor = 'pointer';
        channelButton.addEventListener('click', () => {
            channelId = channelBox.value.trim();
            updateButtonStyles(channelButton);
        });
        buttonContainer.appendChild(channelButton);
    });

    function updateButtonStyles(activeButton) {
        Array.from(buttonContainer.children).forEach((button) => {
            button.style.backgroundColor = button === activeButton ? '#047500' : '#575757';
        });
    }

    container.appendChild(buttonContainer);

    const sendButton = document.createElement('button');
    sendButton.innerText = 'Send DM';
    sendButton.style.marginTop = '10px';
    sendButton.style.width = '100%';
    sendButton.style.backgroundColor = '#575757';
    sendButton.style.color = '#ffffff';
    sendButton.style.border = 'none';
    sendButton.style.borderRadius = '3px';
    sendButton.style.cursor = 'pointer';
    sendButton.addEventListener('click', async () => {
        const token = tokenBox.value.trim();
        if (!token) {
            alert('Token is required');
            return;
        }

        const message = inputBox.value.trim();
        if (!message) {
            alert('Message cannot be empty');
            return;
        }

        const success = await sendMessage(channelId, message, token);
        if (success) {
            inputBox.value = '';
            GM_setValue('inputBoxValue', '');
        } else {
            alert('Failed to send message');
        }
    });
    container.appendChild(sendButton);

    const toggleImage = document.createElement('img');
    toggleImage.src = 'https://i.imgur.com/FL6WD8a.png';
    toggleImage.style.position = 'fixed';
    toggleImage.style.width = '30px';
    toggleImage.style.height = '30px';
    toggleImage.style.cursor = 'pointer';
    toggleImage.style.zIndex = '1001';
    toggleImage.style.left = '175px';
    toggleImage.style.top = '0px';
    document.body.appendChild(toggleImage);

    toggleImage.addEventListener('click', () => {
        isBoxVisible = !isBoxVisible;
        GM_setValue('isBoxVisible', isBoxVisible);
        container.style.display = isBoxVisible ? 'block' : 'none';
    });

    function makeElementDraggable(el) {
        el.onmousedown = function(event) {
            if (event.target.tagName === 'TEXTAREA') return;

            event.preventDefault();

            let shiftX = event.clientX - el.getBoundingClientRect().left;
            let shiftY = event.clientY - el.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                const newLeft = Math.min(Math.max(0, pageX - shiftX), window.innerWidth - el.offsetWidth);
                const newTop = Math.min(Math.max(0, pageY - shiftY), window.innerHeight - el.offsetHeight);

                el.style.left = `${newLeft}px`;
                el.style.top = `${newTop}px`;
            }

            function stopDragging() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', stopDragging);
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', stopDragging);
        };

        el.ondragstart = function() {
            return false;
        };
    }

    async function sendMessage(channelId, message, token) {
        const nonce = generateNonce();
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://discord.com/api/v9/channels/${channelId}/messages`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                data: JSON.stringify({
                    content: message,
                    flags: 0,
                    nonce: nonce,
                    tts: false
                }),
                onload: (response) => {
                    resolve(response.status === 200);
                },
                onerror: () => resolve(false)
            });
        });
    }

    function generateNonce() {
        const now = Date.now();
        return `${now}${Math.floor(Math.random() * 1000)}`;
    }
})();