// ==UserScript==
// @name         GC Add Volcano Plot Link
// @namespace     https://greasyfork.org/en/users/1291562-zarotrox
// @version      0.2
// @description  Adds a link to the volcano plot page on the Battledome Page
// @author       Zarotrox
// @icon         https://i.ibb.co/44SS6xZ/Zarotrox.png
// @match        https://www.grundos.cafe/dome/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507825/GC%20Add%20Volcano%20Plot%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/507825/GC%20Add%20Volcano%20Plot%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    function addLink() {
       
        var nav = document.querySelector('nav.center.margin-1[aria-label="Battledome Links"]');

        if (nav) {
            
            if (!nav.querySelector('a[href="https://www.grundos.cafe/dome/1p/select/?plot=volcano"]')) {
                
                var newLink = document.createElement('a');
                newLink.href = 'https://www.grundos.cafe/dome/1p/select/?plot=volcano'; // URL of the page you want to link to
                newLink.textContent = 'Volcano Plot'; // Text for the link
                newLink.style.marginLeft = '10px'; // Add margin to separate from other links
                newLink.style.textDecoration = 'none'; // Optional: remove underline

               
                nav.appendChild(newLink);
            }
        } else {
            console.log('Navigation bar not found.');
        }
    }

    
    setTimeout(addLink, 1); // Adjust delay as needed

    // Optional: Observe changes to the document and try adding the link again if necessary
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                addLink();
            }
        }
    });

    
    observer.observe(document.body, { childList: true, subtree: true });

})();