// ==UserScript==
// @name            Friend Icon Revert *OLD*
// @author          skyboy
// @version         1.0.0
// @description     Reverts the friend icon back to the star
// @include         http://www.kongregate.com/games/*/*
// @homepage        http://userscripts-mirror.org/scripts/show/72290
// @namespace https://greasyfork.org/users/32649
// @downloadURL https://update.greasyfork.org/scripts/17724/Friend%20Icon%20Revert%20%2AOLD%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/17724/Friend%20Icon%20Revert%20%2AOLD%2A.meta.js
// ==/UserScript==
if (/^\/?games\/[^\/]+\/[^\/?]+(\?.*)?$/.test(window.location.pathname))
setTimeout(function() {
window.location.assign("javascript:(function(){var t = document.createElement('span');t.update(\"<style>.user_row .friend_icon {background: transparent url(/images/presentation/yourrating.gif) no-repeat scroll 0px -12px !important;line-height:12px !important;margin-top:2px;width:14px !important;}</style>\");$('gamepage_header').appendChild(t)})();void(0)");
}, 1250);