// ==UserScript==
// @name         Evoload video redirector
// @namespace    https://tribbe.de
// @version      1.0.0
// @description  Redirect to link for evoload videos
// @author       Tribbe
// @include        *://evoload*
// @require      https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @downloadURL https://update.greasyfork.org/scripts/434217/Evoload%20video%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/434217/Evoload%20video%20redirector.meta.js
// ==/UserScript==

// Redirect to Video
waitForKeyElements ("source[type*='video/mp4']", function(jNode) { window.location.href = jNode[0].src; });
waitForKeyElements ("video[src]", function(jNode) { console.log(jNode[0].src); });