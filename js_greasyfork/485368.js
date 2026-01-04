// ==UserScript==
// @name         Auto Claim
// @namespace    Terminator.Scripts
// @version      0.4
// @description  Auto claim for stakecube.net/app/community
// @author       TERMINATOR
// @license      MIT
// @match        https://stakecube.net/app/community/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stakecube.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485368/Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/485368/Auto%20Claim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoClaim() {
        var int = setInterval(() => {
            var claimButtons = document.querySelectorAll('.btn.btn-success.btn-sm.btn-claim');
            claimButtons.forEach(function(button) {
                if (!button) {
                    clearInterval(int);
                    setTimeout(() => {
                        window.location.reload();
                    }, 60000 * 60 * 24);
                    return;
                }
                button.click();
            });
        }, 5000);
    }

    window.addEventListener('load', function() {
        autoClaim();
    });
})();
