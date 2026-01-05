// ==UserScript==
// @name          Embed to HTML5
// @namespace     DoomTay
// @description   Replaces media embed tags with HTML5 equivalents
// @include       *
// @version       1.1.2
// @exclude       *.svg
// @grant         none

// @downloadURL https://update.greasyfork.org/scripts/16485/Embed%20to%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/16485/Embed%20to%20HTML5.meta.js
// ==/UserScript==

var embeds = document.embeds;

var audioFiletypes = [".mp3",".wav",".ogg"];
var videoFiletypes = [".mp4"];

var bgsound = document.querySelector("bgsound");
if(bgsound && audioFiletypes.some(type => decodeURIComponent(bgsound.getAttribute("src")).includes(type)))
{
	var replacement = document.createElement("audio");
	replacement.src = decodeURIComponent(bgsound.getAttribute("src"));
	replacement.style.display = "none";
	replacement.loop = parseBool(bgsound.getAttribute("loop")) || bgsound.getAttribute("loop") == "-1" || bgsound.getAttribute("loop") == "infinite";
	replacement.autoplay = "true";
	bgsound.parentNode.replaceChild(replacement, bgsound);

	if(bgsound.getAttribute("loop") && bgsound.getAttribute("loop") != "infinite" && parseInt(bgsound.getAttribute("loop")) > 0)
	{
		var playCount = parseInt(bgsound.getAttribute("loop")) - 1;

		replacement.addEventListener('ended', function(){
			if(playCount > 0)
			{
				playCount--;
				replacement.play();
			}
		});
	}
}

if(embeds.length > 0)
{
	for(var e = embeds.length - 1; e >= 0; e--)
	{
		if(audioFiletypes.some(type => embeds[e].src.includes(type))) var replacement = document.createElement("audio");
		else if(videoFiletypes.some(type => embeds[e].src.includes(type))) var replacement = document.createElement("video");
		else continue;
		replacement.src = decodeURIComponent(embeds[e].src);
		replacement.width = embeds[e].width;
		replacement.height = embeds[e].height;
		if(embeds[e].hidden) replacement.style.display = "none";
		replacement.autoplay = parseBool(embeds[e].getAttribute("autostart") || embeds[e].getAttribute("autoplay")) || audioFiletypes.some(elem => window.location.href.includes(elem));
		replacement.controls = parseBool(embeds[e].getAttribute("controller"));
		replacement.loop = parseBool(embeds[e].getAttribute("loop"));
		var oldEmbed;
		if(embeds[e].parentNode.nodeName == "OBJECT")
		{
			oldEmbed = embeds[e].parentNode.parentNode.replaceChild(replacement, embeds[e].parentNode);
		}
		else
		{
			oldEmbed = embeds[e].parentNode.replaceChild(replacement, embeds[e]);
		}
		if(oldEmbed.name)
		{
			replacement.setAttribute("name", oldEmbed.name);
			document[replacement.getAttribute("name")] = replacement;
		}
	}
}

function getBitrate(media)
{
	console.log(media);
	return 44;
}

function parseBool(string)
{
	return string == "true";
}