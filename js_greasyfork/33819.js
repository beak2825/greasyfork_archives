// ==UserScript==
// @name        URL Conversion | YouTube - HookTube
// @namespace   CompletelyUnknown
// @description Sends any /www.youtube.com/ sites to HookTube before page load.  Does not affect /other.youtube.com/, (gaming.youtube.com, creatoracademy.youtube.com, etc.).
// @include     *youtube*
// @version     1
// @grant       none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/33819/URL%20Conversion%20%7C%20YouTube%20-%20HookTube.user.js
// @updateURL https://update.greasyfork.org/scripts/33819/URL%20Conversion%20%7C%20YouTube%20-%20HookTube.meta.js
// ==/UserScript==
var url = window.location.toString();
if (url.indexOf('www.youtube.com') !== - 1) {
  window.location = url.replace(/youtube.com/, 'hooktube.com');
}
