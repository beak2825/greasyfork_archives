// ==UserScript==
// @name         Snail IDE Header Customization
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Change the header color and logo on Snail IDE
// @author       You
// @match        https://www.snail-ide.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507199/Snail%20IDE%20Header%20Customization.user.js
// @updateURL https://update.greasyfork.org/scripts/507199/Snail%20IDE%20Header%20Customization.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change header color
    const header = document.querySelector('header');
    if (header) {
        header.style.backgroundColor = '#4E97FE';
    }

    // Replace logo with new image
    const logo = document.querySelector('header img'); // Adjust the selector if needed
    if (logo) {
        logo.src = 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Scratch_S.svg';
        logo.style.width = 'auto';  // Adjust the size if necessary
        logo.style.height = '50px'; // Adjust the height if necessary
    }
})();
