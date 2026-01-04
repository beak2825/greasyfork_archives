// ==UserScript==
// @name         Chat To The Max Changes
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Adds timestamps, 'new message' notification sound, and moves the "you are now chatting with [agent]" to the bottom.
// @author       You
// @match        https://cricket-sales-support.att.ada.support/*
// @include      https://cricketshout.exceedlms.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396760/Chat%20To%20The%20Max%20Changes.user.js
// @updateURL https://update.greasyfork.org/scripts/396760/Chat%20To%20The%20Max%20Changes.meta.js
// ==/UserScript==

var lel = setInterval(function() {
    for(var i = 0; i < document.getElementsByClassName("MessageGroup").length; i++) {
        if(document.getElementsByClassName("MessageGroup")[i].getElementsByTagName("figure")[0] != null) {if(document.getElementsByClassName("MessageGroup")[i].getElementsByTagName("figure")[0].getElementsByTagName('img')[0] != null) {document.getElementsByClassName("MessageGroup")[i].getElementsByTagName("figure")[0].getElementsByTagName('img')[0].remove();} if(document.getElementsByClassName("MessageGroup")[i].getElementsByTagName("figure")[0].getElementsByTagName('div')[0] != null) {document.getElementsByClassName("MessageGroup")[i].getElementsByTagName("figure")[0].getElementsByTagName('div')[0].remove()} console.log(document.getElementsByClassName("MessageGroup")[i].getElementsByTagName("figure")[0].innerHTML); document.getElementById('status-bar').innerHTML = document.getElementsByClassName("MessageGroup")[i].getElementsByTagName("figure")[0].innerHTML; clearInterval(lel);}
    }
    },0);
var yeeter = setInterval(function() {
for(var l = 0; l < document.getElementsByClassName("MessageListText__base-message").length; l++) {if(document.getElementsByClassName("MessageListText__base-message")[l].getElementsByClassName("timestamp")[0] == null && document.getElementsByClassName("MessageListText__base-message")[l].parentElement.parentElement.getElementsByClassName("g-message--is-owned-by-user")[0] == null && document.getElementsByClassName("MessageListText__base-message")[l].parentElement.parentElement.getElementsByClassName("MessageListText__emojis")[0] == null) {var thedate = new Date(); thedate = thedate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }); var sounds = document.getElementsByTagName('audio'); for(var i=0; i<sounds.length; i++) sounds[i].pause(); document.getElementsByClassName("MessageListText__base-message")[l].getElementsByTagName("span")[0].innerHTML += "<br><span class='timestamp' style='size: 5px; border-radius: 5px; background: white; padding-left: 4px; padding-right: 4px; color: black'>" + thedate.toString() + "</span><audio autoplay><source src='https://media.vocaroo.com/mp3/hMe2tRXdnir' type='audio/mp3'></source></audio>"}}
    for(var l1 = 0; l1 < document.getElementsByClassName("MessageListText__base-message").length; l1++) {if(document.getElementsByClassName("MessageListText__base-message")[l1].getElementsByClassName("timestamp")[0] == null && document.getElementsByClassName("MessageListText__base-message")[l1].parentElement.parentElement.getElementsByClassName("g-message--is-owned-by-user")[0] != null && document.getElementsByClassName("MessageListText__base-message")[l1].parentElement.parentElement.getElementsByClassName("MessageListText__emojis")[0] == null) {var thedate1 = new Date(); thedate1 = thedate1.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }); document.getElementsByClassName("MessageListText__base-message")[l1].getElementsByTagName("span")[0].innerHTML += "<br><span class='timestamp' style='size: 5px; border-radius: 5px; background: white; padding-left: 4px; padding-right: 4px; color: black'>" + thedate1.toString() + "</span>"}}

},0);