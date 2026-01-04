// ==UserScript==
// @name         Chess courtesy
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  On lichess.org, says "Good game" to the opponent, when you lose or draw a game.
// @author       lichess.org/@/thibault
// @include      /^https://lichess\.org\/(\w{8}|\w{12})$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391392/Chess%20courtesy.user.js
// @updateURL https://update.greasyfork.org/scripts/391392/Chess%20courtesy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // feel free to change this list! Always be super nice.
    const messages = [
        "Twas a joy.",
        "That was no mere game",
        "Serotonin has been released",
        "The battle of Helm's Deep is over; the battle for Middle Earth is about to begin.",
        "An enlightening game.",
        "The acquisition of knowledge has been achieved ",
        "Some challenging positions",
        "Now that took character.",
        "Ah, I'm back to my comfort zone.",
    ];

    window.lichess.pubsub.on('socket.in.endData', d => {
        const input = document.querySelector('.mchat__say');
        const loser = d.winner == 'white' ? 'black' : 'white';
        if (input && (!d.winner || document.querySelector('.cg-wrap.manipulable.orientation-' + loser))) setTimeout(() => {
            input.value = messages[Math.floor(Math.random() * messages.length)];
            input.dispatchEvent(new KeyboardEvent('keypress', {'keyCode':13, 'which':13}));
        }, 1000);
    });
})();