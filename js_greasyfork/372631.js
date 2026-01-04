
// ==UserScript==
// @name          Ad Blocker
// @namespace     https://www.nexusmods.com
// @description   Removes ads. Might pop up one but it should just be a false alarm.
// @version       1
// @author        Kaden Baker
// @include       http://www.nexusmods.com/*
// @include       https://www.nexusmods.com/*
// @downloadURL https://update.greasyfork.org/scripts/372631/Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/372631/Ad%20Blocker.meta.js
// ==/UserScript==

var areplacer = document.getElementsByClassName("areplacer");
var count = areplacer.length;
var i;

for(i = 0;i < count;i++)
{
areplacer[0].parentNode.removeChild(areplacer[0]);
}