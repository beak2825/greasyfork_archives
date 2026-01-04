// ==UserScript==
// @name         NewCP Play Now!
// @icon         https://cdn2.steamgriddb.com/icon/e5860ae00103b3869a25d940345bf0fd.png
// @version      0.1
// @description  Replace the "Download App" button with "Play Now!" button on NewCP.net!
// @author       Dragon9135
// @match        https://newcp.net/*
// @license MIT
// @grant        none
// @namespace https://greasyfork.org/users/1372128
// @downloadURL https://update.greasyfork.org/scripts/509877/NewCP%20Play%20Now%21.user.js
// @updateURL https://update.greasyfork.org/scripts/509877/NewCP%20Play%20Now%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Start actions after page load
    window.addEventListener('load', function() {
        // Select the element with the "Download App" button
        let downloadButton = document.querySelector('a[href="/download"]');

        if (downloadButton) {
            // The new "Play Now!" create button
            const newPlayButton = document.createElement('a');
            newPlayButton.href = "/plays?force=true#/login";
            newPlayButton.setAttribute('data-rr-ui-event-key', "/plays?force=true#/login");
            newPlayButton.classList.add('nav-link');
            newPlayButton.innerHTML = `
                <button type="submit" id="Navbar_download-btn__6D0hQ" class="btn btn-danger">
                    <div id="Navbar_download-text__FSfPd" style="border: none; position: unset;">Play Now!</div>
                </button>
            `;

            // Replace old button with new button
            downloadButton.replaceWith(newPlayButton);
        }
    }, false);
})();
