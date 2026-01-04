// ==UserScript==
// @name         Instagram Virus Link Killer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Checking and modifying high-risk links in Twitter
// @author       SKW_Official_2
// @match        *://*.x.com/*
// @match        *://*.twitter.com/*
// @grant        none
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/494956/Instagram%20Virus%20Link%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/494956/Instagram%20Virus%20Link%20Killer.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function checkAndModifyLinks() {
        const links = document.querySelectorAll('a');

        links.forEach(link => {
            const href = link.href;
            const textContent = link.textContent;

            if (!textContent.includes(" [Dangerous Link]")) {
                if (textContent.includes("l.instagram.com")) {
                    if (textContent.includes("business.instagram.com") || textContent.includes("www.facebook.com/ads")) {
                        link.style.color = "red";
                        link.textContent += " [Dangerous Link]";
                        link.href = "http://127.0.0.1";
                    }
                }
            }
        });
    }

    const observer = new MutationObserver(checkAndModifyLinks);

    observer.observe(document.body, { childList: true, subtree: true });

    checkAndModifyLinks();
})();