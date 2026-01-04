// ==UserScript==
// @name         Add 1.75x and 4x Speed Options
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add 1.75x and 4x speed options to Bilibili video player
// @author       AidenLu
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/493904/Add%20175x%20and%204x%20Speed%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/493904/Add%20175x%20and%204x%20Speed%20Options.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let optionAdded = false;
    let intervalId;

    function addSpeedOption() {
        let menu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
        console.log('Finding playback menu:', menu);

        if (menu && !optionAdded) {
            // Add 1.75x option
            let newItem1_75x = document.createElement('li');
            newItem1_75x.className = 'bpx-player-ctrl-playbackrate-menu-item';
            newItem1_75x.setAttribute('data-value', '1.75');
            newItem1_75x.textContent = '1.75x';

            // Add 4x option
            let newItem4x = document.createElement('li');
            newItem4x.className = 'bpx-player-ctrl-playbackrate-menu-item';
            newItem4x.setAttribute('data-value', '4');
            newItem4x.textContent = '4x';

            let item2x = menu.querySelector('[data-value="2"]');
            let item1_5x = menu.querySelector('[data-value="1.5"]');

            if (item2x && item1_5x) {
                // Insert 4x option above 2x
                menu.insertBefore(newItem4x, item2x);
                // Insert 1.75x option between 2x and 1.5x
                menu.insertBefore(newItem1_75x, item1_5x);
                console.log('4x and 1.75x options added.');

                optionAdded = true;
                clearInterval(intervalId);
            }
        }
    }

    window.addEventListener('load', () => {
        addSpeedOption();
        intervalId = setInterval(addSpeedOption, 1000);
    });
})();
