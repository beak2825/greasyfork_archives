// ==UserScript==
// @name         hide underaged users (chat avenue)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  removes messages in chat-avenue.com's gay chat that are most likely coming from minors (and wierdos).
// @author       Dev'd
// @match        gaychat.chat-avenue.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chat-avenue.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469104/hide%20underaged%20users%20%28chat%20avenue%29.user.js
// @updateURL https://update.greasyfork.org/scripts/469104/hide%20underaged%20users%20%28chat%20avenue%29.meta.js
// ==/UserScript==

// large ty to https://github.com/KinkyDeveloper for ChatAf's code which helped me create this project

const filter = /[^0-9a-z]?1[^0-9a-z]?[0-7]|1[0-7]|i[^0-9a-z]?[0-7]|i[0-7]|\|[0-7]/gims

//var str = "ELLO IM LIKE | 3 PLS BAN ME" // testing regex
//console.log(filter.test(str)); // true

function handleChat() {
    var messages = document.getElementsByClassName('chat_message');

    message_loop:
    for (let message of messages) {
        if (message.getAttribute('handled')) {
            continue;
        }
        message.setAttribute('handled', true); //to stop unessesary checking
        var images = message.getElementsByClassName('chat_image');
        var message_box = message.parentElement.parentElement;
        var content = message.innerHTML.toLowerCase()

        if (images.length == 0){ //means not a image
            if (filter.test(content) == true) {
                message_box.remove()
                console.log("Blocked term found. Deleteing one message. \n" + content)
            }
        }
    }
}

setInterval(handleChat, 450);