// ==UserScript==
// @name         cppreference-width
// @version      0.0
// @description  resizes cppreference.com for smaller window widths.
// @match        http://cppreference.com/*
// @match        https://cppreference.com/*
// @match        http://*.cppreference.com/*
// @match        https://*.cppreference.com/*
// @namespace    https://greasyfork.org/users/217495-eric-toombs
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/421108/cppreference-width.user.js
// @updateURL https://update.greasyfork.org/scripts/421108/cppreference-width.meta.js
// ==/UserScript==


style_tag = document.createElement('style');
style_tag.innerHTML = `
html {
	overflow: hidden;
}
body {
  min-width: auto;
}
div#cpp-head-first, div#cpp-head-second, div#content, div#footer {
	width: auto;
}
pre, div.mw-geshi {
	width: auto;
}
`;
document.getElementsByTagName('head')[0].append(style_tag);