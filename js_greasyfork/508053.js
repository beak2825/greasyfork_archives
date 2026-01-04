// ==UserScript==
// @name         GC Cheat! Keyboard Controls
// @namespace    https://greasyfork.org/en/users/1175371
// @version      0.4
// @description  Add keyboard controls to GC's Cheat!
// @author       sanjix
// @match        https://www.grundos.cafe/games/cheat/play/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508053/GC%20Cheat%21%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/508053/GC%20Cheat%21%20Keyboard%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var dropdown = document.querySelector('main .select-wrapper select');
    document.addEventListener('keydown', () => {
        switch (event.key) {
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                dropdown.value = parseInt(event.key);
                break;
            case 'a':
                dropdown.value = 'Ace';
                break;
            case 'j':
                dropdown.value = 'Jack';
                break;
            case 'q':
                dropdown.value = 'Queen';
                break;
            case 'k':
                dropdown.value = 'King';
                break;
            case '0':
                dropdown.value = 10;
                break;
            case 'Enter':
                var go = document.querySelector('main input[value="Go!"]');
                var letSlide = document.querySelector('input[value="Let Slide"]');
                var cont = document.querySelector('input[value="Click to Continue"]');
                var restart = document.querySelector('input[value="Play Again"]');
                if (go != null) {
                    go.click();
                } else if (letSlide != null) {
                    letSlide.click();
                } else if (cont != null) {
                    cont.click();
                } else if (restart != null) {
                    restart.click();
                }
                break;
            case 'n':
                var accuse = document.querySelector('input[value="Accuse of Cheating"]');
                if (accuse != null) {
                    accuse.click();
                }
                break;
        }
    });
})();