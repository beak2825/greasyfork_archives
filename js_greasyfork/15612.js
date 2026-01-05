// ==UserScript==
// @name         no trackers/ads
// @version      0.1
// @description stop 5 seconds wait
// @author       kLutz
// @include       http://www.deafvideo.tv/*
// @include       http://deafvideo.tv/*
// @grant        none
// @namespace https://greasyfork.org/users/25127
// @downloadURL https://update.greasyfork.org/scripts/15612/no%20trackersads.user.js
// @updateURL https://update.greasyfork.org/scripts/15612/no%20trackersads.meta.js
// ==/UserScript==

$('#hidden_text').remove();
$('#hidden_video').show(0);   
var api = flowplayer();
api.play();