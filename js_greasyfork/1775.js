// ==UserScript==
// @name           XKCD What-if mouse-hover text
// @namespace      https://greasyfork.org/users/98-jonnyrobbie
// @author         JonnyRobbie
// @grant		   none
// @description    This script displays mouse-hover text of what-if images as simple image captions.
// @include        /^https?:\/\/(www\.)?what-if\.xkcd\.com\/([0-9]+\/)?$/
// @run-at         document-end
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/1775/XKCD%20What-if%20mouse-hover%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/1775/XKCD%20What-if%20mouse-hover%20text.meta.js
// ==/UserScript==

/*
CHANGELOG:
1.0
-initial release
*/

function main() {
	var illus = document.getElementsByClassName('illustration');
	for (var i=0; i<illus.length; i++) {
		var titleText = document.createElement('div');
		titleText.innerHTML = illus[i].title;
		titleText.className = "title-text";
		titleText.style.lineHeight = "1.7em";
		titleText.style.fontFamily = "Georgia,Times,serif";
		titleText.style.fontSize = "0.8em";
		titleText.style.fontStyle = "italic";
		titleText.style.textAlign = "center";
		titleText.style.margin = "auto";
		titleText.style.width = "40%";
		illus[i].parentNode.insertBefore(titleText, illus[i].nextSibling);
	}
}

main();