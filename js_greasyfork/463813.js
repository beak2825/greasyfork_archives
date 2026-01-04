// ==UserScript==
// @name        Twitch Raid Redirect
// @description Removes "?referrer=raid" from redirect URLs to count yourself as a viewer
// @match       *://*.twitch.tv/*
// @run-at    document-start
// @license CC0
// @version 0.0.1.20230412084031
// @namespace https://greasyfork.org/users/1058676
// @downloadURL https://update.greasyfork.org/scripts/463813/Twitch%20Raid%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/463813/Twitch%20Raid%20Redirect.meta.js
// ==/UserScript==

// Remove "?referrer=raid" if it is the search param of the URL
if (window.location.search == "?referrer=raid") {
    let redirect_url = window.location.toString();
    redirect_url = redirect_url.replace("?referrer=raid", "");
    
    window.location.replace(redirect_url);
}