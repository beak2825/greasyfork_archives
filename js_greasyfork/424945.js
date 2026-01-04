// ==UserScript==
// @name         YouTube Watched Subscription Hider
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Remove (using Hide) watched videos from YouTube subscription page.
// @author       Surf Archer
// @icon         https://www.youtube.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @match        https://www.youtube.com/*
// @match        http://www.youtube.com/*
// @match        https://youtube.com/*
// @match        http://youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424945/YouTube%20Watched%20Subscription%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/424945/YouTube%20Watched%20Subscription%20Hider.meta.js
// ==/UserScript==
//
// VERSION HISTORY
//	x0.1	13-Apr-2021	Private internal version.
//	v0.2	01-Jan-2020	First public version.
//	v0.3	20-Jan-2023	Update hide endpoint name after YouTube changed it.
//	v0.4	27-Jan-2023	Update API call after YouTube changed it.
//	v0.5	20-Jun-2023	Update after YouTube changed it's page design and layout.

'use strict';

logMsg("Initialising Watched Subscription Hider...");

const DEBUG = false;
const INITIAL_DELAY_MS = 1500;
const RUN_EVERY_MS = 333;
const PERCENT_COMPLETE_HIDE = 90;
const DEBUG_HEARTBEAT_EVERY = (2 * 60);



// Setup code.
injectJS();



function injectJS() {
  logMsg("Injecting Javascript...");

  var script = document.createElement("script");
  script.type = "application/javascript";

  var textContent = ("(" + injectScript + ")();");

  textContent = textContent.replace("const DEBUG = false;", "const DEBUG = "+DEBUG+";");
  textContent = textContent.replace("const INITIAL_DELAY_MS = 0;", "const INITIAL_DELAY_MS = "+INITIAL_DELAY_MS+";");
  textContent = textContent.replace("const RUN_EVERY_MS = 0;", "const RUN_EVERY_MS = "+RUN_EVERY_MS+";");
  textContent = textContent.replace("const PERCENT_COMPLETE_HIDE = 0;", "const PERCENT_COMPLETE_HIDE = "+PERCENT_COMPLETE_HIDE+";");
  textContent = textContent.replace("const DEBUG_HEARTBEAT_EVERY = 0;", "const DEBUG_HEARTBEAT_EVERY = "+DEBUG_HEARTBEAT_EVERY+";");

  script.textContent = textContent;
  document.body.appendChild(script);

  logMsg("Javascript injected!");
}

function injectScript() {
  logMsg("Initialising subscriptionWatchedHide...");

  // This following consts get modified to "carry into" from the outer process during injection.
  const DEBUG = false;
  const INITIAL_DELAY_MS = 0;
  const RUN_EVERY_MS = 0;
  const PERCENT_COMPLETE_HIDE = 0;
  const DEBUG_HEARTBEAT_EVERY = 0;

  var currentBeat=0;

  if(!window.CryptoJS) {
    addScriptToPage("//cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js");
  }

  setTimeout(function(){setInterval(function(){hideWatched();}, RUN_EVERY_MS);}, INITIAL_DELAY_MS);
  //setTimeout(function(){hideWatched();}, INITIAL_DELAY_MS);

	function hideWatched() {
		if(DEBUG && ++currentBeat >= DEBUG_HEARTBEAT_EVERY) {
			logMsg("HEARTBEAT");
			currentBeat=0;
		}

		if(window.location.pathname.toLowerCase() == "/feed/subscriptions") {
			var foundVideo=false;
			//var grid=document.querySelector("ytd-section-list-renderer").querySelector("ytd-grid-renderer");
			//var section=grid.querySelector("ytd-item-section-renderer");

			//var subs=pageManager.querySelector('.style-scope.ytd-browse.grid.grid-4-columns[page-subtype="subscriptions"] #primary #contents');
			//var section=pageManager.querySelector('.grid[page-subtype="subscriptions"] #primary #contents');

			var pageManager=document.getElementById('page-manager');
			logDebug(pageManager);
			var sections=pageManager.querySelector('.ytd-browse.grid[page-subtype="subscriptions"] #primary #contents');
			logDebug(sections);
			//var section=sections.querySelector('ytd-item-section-renderer');
      var section=sections.querySelector('ytd-rich-grid-row');
			logDebug(section);

			while(section != null && !foundVideo) {
        //var video=section.querySelector('ytd-grid-video-renderer');
				var video=section.querySelector('ytd-rich-grid-media');
				if(video == null) {
					// Handle the full-width format (i.e., non-grid) video.
					video=section.querySelector("ytd-video-renderer");
				}
				while(video != null && !foundVideo) {
					if(video.data.hasOwnProperty("thumbnailOverlays")) {
						var to=video.data.thumbnailOverlays;
						if(to.length > 1) {
							if(to[0].hasOwnProperty("thumbnailOverlayResumePlaybackRenderer")) {
								if(to[0].thumbnailOverlayResumePlaybackRenderer.percentDurationWatched >= PERCENT_COMPLETE_HIDE) {
									foundVideo=true;
									hideVideo(video);
								}
							}
						}
					}
					if(video.isDismissed) {
						video.remove();
					}
					if(!foundVideo) {
						video=video.nextSibling;
					}
				}
				if(!foundVideo) {
					section=section.nextSibling;
				}
			}
		}
	}

	function hideVideo(video) {
		var ret=false;
		var vId=video.data.videoId;
		var vTitle=video.data.title.runs[0].text;
		logMsg("Hiding video. (ID: "+vId+"  Title: "+vTitle+")");
		if(doDismissal(video)) {
			ret=true;
		} else {
			logMsg("  Dismissal failed!");
		}
		video.remove();
		return ret;
	}

  // UTILITY FUNCTIONS.
	function getEndpoint(elem, endpointName) {
		var ret=null;
		var menuItems=elem.data.menu.menuRenderer.items;

		for (var i = 0; i < menuItems.length && ret === null; i++) {
      var se=menuItems[i].menuServiceItemRenderer.serviceEndpoint;
			if(endpointName in se) {
				ret=menuItems[i].menuServiceItemRenderer.serviceEndpoint;
			}
		}
		return ret;
	}

  function doDismissal(video) {
		var ret=false;
		//var ep=getEndpoint(video, "dismissalEndpoint");	// v0.2
		var ep=getEndpoint(video, "feedbackEndpoint");		// v0.3 20-Jan-2023 Youtube changed the endpoint name.

		// Build the body part.
		//var b={"context":{}, "items":[]};	// v0.2
		var b={"context":{}, "feedbackTokens":[]};		// v0.4 27-Jan-2023 Remove "items" since Youtube changed the API format.
		
		b.context=window.ytcfg.get("INNERTUBE_CONTEXT");
		b.context.client.screenWidthPoints=window.innerWidth;
		b.context.client.screenHeightPoints=window.innerHeight;
		b.context.client.screenPixelDensity=Math.round(window.devicePixelRatio || 1);
		b.context.client.screenDensityFloat=window.devicePixelRatio || 1;
		b.context.client.utcOffsetMinutes=-Math.floor((new Date).getTimezoneOffset());
		b.context.client.userInterfaceTheme="USER_INTERFACE_THEME_LIGHT";
		b.context.request.internalExperimentFlags=[];
		b.context.request.consistencyTokenJars=[];
		b.context.user={};
		b.context.clientScreenNonce=window.ytcfg.get("client-screen-nonce");

		//b.items[0] = ep.dismissalEndpoint.dismissal;	// v0.2
		//b.items[0] = ep.feedbackEndpoint.dismissal;			// v0.3 20-Jan-2023 Youtube changed the endpoint name.
    // v0.4 27-Jan-2023 Remove "items" since Youtube changed the API format.
		
		b.feedbackTokens[0] = ep.feedbackEndpoint.feedbackToken;	// v0.4 27-Jan-2023 Add "feedbackEndpoint" since Youtube changed the API format.

		// Add in the parts specific to the srcRow.
		b.context.clickTracking={"clickTrackingParams" : ep.clickTrackingParams};

		var s=JSON.stringify(b);
		
		// Now build the request.
		var r={"credentials": "include", "headers":{}, "referrer": "", "body": "", "method": "POST", "mode": "cors"};
		if(!("user-agent" in r.headers) && !("User-Agent" in r.headers)) {
			r.headers['User-Agent']=navigator.userAgent;
		}
		r.headers.Accept="*/*";
		r.headers['Accept-Language']=(navigator.language || navigator.userLanguage);
		r.headers['Content-Type']="application/json";
		r.headers.Authorization=sapisidHash();
		if(!("x-goog-authuser" in r.headers) && !("X-Goog-Authuser" in r.headers) && !("X-Goog-AuthUser" in r.headers)) {
			r.headers['X-Goog-AuthUser']=window.ytcfg.get("SESSION_INDEX");
		}
		r.headers['X-Origin']=window.location.origin;

		r.referrer=window.location.href;
		r.body=s;

		// Dispatch the fetch with the right key and wait for it to finish.
		var key=window.ytcfg.get("INNERTUBE_API_KEY");

		var url=window.location.origin+ep.commandMetadata.webCommandMetadata.apiUrl;
		var promise=fetch(url+"?key="+key, r);

		promise.then(value => {
			logDebug(promise);
			ret=true;
		});

		return ret;
	}


  // GENERIC UTILITY FUNCTIONS
  function addScriptToPage(s) {
    var script = document.createElement("script");
    script.setAttribute("src", s);
    document.body.appendChild(script);
  }

  function logDebug(msg, force=false) {
    if(DEBUG || force) {
      if(typeof msg === 'string') {
        console.debug("[yt-sub-watched-hide] "+msg);
      } else {
        console.debug("[yt-sub-watched-hide] Logging variable/object below...");
        console.debug(msg);
      }
    }
  }

  function logMsg(msg) {
    console.log("[yt-sub-watched-hide] "+msg);
  }

  function sapisidHash() {
    var ret="";

    // First get the cookie value.
    var cookies=decodeURIComponent(document.cookie).split(';');
    const SC1="SAPISIDHASH=";
    const SC2="__Secure-3PAPISID=";
    var cval="";
    for(var i=0; i < cookies.length && cval == ""; i++) {
      var c=cookies[i].trim();
      if(c.indexOf(SC1) == 0) {
        cval=c.substring(SC1.length, c.length);
      } else if(c.indexOf(SC2) == 0) {
        cval=c.substring(SC2.length, c.length);
      }
    }

    // Now generate the hash.
    if(cval != "") {
      var timeSecs = Math.floor(new Date().getTime()/1000);
      var s=timeSecs+" "+cval+" https://www.youtube.com"
      var h=CryptoJS.SHA1(s);
      s=h.toString();
      ret="SAPISIDHASH "+timeSecs+"_"+s;
    }
    return ret;
  }

  logMsg("Initialisation of YouTube Watched Subscription Hider finished...");
}

function logMsg(msg) {
  console.log("[yt-sub-watched-hide] "+msg);
}
