// ==UserScript==
// @name         YouTube Shorts Redirect (instant - no page reload)
// @namespace    Violentmonkey Scripts
// @match        https://www.youtube.com/*
// @grant        none
// @version      1.1.3
// @author       @denisde4ev
// @description  instantly replaces shorts UI with video UI, without page reload! very fast!
// @description  (well no reload unless it's loading the page of shorts, then its faster to redirect instead of waiting `history` events to start listening from youtube)
// @description  
// @description  started on 2025-03-11; last working test: 2025-06-29
// @run-at       document-start
// @homepage     https://github.com/denisde4ev/html-css-js/blob/master/js/user-scripts/yt-shorts-redirect/b.js
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/541085/YouTube%20Shorts%20Redirect%20%28instant%20-%20no%20page%20reload%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541085/YouTube%20Shorts%20Redirect%20%28instant%20-%20no%20page%20reload%29.meta.js
// ==/UserScript==


/*
2025-07-20
known bug: when loading sometimes youtube wont stop stop the short and play in background,
so it should first pause old player, then redirect
*/

// log id: 'js_Oozeiv4O'
//console.debug('hi js_Oozeiv4O, log to click and debug me');

{ // if already loading shorts, reload will be just as fast as continuing to load. (and history.current state is not available while loading ... so better reload)
	let url = document.location.href;
	if (url.startsWith('https://www.youtube.com/shorts/')) {
		// 'https://www.youtube.com/shorts/'.length
		// location.replace('https://www.youtube.com/watch?v='+url.slice(31));
		location.replace('https://youtube.com/v/'+url.slice(31)); // `/v` I'm leaving it like this to indicate page loading
		return; // return as page will be reloaded, and script run again without going to this `if` case
		// well, yes. this time will reload page. my test on my PC shows its faster then waiting for YT & history events to starts listening.
	}
}




document.addEventListener("yt-navigate-start", () => {

	try {
		// idk if possible to get history.state but no .endpoint
		if (history.state.endpoint.commandMetadata.webCommandMetadata.webPageType !== "WEB_PAGE_TYPE_SHORTS") return;
	} catch (e) {
		console.error('js_Oozeiv4O:', e);
		return;
	}

	let endpoint = history.state.endpoint;
	let videoId = endpoint.reelWatchEndpoint.videoId;
	history.replaceState(
		{
			"endpoint": {
				"clickTrackingParams": endpoint.clickTrackingParams,
				"commandMetadata": {
					"webCommandMetadata": {
						"url": `/watch?v=${videoId}`, // history.state.endpoint.commandMetadata.webCommandMetadata.url
						"webPageType": "WEB_PAGE_TYPE_WATCH",
						"rootVe": endpoint.commandMetadata.webCommandMetadata.rootVe,
					}
				},
				"watchEndpoint": {
					"videoId": videoId,
					//"playerParams": "?????????????????",
					//"watchEndpointSupportedOnesieConfig": {
					//	"html5PlaybackOnesieConfig": {
					//		"commonConfig": {
					//			"url": "https://rr5---?????.googlevideo.com/initplayback?source=youtube&?????",
					//		}
					//	}
					//}
				}
			},

			// seems like it's not important:
			//"JSC$25806_savedComponentState": {},
			//"JSC$26628_savedComponentState": {...},
			"entryTime": history.state.entryTime,
		},
		document.title,
		`https://www.youtube.com/v/${videoId}`, // `/v` I'm leaving it like this to indicate page loading
	);

	history.go(-1);
	setTimeout(_ => {
		history.go(1);
	}, 0);

});
