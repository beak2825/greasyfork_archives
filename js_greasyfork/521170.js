// ==UserScript==
// @name         Redirect YouTube to Grayjay
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       Reed Hiland (https://hiland.dev/)
// @description  Redirect video clicks from m.youtube.com to Grayjay
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521170/Redirect%20YouTube%20to%20Grayjay.user.js
// @updateURL https://update.greasyfork.org/scripts/521170/Redirect%20YouTube%20to%20Grayjay.meta.js
// ==/UserScript==

(function() {
    'use strict';

document.addEventListener('click', function(e) {
    let target = e.target;
    while (target && target.tagName !== 'A') {
        target = target.parentNode;
    }

    if (target && target.href && target.href.includes('watch')) {
        e.preventDefault();
        e.stopPropagation();

        let fullURL = target.href.replace('m.youtube.com', 'www.youtube.com');
        const grayjayURL = "grayjay://video/" + fullURL;
        
        // Navigate to app URL
        window.location.href = grayjayURL;

        // Try returning false as well
        return false;
    }
}, true);
})();