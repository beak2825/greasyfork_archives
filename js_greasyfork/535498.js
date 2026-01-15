// ==UserScript==
// @name         Pixel Games SpammerBot
// @namespace    http://tampermonkey.net/
// @version      1.31.1
// @license      Spaimic
// @description  Spam Every Pixel Game with this.
// @match        https://pixelplanet.fun/
// @match        https://pixmap.fun/
// @match        https://pixelya.fun/
// @match        https://pixunivers.fun/

// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535498/Pixel%20Games%20SpammerBot.user.js
// @updateURL https://update.greasyfork.org/scripts/535498/Pixel%20Games%20SpammerBot.meta.js
// ==/UserScript==

(function () {
    const panel = document.createElement('div');
    panel.id = 'myStyledPanel';

    panel.innerHTML = `
    <div class='header'>
        <button id='dragHandle' title='Drag Panel'>&#9776;</button>
        <span class='title'>Spam-Bot Control Panel</span>
    </div>
    <div class='content'>
        <label for='spamInput'><strong>Message to Send:</strong></label>
        <input type='text' placeholder='Type your message...' id='spamInput'/>
        <label for='speedInput'><strong>Messages Per Second (ms):</strong></label>
        <input type='number' id='speedInput' value='40' min='10'/>
        <label for='antiSpamCheckbox'>
            <input type='checkbox' id='antiSpamCheckbox'/> Enable Anti-Mute
        </label>
        <button id='toggleSpam' class='spamButton'>Start Spam</button>
    </div>
    `;

    Object.assign(panel.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '300px',
        backgroundColor: '#2c3e50',
        color: '#ecf0f1',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        fontFamily: 'Arial, sans-serif',
        zIndex: 9999,
        padding: '10px',
        userSelect: 'none'
    });

    const style = document.createElement('style');
    style.textContent = `
        #myStyledPanel .header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        #myStyledPanel #dragHandle {
            background: #34495e;
            border: none;
            border-radius: 4px;
            width: 30px;
            height: 30px;
            font-size: 18px;
            color: #ecf0f1;
            cursor: move;
            margin-right: 10px;
            transition: background 0.2s;
        }
        #myStyledPanel #dragHandle:hover {
            background: #3b5998;
        }
        #myStyledPanel .title {
            font-size: 1.2em;
            font-weight: bold;
        }
        #myStyledPanel .content {
            display: flex;
            flex-direction: column;
        }
        #myStyledPanel label {
            margin-top: 8px;
            font-size: 0.9em;
        }
        #myStyledPanel input[type='text'],
        #myStyledPanel input[type='number'] {
            padding: 6px;
            margin-top: 4px;
            border-radius: 4px;
            border: none;
            outline: none;
        }
        #myStyledPanel input[type='text']:focus,
        #myStyledPanel input[type='number']:focus {
            box-shadow: 0 0 3px #2980b9 inset;
        }
        #myStyledPanel input[type='checkbox'] {
            margin-right: 6px;
        }
        #myStyledPanel .spamButton {
            margin-top: 12px;
            padding: 8px;
            background: #2980b9;
            border: none;
            border-radius: 4px;
            color: #ecf0f1;
            font-size: 1em;
            cursor: pointer;
            transition: background 0.2s;
        }
        #myStyledPanel .spamButton:hover {
            background: #3498db;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(panel);

    // Drag logic
    const dragHandle = document.getElementById('dragHandle');
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        e.preventDefault();
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            panel.style.left = e.clientX - offsetX + 'px';
            panel.style.top = e.clientY - offsetY + 'px';
            panel.style.bottom = 'auto';
            panel.style.right = 'auto';
        }
    });

    // Message sending logic
    const toggleButton = document.getElementById('toggleSpam');
    const messageInput = document.getElementById('spamInput');
    const speedInput = document.getElementById('speedInput');
    const antiSpamCheckbox = document.getElementById('antiSpamCheckbox');
    let intervalId = null;
    let active = false;

    toggleButton.addEventListener('click', () => {
        if (!active) {
            const speed = parseInt(speedInput.value, 10) || 1000;
            active = true;
            toggleButton.textContent = 'Stop Spamming';
            intervalId = setInterval(() => {
                const chatInput = document.querySelector('.chatinput input');
                const sendButton = document.getElementById('sendbtn');
                if (chatInput && sendButton) {
                    let message = messageInput.value || '𒐫𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫 𒐫𒐫𒐫  𒐫𒐫𒐫 𒐫';
                    if (antiSpamCheckbox.checked) {
                        const randStr = Math.random().toString(36).substring(2, 8);
                        message += ' ' + randStr;
                    }
                    chatInput.value = message;
                    sendButton.click();
                }
            }, speed);
        } else {
            active = false;
            toggleButton.textContent = 'Start Spam';
            clearInterval(intervalId);
        }
    });
})();
