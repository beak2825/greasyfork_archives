// ==UserScript==
// @name         Skip DiBa-Key check
// @version      0.1.1
// @description  skips the key check on ing-diba.de
// @author       noface
// @match        https://banking.ing-diba.de/app/login/loginProcess?*
// @grant        none
// @namespace https://greasyfork.org/users/160283
// @downloadURL https://update.greasyfork.org/scripts/35524/Skip%20DiBa-Key%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/35524/Skip%20DiBa-Key%20check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const key = '';
    const scriptName = 'Skip DiBa-Key check';
    const hitButton = function(el) {
        const num = parseInt(el.textContent);
        let reqNum = parseInt(key[num - 1]);
        if (reqNum === 0) {
            // key 0 is the last member of the target array
            reqNum = 10;
        }
        const keys = document.querySelectorAll('.diba-keypad__keyboard-key');
        const keyBoardkey = keys[reqNum - 1];
        keyBoardkey.click();
    };

    setTimeout(function() {
        if (!key) {
            console.log(`${scriptName}: No key to work with. Good bye.`);
            return;
        }
        if (document.querySelector('.feedbackPanelERROR')) {
            console.log(`${scriptName}: Found an error on the page. Good bye.`);
            return;
        }
        const activeButtons = document.querySelectorAll('.active');
        Array.prototype.slice.call(activeButtons).forEach((el) => {
            hitButton(el);
        });
        document.querySelector('.button-primary--login').click();
    });
})();
