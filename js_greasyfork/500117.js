// ==UserScript==
// @name         Add Card ID Buttons to Scryfall pages
// @namespace    http://tampermonkey.net/
// @version      2024-06-29
// @description  Add buttons to copy the Scryfall card ID below each image.
// @author       Radaman
// @match        https://scryfall.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scryfall.com
// @grant        none
// @license      gpl-2.0
// @downloadURL https://update.greasyfork.org/scripts/500117/Add%20Card%20ID%20Buttons%20to%20Scryfall%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/500117/Add%20Card%20ID%20Buttons%20to%20Scryfall%20pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function add_id_button(card_grid_item) {
        let images = card_grid_item.querySelectorAll('img')
        if (images.length == 0) { return; }
        let image_url = images[0].src;
        let image_id = image_url.split('.jpg')[0].split('/');
        image_id = image_id[image_id.length - 1];
        var button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = 'Copy ID';
        button.className = 'button-n';
        button.style.left = '35%';
        button.style.marginTop = '10px';
        button.style.marginBottom = '20px';

        var toastmsg = document.createElement('div');
        toastmsg.id = 'mtoast';
        toastmsg.style.display = 'none';
        toastmsg.style.left = '50%';
        toastmsg.style.padding = '10px';
        toastmsg.style.border = '1px solid #c52828';
        toastmsg.style.background = '#A5D6A7';//'#ffebe1';
        toastmsg.style.border = '1px solid #000';

        button.onclick = function() {
            navigator.clipboard.writeText(image_id);
            toastmsg.innerHTML = 'Copied ' + image_id + ' to clipboard!';
            toastmsg.style.display = 'block';
            sleep(2000).then(() => { toastmsg.style.display = 'none'; });
        };
        card_grid_item.appendChild(button);
        card_grid_item.appendChild(toastmsg);
    }

    let cards = document.querySelectorAll('.card-grid-item');
    for (let i = 0; i < cards.length; i++) {
        add_id_button(cards[i]);
    }

})();