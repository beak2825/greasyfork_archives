// ==UserScript==
// @name         Twitch Un-raid
// @version      1.5.3
// @description  Go back to the channel where you were a few minutes after a raid
// @author       raianwz
// @namespace    https://greasyfork.org/users/425245
// @match        *://twitch.tv/*
// @include       *://www.twitch.tv/*
// @exclude      *://*.twitch.tv/videos/*
// @exclude      *://*.twitch.tv/*/video/*
// @exclude      *://*.twitch.tv/embed/*
// @exclude      *://*.twitch.tv/popout/*
// @downloadURL https://update.greasyfork.org/scripts/394565/Twitch%20Un-raid.user.js
// @updateURL https://update.greasyfork.org/scripts/394565/Twitch%20Un-raid.meta.js
// ==/UserScript==

(function() {
    var delayBeforeRedirect = 1000 * 60 * 3 // 3 minutes delay to Redirect
    var delayBeforeRecheck = 1000 * 60 * 3 // 3 minutes delay to Check URL
    function goBackChannel(){history.back()}
    function checkPage(){
        if(window.location.href.includes('?referrer=raid')){
            setTimeout(goBackChannel, delayBeforeRedirect); // redirect in 3 minutes
        }else{
            setTimeout(checkPage, delayBeforeRecheck); // check again in 3 minutes
        }
    }
    console.log('Twitch Unraid is enabled')
    setTimeout(checkPage, 3*1000); // check page 3 seconds after load
})();