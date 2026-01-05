// ==UserScript==
// @name       Hide WtF and Trending on Twitter
// @namespace  http://flaeme.github.io
// @version    0.1
// @description  Hides the WtF (Who to Follow, abbreviation theirs) and Trending modules on the side. Made this because however adblock hides elements leaves an ugly gap.
// @match      *://twitter.com/*
// @copyright  2014 Flaeme Flow
// @downloadURL https://update.greasyfork.org/scripts/210/Hide%20WtF%20and%20Trending%20on%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/210/Hide%20WtF%20and%20Trending%20on%20Twitter.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
	try {
		var elmHead, elmStyle;
		elmHead = document.getElementsByTagName('head')[0];
		elmStyle = document.createElement('style');
		elmStyle.type = 'text/css';
		elmHead.appendChild(elmStyle);
		elmStyle.innerHTML = css;
	} catch (e) {
		if (!document.styleSheets.length) {
			document.createStyleSheet();
		}
		document.styleSheets[0].cssText += css;
	}
}

addGlobalStyle('div.module.wtf-module{ display: none; margin-bottom: 0px } div.module.trends{ display: none; margin-bottom: 0px }');