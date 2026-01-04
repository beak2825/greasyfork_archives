// ==UserScript==
// @name         moodle-width
// @version      0.0
// @description  resizes moodle for smaller window widths.
// @match        https://moodle.helsinki.fi/*
// @namespace    https://greasyfork.org/users/217495-eric-toombs
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/507290/moodle-width.user.js
// @updateURL https://update.greasyfork.org/scripts/507290/moodle-width.meta.js
// ==/UserScript==


style_tag = document.createElement('style');
style_tag.innerHTML = `
div#topofscroll {
		max-width: 100vw !important;
}
`;
document.getElementsByTagName('head')[0].append(style_tag);