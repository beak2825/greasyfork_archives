// ==UserScript==
// @name         Agma.io Random Nickname Generator
// @version      1.2
// @namespace    http://tampermonkey.net/
// @description  Generates a random nickname.
// @author       Peqne
// @match        https://agma.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461751/Agmaio%20Random%20Nickname%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/461751/Agmaio%20Random%20Nickname%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function generateNickname() {
    const adjectives = ['Toxic', 'Deadly', 'Venomous', 'Vicious', 'Hateful', 'Sinister', 'Malevolent', 'Malicious', 'Wicked', 'Nefarious', 'Brutal', 'Fierce', 'Ferocious', 'Merciless', 'Savage', 'Tyrannical', 'Dominant', 'Aggressive', 'Intimidating', 'Ruthless'];
    const animals = ['Shark', 'Tiger', 'Cobra', 'Lion', 'Viper', 'Hyena', 'Scorpion', 'Crocodile', 'Wolf', 'Spider', 'Panther', 'Gorilla', 'Bear', 'Hawk', 'Eagle', 'Rhino', 'Anaconda', 'Python', 'Boa', 'Jaguar'];
        const randomNumber1 = Math.floor(Math.random() * adjectives.length);
        const randomNumber2 = Math.floor(Math.random() * animals.length);
        return `${adjectives[randomNumber1]}${animals[randomNumber2]}`;
    }

    setInterval(() => {
        if (window.nick) {
            window.nick.value = generateNickname();
        }
    }, 5000);
})();
