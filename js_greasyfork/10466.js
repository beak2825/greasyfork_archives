// ==UserScript==
// @namespace	  http://polarityweb.weebly.com/
// @name          FlashTube
// @include       http://*.youtube.com/*.html
// @version       1.0.0
// @description   (FlashTube) Replace the current HTML5 Player with Flash.
// @author        Polarity
// @description   Restore the Flash player on Youtube to improve and fix some playback issues in the HTML5 player. This is a fix for older browsers that have been automatically switched to the HTML5 player automatically and does not have the support for the different Codecs used on Youtube.
//
// FlashTube
//
// Copyright (c) 2015, Polarity
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
// --------------------------------------------------------------------
// Mod By: Polarity
// @downloadURL https://update.greasyfork.org/scripts/10466/FlashTube.user.js
// @updateURL https://update.greasyfork.org/scripts/10466/FlashTube.meta.js
// ==/UserScript==

(function(){
if(location.hostname.match(/^www.youtube.com/i)) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.textContent = 'document.createElement("video").constructor.prototype.canPlayType = function(type){return ""}';
    document.documentElement.appendChild(script);
}
})();