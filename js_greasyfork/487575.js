// ==UserScript==
// @name         Twitch Un-raid
// @version      1
// @description  Go back to the channel where you were a few minutes after a raid
// @author       jmatg1
// @match        https://twitch.tv
// @license MIT
// @namespace https://greasyfork.org/users/843476
// @downloadURL https://update.greasyfork.org/scripts/487575/Twitch%20Un-raid.user.js
// @updateURL https://update.greasyfork.org/scripts/487575/Twitch%20Un-raid.meta.js
// ==/UserScript==

(function() {
    function checkPage(){
        if(window.location.href.includes('?referrer=raid')){
            history.back()
        }
    }
    setTimeout(checkPage, 3*1000);
})();