// ==UserScript==
// @name         Bitcointalk - Hide User Profile Icons
// @version      0.1
// @description  Hides all the icons under the user profile (Visit Website, DM, Visit Profile)
// @author       TryNinja
// @match        https://bitcointalk.org/index.php?topic=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitcointalk.org
// @grant        none
// @namespace https://greasyfork.org/users/1070272
// @downloadURL https://update.greasyfork.org/scripts/465799/Bitcointalk%20-%20Hide%20User%20Profile%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/465799/Bitcointalk%20-%20Hide%20User%20Profile%20Icons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const dm = document.querySelectorAll("td.poster_info > div > a[href*='?action=pm;sa=send;u=']");
    const profile = document.querySelectorAll("td.poster_info > div > a[href*='?action=profile;u=']");
    const url = [...document.querySelectorAll("td.poster_info > div > a > img[src='https://bitcointalk.org/Themes/custom1/images/www_sm.gif'")].map(el => el.parentNode);
    const email = [...document.querySelectorAll("td.poster_info > div > a > img[src='https://bitcointalk.org/Themes/custom1/images/email_sm.gif'")].map(el => el.parentNode);

    [...dm, ...profile, ...url, ...email].forEach(el => el.remove());
})();