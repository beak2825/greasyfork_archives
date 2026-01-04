// ==UserScript==
// @name         Vidoza video redirector
// @namespace    https://tribbe.de
// @version      1.0.0
// @description  Redirect to link for vidoza videos
// @author       Tribbe, M4kaze
// @include        *://*vidoza*
// @require      https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @downloadURL https://update.greasyfork.org/scripts/428123/Vidoza%20video%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/428123/Vidoza%20video%20redirector.meta.js
// ==/UserScript==

// Redirect to Video
waitForKeyElements ("source[type*='video/mp4']", function(jNode) { window.location.href = jNode[0].src; });