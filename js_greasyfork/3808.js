// ==UserScript==
// @name        Youtube Age Confirmation Bypass
// @namespace   kneels
// @description Prevents you from having to sign in to view age restricted videos on YouTube
// @include 	http://www.youtube.com/*
// @include 	https://www.youtube.com/*
// @exclude 	http://www.youtube.com/embed/*
// @exclude 	https://www.youtube.com/embed/*
// @version     1.65
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3808/Youtube%20Age%20Confirmation%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/3808/Youtube%20Age%20Confirmation%20Bypass.meta.js
// ==/UserScript==

var quality = 720; // Change this to the default quality of your preference

function getCurrentUrl() {
    return decodeURIComponent(window.location.href);
}

function getEmbedUrl(videoID) {
    return "https://www.youtube.com/embed/" + videoID;
}

function getVideoID(url) {
    url = url.substr(url.indexOf("v=") + 2);
    var junk = url.indexOf("&");
    if (junk != -1) {
        url = url.substr(0, junk);
    }
    return url;
}

function createEmbedString() {
    var embedString = "<iframe width=\"100%\" height=\"100%\" src='" +
        getEmbedUrl(getVideoID(getCurrentUrl())) + "?autoplay=1&vq=hd" +
        quality + "' frameborder=\"0\" allowfullscreen></iframe>";

    return embedString;
}

var target = document.body;
var title = "";

var observer = new MutationObserver(function(mutations) {
	// Check if a new page was (dynamically) loaded
    if (title != document.title) {

        // Redirect to the regular video page if we're on a "verify age" page
        if (getCurrentUrl().indexOf("verify_age?next_url=/") != -1) {
            window.location = getCurrentUrl().replace("verify_age?next_url=/", "");
            return;
        }

        // Check a couple of times to see if the required DOM element is available. If it is and the 
        // age restricted message appears to be not hidden, replace the regular player with an embedded player.
        var attempts = 0;
        var check = setInterval(function() {
            // New Youtube layout
            var el = document.getElementById('error-screen');
            if (null != el && !el.hasAttribute('hidden')) {
                document.querySelector('#player.ytd-watch').innerHTML = createEmbedString();
                clearInterval(check);
                return;
            }
            // Old Youtube layout
            el = document.getElementById('player-unavailable');
            if (null != el && !el.classList.contains('hid')) {
                document.getElementById('player-unavailable').innerHTML = createEmbedString();
                clearInterval(check);
                return;
            }

            if (++attempts > 3) {
                clearInterval(check);
            }
        }, 300);

        title = document.title;
    }
});

var config = {
    attributes: true
};
observer.observe(target, config);