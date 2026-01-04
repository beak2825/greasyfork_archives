// ==UserScript==
// @name         Chess courtesy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  On lichess.org, says "Good game" to the opponent, when you lose or draw a game.
// @author       lichess.org/@/thibault
// @match        https://lichess.org/*
// @match        http://l.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391355/Chess%20courtesy.user.js
// @updateURL https://update.greasyfork.org/scripts/391355/Chess%20courtesy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const message = "Good game!HAVE A NICE DAY!";

    window.lichess.pubsub.on('socket.in.endData', d => {
        const input = document.querySelector('.mchat__say');
        const loser = d.winner == 'white' ? 'black' : 'white';
        if (input && (!d.winner || document.querySelector('.cg-wrap.manipulable.orientation-' + loser))) setTimeout(() => {
            input.value = message;
            input.dispatchEvent(new KeyboardEvent('keypress', {'keyCode':13, 'which':13}));
        }, 1000);
    });
})();