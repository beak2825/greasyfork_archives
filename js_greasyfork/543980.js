// ==UserScript==
// @name         THIS SCUCJS I DONTKNOW WHATM DOIN
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Clones logout button and places it in the left navbar
// @author       chitsil
// @match        https://toyhou.se/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543980/THIS%20SCUCJS%20I%20DONTKNOW%20WHATM%20DOIN.user.js
// @updateURL https://update.greasyfork.org/scripts/543980/THIS%20SCUCJS%20I%20DONTKNOW%20WHATM%20DOIN.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function moveRealLogoutToLeftNavbar() {
        const leftNavbar = document.querySelector('ul.navbar-nav.navbar-left');
        const dropdown = document.getElementById('dropdownProfile');

        if (!leftNavbar || !dropdown) return;

        // Already added? Don't duplicate.
        if (document.getElementById('vue-logout-left')) return;

        // Find the real logout <a>
        const realLogout = Array.from(dropdown.querySelectorAll('a.dropdown-item'))
            .find(a => a.textContent.trim().toLowerCase() === 'logout');

        if (!realLogout) return;

        // Clone the logout <a> to keep the Vue handler attached
        const logoutClone = realLogout.cloneNode(true);
        logoutClone.id = 'vue-logout-left';
        logoutClone.classList.add('nav-link');

        // Wrap in a <li> like the other nav items
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.appendChild(logoutClone);

        // Append to left navbar
        leftNavbar.appendChild(li);
    }

    const observer = new MutationObserver((_, obs) => {
        const dropdown = document.getElementById('dropdownProfile');
        if (dropdown) {
            moveRealLogoutToLeftNavbar();
            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();