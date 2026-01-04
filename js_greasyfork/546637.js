// ==UserScript==
// @name         çük ölçer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gartic.io da bir kişinin yada sizin çükünüzü ölçer. /çük ölçme veya /çük ölçme İsim yazabilirsiniz.
// @author       187
// @match        https://gartic.io/*
// @icon         https://r.resimlink.com/i8LC3wl.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546637/%C3%A7%C3%BCk%20%C3%B6l%C3%A7er.user.js
// @updateURL https://update.greasyfork.org/scripts/546637/%C3%A7%C3%BCk%20%C3%B6l%C3%A7er.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let originalSend = WebSocket.prototype.send;
    let wsObj = null;
    let myId = null;

    WebSocket.prototype.send = function(data) {
        originalSend.apply(this, arguments);
        if (!wsObj) {
            wsObj = this;
            wsObj.addEventListener("message", (msg) => {
                try {
                    let data = JSON.parse(msg.data.slice(2));
                    if (data[0] == 5) {
                        wsObj.id = data[2];
                        myId = data[2];
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
        const randomCount = Math.floor(Math.random() * 187) + 10;
        return `${prefix} c=3 ${randomCount}cm`;
    };

    const handleMessage = (text, authorId) => {
        if (authorId === myId) return;

        if (text.includes('/çük ölçme')) {
            if (text.toLowerCase().includes("atatürk")) {
                sendMessage("ÖLÇMEYE METRE BULUNAMADI! 1881 - ∞");
                return;
            }

            if (
                text.toLowerCase().includes("mal burak") ||
                text.toLowerCase().includes("escobar emir") ||
                text.toLowerCase().includes("mal aze")
            ) {
                sendMessage("la yokki amk QWERGUREWQGJREWFJFWEFHJGEFWH");
                return;
            }

            const parts = text.split('/çük ölçme');
            const prefix = (parts.length > 1 && parts[1].trim().length > 0)
                ? `${parts[1].trim()} kişisinin çükü işte bu kadar cm`
                : "kendi çükünü ölçtün ve bu çıktı";

            sendMessage(generateMessage(prefix));
        }
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.classList && node.classList.contains("msg")) {
                    const text = node.innerText.trim();
                    let authorNode = node.querySelector(".author");
                    let authorId = authorNode ? authorNode.getAttribute("data-id") : null;
                    handleMessage(text, authorId);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
