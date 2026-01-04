// ==UserScript==
// @name     Twitch.tv Raid Redirect Remover
// @version  0.1
// @description    Script for removing those referrer=raid from redirects so users count towards the raid receiver.
// @author   Spikedrose
// @match    https://www.twitch.tv/*
// @grant    none
// @namespace https://greasyfork.org/users/796948
// @downloadURL https://update.greasyfork.org/scripts/429828/Twitchtv%20Raid%20Redirect%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/429828/Twitchtv%20Raid%20Redirect%20Remover.meta.js
// ==/UserScript==

(function () {
    var urlPath = location.href; //Sets a variable of the current Url
    if (urlPath == location.href) { //Checks that the current Url is still the current Url
        var urlPathName = location.href.split('?')[1]; //Splits the Url at the ? and grabs the second half.
      
        if (urlPathName.match("referrer=raid")) { //Checks if the URL has referrer=raid
            window.location = location.href.split('?')[0]; //Replaces the current URL with the url up to the ? split and reloads the page.
        }
        else { //If the page doesn't have a ? it does nothing.
        }
    }
})();