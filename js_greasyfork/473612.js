// ==UserScript==
// @name         Grundo's Cheese Roller
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  For use in the Cheeseroller game. Automatically selects 'Push Cheese Faster' in the game. Spam Enter!
// @author       Gem
// @match        https://grundos.cafe/medieval/cheeseroller/
// @match        https://www.grundos.cafe/medieval/cheeseroller/
// @icon         https://www.grundos.cafe/static/images/favicon.66a6c5f11278.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/473612/Grundo%27s%20Cheese%20Roller.user.js
// @updateURL https://update.greasyfork.org/scripts/473612/Grundo%27s%20Cheese%20Roller.meta.js
// ==/UserScript==
/* globals $ */

(function() {
    'use strict';

     if (window.location.href.match('grundos.cafe/medieval/cheeseroller/')) {

         if (document.querySelector('[name="cheese_name"]')) {
             document.querySelector('[name="cheese_name"]').value = 'Spicy Juppie Cheese';
         }
         if (document.querySelector('[name="cheese_action"]')) {
             document.querySelector('[name="cheese_action"]').value = 2;
         }

         const submit = document.querySelector('form[action="/medieval/cheeseroller/"] input[type="submit"]');
         const playAgain = document.querySelector('.button-group button:first-child');

         document.addEventListener("keydown", (event) => {
             if (event.keyCode == 13) {
                 if (submit) submit.click();
                 else if (playAgain) playAgain.click();
             }
         });
    }
})();