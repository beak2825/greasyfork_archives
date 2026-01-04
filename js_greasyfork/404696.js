// ==UserScript==
// @name         Plex auto-skip intro
// @namespace    https://greasyfork.org/en/users/555204-bcldvd
// @version      0.2
// @description  Automatically press the Plex "Skip intro" button when it appears.
// @author       David Boclé
// @match        https://app.plex.tv/desktop
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/404696/Plex%20auto-skip%20intro.user.js
// @updateURL https://update.greasyfork.org/scripts/404696/Plex%20auto-skip%20intro.meta.js
// ==/UserScript==

(function() {
    let element = document.getElementById('plex');
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(mutation.addedNodes.length > 0 && mutation.addedNodes[0] && mutation.addedNodes[0].innerText == 'SKIP INTRO') {
                setTimeout(() => {
                    mutation.addedNodes[0].firstChild.click()
                }, 1000);
            }
        });
    });
    observer.observe(element, { childList: true, subtree: true });
})();