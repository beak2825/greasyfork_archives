// ==UserScript==
// @name         Squabbles.io Scroll-to-Top Button
// @namespace  https://github.com/waaamb/userscripts
// @version      0.2.1
// @description  Adds a button to every page to take you back up to the top.
// @author       Waaamb
// @match        *://*.squabbles.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=squabbles.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468601/Squabblesio%20Scroll-to-Top%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/468601/Squabblesio%20Scroll-to-Top%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* Settings */
    /* These are settings variables to enable features.
    /* Keep in mind they'll be erased if the script is updated.              */

    const btnScrollToTopSize = '3rem';

    // Some constants
    const app = document.querySelector('#app');

    function addBtnScrollToTop () {

        // Create the scroll-to-top button...
        let newBtnScrollToTop = document.createElement('button');
        newBtnScrollToTop.id = 'btnScrollToTop';
        const btnClasses = ['btn', 'btn-lg', 'rounded-circle', 'btn-secondary',
                         'position-fixed', 'bottom-0', 'end-0', 'm-3'];
        newBtnScrollToTop.classList.add(...btnClasses);

        // ...and add its icon
        let newBtnScrollToTopIcon = document.createElement('i');
        const iconClasses = ['fa-solid', 'fa-up'];
        newBtnScrollToTopIcon.classList.add(...iconClasses);
        newBtnScrollToTop.appendChild(newBtnScrollToTopIcon);

        // Add it to the DOM
        document.body.appendChild(newBtnScrollToTop);

        // Style the button *after* it's been messed with by the DOM
        const btnScrollToTop = document.querySelector("#btnScrollToTop");
        btnScrollToTop.style.display = 'none';
        btnScrollToTop.style.width = btnScrollToTopSize;
        btnScrollToTop.style.height = btnScrollToTopSize;
        btnScrollToTop.style.padding = '0';
        const btnScrollToTopIcon = btnScrollToTop.querySelector('i');
        btnScrollToTopIcon.style.margin = 'auto';
        btnScrollToTop.addEventListener('click', function() {
            app.scrollTo({top: 0, left: 0, behavior: 'smooth'});
        });

        // Show the button after the page is scrolled down a little
        app.onscroll = function () {
            if (app.scrollTop > 20) {
                btnScrollToTop.style.display = 'flex';
            }
            else {
                btnScrollToTop.style.display = 'none';
            }
        };
    }

    addBtnScrollToTop();
})();