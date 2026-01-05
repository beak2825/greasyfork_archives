// ==UserScript==
// @name          GIF Blocker *OLD*
// @description   Disables animated avatars and replaces them with a default
// @include       http://www.kongregate.com/*
// @version 0.0.1.20160401063918
// @namespace https://greasyfork.org/users/32649
// @downloadURL https://update.greasyfork.org/scripts/18366/GIF%20Blocker%20%2AOLD%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/18366/GIF%20Blocker%20%2AOLD%2A.meta.js
// ==/UserScript==
function gtv(t) {
	var v = 0;
	t = t.toString().split("");
	for(var d = 0;d<t.length;d++) {
		v += t[d].charCodeAt();
	}
	return v;
}
var avs = document.getElementsByClassName ? document.getElementsByClassName("user_avatar") : document.images, defs = ["theclaw", "chicken", "duck", "beefairy", "lolcake", "slimyghost", "devilish", "bird", "general", "robotboy", "yummy", "snooze", "death", "headbot", "frog", "wrestleboy", "darkninja", "emo", "triggers", "robot", "lizardboy", "fluff", "bug"];
for(var i = 0;i<avs.length;i++)
if(/^http:\/\/cdn\d\.kongregate\.com\/user_avatars\/\d{4}\/\d{4}\/.+\.gif(\?.*)?$/i.test(avs[i].src))
avs[i].src = "http://cdn4.kongregate.com/assets/avatars/defaults/"+defs[gtv(avs[i].alt.split(" ")[2])%defs.length]+".jpg";