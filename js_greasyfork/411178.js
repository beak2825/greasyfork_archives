// ==UserScript==
// @name         Xero Playercount
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  notifies you as soon as there is a new ticket!
// @author       Swaight
// @match        https://xero.gg/neocortex/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/411178/Xero%20Playercount.user.js
// @updateURL https://update.greasyfork.org/scripts/411178/Xero%20Playercount.meta.js
// ==/UserScript==

(function() {
    'use strict';

function GetPlayercount(){
    setTimeout(function(){
    var playercount = 0;
    $( "tr" ).each(function( index ) {
        if(index != 0){
            var count = $(this)[0].childNodes[17].innerHTML.split(' ');
            playercount += parseInt(count[0]);
        }
    });
    if(!$('small')[0].innerHTML.includes('Player in Channel')){
        $('small')[0].innerHTML += " - Player in Channel: " + playercount;
    }
     }, 1000);
}

function SetClickEvent(){
    var url = window.location.href;
    if (!(url.includes('type=live&channelId=1') || url.includes('type=live&channelId=2') || url.includes('type=live&channelId=3') || url.includes('type=live&channelId=4')))
        return;

    var events = $._data($(".refresh")[0], "events");
    if(events == null){
        $('.refresh').click(GetPlayercount);
    }
}


SetClickEvent();
setInterval(SetClickEvent, 100);
})();