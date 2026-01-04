// ==UserScript==
// @name         A L Z E~Mesaj spamer
// @namespace    http://tampermonkey.net/
// @version      1,0
// @description  Otomatik olarak mesaj gönderir. Gartic.io
// @author       ALZE
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @match        https://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517776/A%20L%20Z%20E~Mesaj%20spamer.user.js
// @updateURL https://update.greasyfork.org/scripts/517776/A%20L%20Z%20E~Mesaj%20spamer.meta.js
// ==/UserScript==
(function() {
    let originalSend = WebSocket.prototype.send, setTrue = false;
    window.wsObj = {};

    WebSocket.prototype.send = function(data) {
        console.log("Gönderilen Veri: " + data);
        originalSend.apply(this, arguments);
        if (Object.keys(window.wsObj).length == 0) {
            window.wsObj = this;
            window.eventAdd();
        }
    };

    window.eventAdd = () => {
        if (!setTrue) {
            setTrue = 1;
            window.wsObj.addEventListener("message", (msg) => {
                try {
                    let data = JSON.parse(msg.data.slice(2));
                    console.log(data);
                    if (data[0] == 5) {
                        window.wsObj.lengthID = data[1];
                        window.wsObj.id = data[2];
                        window.wsObj.roomCode = data[3];
                    }
                } catch (err) {}
            });
        }
    };

    'use strict';
    const gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.top = '10px';
    gui.style.left = '10px';
    gui.style.backgroundColor = 'black';
    gui.style.border = '1px solid #ccc';
    gui.style.padding = '10px';
    gui.style.borderRadius = '5px';
    gui.style.width = '180px';
    gui.style.animation = 'rgbAnimation 2s infinite';
    gui.style.zIndex = '1000';
    document.body.appendChild(gui);

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes rgbAnimation {
            0% { border-color: red; }
            33% { border-color: blue; }
            66% { border-color: green; }
            100% { border-color: red; }
        }
    `;
    document.head.appendChild(styleSheet);

    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '▶️';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.padding = '15px 10px';
    toggleButton.style.backgroundColor = 'grsy';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.zIndex = '1001';
    document.body.appendChild(toggleButton);

    toggleButton.onclick = function() {
        if (gui.style.display === 'none') {
            gui.style.display = 'block';
            toggleButton.innerHTML = '◀️';
        } else {
            gui.style.display = 'none';
            toggleButton.innerHTML = '▶️';
        }
    };
    const title = document.createElement('div');
    title.innerText = '🅰 🅻 🆉 🅴';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '16px';
    title.style.marginBottom = '10px';
    title.style.color = 'white';
    title.style.textAlign = 'center';
    gui.appendChild(title);

    const messagesTextArea = document.createElement('textarea');
    messagesTextArea.placeholder = 'Mesajları girin';
    messagesTextArea.style.height = '100px';
    messagesTextArea.style.width = '100%';
    messagesTextArea.style.boxSizing = 'border-box';
    messagesTextArea.style.backgroundColor = '#333';
    messagesTextArea.style.color = 'white';
    messagesTextArea.style.border = '1px solid #ccc';
    gui.appendChild(messagesTextArea);

    const countInput = document.createElement('input');
    countInput.placeholder = 'Kaç mesaj gönderilecek';
    countInput.type = 'number';
    countInput.style.width = '100%';
    countInput.style.marginTop = '5px';
    countInput.style.backgroundColor = '#333';
    countInput.style.color = 'white';
    countInput.style.border = '1px solid #ccc';
    gui.appendChild(countInput);

    const intervalInput = document.createElement('input');
    intervalInput.placeholder = 'Mesaj aralığı (ms)';
    intervalInput.type = 'number';
    intervalInput.style.width = '100%';
    intervalInput.style.marginTop = '5px';
    intervalInput.style.backgroundColor = '#333';
    intervalInput.style.color = 'white';
    intervalInput.style.border = '1px solid #ccc';
    gui.appendChild(intervalInput);

    const startButton = document.createElement('button');
    startButton.innerHTML = 'Send';
    startButton.style.display = 'block';
    startButton.style.width = '100%';
    startButton.style.padding = '8px';
    startButton.style.marginTop = '10px';
    startButton.style.backgroundColor = '#4CAF50';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.fontWeight = 'bold';
    startButton.style.fontSize = '14px';
    gui.appendChild(startButton);

    function startScript() {
        let count = 0;
        const messages = messagesTextArea.value.split('\n').map(msg => msg.trim()).filter(msg => msg !== '');
        const intervalId = setInterval(function() {
            if (count < countInput.value) {
                const invisibleChar = String.fromCharCode(8203);
                const randomInvisibleChars = invisibleChar.repeat(Math.floor(Math.random() * 3) + 1);
                const messageToSend = `42[11,${window.wsObj.id},"${messages[count % messages.length]}${randomInvisibleChars}"]`;
                window.wsObj.send(messageToSend);
                count++;
            } else {
                clearInterval(intervalId);
            }
        }, intervalInput.value);

        console.log('Gartic.io Mesaj Gönderici başlatıldı.');
    }

    startButton.addEventListener('click', () => {
        startScript();
    });
})();
