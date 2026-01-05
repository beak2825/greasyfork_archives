// ==UserScript==
// @name         No More Tabs
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Stops all that new tab nonsense
// @author       SentientCrab
// @match        https://horrorcharnel.org/*
// @exclude      https://horrorcharnel.org/shoutbox.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23171/No%20More%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/23171/No%20More%20Tabs.meta.js
// ==/UserScript==

(function() {
    var users=document.querySelectorAll('[class^="user_"]');
    for(var x=0; x<users.length; x++)
    {
        users[x].target="_parent";
    }
})();