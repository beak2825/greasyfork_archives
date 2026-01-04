// ==UserScript==
// @name Subscriber Changer
// @namespace http://tampermonkey.net/
// @version 1.0
// @description 1M Subcribers apear when you got to your channel page
// @author GD SuperRice
// @match https://www.youtube.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/403414/Subscriber%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/403414/Subscriber%20Changer.meta.js
// ==/UserScript==

function start() {
var subscribers = document.getElementById("subscriber-count");
subscribers.innerHTML = "1M Subscribers";
setTimeout(start, 0);
}
start();