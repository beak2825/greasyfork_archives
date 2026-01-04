// ==UserScript==
// @name         Append Hostname to Window Title
// @namespace    https://greasyfork.org/users/77886
// @version      0.5
// @description  Append the domain name of the site to the window title. Helps offer a hint to tools like AHK so that they can identify the site loaded.
// @author       muchtall
// @include      *://*/*
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420249/Append%20Hostname%20to%20Window%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/420249/Append%20Hostname%20to%20Window%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to ensure title element exists and append hostname
    function ensureTitleAndAppendHostname() {
        let titleElement = document.querySelector('title');
        if (!titleElement) {
            titleElement = document.createElement('title');
            document.head.appendChild(titleElement);
        }
        document.title = (document.title || 'Untitled') + " - (" + window.location.hostname + ")";
    }

    // Set the window title on page load
    window.addEventListener('load', ensureTitleAndAppendHostname);

    // Workaround for sites that change the title after page load
    setTimeout(function() {
        let target = document.querySelector('title');
        if (!target) {
            target = document.createElement('title');
            document.head.appendChild(target);
        }
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                const re = new RegExp(" - \\(" + window.location.hostname + "\\)$");
                if (!re.test(document.title)) {
                    console.log('Title before "%s"', document.title);
                    document.title = (document.title || 'Untitled') + " - (" + window.location.hostname + ")";
                    console.log('Title after "%s"', document.title);
                }
            });
        });
        const config = {
            childList: true,
        };
        observer.observe(target, config);
    }, 100);
})();