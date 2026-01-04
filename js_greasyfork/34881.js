// ==UserScript==
// @name         m.facebook.com sound notification
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Play sound and vibrate your phone when a message comes.
// @author       Psyblade
// @match        https://m.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34881/mfacebookcom%20sound%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/34881/mfacebookcom%20sound%20notification.meta.js
// ==/UserScript==

var jewelElem = document.getElementById("mJewelNav").childNodes[2].getElementsByClassName("_59tg")[0]
var observer = new MutationObserver(function(mutationsList, observer) {
    if(jewelElem.innerHTML != "0")
   {
	 var audio = new Audio('https://raw.githubusercontent.com/psyblade12/Notification-in-m.facebook.com/master/FBMessSound.ogg');
                audio.play();
                window.navigator.vibrate(500);
   }
});

observer.observe(jewelElem, {characterData: false, childList: true, attributes: false});