// ==UserScript==
// @name        portalgraphics HTML5 Drawing Procedure
// @namespace   DoomTay
// @description Replaces Flash-based portalgraphics drawing procedure display with a video tag
// @include     http://*.archive.org/web/*/http://www.portalgraphics.net/pg/illust/?image_id=*
// @include     http://*.archive.org/web/*/http://portalgraphics.net/pg/illust/?image_id=*
// @include     https://*.archive.org/web/*/http://www.portalgraphics.net/pg/illust/?image_id=*
// @include     https://*.archive.org/web/*/http://portalgraphics.net/pg/illust/?image_id=*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25917/portalgraphics%20HTML5%20Drawing%20Procedure.user.js
// @updateURL https://update.greasyfork.org/scripts/25917/portalgraphics%20HTML5%20Drawing%20Procedure.meta.js
// ==/UserScript==

var picID = window.location.href.substring(window.location.href.indexOf("=") + 1);
var IDRounded = picID >= 1000 ? Math.floor(picID/1000)*1000 : "0000";
var flashVid = document.querySelector("#ill-de-illust-m > div > object");
var timestamp = /web\/(\d{1,14})/.exec(window.location.href)[1];

if(flashVid)
{
	var eventVid = document.createElement("video");
	eventVid.width = flashVid.width;
	eventVid.height = flashVid.height;
	eventVid.controls = "true";
	eventVid.src = "/web/" + timestamp + "/http://www.portalgraphics.net/data/movie/" + IDRounded + "/" + picID + ".mp4";
	eventVid.poster = "/web/" + timestamp + "/http://www.portalgraphics.net/data/image/resize/" + IDRounded + "/" + picID + ".jpg";
	flashVid.parentNode.replaceChild(eventVid,flashVid);
}