// ==UserScript==
// @name MetroLyrics—Show lyrics only
// @namespace github.com/openstyles/stylus
// @version 1.1.2
// @description Hide distracting extraneous elements.
// @author sK6g6Z6IXv2JA8eH
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:^http[s]://www\.metrolyrics\.com/(?:\w)+(?:-\w+)*-lyrics-(?:\w)+(?:-\w+)*\.html$)$/
// @downloadURL https://update.greasyfork.org/scripts/405066/MetroLyrics%E2%80%94Show%20lyrics%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/405066/MetroLyrics%E2%80%94Show%20lyrics%20only.meta.js
// ==/UserScript==

(function() {
let css = `
	.driver-related {
		display: none;
	}
	.driver-photos {
		display: none;
	}
	.collapse {
		margin-top: initial !important;
	}
	.mid-song-wrap {
		display: none;
	}
	.video-container-inline {
		display: none;
	}
	.hot-list {
		visibility: hidden;
	}
	.content .explicit {
		display: none;
	}
	#lyrics-body-text > div {
		height: initial !important;
	}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
