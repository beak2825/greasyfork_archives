// ==UserScript==
// @name           TargetKiller
// @namespace      http://userscripts.org/users/splurov/
// @include        *
// @version 0.0.1.20140904105115
// @description remove '_blank' from links target
// @downloadURL https://update.greasyfork.org/scripts/4828/TargetKiller.user.js
// @updateURL https://update.greasyfork.org/scripts/4828/TargetKiller.meta.js
// ==/UserScript==

(function(){

for (
	var links = document.links,
			linksLength = links.length,
			i = 0;
	i < linksLength;
	i++
) {
	if (links[i].target == '_blank') {
		links[i].removeAttribute('target');
	}
}

})();