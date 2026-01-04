// ==UserScript==
// @name         GeeksForGeeks Login Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get rid of login popup/blocking on GeeksForGeeks.
// @match        https://www.geeksforgeeks.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geeksforgeeks.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441427/GeeksForGeeks%20Login%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/441427/GeeksForGeeks%20Login%20Bypass.meta.js
// ==/UserScript==


var lastScrollPos = 0;
(function() {
    'use strict';

    // Your code here...
    let observer = new MutationObserver(reactToMutation);
    var domToWatch = document.querySelector('body')
    
    observer.observe(domToWatch, {
        characterDataOldValue: true, 
        subtree: true, 
        childList: true, 
        characterData: true
    });
})();

function reactToMutation(mutations) {
    mutations.forEach((mutation) => {
        let oldValue = mutation.oldValue;
        let newValue = mutation.target;
        if (oldValue !== newValue) {
            var spinnerLoadingOverlay = newValue.querySelector('div.spinner-loading-overlay')
            // spinner overlay is present and visible
            if(spinnerLoadingOverlay && spinnerLoadingOverlay.style.display === 'block') {
                // remove the annoying overlay
                spinnerLoadingOverlay.remove()
                // save scroll position, site brings you back to the top
                if(document.documentElement.scrollTop > 0) {
                    lastScrollPos = document.documentElement.scrollTop
                }
            }
            var loginModal = newValue.querySelector('div.login-modal-div')
            // login modal is present and visible
            if(loginModal && loginModal.style.display === 'block') {
                // remove login modal
                loginModal.remove()
                // remove css scrolling restriction
                var body = document.querySelector('body')
                body.style.position = 'relative'
                body.style.overflow = 'visible'
                // nullify scoll event listener that blocks you
                window.onscroll = null
                // scroll back to where you were
                if(lastScrollPos > 0) {
                    document.documentElement.scrollTo(0, lastScrollPos)
                }
            }
        }
    });
}

