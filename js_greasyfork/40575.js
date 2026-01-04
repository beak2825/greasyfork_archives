// ==UserScript==
// @name         NO NOT YOU AGAIN
// @namespace    dannytech
// @version      1.0.0
// @description  If dannytech is in the server, send NO NOT YOU AGAIN messages
// @author       dannytech
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40575/NO%20NOT%20YOU%20AGAIN.user.js
// @updateURL https://update.greasyfork.org/scripts/40575/NO%20NOT%20YOU%20AGAIN.meta.js
// ==/UserScript==

// Change these to modify the behavior
let toSend = 4 // The amount of messages to send, or Infinity to just continually send them
let interval = 2000 // The amount of time between messages, in milliseconds
let noNotUAgain = [ // The messages
    "NO NOT YOU AGAIN",
    "I HATE YOU",
    "NO",
    "NOT YOU AGAIN",
    "NOT U AGAIN",
    "NO NOT YOU",
    "NO NOT U",
    "NOOOOOO",
    "I HATE U"
];

// The messy brains of the code
(function() {
    'use strict';

    let isFirstTime = true
    let count = 0
    let lastMessage

    setInterval(() => {
        gameObjects.forEach((cur) => {
            if (count < toSend && cur.type == 'player' && cur.account && (cur.account.user_name === 'dannytech' || cur.account.user_name === 'dannytechAlt') && (player.account && player.account.user_name !== 'dannytech' && player.account.user_name !== 'dannytechAlt')) {
                let message
                do {
                    message = noNotUAgain[Math.floor(Math.random() * noNotUAgain.length)] // Randomize the message to send
                } while (message === lastMessage)
                lastMessage = message
                if (isFirstTime) {
                    message = noNotUAgain[0]
                    isFirstTime = false
                }
                socket.emit('cht', message, '')
                count++
            }
        })
    }, interval)
})();