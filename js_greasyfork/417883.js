// ==UserScript==
// @name Metart video player customization
// @namespace Adults
// @description Custom video player of Metart
// @icon https://pbs.twimg.com/profile_images/459092898680549376/7aCyeOnC_400x400.png
// @run-at document-start
// @match *://*members.metartvip.com/model*
// @grant none
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/417883/Metart%20video%20player%20customization.user.js
// @updateURL https://update.greasyfork.org/scripts/417883/Metart%20video%20player%20customization.meta.js
// ==/UserScript==

jQuery(document).ready(function() {
  jwplayer("movie_player").setVolume(20);
  jwplayer("movie_player").onReady(function () {
    var myFFButton = document.createElement("div");
    myFFButton.id = "myFFButton";
    myFFButton.setAttribute('style',"transform: scaleX(-1);-webkit-transform: scaleX(-1);");
    myFFButton.setAttribute('class','jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-rewind');
    myFFButton.setAttribute('onclick','jwplayer().seek(jwplayer().getPosition()+5)');
    $('.jw-controlbar-left-group').append(myFFButton);
  });
});