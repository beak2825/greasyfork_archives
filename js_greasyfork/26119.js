// ==UserScript==
// @name Toggleable video and audio html5 elements
// @namespace Violentmonkey Scripts
// @grant none
// @include *
// @author       Creec Winceptor
// @description  Little script to enable video and audio html5 elements play/pause toggle clicking on element itself.
// @namespace https://greasyfork.org/users/3167
// @run-at document-load
// @version 1.1
// @downloadURL https://update.greasyfork.org/scripts/26119/Toggleable%20video%20and%20audio%20html5%20elements.user.js
// @updateURL https://update.greasyfork.org/scripts/26119/Toggleable%20video%20and%20audio%20html5%20elements.meta.js
// ==/UserScript==

var playpause = function(obj)
{
  obj.paused?obj.play():obj.pause();
}
var enableclicktoggle = function(elem) 
{
  elem.addEventListener("click", function(){playpause(this)});
  elem.volume = 0.5;
}

var videos = document.getElementsByTagName("VIDEO");
for (var i = 0; i < videos.length; i++) 
{
	var elem = videos[i];
  	enableclicktoggle(elem);
}

var audios = document.getElementsByTagName("AUDIO");
for (var i = 0; i < audios.length; i++) 
{
	var elem = audios[i];
  	enableclicktoggle(elem);
}