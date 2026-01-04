// ==UserScript==
// @name        Rai.tv native video player and direct links
// @namespace   https://tampermonkey.net
// @author      Fork from Lazza
// @description This script allows you to watch and download videos on Rai.tv.
// @include     http://www*.rai.*/dl/RaiTV/programmi/media/*
// @include     https://www*.rai.*/dl/RaiTV/programmi/media/*
// @include     http://www*.rai.*/dl/RaiTV/tematiche/*
// @include     https://www*.rai.*/dl/RaiTV/tematiche/*
// @include     http://www*.rai.*/dl/*PublishingBlock-*
// @include     https://www*.rai.*/dl/*PublishingBlock-*
// @include     http://www*.rai.*/dl/replaytv/replaytv.*
// @include     https://www*.rai.*/dl/replaytv/replaytv.*
// @include     http://rai.it/*
// @include     https://rai.it/*
// @include     http://*.rai.it/*
// @include     https://*.rai.it/*
// @include     http://www.raiplay.it/*
// @include     https://www.raiplay.it/*
// @exclude     http://www.raiplay.it/dirette/*
// @exclude     https://www.raiplay.it/dirette/*
// @include     http://www.rainews.it/dl/rainews/*
// @include     https://www.rainews.it/dl/rainews/*
// @include     http://www.rainews.it/tgr/*
// @include     https://www.rainews.it/tgr/*
// @version     9.1.18
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @connect     rai.it
// @connect     rai.tv
// @connect     video.lazza.dk
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/514495/Raitv%20native%20video%20player%20and%20direct%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/514495/Raitv%20native%20video%20player%20and%20direct%20links.meta.js
// ==/UserScript==

/* Greasemonkey 4 wrapper */
if (typeof GM !== "undefined" && !!GM.xmlHttpRequest)
  GM_xmlhttpRequest = GM.xmlHttpRequest;

var MP4isOk = document.createElement('video').canPlayType('video/mp4');

function playerElement() {
	var selectors = [
        "#Player.Player",
        "div.player-container",
		"div.Player:has(video)",
		"div.Player:has(embed)",
		"div.Player",
		"div#Player",
		"div#idPlayer",
		"div.videoContainer:has(iframe)",
		"div.mediaRaiTV:has(iframe)",
		"div.entry-content > div:has(iframe)",
		"div.player-video",
];

	for (var k in selectors) {
		var PL = $(selectors[k]).get(0);
		if(PL)
			return $( PL );
	}

	return null;
}

function appendMsg(text, PL) {
	if(!PL)
		PL = playerElement();
	PL.append("<div id='subcontent'>" + text + "</div>");
	var wi = PL.width();
	var w = wi*0.6;
	$("#subcontent").css({
		"padding": "5px",
		"color": "white",
		'width': w+'px',
		"background": "rgba(0,0,0,0.5)",
		'margin': '15px auto'
	});
	$("#subcontent p").css({
		'margin': '.2em auto',
		'padding': 0
	});
	$("#subcontent a").css({
		'color': 'white',
		'font-weight': 'bold',
        'text-decoration': 'underline'
	});
}

function suggestAlternative(relinker) {
	appendMsg("<p>Link diretto non disponibile. Prova a scaricarlo con <code>youtube-dl</code>:</p><pre><code>youtube-dl \"" + relinker + "\"</code></pre><p>Attenzione! Alcuni video si possono salvare solo dall'Italia.</p>");
}

function placeHolder(url, kind, PL, remove) {
	remove = typeof remove !== 'undefined' ? remove : true;

	if(!PL)
		PL = playerElement();
	if(remove)
		$("#direct-link").remove();
	PL.append("<div id='direct-link' />");
	var wi = PL.width();
	var w = wi*0.6;

    $("#direct-link")
		.css({
			'padding': '5px',
			'margin': '10px auto 15px',
			'width': w+'px',
			'border': '1px solid #888',
			'text-align': 'center',
			'box-shadow': '0px 5px 15px 0px rgba(0, 0, 0, .7)',
			'background-color': '#cfc',
		})
        .append('<a href="'+url+'">' + kind + " Direct Link</a>");
	$("#direct-link a")
		.css({
			'font-size': '13px',
			'font-weight': 'normal',
			'color': 'black'
		});

    PL.css({
        'height': 'auto',
        'padding-bottom': 0,
    });
	PL.parent().css('overflow', 'visible');

    appendMsg('<center>' +
              '<iframe allowtransparency="true" style="width: 94px; height: 20px; position: relative; vertical-align: middle; display: inline-block;" src="https://www.facebook.com/v2.12/plugins/like.php?href=https%3A%2F%2Ffacebook.com%2FAndreaLazzarottoSoftware&layout=button_count&sdk=joey&share=false&show_faces=false" frameborder="0"></iframe>' +
              '&nbsp;&nbsp;—&nbsp;&nbsp;<a href="https://lazza.me/DonazioneScript">Fai una donazione</a>' +
              '</center>');
}

function setUP(url, kind) {
	if(kind.toLowerCase().indexOf("smooth") != -1 ||
			kind.toLowerCase().indexOf("csm") != -1)
		return;

	// fix spaces
	url = url.split(' ').join('%20');

	// check for server problems
	if(url.indexOf('Host') > 0 && url.indexOf('video.lazza.dk') > 0) {
		$("#direct-link").remove();
		appendMsg('Si è verificato un <b>problema temporaneo</b> con il server');
		return;
	}

	placeHolder(url, kind);
}

function decide(videoURL, videoURL_MP4, estensioneVideo) {
	if (videoURL_MP4) {
		// handle the relinker server-side
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://video.lazza.dk/rai?r=' + encodeURIComponent(videoURL_MP4),
			onload: function(responseDetails) {
				var r = responseDetails.responseText;
				if (!!r && r.length > 0)
					setUP(r, "MP4");
				else
					suggestAlternative(videoURL_MP4);
			}
		});
	}
	else if (videoURL) {
		// handle the relinker server-side
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://video.lazza.dk/rai?r=' + encodeURIComponent(videoURL),
			onload: function(responseDetails) {
				console.log(responseDetails);
				var r = responseDetails.responseText;
				if (!r) {
					return suggestAlternative(videoURL);
				}
				if (r.substr(r.length - 4).substr(0,1) == '.')
					estensioneVideo = r.substr(r.length - 3).toUpperCase();
				if(r.toLowerCase().indexOf("mms") === 0)
					setUP(r, "MMS Stream");
				else
					if(r.length > 0)
						setUP(r, estensioneVideo);
			}
		});
	} // end if (videoURL)
}

function parseQuery(hash) {
	var result = {};
	var parts = hash.split("&");
	for(var i = 0; i<parts.length; i++) {
		var pair = parts[i].split("=");
		result[pair[0]] = pair[1];
	}
	return result;
}

function purifyTitle(title) {
	return title.replace(/[^A-Za-z0-9]/gi," ").trim().replace(/\ +/gi,"_");
}

function setUpFromURL(url) {
	// get the original page content
	GM_xmlhttpRequest({
		method: 'GET',
		url: url,
		onload: function(responseDetails) {
			var r = responseDetails.responseText;
			// kill script tags to avoid execution (and errors!)
			r = r.replace(new RegExp('script', 'g'), 'dummy');
			r = $('<div></div>').append(r);

			var data = $(r).find("div#silverlightControlHost dummy").text();

			var videoURL = null;
			var videoURL_MP4 = null;
			var estensioneVideo = null;

			// set the correct variables
			try {
				videoURL = data.match(/videoURL = ["'](.*?)["']/)[1];
			}
			catch(e) {}
			try {
				videoURL_MP4 = data.match(/videoURL_MP4 = ["'](.*?)["']/)[1];
			}
			catch(e) {}
			try {
				estensioneVideo = data.match(/estensioneVideo = ["'](.*?)["']/)[1];
			}
			catch(e) {}

			decide(videoURL, videoURL_MP4, estensioneVideo);
		}
	});
}

$(document).ready(function(){

	unsafeWindow.createPlayer = function() { return false; };
    $("body").append("<style>iframe ~ .tagManagerError {display: none;}</style>");

	var isRaiPlay = !!$(".Player[data-video-url]").length;
	var isReplay = !!$("script[src*='/replaytv.js'], script[src*='/replaytv.dev.js']").length;
	var isTematiche = window.location.href.indexOf("tematiche") > 0;
	var isPublishingBlock = window.location.href.indexOf("PublishingBlock") > 0;
	var isRubriche = window.location.href.indexOf("rubriche") > 0;
    var isTGR = window.location.href.indexOf("rainews.it/tgr") > 0;
	var isMultiple = (isTematiche || isPublishingBlock || isRubriche);

    console.log("isRaiPlay: " + isRaiPlay);
	console.log("isReplay: " + isReplay);
	console.log("isTematiche: " + isTematiche);
	console.log("isPublishingBlock: " + isPublishingBlock);
	console.log("isRubriche: " + isRubriche);
	console.log("isMultiple: " + isMultiple);
    console.log("isTGR: " + isTGR);

	var frames = $("iframe[src*='/dl/objects/embed.html'], iframe[src*='/dl/ray/'], " +
			"iframe[src*='/dl/Rai/'], iframe[src*='/dl/siti/'], iframe[src*='ContentItem']");

	if (isRaiPlay) {
		var PL = $(".Player[data-video-url]");
		var relinker = PL.data('video-url');
		console.log(relinker);
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://video.lazza.dk/rai?r=' + encodeURIComponent(relinker),
			onload: function(responseDetails) {
				console.log(responseDetails);
				var r = responseDetails.responseText;
				if (!r) {
					return suggestAlternative(relinker);
				}
				var estensioneVideo = "";
				if (r.substr(r.length - 4).substr(0,1) == '.')
					estensioneVideo = r.substr(r.length - 3).toUpperCase();
				if(r.length > 0) {
                    setUP(r, estensioneVideo, PL);
                    PL.css('background-color', 'transparent');
					$("body").append("<style>.videoOverlay {display: none;}</style>");
				}
			}
		});
	}

	if(!isMultiple && !isReplay &&
		(unsafeWindow.videoURL || unsafeWindow.videoURL_MP4)) {
        console.log("[Has video URL]");

		var videoURL = $("meta[name=videourl]").attr("content");
		if(!videoURL)
			videoURL = unsafeWindow.videoURL;
		var videoURL_MP4 = $("meta[name=videourl_h264]").attr("content");
		if(!videoURL_MP4)
			videoURL_MP4 = unsafeWindow.videoURL_MP4;
		if(!videoURL_MP4)
			videoURL_MP4 = $("meta[name=videourl_mp4]").attr("content");
		var estensioneVideo = unsafeWindow.estensioneVideo;
		if(estensioneVideo)
			estensioneVideo = estensioneVideo.toUpperCase();
		else
			estensioneVideo = "Unknown";
		if(unsafeWindow.MediaItem.type == 'WMV')
			// avoid bug when estensioneVideo = CSM and MediaItem.type = WMV
			estensioneVideo = "WMV";

		decide(videoURL, videoURL_MP4, estensioneVideo);

	}
	// end Rai.tv "standard"

	else if(frames.length && !isReplay && !isMultiple) {
		var url = frames.attr("src");
		if(url.indexOf("embed.html") > 0)
			url = "http://www.rai.tv" + url.replace(/.*embed.html\?/, "");
		setUpFromURL(url);
	}

	// end iframes

    else if(isTGR) {
        $("div.Player").each(function() {
            var relinker = $(this).attr('data-mediaurl');
            if (relinker) {
                setTimeout(function() {
                    decide(relinker);
                    $("div.Player").parent().css('padding', 0);
                }, 1000);
            }
        });
    }

	else if(isMultiple && !isReplay) {
		if(unsafeWindow.videoURL) {
			document.videoURL = '';
			setInterval(function() {
				if(!playerElement())
					return;
				document.prevURL = document.videoURL;
				document.videoURL = unsafeWindow.videoURL;
				if(document.videoURL && (document.prevURL != document.videoURL)) {
					decide(document.videoURL);
				}
			}, 400);
		}
		else
			setInterval(function() {
				if(!playerElement())
					return;
				document.HprevId = document.Hid;
				document.Hid = $("div.Player").attr("data-id");
                console.log(document.Hid);
				if(!document.Hid)
					try {
						document.Hid = $("div.player-video iframe").attr("src").split("media/")[1].split(".html")[0];
					}
					catch(e) {}

				// remove video list click events to allow opening of "real" pages
				// if not on "tematiche"
				if(!isTematiche) {
					$(".listaVideo a").unbind("click");
				}
				if(document.Hid && (document.Hid != document.HprevId)) {
					var completeURL = "http://www.rai.tv/dl/RaiTV/" +
						"programmi/media/" + document.Hid + ".html";
					setUpFromURL(completeURL);
				}
			}, 400);
	}

	// end Tematiche

	else if($("script:contains('draw')").length > 0 ||
			$("div.infoVideo").length > 0) {
		var videoURL = $("script:contains('draw')").text().split("'")[1];
		if(videoURL !== null && videoURL.indexOf("relinker") > 0) {
			GM_xmlhttpRequest({
				method: 'GET',
				url: videoURL,
				headers: {
					'Accept': 'application/atom+xml,application/xml,text/xml'
				},
				onload: function(responseDetails) {
					var r = responseDetails.responseText;
					var doc = $.parseXML(r);
					var $xml = $( doc );

					var url = $xml.find("REF").attr("HREF");
					url = url.replace("http://", "mms://");

					setUP(url, "MMS Stream");
				}
			});
		}
		else if(videoURL !== null && videoURL.indexOf(".html") > 0) {
			setUpFromURL(videoURL);
		}
		else { // last try
			var PL = playerElement();
			var initParams = PL.find("param[name=initParams]").attr("value");
			if (initParams.indexOf("mediaUri") != -1) {
				var url = initParams.split("mediaUri=")[1].split(",")[0];
				decide(url, null, null); // decide will find the type
			}
		}
	}

	// end pages like report.rai.it

	else if(isReplay) {
		$(window).bind('hashchange', function(){
			var hash = window.location.hash.slice(1);
			var hashdata = parseQuery(hash);

			$("#direct-link + #subcontent").remove();
			$("#direct-link").remove();

			var identifier = hashdata.v;
			document.TheVideoNow = hashdata.v;
			if(identifier && document.TheVideoNow != document.TheVideoBefore) {
                var dataURL = "https://video.lazza.dk/rai";
                if("" + parseInt(identifier) === identifier) {
                    dataURL += "?i=" + hashdata.v;
                }
                else {
                    dataURL += "?r=" + unsafeWindow.replayTv.vid2data[identifier].h264;
                }

				GM_xmlhttpRequest({
					method: 'GET',
					url: dataURL,
					onload: function(responseDetails) {
						var r = responseDetails.responseText;
						if(r.length > 0)
							setUP(r, "MP4");
					}
				});
				document.TheVideoBefore = document.TheVideoNow;
			}

			$("a[name]").click(function() {
				setTimeout(unsafeWindow.onClickShowAll, 500);	// show the complete listing
			});
		});
		$(window).trigger( 'hashchange' );
		setTimeout(unsafeWindow.onClickShowAll, 500);			// show the complete listing
	}

	// end Rai Replay

	// handle RTMP based flash objects on Rai.it
	$("object").not("object object").each(function() {
		var o = $(this);
		var flashvars = o.find("param[name=flashvars]").attr("value");
		if(!flashvars)
			flashvars = o.find("embed").attr("flashvars");
		if(!flashvars)
			flashvars = "";
		var path = flashvars.replace(/.*percorso[^=]*=/gi, "")
				.replace(/&.*/gi, "").replace(/\?.*/gi, "");
		if(path.toLowerCase().indexOf("rtmp")!=-1) {
			var url = path.replace('mp4:','').replace('rtmp','http')
						.replace('.mp4','') + '.mp4';
			placeHolder(url, "MP4", o, false);
		}
	});
	// end code for flash videos

	// handle new pages with projekktor
	var pj;
	try {
		pj = unsafeWindow.projekktor();
	}
	catch (e) {
		pj = false;
	}
	if(pj) {
		var files = pj.media;
		var src = files[files.length - 1].file[0].src;
		var el = $('div.projekktor').parent();
		placeHolder(src, 'MP4', el);
		el.css('background', 'transparent');
	}
	// end projekktor

	// handle WP-Video
	$('div[class^="wp-video"]').each(function() {
		var url = $(this).find('video').attr('src');
		placeHolder(url, "MP4", $(this), false);
	});

	// handle jwplayer
	$('script:contains("jwplayer(")').each(function() {
		var content;
		try {
			content = $(this).text().split('sources:')[1].split('[{')[1].split('}]')[0];
		}
		catch (e) { return; }
		parts = content.split('file:').filter(function(x){return x.indexOf('m3u8') > 0;});
		if(parts.length) {
			var m3u8_url;
			try {
				m3u8_url = parts[0].split('"')[1];
			}
			catch (e) { return; }
			placeHolder(m3u8_url, 'M3U8 Stream', $(this).parent(), false);
			appendMsg(
				"<p>Ricordo che per registrare i video in formato M3U8 va utilizzato <code>avconv</code> o <code>ffmpeg</code>. " +
				"Maggiori informazioni <a href='http://lazza.me/1PLyi12'>cliccando qui</a>.</p>" +
				"<p style='text-align:right'>&mdash; Andrea</p>", $(this).parent());
		}

	});

}); // end document.ready