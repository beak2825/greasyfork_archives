// ==UserScript==
// @name 				Garmin Connect Hide Golf Link
// @namespace 	http://users.pandora.be/divvy/userscript/
// @description Hide Golf Link
// @include     https://connect.garmin.com/modern/activity/*
// @version 0.0.1.0
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480393/Garmin%20Connect%20Hide%20Golf%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/480393/Garmin%20Connect%20Hide%20Golf%20Link.meta.js
// ==/UserScript==
var listItems = document.querySelectorAll('li.main-nav-item');

if (listItems.length >= 4) {
  var fourthListItem = listItems[7];
  fourthListItem.style.display = "none";
}