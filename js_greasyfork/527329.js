// ==UserScript==
// @name         Добавляет смайлик в сообщение, в быстрый ответ
// @version      1.2
// @namespace    awaw https://lolz.live/andrey
// @description  добавляет смайлик в сообщение специально для Сильвестра
// @author       awaw
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527329/%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D1%8F%D0%B5%D1%82%20%D1%81%D0%BC%D0%B0%D0%B9%D0%BB%D0%B8%D0%BA%20%D0%B2%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%2C%20%D0%B2%20%D0%B1%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/527329/%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D1%8F%D0%B5%D1%82%20%D1%81%D0%BC%D0%B0%D0%B9%D0%BB%D0%B8%D0%BA%20%D0%B2%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%2C%20%D0%B2%20%D0%B1%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82.meta.js
// ==/UserScript==

//фиксированный эмодзи который будет вставляться - можно поставить любой другой
const fixedEmoji = ':pepesmile:'; //вместо :pepesmile: вписываете любой другой смайл, либо что-то своё, главное кавычки оставить

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
        textbox.addEventListener(
            "keydown",
            (event) => {
                if (event.repeat === false && event.key === "Enter" && !event.ctrlKey && !event.shiftKey) {
                    event.preventDefault();
                    insertFixedEmoji(textbox);
                }
            },
            true
        );

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