// ==UserScript==
// @name	YouTube Hide recommended videos
// @namespace	ef0mwUGrgwzkNkfCE3ecJ5K1URMi6r
// @version	20140815d
// @homepageURL	https://greasyfork.org/scripts/4246-youtube-hide-recommended-videos
// @description	Hides the recommended videos on your stream (new design)
// @include	*://youtube.com/*
// @include	*://*.youtube.com/*
// @copyright	2014 Mr. Anonymous
// @downloadURL https://update.greasyfork.org/scripts/4246/YouTube%20Hide%20recommended%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/4246/YouTube%20Hide%20recommended%20videos.meta.js
// ==/UserScript==

window.setTimeout(
	function check() {
		if (document.getElementsByClassName('shelf-title-annotation')) {
		  main();
		}
		window.setTimeout(check, 250);
	}, 250
);

function main() {
var lang = document.querySelector('[data-picker-key="language"]').outerText;  
switch (lang) {
	case " Язык: Русский  ":
		var AggroText = "Рекомендованный популярный канал"
		break;
	case " Language: English  ":
		var AggroText = "Popular channel you might like"
		break;
	case " Language: English (UK)  ":
		var AggroText = "Popular channel you might like"
		break;
/*
If you need to add your language, add this block to "case" statement 
and copy-paste text of "Popular channel you might like" span to it:

	case TEXT_AT_BUTTON_IN_FOOTER_OF_MAIN_PAGE:
		var AggroText = LOCALIZED_STRING_OF_"Popular channel you might like"
		break;
*/
}	/* end of switch (lang) */

var TitleAnnotations = document.getElementsByClassName('shelf-title-annotation');
for(var i = 0, len = TitleAnnotations.length; i < len; i++) {
	if (TitleAnnotations[i].innerText == AggroText) {
		TitleAnnotations[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
	}
}
}	/* end of main() */
