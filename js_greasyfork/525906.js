// ==UserScript==
// @name         Wikipedia - Keep style preferences in incognito
// @version      2025-02-04.3
// @description  Immediately apply the user's style preferences in incognito sessions, for a seamless experience, without needing to manually set them every time.
// @author       jackiechan285
// @match        https://*.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        GM_cookie
// @namespace    https://greasyfork.org/en/scripts/525906-wikipedia-keep-style-preferences-in-incognito
// @downloadURL https://update.greasyfork.org/scripts/525906/Wikipedia%20-%20Keep%20style%20preferences%20in%20incognito.user.js
// @updateURL https://update.greasyfork.org/scripts/525906/Wikipedia%20-%20Keep%20style%20preferences%20in%20incognito.meta.js
// ==/UserScript==

/*
When you open Wikipedia in incognito, you have to manually set the styles to your preferences all over again, which may be annoying if done multiple times.

This script does it automatically, instantly, at first run, with no reload required.

It directly changes the cookie responsible for the style preferences and changes the style preference classes to apply them immediately because the changes to the cookie only take effect after reloading.

The cookies are necessary because the class changes alone do not get saved.

This is done only once per session, so it won't affect performance or be redundant. It also allows the user to change the preferences further on, and they won't be overwritten.

It sets a flag on localStorage to indicate the cookie has already been overwritten, to ensure it's only done once per session
*/

(function() {
    'use strict';

    // Get the language subdomain dynamically
    const langSubdomain = window.location.hostname.split('.')[0];
    const cookieName = `${langSubdomain}wikimwclientpreferences`;

    // Check if the script has already run in this session
    if (localStorage.getItem('cookieModified') === 'true') {
        return; // Exit if already modified
    }

    const newCookieValue = "skin-theme-clientpref-night%2Cvector-feature-limited-width-clientpref-0%2Cvector-feature-custom-font-size-clientpref-0%2Cvector-feature-appearance-pinned-clientpref-0";

    // Check if the cookie exists
    GM_cookie.list({ name: cookieName }, function(cookies, error) {
        if (error) {
            console.error('Error retrieving cookies:', error);
            return;
        }

        if (!cookies || cookies.length === 0) {
            console.log(`Cookie ${cookieName} does not exist. Creating it.`);
        } else {
            console.log(`Cookie ${cookieName} exists. Updating it.`);
        }

        // Set or update the cookie
        GM_cookie.set({
            name: cookieName,
            value: newCookieValue,
            path: '/',
            secure: true,
            expirationDate: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // Expires in 1 day
        }, function(error) {
            if (error) {
                console.error('Error setting cookie:', error);
            } else {
                console.log(`Cookie ${cookieName} set successfully.`);
            }
        });

        // Set a flag in localStorage to indicate the script has run
        localStorage.setItem('cookieModified', 'true');
    });

    // Replace specific classes in HTML elements
    const replaceClasses = () => {
        const elements = document.querySelectorAll('*');
        elements.forEach((element) => {
            element.classList.forEach((className) => {
                if (className.includes('vector-feature-limited-width-clientpref-')) {
                    element.classList.replace(className, 'vector-feature-limited-width-clientpref-0');
                }
                if (className.includes('vector-feature-custom-font-size-clientpref-')) {
                    element.classList.replace(className, 'vector-feature-custom-font-size-clientpref-0');
                }
                if (className.includes('skin-theme-clientpref-')) {
                    element.classList.replace(className, 'skin-theme-clientpref-night');
                }
                if (className.includes('vector-feature-appearance-pinned-clientpref-')) {
                    element.classList.replace(className, 'vector-feature-appearance-pinned-clientpref-0');
                }
            });
        });
    };

    // Run the class replacement
    replaceClasses();
})();
