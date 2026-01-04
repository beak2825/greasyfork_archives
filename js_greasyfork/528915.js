// ==UserScript==
// @name         greassyfork button
// @namespace    https://greasyfork.org/en/scripts?q=nitrotype
// @version      1.2
// @description  This Script adds a menu bar option to open greasyfork
// @author       powahkat
// @match        https://www.nitrotype.com/garage
// @grant        none
// @icon         https://seeklogo.com/images/C/crown-logo-D8A8BC5802-seeklogo.com.png
// @downloadURL https://update.greasyfork.org/scripts/528915/greassyfork%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/528915/greassyfork%20button.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Function to open site in a new tab
    function openSite(event) {
        event.preventDefault();
        window.open('https://greasyfork.org/en/scripts?q=nitrotype', '_blank');
    }
 
    // Function to hide the Class tab
    function hideClassTab() {
        const classTab = Array.from(document.querySelectorAll('.nav-list-item')).find(item => item.textContent.trim() === 'Class');
        if (classTab) {
            classTab.style.display = 'none';
        }
    }
 
    // Add tab button to original page and hide Class tab
    function insertButton() {
        const navList = document.querySelector('.nav-list');
        if (navList && !document.querySelector('.nt-custom-tab-')) {
            // Hide Class tab
            hideClassTab();
 
            const li = document.createElement('li');
            li.className = 'nav-list-item nt-custom-tab-ntpd1';
            li.innerHTML = `
                <a href="https://greasyfork.org/en/scripts?q=nitrotype"
                   class="nav-link"
                   id="Link_unique"
                   target="_blank">
                    greasyfork
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
            document.getElementById('Link_unique').addEventListener('click', openSite);
        }
    }
 
    // Initialize with MutationObserver
    function init() {
        const observer = new MutationObserver((mutations, obs) => {
            const navList = document.querySelector('.nav-list');
            if (navList) {
                insertButton();
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