// ==UserScript==
// @name         Vivo video redirector
// @namespace    https://tribbe.de
// @version      1.2.5
// @description  Redirect to link for vivo.sx videos
// @author       Tribbe
// @include        *://vivo*
// @require      https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @downloadURL https://update.greasyfork.org/scripts/392841/Vivo%20video%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/392841/Vivo%20video%20redirector.meta.js
// ==/UserScript==

// Redirect to Video
waitForKeyElements ("source[type*='video/mp4']", function(jNode) { window.location.href = jNode[0].src; });