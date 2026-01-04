// ==UserScript==
// @name         Vim Movements
// @namespace    http://tampermonkey.net/
// @version      2024-06-01
// @description  vim movements
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/496990/Vim%20Movements.user.js
// @updateURL https://update.greasyfork.org/scripts/496990/Vim%20Movements.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.documentElement.style.scrollBehavior = 'smooth';
    console.log("vim motions loaded");
    const scrollAmt = 500;

    // define function to see if current element is a text box
    function checkTextBox() {
        const tag = document.activeElement.tagName;
        console.log(tag);
        if (tag == 'TEXTAREA' || tag == 'INPUT') {
            return true;
        }
        return false;
    }
    // functions for keys h, j, k, and l
    document.addEventListener('keypress', (event) => {
        if (!checkTextBox()) {
            if (event.key == 'j') {
                // document.activeElement.scrollBy(0, scrollAmt);
                window.scrollBy(0, scrollAmt);
            }
            else if (event.key == 'k') {
                // document.activeElement.scrollBy(0, scrollAmt);
                window.scrollBy(0, -scrollAmt);
            }
            else if (event.key == 'u') {
                history.go(-1);
            }
            else if (event.key == 'R' && event.shiftKey) {
                history.go(1);
            }

        }
    });
})();
