// ==UserScript==
//
// @license         MIT
// @name            Dark Mode
// @namespace       Violentmonkey Scripts
// @match           https://g.wildwest.gg/g/d893cd5b-68e2-46a4-a23d-9efb65a198dd*
// @match           https://g.wildwest.gg/g/beccb87f-c9ae-4cd6-bdc2-156e56a82da9*
// @grant           none
// @version         1.2
// @author          GameRoMan
// @description     Dark Mode for Emoji Arena
//
// @downloadURL https://update.greasyfork.org/scripts/513442/Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/513442/Dark%20Mode.meta.js
// ==/UserScript==


(function() {
    function ApplyDarkMode() {
        document.body.style.backgroundColor = '#000000';
        document.body.style.color = '#666666';

        document.getElementById('game-container').style.backgroundColor = '#111111';

        if (window.location.href === 'https://g.wildwest.gg/g/d893cd5b-68e2-46a4-a23d-9efb65a198dd') document.getElementById('popup').style.backgroundColor = '#111111';

        document.querySelectorAll('.page').forEach(element => {
            element.style.backgroundColor = '#222222';
        });

        document.querySelectorAll('h2').forEach(element => {
            element.style.color  = '#666666';
        });

        document.querySelectorAll('h3').forEach(element => {
            element.style.color  = '#666666';
        });

        document.querySelectorAll('p').forEach(element => {
            element.style.color  = '#666666';
        });

        document.querySelectorAll('button').forEach(button => {
            button.style.backgroundColor = '#333333';
            button.style.color = '#666666';
        });

        document.querySelectorAll('.character-block').forEach(button => {
            button.style.backgroundColor = '#111111';
        });

        document.querySelectorAll('.settings-label').forEach(button => {
            button.style.backgroundColor = '#111111';
        });

        document.querySelectorAll('.skill-btn').forEach(button => {
            button.style.backgroundColor = '#111111';
        });

        document.querySelectorAll('.battle-section').forEach(element => {
            element.style.backgroundColor = '#111111';
        });

        document.querySelectorAll('.guide-row').forEach(element => {
            element.style.backgroundColor = '#111111';
        });

        document.querySelectorAll('.guide-emoji').forEach(element => {
            element.style.backgroundColor = '#222222';
        });

        document.querySelectorAll('.achievement-row').forEach(element => {
            element.style.backgroundColor = '#111111';
        });

        document.querySelectorAll('.achievement-emoji').forEach(element => {
            element.style.backgroundColor = '#222222';
        });
    }

    document.querySelectorAll('#nav-buttons button').forEach(button => {
        button.addEventListener('click', ApplyDarkMode);
    });

    ApplyDarkMode();
})();
