// ==UserScript==
// @name         Roblox Favorites fix
// @license      C4-Suhail
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  this fix's the roblox Favorites tabs not showing all the games
// @Note         Thanks for downloading.
// @author       C4-Suhail
// @match        *https://www.roblox.com/discover*
// @icon         https://www.google.com/s2/favicons?domain=roblox.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444615/Roblox%20Favorites%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/444615/Roblox%20Favorites%20fix.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var user_id = document.getElementsByName('user-data')[0].getAttribute('data-userid')
    var Window = ("https://www.roblox.com/discover#/sortName/v2/Favorites")
    var Window_id = (window.location.href);
    var User_Window = ("https://www.roblox.com/users/"+user_id+"/favorites#!/places")

    if (Window_id == Window) {

        location.href = User_Window

    } else {
}

})();