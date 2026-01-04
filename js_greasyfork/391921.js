// ==UserScript==
// @name        Rai.tv native video player and direct links - LEGACY
// @namespace   http://andrealazzarotto.com
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
// @include     http://www.rainews.it/dl/rainews/*
// @include     https://www.rainews.it/dl/rainews/*
// @include     http://www.rainews.it/tgr/*
// @include     https://www.rainews.it/tgr/*
// @version     9.2.0
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require     https://unpkg.com/@ungap/from-entries@0.1.2/min.js
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @connect     rai.it
// @connect     rai.tv
// @connect     raiplay.it
// @connect     akamaized.net
// @connect     akamaihd.net
// @connect     msvdn.net
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/391921/Raitv%20native%20video%20player%20and%20direct%20links%20-%20LEGACY.user.js
// @updateURL https://update.greasyfork.org/scripts/391921/Raitv%20native%20video%20player%20and%20direct%20links%20-%20LEGACY.meta.js
// ==/UserScript==

/* Greasemonkey 4 wrapper */
if (typeof GM !== "undefined" && !!GM.xmlHttpRequest)
  GM_xmlhttpRequest = GM.xmlHttpRequest;

function fetch(params) {
    return new Promise(function(resolve, reject) {
        params.onload = resolve;
        params.onerror = reject;
        GM_xmlhttpRequest(params);
    });
}

var checkQuality = (url, rate) => {
    return fetch({
        method: 'GET',
        url: url,
        headers: {
            'User-Agent': 'raiweb',
            'Range': 'bytes=0-255',
        },
    }).then(
        (response) => {
            let headers = fromEntries(response.responseHeaders.split("\n").map(element => element.trim().toLowerCase().split(":")));
            let range = headers['content-range'] || '/0';
            let size = +(range.split('/').slice(1,)[0] || 0);
            let megabytes = Math.round(size / 1024 / 1024);
            if (size > 102400) {
                return { quality: rate, url: url, megabytes: megabytes };
            } else {
                return null;
            }
        },
        () => null
    );
}

var qualities = async (url) => {
    let bases = [];
    let rates = [5000, 3200, 2401, 2400, 1800, 1500, 1200, 800, 600, 400];
    if (url.indexOf('.m3u8') > 0) {
        let parts = url.replace(/\?.*/, '').split(',');
        // Verify all the rates
        const new_rates = parts.slice(1).map(value => value.replace(/\/.*/, '')).reverse().filter(value => !isNaN(value));
        // Handle single rate case
        if (new_rates.length) {
            rates = new_rates;
        } else {
            let rate = url.split('.mp4')[0].split('_').slice(-1)[0];
            rates = [rate];
        }
        const path = parts[0];
        let servers = [
            'creativemedia1.rai.it',
            'creativemedia2.rai.it',
            'creativemedia3.rai.it',
            'creativemedia4.rai.it',
            'creativemedia6-rai-it.akamaized.net',
            'creativemedia7-rai-it.akamaized.net',
            'download2.rai.it',
            'download2-geo.rai.it',
            'creativemediax1.rai.it',
            'creativemediax2.rai.it',
        ];
        let file_path;
        if (path.indexOf('akamaized.net') > 0 || path.indexOf('akamaihd.net') > 0) {
            const path_parts = path.split('.net/');
            file_path = '/' + path_parts[1];
        } else {
            const path_parts = path.split('msvdn.net/');
            const first = path_parts[1].replace(/^[^0-9]+/, '');
            file_path = first.slice(1);
        }
        // Fix the "/i/" prefix
        if (file_path.slice(0, 3) === '/i/') {
            file_path = file_path.replace('/i/', '/');
        }
        file_path = file_path.replace(/_[1-9]+0?0[01]\.mp4.*/, '_');
        if (file_path.indexOf('.mp4') > 0) {
            file_path = file_path.replace(/\.mp4.*/, '');
            rates = [''];
        }
        bases = servers.map(server => {
            return `http://${server}${file_path}${rates[0]}.mp4`;
        });
        console.log(bases);
    } else {
        bases.push(url);

        var ending = url.match(/_[1-9]+0?0[01]\.mp4/);
        if (!ending || !ending.length) {
            let result = await checkQuality(url, '');
            return [result].filter(value => (value !== null));
        }
    }

    let promises = [];
    bases.forEach(url => {
        var promise = Promise.all(rates.map(rate => {
            var quality_url = url.replace(/_[1-9]+0?0[01]\.mp4/, `_${rate}.mp4`);
            return checkQuality(quality_url, rate);
        }));
        promises.push(promise);
    });
    const groups = await Promise.all(promises);
    for (let i = 0; i < groups.length; i++) {
        const filtered = groups[i].filter(value => (value !== null));
        if (filtered.length) {
            return filtered;
        }
    }

    return [];
};

var solveRelinker = (url) => {
    var secure = url.replace('http://', 'https://');
    return fetch({
        method: 'HEAD',
        url: secure,
        headers: {
            'User-Agent': 'raiweb',
        },
    }).then(
        (response) => {
            let final = response.finalUrl;
            let valid = (final.indexOf('mp4') > 0 || final.indexOf('.m3u8') > 0) && final.indexOf('DRM_') < 0;
            if (valid) {
                return qualities(response.finalUrl).then(results => {
                    return results[0].url;
                });
            }
        }
    );
};

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
        "div.video-iframe",
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
    $("#subcontent").remove();
	PL.append("<div id='subcontent'>" + text + "</div>");
	$("#subcontent").css({
		"padding": "5px",
		"color": "white",
		'width': '60%',
        'min-width': '18rem',
        'max-width': '100%',
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

    var wrapper = PL.closest('.video-player-wrapper');
    if (!wrapper.length) {
        wrapper = $('<div class="video-player-wrapper" />');
        PL.wrap(wrapper);
    };
    var direct = $('<div id="direct-link" />');
    $('.video-player-wrapper').append(direct);
    direct.css({
			'padding': '5px',
			'margin': '10px auto 15px',
			'width': '60%',
        	'min-width': '18rem',
        	'max-width': '100%',
			'border': '1px solid #888',
			'text-align': 'center',
			'box-shadow': '0px 5px 15px 0px rgba(0, 0, 0, .7)',
			'background-color': '#cfc',
		})
        .append('<a href="'+url+'">' + kind + " Direct Link</a>");
	direct.find('a').css({
			'font-size': '13px',
			'font-weight': 'normal',
			'color': 'black'
		});

	wrapper.parent().css('overflow', 'visible');

    appendMsg('<center>' +
              '<iframe allowtransparency="true" style="width: 102px; height: 20px; position: relative; vertical-align: middle; display: inline-block;" src="https://www.facebook.com/v2.12/plugins/like.php?href=https%3A%2F%2Ffacebook.com%2FAndreaLazzarottoSoftware&layout=button_count&sdk=joey&share=false&show_faces=false" frameborder="0"></iframe>' +
              '&nbsp;&nbsp;—&nbsp;&nbsp;<a href="https://lazza.me/DonazioneScript">Fai una donazione</a>' +
              '</center>', $('.video-player-wrapper'));
}

function setUP(url, kind) {
	if(kind.toLowerCase().indexOf("smooth") != -1 ||
			kind.toLowerCase().indexOf("csm") != -1)
		return;

	// fix spaces
	url = url.split(' ').join('%20');

	placeHolder(url, kind);
}

function decide(videoURL, videoURL_MP4, estensioneVideo) {
	if (videoURL_MP4) {
		// handle the relinker client-side
        solveRelinker(videoURL_MP4).then(r => {
            setUP(r, "MP4");
        }).catch(() => {
            suggestAlternative(videoURL_MP4);
        });
	}
	else if (videoURL) {
		// handle the relinker client-side
        solveRelinker(videoURL).then(r => {
            if (r.substr(r.length - 4).substr(0,1) == '.') {
                estensioneVideo = r.substr(r.length - 3).toUpperCase();
            }
            setUP(r, estensioneVideo);
        }).catch(() => {
            suggestAlternative(videoURL);
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

function setUpFromURL(url) {
	// get the original page content
	GM_xmlhttpRequest({
		method: 'GET',
		url: url,
		onload: function(responseDetails) {
			var r = responseDetails.responseText;
			// kill script tags to avoid execution (and errors!)
			r = r.replace(new RegExp('script', 'g'), 'dummy');
			var data = $('<div></div>').append(r).html();

			var videoURL = null;
			var videoURL_MP4 = null;
			var estensioneVideo = null;

			// set the correct variables
			try {
				videoURL = data.match(/videoURL = ["'](.*?)["']/)[1];
			}
			catch(e) {}
            try {
                videoURL = data.match(/data-video-url="([^"]*)"/)[1];
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
    $("body").append(`
    <style>
        iframe~.tagManagerError {
            display: none;
        }

        @media screen and (max-width: 639px) {
            .videoOverlay {
                position: unset;
                height: auto;
                z-index: unset;
                padding-top: 0;
                padding-bottom: 0 !important;
                transform: scale(0.65);
                margin-left: -10vw;
                margin-right: -10vw;
                width: 120vw;
                transform-origin: top center;
                background: none;
                font-size: 6vw;
            }
            .videoOverlay *,
            .videoOverlay .button {
                font-size: inherit !important;
            }
        }
    </style>
    `);

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
			"iframe[src*='/dl/Rai/'], iframe[src*='/dl/siti/'], iframe[src*='ContentItem'], iframe[src*='iframe/video/']");

	if (isRaiPlay) {
		var PL = $(".Player[data-video-url]");
		var relinker = PL.data('video-url');
		console.log(relinker);
        solveRelinker(relinker).then(r => {
            var estensioneVideo = "";
            if (r.substr(r.length - 4).substr(0,1) == '.')
                estensioneVideo = r.substr(r.length - 3).toUpperCase();
            if(r.length > 0) {
                setUP(r, estensioneVideo, PL);
            }
        }).catch(() => {
            suggestAlternative(relinker);
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
        if(url.indexOf("/iframe/video") > 0)
            url = url.replace("/iframe/video", "/video");
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
				"<p>Ricordo che per registrare i video in formato M3U8 va utilizzato <code>ffmpeg</code>. " +
				"Maggiori informazioni <a href='http://lazza.me/1PLyi12'>cliccando qui</a>.</p>" +
				"<p style='text-align:right'>&mdash; Andrea</p>", $(this).parent());
		}

	});

}); // end document.ready