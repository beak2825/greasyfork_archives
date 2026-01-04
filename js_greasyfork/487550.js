// ==UserScript==
// @name         ssrmovies.rent auto-skip
// @version      1.1
// @description  autoclick the buttons for the link shortener used in ssrmovies.rent
// @author       Rust1667
// @match        https://blogging.techworldx.net/*
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/487550/ssrmoviesrent%20auto-skip.user.js
// @updateURL https://update.greasyfork.org/scripts/487550/ssrmoviesrent%20auto-skip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkElementVisible = element => element !== null && !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);


    function waitForAndClickElement(selector) {
        const interval = setInterval(function() {
            const element = document.querySelector(selector);
            if (checkElementVisible(element)) {
                const style = element.getAttribute('style');
                if (!style || !style.includes('display:none')) {
                    clearInterval(interval);
                    element.click();
                }
            }
        }, 1000); // Check every second
    }

    waitForAndClickElement('.wait > center:nth-child(1) > img:nth-child(1)');
    waitForAndClickElement('#generater > img:nth-child(1)');
    waitForAndClickElement('#showlink');

})();
