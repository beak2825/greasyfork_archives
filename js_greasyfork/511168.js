// ==UserScript==
// @name         çük ölçer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Gartic.io da bir kişinin yada sizin çükünüzü ölçer tek yapmanız gereken sohbete /çük ölçme yada /çük ölçme yazarak yanına herhangi bir isim ekleyebilirsiniz(iconda sorun olmuş 2 ay sonra farkediyorum) 
// @author       187
// @match        https://gartic.io/*
// @icon         https://r.resimlink.com/i8LC3wl.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511168/%C3%A7%C3%BCk%20%C3%B6l%C3%A7er.user.js
// @updateURL https://update.greasyfork.org/scripts/511168/%C3%A7%C3%BCk%20%C3%B6l%C3%A7er.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let originalSend = WebSocket.prototype.send;
    let wsObj = null;
    let processedMessages = new Set();

    WebSocket.prototype.send = function(data) {
        originalSend.apply(this, arguments);
        if (!wsObj) {
            wsObj = this;
            wsObj.addEventListener("message", (msg) => {
                try {
                    let data = JSON.parse(msg.data.slice(2));
                    if (data[0] == 5) {
                        wsObj.lengthID = data[1];
                        wsObj.id = data[2];
                        wsObj.roomCode = data[3];
                    }
                } catch (err) {}
            });
        }
    };

    const sendMessage = (message) => {
        if (wsObj) {
            wsObj.send(`42[11,${wsObj.id},"${message}"]`);
        }
    };

    const generateMessage = (prefix) => {
        const randomCount = Math.floor(Math.random() * 18) + 3;
        return `${prefix} c${'='.repeat(randomCount)}3 ${randomCount}cm`;
    };

    const checkMessages = () => {
        document.querySelectorAll('.msg').forEach(msg => {
            const text = msg.innerText;
            if (text.includes('/çük ölçme') && !processedMessages.has(text)) {
                processedMessages.add(text);
                const parts = text.split('/çük ölçme');
                const prefix = (parts.length > 1 && parts[1].trim().length > 0) ? `${parts[1].trim()} kişisinin çükü işte bu kadar cm` : "kendi çükünü ölçtün ve bu çıktı";
                sendMessage(generateMessage(prefix));
            }
        });
    };

    setInterval(checkMessages, 1000);
})();
