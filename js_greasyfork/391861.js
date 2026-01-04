// ==UserScript==
// @name         Roblox Trade Link on Username
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  This userscript makes the username on anyone's profile link to their trade window.
// @author       awesomerly
// @match        *://*.roblox.com/users/*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391861/Roblox%20Trade%20Link%20on%20Username.user.js
// @updateURL https://update.greasyfork.org/scripts/391861/Roblox%20Trade%20Link%20on%20Username.meta.js
// ==/UserScript==

var url = window.location.href
var userId = url.split("/")[4]


/*
https://stackoverflow.com/questions/39346747/tampermonkey-script-run-before-page-load
thanks to the person that answered this question lol
*/

new MutationObserver(function(mutations) {
    if (document.getElementsByTagName('h2')[0]) {
        var thingy = document.getElementsByClassName("profile-name")[0]
        if (thingy) {
            thingy.innerHTML = `<a href = 'https://www.roblox.com/Trade/TradeWindow.aspx?TradePartnerID=${userId}' target='_blank' title="Trade">` + thingy.innerHTML + "</a>";
            this.disconnect(); // disconnect the observer
        }
    }
}).observe(document, {childList: true, subtree: true});