// ==UserScript==
// @name         SCROLL-TO-BOTTOM & SCROLL-TO-TOP
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  becomes a SCROLL-TO-BOTTOM when you reach page top and SCROLL-TO-TOP when you reach bottom
// @author       Noushad Bhuiyan
// @namespace    https://fiverr.com/web_coder_nsd
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481618/SCROLL-TO-BOTTOM%20%20SCROLL-TO-TOP.user.js
// @updateURL https://update.greasyfork.org/scripts/481618/SCROLL-TO-BOTTOM%20%20SCROLL-TO-TOP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check the current URL and decide where to insert the button
    const url = window.location.href;
    let buttonContainer;
    // Create a fixed position div for the button
    buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.bottom = '20px';
    buttonContainer.style.right = '20px';
    buttonContainer.style.listStyle = 'none';
    buttonContainer.style.zIndex = '9999';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.placeItems = 'center';
    document.body.appendChild(buttonContainer);

    // Create the button container list item
    const buttonListItem = document.createElement('li');
    buttonListItem.style.display = 'flex';

    const go2TopListCont = document.createElement('li');
    const goToTopButton = document.createElement('button');
    let go2Top = true;
    goToTopButton.style.marginRight = '8px';
    goToTopButton.style.background = "#77A398";
    goToTopButton.style.width = "32px";
    goToTopButton.style.height = "32px";
    goToTopButton.style.borderRadius = '50%';
    goToTopButton.style.justifyContent = 'center';
    goToTopButton.style.alignItems = 'center';
    goToTopButton.textContent = '↑';
    goToTopButton.addEventListener('click', () => {
        if (go2Top) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            goToTopButton.textContent = '↓';
            go2Top = false;
        } else {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            goToTopButton.textContent = '↑';
            go2Top = true;
        }
    });
    go2TopListCont.appendChild(goToTopButton);
    buttonContainer.appendChild(go2TopListCont);

    // Insert the button into the button container
    buttonContainer.appendChild(buttonListItem);

})();