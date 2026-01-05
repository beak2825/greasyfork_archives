// ==UserScript==
// @name        Ö1 – Simple <audio> Stream and Download
// @description Sendungen auf Ö1 schnell und einfach anhören und herunterladen
// @namespace   https://xmine127.tk/gm/
// @include     *://oe1.orf.at/*
// @include     *://loopstream01.apa.at/*#DOWNLOAD=*
// @version     1.1.0
// @grant       unsafeWindow
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/12848/%C3%961%20%E2%80%93%20Simple%20%3Caudio%3E%20Stream%20and%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/12848/%C3%961%20%E2%80%93%20Simple%20%3Caudio%3E%20Stream%20and%20Download.meta.js
// ==/UserScript==

function $A(collection) {
	return Array.prototype.slice.call(collection, 0);
};



function create_download_link(attributes) {
	var DOMDownloadLink = document.createElement("a");
	for(var attribute in attributes) {
		if(attributes.hasOwnProperty(attribute)) {
			DOMDownloadLink[attribute] = attributes[attribute];
		}
	}
	DOMDownloadLink.className = "userscript-audio-download";
	DOMDownloadLink.appendChild(document.createTextNode("Download"));
	return DOMDownloadLink;
}


if(window.location.hash.startsWith("#DOWNLOAD=")) {
	// Download link iframe page
	
	var downloadAttributes = JSON.parse(decodeURIComponent(window.location.hash.substr(10)));
	
	document.addEventListener("DOMContentLoaded", function()
	{
		// Inject style information
		inject_content();
		
		// Mark this page's content as not-important
		document.documentElement.className = "download-proxy";
		
		// Add the (important) download link
		document.body.appendChild(create_download_link(downloadAttributes));
	}, true);
	
	return;
}


document.addEventListener("DOMContentLoaded", function()
{
	// Inject extra page nodes and styles
	inject_content();
	
	// Detect if page URL inherently points to some stream
	var pageTrackID = window.location.pathname.match(/^\/programm\/(\d+).*$/);
	if(pageTrackID instanceof Array) {
		pageTrackID = parseInt(pageTrackID[1]);
	}
	
	// Define replacement function for stream window launcher
	var konsole_orig = unsafeWindow.konsole;
	var konsole = exportFunction(function(url, trackRestore) {
		var DOMPlayButton;
		var trackID;
		if(pageTrackID) {
			// Find play area on program pages
			DOMPlayButton = document.querySelector(".galleryitem > .overlay-7tage");
			
			// Assume that the page's inherent track should be played
			// (although parsing the requested URL would work too)
			trackID = pageTrackID;
		} else {
			// Guess the play button used to play the stream based on the received URL
			DOMPlayButton = document.querySelector(".has-7tage > a[href='" + url.replace("'", "\\'") + "']");
			
			// Determine track ID from URL requested by the caller
			var URLQuery = url.split("#")[0].split("?")[1];
			if(URLQuery) {
				var URLOptions = URLQuery.split("&");
				for(var i = 0; i < URLOptions.length; i++) {
					var URLOption = URLOptions[i];
					if(URLOption.substr(0, 9) == "track_id=") {
						trackID = parseInt(URLOption.substr(9));
						break;
					}
				};
			}
		}
		
		// Delegate to original handler if the target stream container could not be determined
		if(!trackID || !DOMPlayButton) {
			console.log("UserScript: Failed to determine stream container or track ID for URL: " + url);
			
			return konsole_orig(url);
		}
		
		var DOMStreamContainer = DOMPlayButton.parentNode.parentNode;
		
		// Generate title string from stream information
		var DOMStreamTitle = DOMStreamContainer.querySelector(".textbox > h3");
		var DOMStreamDate  = DOMStreamContainer.querySelector(".textbox > .datum");
		
		var title = "";
		if(DOMStreamTitle) {
			title += DOMStreamTitle.textContent.trim();
			
			if(title.substr(title.length - 1) == "*") {
				title = title.substr(0, title.length - 1).trim();
			}
		}
		if(DOMStreamDate) {
			title += (title != "") ? " vom " : "";
			title += DOMStreamDate.textContent.split("|")[1].trim();
		}
		
		// Hide "Play episode" button(s)
		$A(DOMPlayButton.parentNode.querySelectorAll(".overlay-playbutton")).forEach(function(DOMPlayButton) {
		    DOMPlayButton.style.display = "none";
		});
		
		// Find or add main container below container with information text
		var DOMStreamController = DOMStreamContainer.getElementsByClassName("userscript-audio-controller")[0];
		if(!DOMStreamController) {
			DOMStreamController = document.createElement("div");
			DOMStreamController.className = "userscript-audio-controller";
			DOMStreamContainer.appendChild(DOMStreamController);
		}
		
		// Show progress spinner in controller area
		var DOMLoadingSpinner = document.getElementById("fountainG");
		DOMLoadingSpinner.style.display = "block";
		DOMStreamController.appendChild(DOMLoadingSpinner);
		
		// Download playlist file for stream
		var XHRPlaylist = new XMLHttpRequest();
		XHRPlaylist.addEventListener("load", function() {
			if(XHRPlaylist.status != 200 || !XHRPlaylist.responseXML) {
				var status = XHRPlaylist.status + " " + XHRPlaylist.statusText;
				console.log("UserScript: Could not retrieve playlist file: " + status);
				
				return konsole_orig(url);
			}
			
			// Create list of audio tracks in stream playlist
			var playlist = [];
			$A(XHRPlaylist.responseXML.querySelectorAll("playlist > track")).forEach(function(XMLTrack) {
				var url = XMLTrack.getAttribute("url");
				if(url) {
					playlist.push(url);
				}
			});
			
			// Create <audio> tag (with UI) for episode
			var DOMAudioContainer = document.createElement("div");
			DOMAudioContainer.className = "userscript-audio-container";
			DOMStreamController.appendChild(DOMAudioContainer);
			var DOMAudio = document.createElement("audio");
			DOMAudio.controls = true;
			DOMAudio.preload  = "auto";
			DOMAudio.src      = playlist[0];
			DOMAudioContainer.appendChild(DOMAudio);
			
			// Create download link
			var downloadAttributes = {
				href:     playlist[0],
				download: title,
				target:   "_new",
				type:     "audio/mpeg"
			};
			
			if(navigator.product == "Gecko") {
				// Create <iframe> that contains download link on <audio> domain (thanks Mozilla...)
				var DOMDownloadFrame = document.createElement("iframe");
				DOMDownloadFrame.className = "userscript-audio-download";
				DOMDownloadFrame.src       = "//loopstream01.apa.at/welcome.aspx#DOWNLOAD=" + JSON.stringify(downloadAttributes);
				DOMStreamController.appendChild(DOMDownloadFrame);
			} else {
				// Other browser either support the "download" attribute – or they don't…
				// The one's that don't, won't support streaming the content and will therefor offer it for download
				// regardless... :-)
				DOMStreamController.appendChild(create_download_link(downloadAttributes));
			}
			
			// Hide progress spinner
			DOMLoadingSpinner.style.display = "none";
			
			// Track current playback position
			// (so that playback can be continued after page navigation)
			function setPlaybackHandler() {
				// Do not update state while stream hasn't initialized yet
				if(DOMAudio.readyState < 2) {
					return;
				}
				
				// Store state information for this stream
				try {
					var storage = window.localStorage;
					var keyName = "userscript" + "." + trackID;
					
					if(!DOMAudio.ended) {
						storage.setItem(keyName, JSON.stringify({
							playing:    !DOMAudio.paused,
							currentTime: DOMAudio.currentTime
						}));
					} else {
						storage.removeItem(keyName);
					}
				} catch(e) { console.log(e); /* Handle full storage gracefully */ }
			}
			DOMAudio.addEventListener("play",       setPlaybackHandler);
			DOMAudio.addEventListener("playing",    setPlaybackHandler);
			DOMAudio.addEventListener("seeked",     setPlaybackHandler);
			DOMAudio.addEventListener("timeupdate", setPlaybackHandler);
			DOMAudio.addEventListener("pause",      setPlaybackHandler);
			DOMAudio.addEventListener("ended",      setPlaybackHandler);
			
			// Seek to requested position (once the stream has initialized)
			DOMAudio.addEventListener("loadedmetadata", function() {
				// Read shared playback information
				var state = {};
				try {
					var storage = window.localStorage;
					var keyName = "userscript" + "." + trackID;
					
					state = JSON.parse(storage.getItem(keyName));
				} catch(e) { console.log(e); /* Handle failed JSON.parse() gracefully */ }
				
				if(typeof(state.currentTime) === "number") {
					DOMAudio.currentTime = state.currentTime;
				}
				
				if(state.playing !== true && trackRestore) {
					DOMAudio.pause();
				}
			});
			
			// Start playback
			DOMAudio.play();
		});
		XHRPlaylist.open("GET", "http://oe1.orf.at/programm/" + trackID + "/playlist", true);
		XHRPlaylist.send();
	}, unsafeWindow);
	
	// Replace page read-only stream window launcher function
	Object.defineProperty(unsafeWindow, "konsole", {
		value: konsole
	});
	
	
	
	// Auto-start playback, if the user was previously playing the stream of the current page
	if(pageTrackID) {
		konsole(null, true);
	}
});





function inject_content()
{
	// Inject extra HTML tags for loading indicator
	var DOMLoadingSpinner = document.createElement("div");
	DOMLoadingSpinner.id            = "fountainG";
	DOMLoadingSpinner.style.display = "none";

	for(var i = 1; i <= 8; i++) {
		var DOMLoadingItem = document.createElement("div");
		DOMLoadingItem.id        = "fountainG_" + i;
		DOMLoadingItem.className = "fountainG";
		DOMLoadingSpinner.appendChild(DOMLoadingItem);
	}

	document.body.appendChild(DOMLoadingSpinner);

	// Inject extra page styles for loading indicator
	var DOMStylesheet = document.createElement("style");
	DOMStylesheet.type      = "text/css";
	DOMStylesheet.innerHTML = (function () {/*
		html.download-proxy,
		html.download-proxy > body {
			margin:  0 !important;
			padding: 0 !important;
			height:  100%;
		}
		
		html.download-proxy > body > * {
			display: none !important;
		}
		
		html.download-proxy > body > .userscript-audio-download {
			display: block !important;
		}
		
		
		
		.userscript-audio-controller {
			display: inline-block;
			margin-top:  0.5em;
			margin-left: 196px;
			height: 32px;
		}
		
		.userscript-audio-download {
			text-indent: -9999px;
			width: 64px;
			background: #999494 url("//oe1.orf.at/static/img/ico-tile.png") repeat scroll -100px -1372px;
		}
		
		.userscript-audio-container {
			background-color: #5C5959;
			padding-right: 0.5em;
		}
		
		.userscript-audio-container,
		.userscript-audio-download {
			display: inline-block;
			vertical-align: top;
			height: 100%;
		}
		
		.userscript-audio-controller audio {
			background-color: white;
		}
		
		
		
		.overlay-download-liste,
		.galleryitem > .hover-infobar,
		.galleryitem > .overlay-download {
			display: none !important;
		}
		
		.gallery > .userscript-audio-container {
			margin-top: 0;
		}
		
		
		
		#fountainG{
			position:relative;
			width:84px;
			height:10px;
			margin:auto;
		}

		.fountainG{
			position:absolute;
			top:0;
			background-color:rgb(0,0,0);
			width:10px;
			height:10px;
			animation-name:bounce_fountainG;
				-o-animation-name:bounce_fountainG;
				-ms-animation-name:bounce_fountainG;
				-webkit-animation-name:bounce_fountainG;
				-moz-animation-name:bounce_fountainG;
			animation-duration:1.5s;
				-o-animation-duration:1.5s;
				-ms-animation-duration:1.5s;
				-webkit-animation-duration:1.5s;
				-moz-animation-duration:1.5s;
			animation-iteration-count:infinite;
				-o-animation-iteration-count:infinite;
				-ms-animation-iteration-count:infinite;
				-webkit-animation-iteration-count:infinite;
				-moz-animation-iteration-count:infinite;
			animation-direction:normal;
				-o-animation-direction:normal;
				-ms-animation-direction:normal;
				-webkit-animation-direction:normal;
				-moz-animation-direction:normal;
			transform:scale(.3);
				-o-transform:scale(.3);
				-ms-transform:scale(.3);
				-webkit-transform:scale(.3);
				-moz-transform:scale(.3);
			border-radius:7px;
				-o-border-radius:7px;
				-ms-border-radius:7px;
				-webkit-border-radius:7px;
				-moz-border-radius:7px;
		}

		#fountainG_1{
			left:0;
			animation-delay:0.6s;
				-o-animation-delay:0.6s;
				-ms-animation-delay:0.6s;
				-webkit-animation-delay:0.6s;
				-moz-animation-delay:0.6s;
		}

		#fountainG_2{
			left:10px;
			animation-delay:0.75s;
				-o-animation-delay:0.75s;
				-ms-animation-delay:0.75s;
				-webkit-animation-delay:0.75s;
				-moz-animation-delay:0.75s;
		}

		#fountainG_3{
			left:21px;
			animation-delay:0.9s;
				-o-animation-delay:0.9s;
				-ms-animation-delay:0.9s;
				-webkit-animation-delay:0.9s;
				-moz-animation-delay:0.9s;
		}

		#fountainG_4{
			left:31px;
			animation-delay:1.05s;
				-o-animation-delay:1.05s;
				-ms-animation-delay:1.05s;
				-webkit-animation-delay:1.05s;
				-moz-animation-delay:1.05s;
		}

		#fountainG_5{
			left:42px;
			animation-delay:1.2s;
				-o-animation-delay:1.2s;
				-ms-animation-delay:1.2s;
				-webkit-animation-delay:1.2s;
				-moz-animation-delay:1.2s;
		}

		#fountainG_6{
			left:52px;
			animation-delay:1.35s;
				-o-animation-delay:1.35s;
				-ms-animation-delay:1.35s;
				-webkit-animation-delay:1.35s;
				-moz-animation-delay:1.35s;
		}

		#fountainG_7{
			left:63px;
			animation-delay:1.5s;
				-o-animation-delay:1.5s;
				-ms-animation-delay:1.5s;
				-webkit-animation-delay:1.5s;
				-moz-animation-delay:1.5s;
		}

		#fountainG_8{
			left:73px;
			animation-delay:1.64s;
				-o-animation-delay:1.64s;
				-ms-animation-delay:1.64s;
				-webkit-animation-delay:1.64s;
				-moz-animation-delay:1.64s;
		}



		@keyframes bounce_fountainG{
			0%{
			transform:scale(1);
				background-color:rgb(0,0,0);
			}

			100%{
			transform:scale(.3);
				background-color:rgb(255,255,255);
			}
		}

		@-o-keyframes bounce_fountainG{
			0%{
			-o-transform:scale(1);
				background-color:rgb(0,0,0);
			}

			100%{
			-o-transform:scale(.3);
				background-color:rgb(255,255,255);
			}
		}

		@-ms-keyframes bounce_fountainG{
			0%{
			-ms-transform:scale(1);
				background-color:rgb(0,0,0);
			}

			100%{
			-ms-transform:scale(.3);
				background-color:rgb(255,255,255);
			}
		}

		@-webkit-keyframes bounce_fountainG{
			0%{
			-webkit-transform:scale(1);
				background-color:rgb(0,0,0);
			}

			100%{
			-webkit-transform:scale(.3);
				background-color:rgb(255,255,255);
			}
		}

		@-moz-keyframes bounce_fountainG{
			0%{
			-moz-transform:scale(1);
				background-color:rgb(0,0,0);
			}

			100%{
			-moz-transform:scale(.3);
				background-color:rgb(255,255,255);
			}
		}
	*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
	document.head.appendChild(DOMStylesheet);
}
