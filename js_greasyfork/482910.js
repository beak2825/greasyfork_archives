// ==UserScript==
// @name     	    No Youtube Shorts Player
// @description	    on the Subscription page. Desktop & Mobile.
// @version  	    1
// @grant    	    none
// @match    	    https://www.youtube.com/*
// @match    	    https://m.youtube.com/*
// @license         MIT
// @namespace       Play Shorts in the normal video player
// @author          You
// @downloadURL https://update.greasyfork.org/scripts/482910/No%20Youtube%20Shorts%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/482910/No%20Youtube%20Shorts%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace '/shorts/' with '/watch?v=' in a URL
    function modifyUrl(url) {
        if (url.includes('/shorts/')) {
            return url.replace('/shorts/', '/watch?v=');
        }
        return url;
    }

    // Modify the URL on page load without affecting history, but only if it's not a 'back' navigation
    if (window.location.href.includes('/shorts/') && !window.history.state?.isBackNavigation) {
        var newUrl = modifyUrl(window.location.href);
        window.history.replaceState({isBackNavigation: true}, '', newUrl);
    }

    // Use event delegation to catch dynamic URL changes without affecting history
    document.body.addEventListener('click', function(event) {
        var target = event.target.closest('a');
        if (target && target.href.includes('/shorts/')) {
            event.preventDefault();
            var newUrl = modifyUrl(target.href);
            window.history.pushState({isBackNavigation: true}, '', newUrl);
            window.location.replace(newUrl);
        }
    }, true);
})();