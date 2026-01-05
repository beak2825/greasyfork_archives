// ==UserScript==
// @name         Bandcamp Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        htt*://*.bandcamp.com/album/*
// @match        htt*://*.bandcamp.com/releases
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/25025/Bandcamp%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/25025/Bandcamp%20Helper.meta.js
// ==/UserScript==

(function() {
    var counter=1;
    var text="Tracklist:\n";
    var tracklist=document.querySelectorAll('[itemprop=name]');
    for(i=1; i < tracklist.length-1; i++)
    {
        text+=counter+". "+tracklist[i].innerText+"\n";
        counter++;
    }
    GM_setClipboard(text+"\n"+document.URL);
})();