// ==UserScript==
// @name         Touchgrass caveats clearup
// @namespace    http://tampermonkey.net/
// @version      2024-03-20 1
// @description  Made for myself :)
// @author       @proneo
// @match        https://touchgrass-app.netlify.app/app
// @icon         https://touchgrass-app.netlify.app/images/loading.gif
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490339/Touchgrass%20caveats%20clearup.user.js
// @updateURL https://update.greasyfork.org/scripts/490339/Touchgrass%20caveats%20clearup.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // get rid of the ugly rectangle and make the div go upto max height
    window.addEventListener("load", () => {
        // wait for it to load ( 5s )
        setTimeout(() => {
            const elem = document.querySelector('#root div');
            elem.classList.add('absolute')
        }, 5000);
    })
    window.addEventListener("keydown", key => {
        // Shift + z
        if ( key.key == "Z" ) {
            const navBar = document.querySelector('#root div nav')
            if ( navBar.classList.contains('hidden') ) {
                navBar.classList.remove('hidden')
            } else {
                navBar.classList.add('hidden')
            }
        }
    })
})();