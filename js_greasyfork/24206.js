// ==UserScript==
// @name         FacebookAntiSpoiler
// @namespace    fbantispoiler
// @version      0.1
// @description  Blacken post if contains #Spoiler tag.
// @author       Canas
// @match        https://www.facebook.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/24206/FacebookAntiSpoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/24206/FacebookAntiSpoiler.meta.js
// ==/UserScript==

function hideSpoilers() {
    var content = $("._5pbx.userContent").find("p:contains('#Spoiler')");
    content.css({'background-color': 'black', 'color': 'black'});
    content.hover(function(){
        $(this).css({'background-color': 'white'});
    }, function(){
        $(this).css({'background-color': 'black'});
    });
}

$(document).ready(hideSpoilers());

$(document).scroll(function(){
    hideSpoilers();
});