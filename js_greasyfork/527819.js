// ==UserScript==
// @name         Nitro Type NTPD1 Link and Hide Class Tab
// @namespace    https://www.ntpd1.com
// @version      4.7
// @description  This Script adds a menu bar option to open NTPD1 in a new tab between Leagues and Team, and hides the Class tab on Nitro Type.
// @author       [NTPD1]Captain.Loveridge // adapted from Ginfino's Code
// @match        https://www.nitrotype.com/team/NTPD1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527819/Nitro%20Type%20NTPD1%20Link%20and%20Hide%20Class%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/527819/Nitro%20Type%20NTPD1%20Link%20and%20Hide%20Class%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to open NTPD1 site in a new tab
    function openNTPD1Site(event) {
        event.preventDefault();
        window.open('https://www.ntpd1.com', '_blank');
    }

    // Function to hide the Class tab
    function hideClassTab() {
        const classTab = Array.from(document.querySelectorAll('.nav-list-item')).find(item => item.textContent.trim() === 'Class');
        if (classTab) {
            classTab.style.display = 'none';
        }
    }

    // Add NTPD1 tab button to original page and hide Class tab
    function insertNTPD1Button() {
        const navList = document.querySelector('.nav-list');
        if (navList && !document.querySelector('.nt-custom-tab-ntpd1')) {
            // Hide Class tab
            hideClassTab();

            const li = document.createElement('li');
            li.className = 'nav-list-item nt-custom-tab-ntpd1';
            li.innerHTML = `
                <a href="https://www.ntpd1.com"
                   class="nav-link"
                   id="ntpd1Link_unique"
                   target="_blank">
                    NTPD1
                </a>
            `;

            // Find the "Leagues" and "Team" buttons
            const leaguesButton = Array.from(navList.children).find(child => child.textContent.trim() === 'Leagues');
            const teamButton = Array.from(navList.children).find(child => child.textContent.trim() === 'Team');

            // Insert the new button between "Leagues" and "Team"
            if (leaguesButton && teamButton) {
                navList.insertBefore(li, teamButton);
            } else {
                // Fallback: insert at the end if buttons not found
                navList.appendChild(li);
            }

            // Add click event listener
            document.getElementById('ntpd1Link_unique').addEventListener('click', openNTPD1Site);
        }
    }

    // Initialize with MutationObserver
    function init() {
        const observer = new MutationObserver((mutations, obs) => {
            const navList = document.querySelector('.nav-list');
            if (navList) {
                insertNTPD1Button();
                obs.disconnect(); // Stop observing once button is inserted and Class tab is hidden
            }
        });

        // Start observing the document with the configured parameters
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Run init when the document is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
