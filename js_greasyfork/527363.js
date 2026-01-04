// ==UserScript==
// @name         пепа спешл для ВПН
// @version      1.3
// @namespace    awaw https://lolz.live/andrey
// @description  Добавляет :pepesmile: в сообщение при отправке
// @author       awaw
// @match        https://lolz.live/threads/*
// @match        https://zelenka.guru/threads/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527363/%D0%BF%D0%B5%D0%BF%D0%B0%20%D1%81%D0%BF%D0%B5%D1%88%D0%BB%20%D0%B4%D0%BB%D1%8F%20%D0%92%D0%9F%D0%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/527363/%D0%BF%D0%B5%D0%BF%D0%B0%20%D1%81%D0%BF%D0%B5%D1%88%D0%BB%20%D0%B4%D0%BB%D1%8F%20%D0%92%D0%9F%D0%9D.meta.js
// ==/UserScript==

const fixedEmoji = ':pepesmile:';

function waitForElement(node, selector, callback) {
    const observer = new MutationObserver((mutations, obs) => {
        const element = node.querySelector(selector);
        if (element) {
            callback(element);
            obs.disconnect();
        }
    });
    observer.observe(node, { childList: true, subtree: true });
}

function insertFixedEmoji(textbox) {
    var oldHTML = textbox.lastChild.innerHTML;
    if (oldHTML.endsWith("<br>")) {
        textbox.lastChild.innerHTML = `${oldHTML.slice(0, -4)} ${fixedEmoji}<br>`;
    } else {
        textbox.lastChild.innerHTML = `${oldHTML} ${fixedEmoji}`;
    }
}

(function () {
    'use strict';
    const editor = document.querySelector("div.defEditor");
    if (!editor) return;

    waitForElement(editor, "div.fr-element.fr-view", (textbox) => {

        const sendMessageButton = editor.querySelector("div.sendMessageContainer > button.lzt-fe-se-sendMessageButton");
        if (sendMessageButton) {
            sendMessageButton.addEventListener(
                "click",
                (event) => {
                    if (event.detail === 1) {
                        insertFixedEmoji(textbox);
                    }
                },
                true
            );
        }
    });
})();