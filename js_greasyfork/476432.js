// ==UserScript==
// @name         NakrutkaDetector3000
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  The script checks the stream for the presence of cheating viewers with https://check-bots.ru/ service.
// @author       erxson
// @license      MIT
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/476432/NakrutkaDetector3000.user.js
// @updateURL https://update.greasyfork.org/scripts/476432/NakrutkaDetector3000.meta.js
// ==/UserScript==

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        const observer = new MutationObserver((mutationsList, observer) => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

function rapapa() {
    waitForElement('h1.CoreText-sc-1txzju1-0', (element) => {
        const streamer = element.textContent;
        fetch(`https://checkbotsruserver.tk/?tw=${streamer}`)
            .then(response => response.json())
            .then(data => {
            const decision = data.decision;
            const chatters = data.chatters;
            const online = data.online;
            const text = `${decision ? "bad bro" : "real bro"} | ${chatters}/${online}`;
            waitForElement('#chat-room-header-label', (e) => {
                e.textContent = text;
            })
        })
            .catch(error => {
            console.error("ощибка:", error);
        });
    });
}

setInterval(rapapa, 30000);
rapapa();