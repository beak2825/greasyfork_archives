// ==UserScript==
// @name         Torn Crimes Scamming Quick
// @namespace    https://github.com/SOLiNARY
// @version      0.1.5
// @description  Makes clicks on response emojis do the respond attempt & hovering on them is like clicking on them.
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/loader.php?sid=crimes*
// @match        https://torn.com/loader.php?sid=crimes*
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507625/Torn%20Crimes%20Scamming%20Quick.user.js
// @updateURL https://update.greasyfork.org/scripts/507625/Torn%20Crimes%20Scamming%20Quick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isMobileView = window.innerWidth <= 784;

    function addHoverClickListener() {
        const buttons = document.querySelectorAll('div.crime-root.scamming-root button.response-type-button');
        buttons.forEach(button => {
            let clickEvent = new Event("click", {bubbles: true});
            button.addEventListener('click', function(event) {
                if (!event.isTrusted) {
                    return;
                }
                let responseBtn = event.target.parentNode.parentNode;
                if (!responseBtn.classList.contains('response-type-button-selected')){
                    responseBtn.classList.add('response-type-button-selected');
                    responseBtn.dispatchEvent(clickEvent);
                    return;
                }
                let commitBtn = event.target.parentNode.parentNode.parentNode.parentNode.querySelector('div[class*=commitButtonSection___] button.commit-button');
                commitBtn.dispatchEvent(clickEvent);
            });
            button.addEventListener('mouseover', function(event) {
                let responseBtn = event.target.parentNode.parentNode;
                if (responseBtn.classList.contains('response-type-button-selected') || responseBtn.getAttribute('aria-disabled') === 'true'){
                    return;
                }
                responseBtn.classList.add('response-type-button-selected');
                responseBtn.dispatchEvent(clickEvent);
            });
            button.addEventListener('mouseexit', function(event) {
                let responseBtn = event.target.parentNode.parentNode;
                responseBtn.classList.remove('response-type-button-selected');
            });
        });
    }

    if (isMobileView){
        console.log('[TornCrimesScammingQuick] Mobile view detected, script disabled');
        return;
    }

    const observer = new MutationObserver(addHoverClickListener);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    addHoverClickListener();
})();