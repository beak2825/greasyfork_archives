// ==UserScript==
// @name Subscriber Changer (Revamped)
// @namespace http://tampermonkey.net/
// @version 1.0
// @description 500M Subcribers apear when you got to your channel page (Originally by GD SuperRice)
// @author og: GD SuperRice, edited: JefferyAdventures
// @match https://www.youtube.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/521970/Subscriber%20Changer%20%28Revamped%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521970/Subscriber%20Changer%20%28Revamped%29.meta.js
// ==/UserScript==
 
function start() {
var subscribers = document.getElementById("subscriber-count");
subscribers.innerHTML = "500M Subscribers";
setTimeout(start, 0);
}
start();