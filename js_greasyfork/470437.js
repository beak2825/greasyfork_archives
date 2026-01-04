// ==UserScript==
// @name           Auto zoom lone images
// @id             dc989f0a-f9e6-4507-ba5f-a0730a614553@http://forums.mozillazine.org/memberlist.php?mode=viewprofile&u=261941
// @version        2.5
// @namespace      http://forums.mozillazine.org/memberlist.php?mode=viewprofile&u=261941
// @author         Gingerbread Man
// @description    Automatically zoom small standalone images
// @include      /http?://.*\.gif.*
// @include      /http?://.*\.jpg.*
// @include      /http?://.*\.png.*
// @include      /https?://.*\.gif.*
// @include      /https?://.*\.jpg.*
// @include      /https?://.*\.png.*
// @include      /https?://.*\.webp.*
// @exclude  https://www.google.com/imgres*
// @run-at         window-load
// @license			MIT
// @downloadURL https://update.greasyfork.org/scripts/470437/Auto%20zoom%20lone%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/470437/Auto%20zoom%20lone%20images.meta.js
// ==/UserScript==

// Reference: https://support.mozilla.org/en-US/questions/942713

var img = document.images[0];
var iw = img.width;
var ih = img.height;
var ir = iw / ih;

function togglezoom() {
	if (img.width>iw||img.height>ih) {
		img.width = iw;
		img.height = ih;
		img.setAttribute("style","cursor:-moz-zoom-in");
	}
	else zoomin();
}

function zoomin() {
	var ww = window.innerWidth;
	var wh = window.innerHeight;

	if (iw<ww&&ih<wh) {
            console.log("here0");
		img.addEventListener("click", togglezoom, false);
		var zohw = wh * ir;

		if (zohw<=ww) {
            console.log("here1");
			img.height = wh;
			img.width = img.height * ir;
			img.setAttribute("style","cursor:-moz-zoom-out");
		}

		else {
            console.log("here2");
			img.width = ww;
			img.height = img.width / ir;
			img.setAttribute("style","cursor:-moz-zoom-out");
		}

	}

}

zoomin();

//.user.js