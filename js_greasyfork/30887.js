// ==UserScript==
// @name         Steam Community Ignore
// @namespace    https://greasyfork.org/users/5097-aemony
// @version      0.3
// @description  Hides posts from specific users.
// @author       Aemony
// @match        *://steamcommunity.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30887/Steam%20Community%20Ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/30887/Steam%20Community%20Ignore.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // SteamID3 of profiles to hide, comma delimited, use https://steamid.xyz/ to look one up.
    // Only use the last numbers of the ID, so if the SteamID3 is 'U:1:12345678' you should only add '12345678' in the array.
    let profilesToIgnore = []; // example: let profilesToIgnore = ['12345678', '23456789']
    
    // ==code past this point==
    
    // detects if we're on a page with a comment thread or not
    var target = document.getElementsByClassName('commentthread_comments');
    
    if(target.length > 0)
    {
        // add an observer to the comment thread
        var config = { childList: true };
        var observer = new MutationObserver(function() {
            // runs the function when the comment thread changes
            hideProfiles();
        });
        observer.observe(target[0], config);

        // runs the function once when the page initially loads
        hideProfiles();
    }
    
    function hideProfiles() {
        profilesToIgnore.forEach(function(profile) {
            
            // add '.forum_op a[data-miniprofile="${profile}"]' to the call below to filter out the opening post in a forum thread as well
            let matches = document.querySelectorAll(`.commentthread_comments a[data-miniprofile="${profile}"]:not(.commentthread_author_link)`);
            
            if(matches.length > 0) {
                // logs the number of posts that were hidden in the console
                console.log(`Found ${matches.length} posts to hide from ${profile}.`);
                matches.forEach(function(element) {
                    element.parentElement.parentElement.style.display = 'none';
                });
            }
        });
    }
})();