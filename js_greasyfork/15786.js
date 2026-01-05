// ==UserScript==
// @name         WorldStar Flash to <video>
// @namespace    http://kmcgurty.com
// @version      1.1
// @description  Replaces videos embedded with flash with the direct video
// @author       Kmc - admin@kmcdeals.com
// @match        *://*.worldstarhiphop.com/videos/*
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     vjsCSS https://vjs.zencdn.net/5.4.6/video-js.min.css
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/video.js/5.5.3/video.min.js
// @downloadURL https://update.greasyfork.org/scripts/15786/WorldStar%20Flash%20to%20%3Cvideo%3E.user.js
// @updateURL https://update.greasyfork.org/scripts/15786/WorldStar%20Flash%20to%20%3Cvideo%3E.meta.js
// ==/UserScript==
/* jshint -W097 */

(function() {
	'use strict';

	unsafeWindow.VIDEOJS_NO_BASE_THEME = false;
	window.VIDEOJS_NO_BASE_THEME = false;
	VIDEOJS_NO_BASE_THEME = false;

	var vjsCSS = GM_getResourceText("vjsCSS");
	GM_addStyle(vjsCSS);
	var vjsSkin = GM_getResourceText("vjsSkin");
	GM_addStyle(vjsSkin);

	//easier to read than having indexOf everywhere
	String.prototype.contains = function(array) {
		var contains = false,
			i;

		for (i = 0; i < array.length; i++) {
			contains = this.indexOf(array[i]) != -1;

			return contains;
		}
	};


	findFlashPlayer();

	function findFlashPlayer() {
		var flashObject = $("embed");

		if (flashObject[0]) {
			var flashVars = flashObject.attr('flashvars').split('&');

			for (var i = 0; i < flashVars.length; i++) {
				if (flashVars[i].contains([".mp4", ".webm", ".ogg"])) {

					var directMP4url = flashVars[i].replace("file=", "");

					replaceFlashPlayer(flashObject, directMP4url);

					return;
				} else if (flashVars[i].contains(["youtube.com", "youtu.be"])) {
					var youtubeURL = flashVars[i].replace("file=", "");

					youtubeURL = youtubeURL.replace("/v/", "/embed/");

					embedYoutubeVideo(flashObject, youtubeURL);

					return;
				}
			}

			//html5 <video> tag only accepts mp4, webm, ogg
			console.log(i, "Unable to replace the flash player (file type not supported)");
		}
	}


	function embedYoutubeVideo(divToReplace, youtubeURL) {
		$(divToReplace).replaceWith('<iframe type="text/html" width="640" height="390" src="' + youtubeURL + '" frameborder="0"/>');
	}


	function replaceFlashPlayer(divToReplace, videoSource) {

		var defaultPlayerVolume = .5;

		$(divToReplace).replaceWith('<video class="video-js vjs-sublime-skin" width="640" height="390" controls="controls" data-setup=\'{}\'>\
										 <source src="' + videoSource + '" type="video/mp4">\
									 </video>');

		var videoPlayer = $("video")[0];
		var userVolume = GM_getValue("video_volume", defaultPlayerVolume);

		videoPlayer.volume = userVolume;

		addListeners(videoPlayer);
	}

	function addListeners(videoPlayer) {
		videoPlayer.onvolumechange = function(volume) {
			GM_setValue("video_volume", videoPlayer.volume);
		};
	}

	MutationObserver = unsafeWindow.MutationObserver || unsafeWindow.WebKitMutationObserver;

	var observer = new MutationObserver(function(mutations, observer) {
		findFlashPlayer();
	});

	observer.observe(document, {
		subtree: true,
		attributes: true
	});
}());