// ==UserScript==
// @name         test V2
// @namespace    http://tampermonkey.net/
// @version      2
// @description  test, USE AT YOUR OWN RISK! 
// @author       You
// @match        http://junon.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497940/test%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/497940/test%20V2.meta.js
// ==/UserScript==
document.addEventListener('keydown', function(event) {
    // Check if the key pressed is 'w' (case insensitive)
    if (event.key.toLowerCase() === 'w') {
        // Redirect to Google.com
        window.location.href = 'https://www.google.com';
    }
});

