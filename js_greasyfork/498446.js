// ==UserScript==
// @name         EĞLENCE PANELİ
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Gartic.io oyununda otomatik olarak mesaj gönderir ve URL işlemleri yapar.
// @author       NEO
// @match        https://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498446/E%C4%9ELENCE%20PANEL%C4%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/498446/E%C4%9ELENCE%20PANEL%C4%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let originalSend = WebSocket.prototype.send;
    let intervalId = null;
    let chatIntervalId = null;
    let epilepsyIntervalId = null;
    let messageBoxes = [];
    const maxMessages = 3;
    window.wsObj = {};

    WebSocket.prototype.send = function(data) {
        originalSend.apply(this, arguments);
        if (!window.wsObj.id) {
            window.wsObj = this;
            window.wsObj.addEventListener("message", (msg) => {
                try {
                    let data = JSON.parse(msg.data.slice(2));
                    if (data[0] == 5) {
                        Object.assign(window.wsObj, { lengthID: data[1], id: data[2], roomCode: data[3] });
                    }
                } catch (err) {}
            });
        }
    };

    const addStyle = () => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbowGlow { 0%, 100% { box-shadow: 0 0 15px red; } 20% { box-shadow: 0 0 15px orange; } 40% { box-shadow: 0 0 15px yellow; } 60% { box-shadow: 0 0 15px green; } 80% { box-shadow: 0 0 15px blue; } }
            @keyframes rainbowText { 0%, 100% { color: red; } 20% { color: orange; } 40% { color: yellow; } 60% { color: green; } 80% { color: blue; } }
            .rainbowGlow { animation: rainbowGlow 3s infinite alternate; }
            .rainbowText { animation: rainbowText 3s infinite alternate; }
        `;
        document.head.appendChild(style);
    };

    const createButton = (text, className, clickHandler) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.classList.add('rainbowGlow');
        btn.style = `background-color: ${className}; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; margin-right: 10px;`;
        btn.addEventListener('click', clickHandler);
        return btn;
    };

    const createPanel = () => {
        const panel = document.createElement('div');
        panel.style = 'position: fixed; top: 70px; left: 10px; background-color: rgba(0, 0, 0, 0.8); color: white; padding: 20px; border-radius: 10px; display: none; z-index: 1000; width: 300px;';
        document.body.appendChild(panel);
        return panel;
    };

    const simulateClick = (element) => {
        const rect = element.getBoundingClientRect();
        const x = rect.left + (rect.width / 2);
        const y = rect.top + (rect.height / 2);

        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });

        element.dispatchEvent(clickEvent);
    };

    const toggleButton = document.createElement('div');
    toggleButton.style = 'position: fixed; top: 10px; left: 10px; width: 50px; height: 50px; background-color: black; color: red; border-radius: 10%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 24px;';
    toggleButton.classList.add('rainbowGlow');
    toggleButton.textContent = '❌';
    document.body.appendChild(toggleButton);

    const panel = createPanel();
    const title = document.createElement('div');
    title.textContent = 'Script Developer By Neo';
    title.classList.add('rainbowText');
    title.style.marginBottom = '10px';
    panel.appendChild(title);

    const messageInput = document.createElement('textarea');
    messageInput.placeholder = 'Göndermek istediğiniz mesaj';
    messageInput.style = 'width: 100%; margin-bottom: 10px; height: 30px;';
    panel.appendChild(messageInput);

    const startButton = createButton('Başlat', 'rainbowGlow', () => {
        const messages = [messageInput.value, ...messageBoxes.map(box => box.value)].filter(msg => msg.trim());
        if (!messages.length) return;

        const interval = messageBoxes.length ? 300 : 130;
        let count = 0;
        intervalId = setInterval(() => {
            const invisibleChar = String.fromCharCode(8203).repeat(Math.random() * 3 + 1);
            window.wsObj.send(`42[13,${window.wsObj.id},"${messages[count % messages.length]}${invisibleChar}"]`);
            count++;
        }, interval);
    });

    const stopButton = createButton('Dur', 'rainbowGlow', () => clearInterval(intervalId));
    panel.appendChild(startButton);
    panel.appendChild(stopButton);

    const addMessageButton = createButton('Mesaj Ekle', 'rainbowGlow', () => {
        if (messageBoxes.length >= maxMessages - 1) {
            alert('En fazla 3 mesaj gönderebilirsiniz');
            return;
        }

        const messageBoxContainer = document.createElement('div');
        messageBoxContainer.style = 'display: flex; align-items: center; margin-bottom: 10px; margin-top: 10px;';

        const newMessageBox = document.createElement('textarea');
        newMessageBox.placeholder = 'Ek mesaj';
        newMessageBox.style = 'flex-grow: 1; margin-right: 10px; height: 30px;';
        messageBoxContainer.appendChild(newMessageBox);

        const removeButton = createButton('✖', '#0000FF', () => {
            panel.removeChild(messageBoxContainer);
            messageBoxes = messageBoxes.filter(box => box !== newMessageBox);
        });
        messageBoxContainer.appendChild(removeButton);

        panel.appendChild(messageBoxContainer);
        messageBoxes.push(newMessageBox);
    });
    panel.appendChild(addMessageButton);

    // F5 Button
    const f5Button = createButton('F5', 'rainbowGlow', () => {
        const currentUrl = window.location.href;
        document.querySelector('#exit').click();
        const checkUrlChange = setInterval(() => {
            if (window.location.href !== currentUrl) {
                clearInterval(checkUrlChange);
                window.location.href = currentUrl;
                setTimeout(() => document.querySelector('.ic-playHome').click(), 2000);
            }
        }, 100);
    });
    panel.appendChild(f5Button);

    // Epilepsi Modu
    const epilepsyLabel = document.createElement('div');
    epilepsyLabel.textContent = 'Epilepsi Modu';
    epilepsyLabel.style = 'margin-top: 10px; color: white;';
    panel.appendChild(epilepsyLabel);

    const epilepsyButton = createButton('Off', 'rainbowGlow', () => {
        if (epilepsyButton.textContent === 'Off') {
            epilepsyButton.textContent = 'On';
            epilepsyButton.style.color = 'green';

            const blackColorDiv = document.querySelector('div.color.active[style*="background-color: rgb(0, 0, 0);"]');
            if (blackColorDiv) simulateClick(blackColorDiv);
            simulateClick(document.querySelector('li#op7.tool'));
            const eventsElement = document.querySelector('#events');
            if (eventsElement) simulateClick(eventsElement);

            epilepsyIntervalId = setInterval(() => {
                simulateClick(document.querySelector('li#undo'));
                setTimeout(() => simulateClick(document.querySelector('li#repeat')), 100);
            }, 200);
        } else {
            epilepsyButton.textContent = 'Off';
            epilepsyButton.style.color = 'red';
            clearInterval(epilepsyIntervalId);
        }
    });
    panel.appendChild(epilepsyButton);

    // Sohbet Mesajı
    const chatLabel = document.createElement('div');
    chatLabel.textContent = 'Sohbet Mesajı';
    chatLabel.style = 'margin-top: 10px; color: white;';
    panel.appendChild(chatLabel);

    const chatButton = createButton('Off', 'rainbowGlow', () => {
        if (chatButton.textContent === 'Off') {
            chatButton.textContent = 'On';
            chatButton.style.color = 'green';

            const messages = [messageInput.value, ...messageBoxes.map(box => box.value)].filter(msg => msg.trim());
            if (!messages.length) return;

            let count = 0;
            chatIntervalId = setInterval(() => {
                const invisibleChar = String.fromCharCode(8203).repeat(Math.random() * 3 + 1);
                window.wsObj.send(`42[11,${window.wsObj.id},"${messages[count % messages.length]}${invisibleChar}"]`);
                count++;
            }, 1000);
        } else {
            chatButton.textContent = 'Off';
            chatButton.style.color = 'red';
            clearInterval(chatIntervalId);
        }
    });
    panel.appendChild(chatButton);

    toggleButton.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    addStyle();
})();
