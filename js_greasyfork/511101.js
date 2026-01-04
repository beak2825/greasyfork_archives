// ==UserScript==
// @name         [LZT] Insert Random Emoji
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Inserts a random emoji at the end of the message.
// @author       You
// @match        https://zelenka.guru/threads/*
// @match        https://lolz.guru/threads/*
// @match        https://lolz.live/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/511101/%5BLZT%5D%20Insert%20Random%20Emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/511101/%5BLZT%5D%20Insert%20Random%20Emoji.meta.js
// ==/UserScript==


const emojis = JSON.parse(localStorage.xf_lzt_fe_smilies).ac.map(smile => smile.value);
shuffleArray(emojis);


function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function waitForElement(node, selector, callback) {
    const observer = new MutationObserver((mutations, obs) => {
        console.log(mutations);
        const element = node.querySelector(selector);
        if (element) {
            callback(element);
            obs.disconnect();
        }
    });

    observer.observe(node, { childList: true, subtree: true });
}


function insertRandomEmoji(textbox) {
    var oldHTML = textbox.lastChild.innerHTML;
    if (oldHTML.endsWith("<br>")) {
        textbox.lastChild.innerHTML = `${oldHTML.slice(0, -4)} ${getRandomEmoji()}<br>`;
    } else {
        textbox.lastChild.innerHTML = `${oldHTML} ${getRandomEmoji()}`;
    }
}


function getRandomEmoji() {
    const rndIndex = Math.floor(Math.random() * emojis.length);
    return emojis[rndIndex];
}



(function () {
    'use strict';

    const editor = document.querySelector("div.defEditor");
    waitForElement(editor, "div.fr-element.fr-view", (textbox) => {
        textbox.addEventListener(
            "keydown",
            (event) => {
                if (event.repeat == false && event.key == "Enter" && event.ctrlKey) {
                    insertRandomEmoji(textbox);
                }
            },
            true
        );

        const sendMessageButton = editor.querySelector("div.sendMessageContainer > button.lzt-fe-se-sendMessageButton");
        sendMessageButton.addEventListener(
            "click",
            (event) => {
                if (event.detail === 1) {
                    insertRandomEmoji(textbox);
                }
            },
            true
        );
    });

})();