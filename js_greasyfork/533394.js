// ==UserScript==
// @name         Achievements always visible
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make achievement button always visible
// @author       discord@celestial_raccoon_80621
// @match        diep.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533394/Achievements%20always%20visible.user.js
// @updateURL https://update.greasyfork.org/scripts/533394/Achievements%20always%20visible.meta.js
// ==/UserScript==

// body > app > screen-holder > home-screen > session-buttons
// and you gonna see "display: none;" at the top right of the screen


(() => {
    function transform() {
        const sessionButtons = document.getElementById('session-buttons')
        sessionButtons.style.display = 'flex'

        const rivetAuth = document.getElementById("rivet-auth-button");
        rivetAuth.style.display = "none";
        const viewFriends = document.getElementById("view-friends-button");
        viewFriends.style.display = "none";
    }

    function observeSessionButtons() {
        const sessionButtons = document.getElementById('session-buttons')

        if (sessionButtons) {
            transform();

        } else {
            const observer = new MutationObserver((mutations, obs) => {
                const sessionButtons = document.getElementById('session-buttons')
                if (sessionButtons) {
                    transform();
                    obs.disconnect()
                }
            })

            observer.observe(document.body, {
                childList: true,
                subtree: true
            })
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeSessionButtons)
    } else {
        observeSessionButtons()
    }
})();