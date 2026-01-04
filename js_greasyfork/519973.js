// ==UserScript==
// @name         Neopets Quick Quests
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Open specific Neopets pages by right-clicking on quest descriptions or task descriptions.
// @author       BandanaWaddleDee24
// @match        *://www.neopets.com/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/519973/Neopets%20Quick%20Quests.user.js
// @updateURL https://update.greasyfork.org/scripts/519973/Neopets%20Quick%20Quests.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('contextmenu', (event) => {
        const target = event.target;

        if (!target || (!target.classList.contains('ql-quest-description') && !target.classList.contains('ql-task-description'))) {
            return;
        }

        let url = null;

        switch (target.textContent.trim()) {
            case 'Purchase Item(s)':
                url = 'https://www.neopets.com/generalstore.phtml?store_type=';
                break;
            case 'Spin the Wheel of Mediocrity':
                url = 'https://www.neopets.com/prehistoric/mediocrity.phtml';
                break;
            case 'Spin the Wheel of Excitement':
                url = 'https://www.neopets.com/faerieland/wheel.phtml';
                break;
            case 'Spin the Wheel of Knowledge':
                url = 'https://www.neopets.com/medieval/knowledge.phtml';
                break;
            case 'Spin the Wheel of Monotony':
                url = 'https://www.neopets.com/prehistoric/monotony.phtml';
                break;
            case 'Spin the Wheel of Misfortune':
                url = 'https://www.neopets.com/halloween/wheel/index.phtml';
                break;
            case 'Customise your Neopet':
                url = 'https://www.neopets.com/customise/?view=BlueowPenguin';
                break;
            case 'Play a game':
                url = 'https://www.neopets.com/games/h5game.phtml?game_id=1391';
                break;
            case 'Feed a Pet':
            case 'Feed your Neopet':
            case 'Groom a Pet':
                url = 'https://www.neopets.com/home/';
                break;
        }

        if (url) {
            event.preventDefault(); 
            window.open(url, '_blank');
        }
    });
})();
