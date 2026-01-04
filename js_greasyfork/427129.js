// ==UserScript==
// @name         Streamz video redirector
// @namespace    https://tribbe.de
// @version      1.0.2
// @description  Redirect to link for streamz.ws videos
// @author       Tribbe
// @include      *://streamz.ws*
// @include      *://streamzz.to*
// @require      https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @downloadURL https://update.greasyfork.org/scripts/427129/Streamz%20video%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/427129/Streamz%20video%20redirector.meta.js
// ==/UserScript==

// Redirect to Video
waitForKeyElements ("video[id*='video_1_html5_api']", function(jNode) { window.location.href = jNode[0].src; });