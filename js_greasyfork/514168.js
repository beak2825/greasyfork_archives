// ==UserScript==
// @name         Karsanji Error Checker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect if the URL contains "karsanji"
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514168/Karsanji%20Error%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/514168/Karsanji%20Error%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the URL contains "karsanji"
    if (window.location.href.includes('karsanj')) {
        document.body.innerHTML = ""; // Clear the body content
        setTimeout(() => {
            alert('سامانه به علت شلوغی به مشکل خورده است. لطفا ساعاتی دیگر مجدد تلاش کنید');
            window.location.href = 'about:blank'; // Redirect to a blank page
        }, 100); // Adjust the delay as needed
    }
})();
