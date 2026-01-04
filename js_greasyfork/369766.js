// ==UserScript==
// @name        Anime News Network HTML5 Video
// @namespace   DoomTay
// @description Replaces built-in Flash player with HTML5
// @include     https://www.animenewsnetwork.com/video/*
// @version     0.5.1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/369766/Anime%20News%20Network%20HTML5%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/369766/Anime%20News%20Network%20HTML5%20Video.meta.js
// ==/UserScript==

var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		mutation.addedNodes.forEach(findVideoScript);
	});
});

var config = { childList: true, subtree: true };
observer.observe(document, config);

for(var i = 0; i < document.scripts.length; i++)
{
	findVideoScript(document.scripts[i]);
}

function findVideoScript(start)
{
	if(start.nodeName == "SCRIPT" && start.src.includes("assets/bd277df0dd3412fa7734d08320ecbe1cd9089168.js"))
	{
		observer.disconnect();

		start.on("load",function()
		{
			var oldInit = window.Video.init_player;

			window.Video.init_player = function(vid)
			{
				if(vid.flashvars["GetVideo"])
				{
					this.init_player = null;
					this.initialized = true;

					$("flash-required-message").hide();

					jQuery.get(vid.flashvars["GetVideo"],function(data)
					{
						var newVideo = document.createElement("video");
						newVideo.width = 480;
						newVideo.height = 360;
						newVideo.controls = true;
						newVideo.src = data.querySelector("flv bitrate").textContent;
						newVideo.autoplay = document.location.hash == "#play-1";
						newVideo.poster = data.querySelector("Still").textContent;

						$("video-player-area").append(newVideo);
					})
				}
				else if(vid.flash.movie && (vid.flash.movie.includes("youtube") || vid.flash.movie.includes("hulu")))
				{
					//A proper replacement of Hulu's embed might not be possible, as their HTML5 embed URL is too different from the Flash one
					vid.flash.movie = vid.flash.movie.replace("http:","https:");

					window.UFO.pluginType = "npapi";

					window.UFO.hasFlashVersion = function(major, release) {
						if(major == 9 && release == 115) return true;
						else return (UFO.fv[0] > major || (UFO.fv[0] == major && UFO.fv[1] >= release));
					}

					oldInit.apply(this, arguments);
				}
				else oldInit.apply(this, arguments);
			}
		});
	}
}