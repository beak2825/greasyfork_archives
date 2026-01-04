// ==UserScript==
// @name        Crunchyroll HTML5
// @namespace   DoomTay
// @description Replaces Crunchyroll's HTML5 player with an improved version
// @include     http://www.crunchyroll.com/*
// @include     https://www.crunchyroll.com/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/video.js/7.1.0/video.js
// @require     https://cdn.jsdelivr.net/npm/@videojs/http-streaming@1.10.5/dist/videojs-http-streaming.min.js
// @require     https://cdn.jsdelivr.net/npm/videojs-ima@1.5.1/dist/videojs.ima.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-ads/6.3.0/videojs-contrib-ads.js
// @require     https://cdn.jsdelivr.net/gh/Arnavion/libjass@b13173112df83073e03fdd209b87de61f7eb7726/demo/libjass.js
// @require     https://cdn.jsdelivr.net/npm/videojs-contrib-quality-levels@2.0.9/dist/videojs-contrib-quality-levels.min.js
// @require     https://cdn.jsdelivr.net/npm/videojs-http-source-selector@1.1.6/dist/videojs-http-source-selector.min.js
// @resource    vjsCSS https://cdnjs.cloudflare.com/ajax/libs/video.js/7.1.0/video-js.min.css
// @resource    libjassCSS https://cdn.jsdelivr.net/gh/Arnavion/libjass@b13173112df83073e03fdd209b87de61f7eb7726/demo/libjass.css
// @resource    vjsASSCSS https://cdn.jsdelivr.net/npm/videojs-ass@0.8.0/src/videojs.ass.css
// @resource    vjsASSJS https://cdn.jsdelivr.net/npm/videojs-ass@0.8.0/src/videojs.ass.js
// @resource    switcherCSS https://cdn.jsdelivr.net/npm/videojs-http-source-selector@1.1.6/dist/videojs-http-source-selector.min.css
// @resource    imaCSS https://cdn.jsdelivr.net/npm/videojs-ima@1.5.1/dist/videojs.ima.min.css
// @resource    adData https://static.crunchyroll.com/config/cx-vilos-ads/558.json?nnn=2
// @version     2.1.3
// @grant       none
// @run-at      document-start
// @no-frames
// @downloadURL https://update.greasyfork.org/scripts/32366/Crunchyroll%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/32366/Crunchyroll%20HTML5.meta.js
// ==/UserScript==

window.videojs = videojs;
//As we're loading from document-start, it will be much harder to get access to the page's "built in" libjass variable, so we'll set up our own.
if(!window.libjass) window.libjass = libjass;

//Load needed CSS.
createCSS(GM_getResourceURL("vjsCSS"));
createCSS(GM_getResourceURL("libjassCSS"));
createCSS(GM_getResourceURL("vjsASSCSS"));
createCSS(GM_getResourceURL("imaCSS"));
createCSS(GM_getResourceURL("switcherCSS"));


//Adding custom stylesheet after video is initialized so that the "default" stylesheet doesn't override it
var newStyleSheet = document.createElement("style");
newStyleSheet.rel = "stylesheet";
newStyleSheet.innerHTML = `.vjs-volume-panel.vjs-volume-panel-horizontal
{
	width: 9em;
}

.vjs-volume-panel .vjs-volume-control.vjs-volume-horizontal
{
	width: 5em;
	height: 3em;
	padding-right: 10px;}

.vjs-volume-panel .vjs-volume-control
{
	opacity: 1 !important;
}

.video-js .vjs-control-bar
{
	background-color:#333;
}

.video-js .vjs-play-progress, .video-js .vjs-volume-level, .video-js .vjs-load-progress div
{
	background-color:#f7931e;
}

.video-js .vjs-current-time
{
	display:block;
	padding-right: 0;
}

.video-js .vjs-time-divider
{
	display:block;
}

.video-js .vjs-duration
{
	display:block;
	padding-left: 0;
}

.newMarker
{
	width: 5px;
	height: 100%;
	background-color: white;
	position: absolute;
}`;
document.head.appendChild(newStyleSheet);

//@require won't really work for some of the plugins, so instead we'll load it in the page.
function loadPlugins()
{
	return Promise.all([createJS(GM_getResourceURL("vjsASSJS")),
	//createJS(GM_getResourceURL("qualityLevelsJS")),
	//createJS(GM_getResourceURL("switcherJS")),
	createJS("https://imasdk.googleapis.com/js/sdkloader/ima3.js")]);

	function createJS(scriptPath)
	{
		return new Promise(function(resolve)
		{
			var newScript = document.createElement("script");
			newScript.type = "text/javascript";
			newScript.src = scriptPath;
			newScript.onload = resolve;
			document.head.appendChild(newScript);
		})
	}
}

//Find the script that powers the embedSWF function so we can overwrite. This is why the script is set to load at document-start. This way, we have access to the function parameters, and more importantly, the function can be overwritten before the Flash plugin has a chance to load.
var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		mutation.addedNodes.forEach(findVilosScript);
	});
});

var config = { childList: true, subtree: true };
observer.observe(document, config);

var callbackCount = 0;
var lastPing = 0;
var pingIntervals = [];
var previousTime = 0;
var elapsed = 0;
var affiliateCode = "";

for(var i = 0; i < document.scripts.length; i++)
{
	findVilosScript(document.scripts[i]);
}

function findVilosScript(start)
{
	if(start.nodeName == "SCRIPT" && (start.src.includes("https://www.crunchyroll.com/versioned_assets/js/components/vilos_player") || start.src.includes("https://www.crunchyroll.com/versioned_assets/js/modules/view_templates/affiliate_iframe_embed")))
	{
		observer.disconnect();

		if(window.VilosPlayer) redoFunction();
		else start.addEventListener("load",function()
		{
			redoFunction();
		});

		function redoFunction()
		{
			window.VilosPlayer = (function () {
				var orig_function = window.VilosPlayer;

				return function () {
					orig_function.apply(this);

					this.load = function(container)
					{
						var baseID = "showmedia_video_player";

						var placeholder = document.getElementById(baseID);

						var newVideo = document.createElement("video");
						newVideo.id = baseID;
						newVideo.className = "video-js vjs-default-skin";
						newVideo.controls = true;
						newVideo.style.width = "100%";
						newVideo.style.height = "100%";
						newVideo.style.visibility = "visible";
						newVideo.style.overflow = "hidden";

						placeholder.parentNode.replaceChild(newVideo,placeholder);

						var config = this.config;


						Promise.all([getAdData(),loadPlugins()]).then(results => results[0]).then(function(adData)
						{
							var mediaID = config.analytics.legacy.media_id;
							var autoplay = config.player.autoplay;
							var streamFile = config.media.streams.find(stream => stream.format == "adaptive_hls" && (stream.hardsub_lang == null || stream.hardsub_lang == config.player.language));
							var subtitles = config.media.subtitles;
							var initialVolume = config.player.preferred_volume;
							var duration = config.media.metadata.duration / 1000;
							//affiliateCode = config.getElementsByTagName("default:affiliateCode")[0].textContent;

							var streamObject = {};
							streamObject.media_id = config.analytics.legacy.media_id;
							streamObject.video_encode_id = config.analytics.legacy.video_encode_id;
							streamObject.media_type = config.analytics.legacy.media_type;

							//pingIntervals = config.getElementsByTagName("default:pingBackIntervals")[0].textContent.split(" ");

							if(config.player.autoplay) newVideo.autoplay = true;

							var adSlots = config.media.ad_breaks;

							var player = window.videojs(baseID, {
								sources: [
									{src: streamFile.url, type: 'application/x-mpegURL'}
								],
								poster: config.media.thumbnail.url,
								plugins: {
									httpSourceSelector:
									{
										default: 'auto'
									}
								},
								controlBar: {
									children: [
										'playToggle',
										'progressControl',
										'currentTimeDisplay',
										'timeDivider',
										'durationDisplay',
										'playbackRateMenuButton',
										'chaptersButton',
										'subtitlesButton',
										'captionsButton',
										'httpSourceSelector',
										'fullscreenToggle',
										'volumePanel'
									]
								}},function()
								{
								jumpAhead();
								if(autoplay) player.play();

								if(subtitles.length > 0)
								{
									var firstSub = subtitles.find(sub => sub.language == config.player.language) || subtitles[0];

									var vjs_ass = player.ass({
										"src": [firstSub.url],
										"label": firstSub.title,
										"srclang": firstSub.language,
										"enableSvg": false,
										"delay": 0
									});

									for(var s = 0; s < subtitles.length; s++)
									{
										if(subtitles[s] == firstSub) continue;
										vjs_ass.loadNewSubtitle(subtitles[s].url,subtitles[s].title,subtitles[s].language,false);
									}
								}
							});

							if(adSlots && adSlots.length > 0)
							{
								window.EVS = {};
								window.EVS.player = player;
								window.EVS.config = config;
								window.vilos = {};
								window.vilos.config = config;

								function substituteParams(url)
								{
									for(var m = 0; m < adData.setup.maps.length; m++)
									{
										if(adData.setup.maps[m].name == "adBreakType") continue;
										if(typeof adData.setup.maps[m].callback == "string")
										{
											if(adData.setup.maps[m].callback.includes("EVS.adService")) continue;
											if(adData.setup.maps[m].callback.startsWith("function")) url = url.replace("{" + adData.setup.maps[m].name + "}", eval("(" + adData.setup.maps[m].callback + ")();"));
											else url = url.replace("{" + adData.setup.maps[m].name + "}", eval(adData.setup.maps[m].callback));
										}
									}

									return url;
								}

								var slots = adData.setup.creatives;

								var midrollGroupCount = 0;

								var markers = [];

								var vmapString = '<\?xml version="1.0" encoding="UTF-8"?><vmap:VMAP xmlns:vmap="http://www.iab.net/videosuite/vmap" version="1.0">';
								for(var s = 0; s < adSlots.length; s++)
								{
									var adUrls = Array.from(slots,ad => ad.resource);

									var selectedUrl = "";

									switch(adSlots[s].type)
									{
										case "preroll":
											var slotCount = adData.setup.placements[0].context.preroll.adSlots;

											for(var a = 0; a < slotCount; a++)
											{
												var prerollSlots = slots.filter(slot => slot.resource.toLowerCase().includes("tpcl=preroll"));
												var slot = prerollSlots[prerollSlots.length - 1];
												selectedUrl = substituteParams(slot.resource);
												vmapString += '<vmap:AdBreak timeOffset="start" breakId="preroll"><vmap:AdSource id="preroll-ad-1" allowMultipleAds="false" followRedirects="true"><vmap:AdTagURI templateType="vast2"><![CDATA[' + selectedUrl + ']]></vmap:AdTagURI></vmap:AdSource></vmap:AdBreak>';
											}
											break;
										case "midroll":
											var adTime = adSlots[s].offset / 1000;
											var midSlotCount = adData.setup.placements[0].context.midroll.adSlots;

											if(!markers.includes(adTime))
											{
												markers.push(adTime);

												var newMarker = document.createElement("div");
												newMarker.className = "newMarker";
												newMarker.style.left = ((adTime / duration) * 100) - 0.5 + "%";
												player.el().querySelector('.vjs-progress-holder').appendChild(newMarker);
											}

											var minutes = Math.floor(adTime / 60);
											var seconds = adTime % 60;
											var hours = Math.floor(adTime / 3600);

											function padToTwo(number)
											{
												return ("0" + number).slice(-2);
											}

											var timeToReal = padToTwo(hours) + ":" + padToTwo(minutes) + ":" + padToTwo(seconds) + ".000";

											var midrollSlots = slots.filter(slot => slot.resource.toLowerCase().includes("tpcl=midroll"));
											var midSlot = midrollSlots[midrollSlots.length - 1];
											selectedUrl = substituteParams(midSlot.resource);

											for(var m = 0; m < midSlotCount; m++)
											{
												vmapString += '<vmap:AdBreak timeOffset="' + timeToReal + '" breakId="midroll-' + (midrollGroupCount + 1) + '"><vmap:AdSource id="midroll-' + (midrollGroupCount + 1) + '-ad-' + (m + 1) + '" allowMultipleAds="false" followRedirects="true"><vmap:AdTagURI templateType="vast2"><![CDATA[' + selectedUrl + ']]></vmap:AdTagURI></vmap:AdSource></vmap:AdBreak>';
											}

											midrollGroupCount++;
											break;
										default:
											break;
									}
								}

								vmapString += '</vmap:VMAP>';

								var options = {
									adsResponse: vmapString,
									vpaidMode: google.ima.ImaSdkSettings.VpaidMode.INSECURE
								};

								player.ima(options);
							}

							player.volume(initialVolume);

							player.on("seeking", function()
							{
								previousTime = this.currentTime();
							});

							player.on("volumechange", function()
							{
								localStorage.setItem('vilosPreferredVolume',player.volume().toFixed(2));
							});

							player.on("timeupdate", function()
							{
								if(!player.seeking())
								{
									var delta = this.currentTime() - previousTime;
									elapsed += delta;
									previousTime = this.currentTime();

									testPing();
								}
							});

							function jumpAhead()
							{
								var startTime = config.player.start_offset;
								if(startTime > 0) player.currentTime(startTime / 1000);
								previousTime = player.currentTime();
							}

							function testPing()
							{
								if((elapsed * 1000) >= 30)
								{
									ping(streamObject,(elapsed * 1000),player.currentTime());
									elapsed -= 30;
								}
							}
						});
					};
				};
			})();

			//In Chrome, the function replacing will have come "too late", and embedSWF will have to be called again.
			var initScript = Array.prototype.find.call(document.scripts, script => script.textContent.includes("vilosPlayer.load"));

			if(initScript)
			{
				var newScript = document.createElement("script");
				newScript.innerHTML = initScript.innerHTML;

				var parentNode = initScript.parentNode;

				parentNode.replaceChild(newScript,initScript);
			}
		}
	}
}

function setData(newCallCount,newPing)
{
	callbackCount = newCallCount;
	lastPing = newPing;
}

function createCSS(css)
{
	var newStyleSheet = document.createElement("link");
	newStyleSheet.rel = "stylesheet";
	newStyleSheet.href = css;
	document.head.appendChild(newStyleSheet);
}

function getAdData()
{
	return new Promise(function(resolve,reject)
	{
		var config = new XMLHttpRequest();
		config.onload = function()
		{
			if(this.status == 200) resolve(this.response);
			else if(this.status == 502) resolve(getAdData());
			else reject(this);
		};
		config.onerror = reject;
		config.open("GET", GM_getResourceURL("adData"), true);
		config.responseType = "json";
		config.send();
	});
}

function ping(streamData, newLastPing, playhead)
{
	var newCallCount = callbackCount + 1;
	var sinceLastPing = newLastPing - lastPing;
	sendPing(streamData,newCallCount,sinceLastPing,playhead);
	setData(newCallCount,newLastPing);
}

function sendPing(entry, callCount, timeSinceLastPing, playhead)
{
	var params = new URLSearchParams();
	params.set("current_page",window.location.href);
	params.set("req","RpcApiVideo_VideoView");
	params.set("media_id",entry.media_id);
	params.set("video_encode_id",entry.video_encode_id);
	params.set("media_type",entry.media_type);
	params.set("h",entry.ping_back_hash);
	params.set("ht",entry.ping_back_hash_time);
	params.set("cbcallcount",callCount);
	params.set("cbelapsed",Math.floor(timeSinceLastPing / 1000));
	if(!isNaN(playhead)) params.set("playhead",playhead);
	if(affiliateCode) params.set("affiliate_code",affiliateCode);

	var ping = new XMLHttpRequest();
	ping.open("POST", "/ajax/", true);
	ping.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	ping.send(params);
}

function GM_getResourceURL(resourceName)
{
	if(GM_info.script.resources[resourceName]) return GM_info.script.resources[resourceName].url;
	else
	{
		//The "built in" mimetype tends to be inaccurate, so we're doing something simpler to determine the mimetype of the resource
        var resourceObject = GM_info.script.resources.find(resource => resource.name == resourceName);
		var mimetype;
		if(resourceObject.url.endsWith(".swf")) mimetype = "application/x-shockwave-flash";
		else mimetype = resourceObject.meta;
		var dataURL = "data:" + mimetype + "," + encodeURIComponent(resourceObject.content);
		return dataURL;
	}
}