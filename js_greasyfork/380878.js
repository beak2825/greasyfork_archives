// ==UserScript==
// @name           E-H Fjords
// @description    Redirects galleries automatically.
// @author         Hen Tie
// @homepage       https://hen-tie.tumblr.com/
// @namespace      https://greasyfork.org/en/users/8336
// @include        /https://e-hentai.org\/[sg]\/.*/
// @icon           https://i.imgur.com/pMMVGRx.png
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/380878/E-H%20Fjords.user.js
// @updateURL https://update.greasyfork.org/scripts/380878/E-H%20Fjords.meta.js
// ==/UserScript==
// based on Mexiguy's Fjords Begone (sleazyfork.org/en/scripts/2053)

//redirect behaviour
var delayRedirect = false; //true=delayed with message, false=instant
var delayTime = 2000; //in milliseconds

function redirectPage() {
	var redirectUrl = document.location.toString().replace("e-hentai", "exhentai");
	document.location = redirectUrl;
}

if (document.title.indexOf("Gallery Not Available") >= 0) {
	//break homepage redirect timeout
	document.getElementById('continue').remove();
	//custom redirect message
	document.getElementsByTagName('p')[1].remove();
	document.getElementsByClassName('d')[0].innerHTML += "<P><em>E-H Fjords is redirecting you now…</em></p>";
	if (delayRedirect) {
		//custom title
		document.title = "E-H Fjords: Redirecting";
		//delay then redirect page
		setTimeout(redirectPage, delayTime);
	} else {
		redirectPage();
	}
}
