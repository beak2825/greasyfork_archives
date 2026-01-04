// ==UserScript==
// @name         Facebook Switch to Classic
// @namespace    http://www.JamesKoss.com/
// @version      1.0
// @description  Automatically change into classic mode.
// @author       Phuein
// @match        https://www.facebook.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/411686/Facebook%20Switch%20to%20Classic.user.js
// @updateURL https://update.greasyfork.org/scripts/411686/Facebook%20Switch%20to%20Classic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var switched = false;

    function switchClassic() {
        if (switched) return;

        let button = document.querySelectorAll('[role="navigation"]')[1].firstElementChild.firstElementChild.firstElementChild.firstElementChild;

        if (button !== null) {
            button.click();

            setTimeout(() => {
                let index = Array.from(document.querySelectorAll('span'))
                .findIndex(el => el.textContent === 'Switch to Classic Facebook for 48 Hours');

                if (index) {
                    document.querySelectorAll('span')[index].click();

                    setTimeout(() => {
                        let i = Array.from(document.querySelectorAll('span'))
                        .findIndex(el => el.textContent === 'Skip');

                        if (i) {
                            document.querySelectorAll('span')[i].click();
                            switched = true;
                            console.log('Automatically switching to FB Classic...');
                        }
                    }, 500);
                }
            }, 500);
        }
    }

    //intercept url navigation by ajax
    window.addEventListener('locationchange', switchClassic);

    switchClassic();
})();