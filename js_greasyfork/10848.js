// ==UserScript==
// @name        YouTube Thumbnails - Full Video Thumbnails for YouTube
// @namespace   driver8.net
// @description Shows complete video thumbnails for YouTube videos. You can click a thumbnail image to jump to that point in the video.
// @match		*://*.youtube.com/*
// @version     0.4.12
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant       GM_addStyle
// @grant		unsafeWindow
// @grant		GM_registerMenuCommand
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_xmlhttpRequest
// @run-at 		document-idle
// @downloadURL https://update.greasyfork.org/scripts/10848/YouTube%20Thumbnails%20-%20Full%20Video%20Thumbnails%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/10848/YouTube%20Thumbnails%20-%20Full%20Video%20Thumbnails%20for%20YouTube.meta.js
// ==/UserScript==

var AND_BUTTS = GM_getValue('ytAndButts', false);
var BEFORE_TITLE = true;
var TIMEOUT_DELAY = 50;
var MAX_TRIES = 1;
var DIV_PADDING = 10;
var TD_PADDING = 2;
var DISABLE_SPF = GM_getValue('ytDisableSPF', false);
var MIN_WIDTH = 4;
var MAX_IMAGES = 400;
var LOGGING = true;

var $thumbDiv, $thumbHeader, $titleDiv, storyboard_spec, storyboard, best_size_idx, best_size, len_seconds = 0, video_id, current_id,
		tries, yp, mp, args, scriptStarted = false, scriptFinished = false, success = false;

function log(...msg) {
	LOGGING && console.log(...msg);
}

console.log("Hi, yt thumbs");

function findStuff(event) {
	event && console.log(event);
	if (!window.location.href.match(/watch\?/) || (scriptStarted && !scriptFinished)) {
        console.log('scriptStarted', scriptStarted, 'scriptFinished', scriptFinished);
		console.log("don't run");
		return;
	}
	console.log("started...");
	scriptStarted = true;
	scriptFinished = false;
    storyboard_spec = null;

    var m = document.location.href.match(/(?:watch\?.*v=|\/v\/)([\w\-=]+)/);
    current_id = m[1];
	if ($('#thumbDiv.yes-thumbs').size() > 0) {
        console.log('current_id', current_id, 'existing id', $('#thumbDiv.yes-thumbs').data('video_id'));
        if ($('#thumbDiv.yes-thumbs').data('video_id') === current_id) {
            scriptFinished = true;
            return;
        } else {
            $('#thumbDiv.yes-thumbs').remove();
        }
	} else if ($('#thumbDiv').size() > 0) { //no-thumbs
		$('#thumbDiv').remove();
    }

    try {
        console.log('trying ytplayer');
        yp = (window && window.ytplayer) || (unsafeWindow && unsafeWindow.ytplayer);
        args = yp.config.args;
        video_id = args.video_id;
        if (video_id === current_id) {
            storyboard_spec = args.storyboard_spec;
            len_seconds = parseInt(args.length_seconds);
            if (!storyboard_spec) {
                var pr = JSON.parse(args.player_response);
                storyboard_spec = pr.storyboards.playerStoryboardSpecRenderer.spec;
            }
        }
    } catch (e) {
        console.log('problem loading storyboard_spec from ytplayer.config', e);
    }
    if (video_id !== current_id || !storyboard_spec) {
        try {
            console.log('trying #movie_player');
            mp = document.querySelector('div#movie_player');
            if (mp === null) {
                var frame = document.querySelector('iframe#player-container');
                mp = frame.contentWindow.document.querySelector('div.html5-video-player');
            }
            //args = mp.getUpdatedConfigurationData().args;
            //video_id = args.video_id;
            video_id = mp.getVideoData().video_id;
            if (video_id === current_id) {
                //storyboard_spec = args.storyboard_spec;
                //len_seconds = parseInt(args.length_seconds);
                storyboard_spec = mp.getStoryboardFormat();
                len_seconds = parseInt(mp.getDuration());
            }
        } catch (e) {
            console.log('problem loading storyboard_spec from #movie_player', e);
        }
    }
	console.log('yp', yp, 'mp', mp, 'sb_spec', storyboard_spec);

	if (video_id === current_id && storyboard_spec) {
        tries = 0;
		tryTitle();
	} else {
        tryXHR1();
	}
}

function getInfoFromXHR(args) {
    console.log('args from xhr', args);
    storyboard_spec = args.storyboard_spec;
    len_seconds = parseInt(args.length_seconds);
    video_id = args.video_id;
    if (!storyboard_spec) {
        var pr = JSON.parse(args.player_response);
        console.log('player_response', pr);
        storyboard_spec = pr.storyboards.playerStoryboardSpecRenderer.spec;
    }
}

function tryXHR1() {
    console.log('trying get_video_info xhr');
    storyboard_spec = null;
    var oReq = new XMLHttpRequest();
    oReq.addEventListener('load', function(evt) {
        console.log('evt', evt, 'resp', this.response);
        try {
            var params = getParameters(this.responseText);
            getInfoFromXHR(params);
        } catch (e) {
            console.log('problem loading storyboard_spec from get_video_info xhr', e);
        } finally {
            if (video_id === current_id && storyboard_spec) {
                tryTitle();
            } else {
                tryXHR2();
            }
        }
    });
    oReq.open('GET', "https://www.youtube.com/get_video_info?asv=3&video_id=" + current_id);
    oReq.send();
}

function tryXHR2() {
    console.log('trying pbj xhr');
    storyboard_spec = null;
    var y = window.ytcfg || unsafeWindow.ytcfg;
    console.log('ytcfg', y);
    try {
        var reqHeaders = {
            //"Referer": document.location.href,
            "X-SPF-Previous": document.location.href,
            "X-SPF-Referer": document.location.href,
            "X-YouTube-Client-Name": y.data_.INNERTUBE_CONTEXT_CLIENT_NAME,
            "X-YouTube-Client-Version": y.data_.INNERTUBE_CONTEXT_CLIENT_VERSION,
            //"X-Youtube-Identity-Token": y.data_.XSRF_TOKEN,
            "X-Youtube-Identity-Token": y.data_.ID_TOKEN,
            "X-YouTube-Page-CL": y.data_.PAGE_CL,
            "X-YouTube-Page-Label": y.data_.PAGE_BUILD_LABEL,
            "X-YouTube-STS": y.data_.FILLER_DATA.player.sts,
            "X-YouTube-Utc-Offset": 0,
            "X-YouTube-Variants-Checksum": y.data_.VARIANTS_CHECKSUM
        };
        console.log('req headers', reqHeaders);

        var oReq = new XMLHttpRequest();
        oReq.addEventListener('load', function(evt) {
            console.log('evt', evt, 'resp', this.response);
            try {
                var args = this.response[2].player.args;
                getInfoFromXHR(args)
            } catch (e) {
                console.log('problem loading storyboard_spec from pbj xhr json', e);
            }
            tryTitle();
        });
        oReq.open('GET', document.location.href + '&pbj=1');
        oReq.responseType = 'json';
        for (var h in reqHeaders) {
            oReq.setRequestHeader(h, reqHeaders[h]);
        }
        oReq.send();
    } catch (e) {
        console.log('problem loading storyboard_spec from pbj xhr json', e);
        tryTitle();
    }
}

function tryTitle() {
	console.log('tryTitle');
	//$titleDiv = $('div#container.ytd-video-primary-info-renderer, div#info.ytd-watch, #watch-header');
    //$titleDiv = $('ytd-video-primary-info-renderer.ytd-watch-flexy, div#info.ytd-watch, #watch-header');
    $titleDiv = $('ytd-watch-metadata, div#info.ytd-watch-flexy, div#info.ytd-watch, #watch-header').first();
	if (!$titleDiv) { // || $titleDiv.prop('nodeName') !== 'DIV') {
		console.log("no title div");
		if (tries++ < MAX_TRIES) {
			console.log("trying again for title div");
			window.setTimeout(tryTitle, TIMEOUT_DELAY);
		} else {
			console.log("done trying for title div");
			scriptFinished = true;
		}
	} else {
		console.log('found title div', $titleDiv);
		setUp();
	}
}

function setUp() {
	if (storyboard_spec) {
        success = true;
		console.log('sb_spec', storyboard_spec);
		storyboard = parseStoryboardSpec(storyboard_spec);
		console.log('sb', storyboard);
		best_size_idx = chooseBestStoryboardSize(storyboard);
		best_size = storyboard.sizes[best_size_idx];
		console.log(best_size);
		if (! len_seconds > 0) {
			var len_str = $('div.ytp-progress-bar').attr('aria-valuemax') || yp.config.args.length_seconds;
			len_seconds = parseInt(len_str);
		}
		console.log("len: ", len_seconds);

		$thumbDiv = $('<div id="thumbDiv" class="style-scope yt-card yes-thumbs thumb-inactive"></div>');
        $thumbDiv.data('video_id', video_id);
		$thumbHeader = $('<h1 width="100%" class="title ytd-video-primary-info-renderer">Thumbnails</h1>');
		$thumbDiv.append($thumbHeader);
		$thumbDiv.click(showThumbs);
	} else if (unsafeWindow.ytplayer) {
		$thumbDiv = $('<div id="thumbDiv" class="style-scope yt-card no-thumbs"></div>');
		$thumbHeader = $('<h1 width="100%" class="title ytd-video-primary-info-renderer">No Thumbnails Available</h1>');
		$thumbDiv.append($thumbHeader);
	} else {
		console.log("Reload for thumbs");
		$thumbDiv = $('<div id="thumbDiv" class="style-scope yt-card no-thumbs"></div>');
		$thumbHeader = $('<h1 width="100%" class="title ytd-video-primary-info-renderer">Reload for Thumbnails</h1>');
		$thumbDiv.append($thumbHeader);
	}

	if (BEFORE_TITLE) {
		$titleDiv.before($thumbDiv);
	} else {
		$titleDiv.after($thumbDiv);
	}
	console.log($titleDiv);

	console.log("Script done");

	styleIt();

	console.log("finished.");
	scriptFinished = true;
}

function showThumbs(event) {
	var duration = best_size.duration / 1000;
	var num_thumbs = 1;
	if (duration > 0) {
		num_thumbs = Math.ceil(len_seconds / duration / best_size.cols / best_size.rows);
	} else {
		duration = len_seconds / best_size.cols / best_size.rows;
	}
	console.log("Thumb header clicked. Loading " + num_thumbs + " images.");
	var total_width = best_size.width * best_size.cols + DIV_PADDING * 2;
	var parent_diff = $thumbDiv.parent().innerWidth() - total_width;
	parent_diff < 0 && $thumbDiv.css({'left': + parent_diff + 'px'});
	// $thumbDiv.css({'position': 'relative', 'width': total_width + 'px'});
	// $thumbDiv.css({'position': 'relative'});
	$thumbDiv.removeClass('thumb-inactive');
	$thumbDiv.addClass('thumb-active');

//	Grab the youtube sessionlink ID for time links
	var sessionlink = $('#logo-container').data("sessionlink");

	var badImage = false;
	(function loadImage(imgNum) {
		if (badImage === false && imgNum < num_thumbs && imgNum < MAX_IMAGES) {
			// EX: https:\/\/i.ytimg.com\/sb\/2XY3AvVgDns\/storyboard3_L$L\/$N.jpg
			// EX: https://i.ytimg.com/sb/k4YRWT_Aldo/storyboard3_L2/M0.jpg?sigh=RVdv4fMsE-eDcsCUzIy-iCQNteI
			var link = storyboard.baseUrl.replace('\\', '');
			link = link.replace('$L', best_size_idx);
			link = link.replace('$N', best_size.img_name);
			link = link.replace('$M', imgNum);
            if (link.indexOf('?') > -1) {
                link += '&';
            } else {
                link += '?';
            }
			link += 'sigh=' + best_size.sigh;

			console.log(link);

			// Create a table for the timestamps over the image
			var $newTable = $('<table>');
			$newTable.addClass('imgTable');
			var x = imgNum * duration * best_size.rows * best_size.cols; // the starting time for this table
			var innerStr = '';
			var doclocation = document.location.href.replace(/\#.*/, '');
			for (var i = 0; i < best_size.rows; i++) {
				if (x <= len_seconds + 1) { // if we haven't reached the end of the video
					//console.log( 'x', x, 'len_seconds', len_seconds);
					innerStr += '<tr>';
					for (var j = 0; j < best_size.cols; j++) {
						innerStr += '<td><a href="' + doclocation + '#t=' + x + '" data-seek-to="' + x + '">';
						if (x <= len_seconds + 1) {
							var hrs = Math.floor(x / 3600);
							var mins = Math.floor((x % 3600) / 60);
							var secs = Math.round(x % 60);
							innerStr += hrs > 0 ? hrs + ':' : ''; // hrs
							innerStr += ( hrs > 0 && mins < 10 ? "0" + mins : mins ) + ':'; // mins
							innerStr += secs < 10 ? "0" + secs : secs; // secs
						}
						innerStr += '</a></td>';
						x += duration;
					}
					innerStr += '<tr>';
				}
			}
			$newTable.html(innerStr);
			$newTable.error(function() {
				badImage = true;
				$(this).remove();
				console.log("Hid bad image");
			});
			//$newTable.load(function() {
			//	loadImage(imgNum + 1);
			//});
			$newTable.css({'background-image': 'url(' + link + ')', 'width': best_size.width * best_size.cols});

			$thumbDiv.append($newTable);

			//setTimeout(loadImage, Math.min(LOAD_DELAY_START + imgNum * LOAD_DELAY_FACTOR, LOAD_DELAY_MAX), imgNum + 1);
			setTimeout(loadImage, 1, imgNum + 1);
		}

		$('.imgTable a').click(function(event) {
			event.preventDefault();
			var seekTime = parseInt($(this).data('seekTo'));
			console.log('seek time', seekTime);
			$('video.html5-main-video')[0].currentTime = seekTime;
			$('html, body').scrollTop(0);
			event.stopImmediatePropagation();
		});
	})(0);

	console.log("Done making thumb div");
	$thumbDiv.off('click');
	$thumbDiv.click(hideThumbs);
}

function hideThumbs(event) {
	if ($(event.target).is('#thumbDiv, #thumbDiv h1')) {
		$thumbDiv.children('table').hide();
		$thumbDiv.off('click');
		$thumbDiv.click(showThumbsAgain);
		$thumbDiv.removeClass('thumb-active');
		$thumbDiv.addClass('thumb-inactive');
	} else {
		$('html, body').scrollTop(0);
	}
}

function showThumbsAgain(event) {
	if ($(event.target).is('#thumbDiv, #thumbDiv h1')) {
		$thumbDiv.children('table').show();
		$thumbDiv.off('click');
		$thumbDiv.click(hideThumbs);
		$thumbDiv.removeClass('thumb-inactive');
		$thumbDiv.addClass('thumb-active');
	}
}

function parseStoryboardSpec(spec) {
	// EX: https:\/\/i.ytimg.com\/sb\/Pk2oW4SDDxY\/storyboard3_L$L\/$N.jpg|48#27#100#10#10#0#default#vpw4l5h3xmm2AkCT6nMZbvFIyJw|80#45#90#10#10#2000#M$M#hCWDvBSbgeV52mPYmOHjgdLFI1o|160#90#90#5#5#2000#M$M#ys1MKEnwYXA1QAcFiugAA_cZ81Q
	var sections = spec.split('|');
	console.log(sections);
	var sb = {
		sizes: [],
		baseUrl: sections.shift()
	};

	// EX: 80#45#90#10#10#2000#M$M#hCWDvBSbgeV52mPYmOHjgdLFI1o
	// EX: 160#		90#		90#		5#		5#		2000#	M$M#			ys1MKEnwYXA1QAcFiugAA_cZ81Q
	sections.forEach(function(value, idx) {
		var data = value.split('#');
		console.log(data);
		var new_size = {
			width : +data[0],
			height : +data[1],
			qual : +data[2], // image quality???
			cols : +data[3],
			rows : +data[4],
			duration : +data[5], // duration of each snapshot in milliseconds
			img_name : data[6],
			sigh : data[7]
		};
		sb.sizes[idx] = new_size;
	});
	console.log(sb);
	return sb;
}

function chooseBestStoryboardSize(sb) {
	var sizes = sb.sizes;
	var widest = 0;
	var widest_idx = -1;
	for (var i = 0; i < sizes.length; i++) {
		if (widest < sizes[i].width  || (widest == sizes[i].width && sizes[widest_idx].cols < sizes[i].cols)) {
			if (sizes[i].cols >= MIN_WIDTH) {
				widest = sizes[i].width;
				widest_idx = i;
			}
		}
	}
	return widest_idx;
}


function styleIt() {
	console.log("styling");

	var td_width = best_size ? best_size.width - 2 * TD_PADDING : 10;
	var td_height = best_size ? best_size.height - 2 * TD_PADDING : 10;
	var userStyles0 =
		"table.imgTable { border-collapse: collapse; background-repeat: no-repeat; cursor: auto; background-color: rgba(0, 0, 0, 0) !important; } " +
		".imgTable tbody { background-color: rgba(0, 0, 0, 0) !important; }" +
		".imgTable td { width: " + td_width + "px;" +
		" height: " + td_height + "px;" +
		" padding: " + TD_PADDING + "px;" +
		" border-width: 0px;" +
		" background-color: rgba(0, 0, 0, 0) !important;" +
		" vertical-align: top;" +
		"	color: white;" +
		"	    text-shadow:" +
		"			-1px -1px 0 #000, " +
		"			1px -1px 0 #000, " +
		"			-1px 1px 0 #000, " +
		"			1px 1px 0 #000;  " +
		" 	!important}" +
		".imgTable a { text-decoration: none; color: white; font-size: small; display: block; width: 100%; height: 100%; } " +
		"#thumbDiv { cursor: pointer; padding-right: var(--watch-sidebar-width); } " +
		//".thumb-inactive { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAD1BMVEXAwMABAQEBAQEAAAAAAADcECccAAAABHRSTlMAPEjK3fOUzQAAADFJREFUGNNjYGRmQQLMjAzMTAxIgImZgYUBBbDgFGBhIU0AZiluATIMxe9SDM+hex8AtbABVeH7XA4AAAAASUVORK5CYII=); }" +
		//".thumb-active { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAD1BMVEXAwMABAQEBAQEAAAAAAADcECccAAAABHRSTlMAPEjJRPrFdwAAACtJREFUGNNjYGRmQQLMjAzMTAxIgImZgYUBBbBQTQBmKW4BqluL4Tl07wMAnDABJd8eqrEAAAAASUVORK5CYII=); }" +
		".thumb-active h1 { margin-bottom: 2px; }" +
		".no-thumbs { cursor: default !important; }" +
		".no-thumbs h1 { color: grey !important; }";

	//.yt-simple-endpoint{display:inline-block;cursor:pointer;text-decoration:none;color:var(--yt-endpoint-color, hsl(0, 0%, 6.7%));}.yt-simple-endpoint:hover{color:var(--yt-endpoint-hover-color, var(--yt-endpoint-color));text-decoration: none;}
	var userStyles1 =
		"#video-title.old-endpoint.ytd-grid-video-renderer {" +
			"color:var(--yt-primary-color);" +
			"display:block;" +
			"max-height:3.2rem;" +
			"overflow:hidden;" +
			"font-size:1.4rem;" +
			"font-weight:500;" +
			"line-height:1.6rem;" +
		"}" +
		".old-endpoint{display:inline-block;cursor:pointer;text-decoration:none;color:var(--yt-endpoint-color, hsl(0, 0%, 6.7%));}.old-endpoint:hover{color:var(--yt-endpoint-hover-color, var(--yt-endpoint-color));text-decoration: none;}";
	GM_addStyle(userStyles0);
	GM_addStyle(userStyles1);
	window.setTimeout(killSPF, 500);

	console.log("DONE");
}

function killSPF() {
	return;
	if (DISABLE_SPF) {
		console.log('trying to kill SPF');
		$('a.spf-link, a.yt-simple-endpoint').each(function () {
			var $link = $(this);
			//console.log('$link', $link);
			$link.removeClass('spf-link');
			$link.removeClass('yt-simple-endpoint');
			$link.addClass('old-endpoint');
			$link.off();
		});
	}
	//AND_BUTTS && $('#info-contents h1.title').text($('#info-contents h1.title').text() + " and Butts");
}

function getParameters(str) {
    var r = {};
    str.split('&').forEach(str => {
        var split = str.split('=');
        r[split[0]] = decodeURIComponent(split[1]);
    });
    return r;
}

//GM_registerMenuCommand("Toggle SPF", function toggleSpf() {
//	DISABLE_SPF = !DISABLE_SPF;
//	console.log("Diable SPF: " + DISABLE_SPF);
//	GM_setValue('ytDisableSPF', DISABLE_SPF);
//}, 's');
//GM_registerMenuCommand("and Butts", function toggleButts() {
//	AND_BUTTS = !AND_BUTTS;
//	console.log("Butts: " + AND_BUTTS);
//	GM_setValue('ytAndButts', AND_BUTTS);
//}, 'b');

//<div>Icons made by <a href="http://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
// http://www.flaticon.com/free-icon/add-square-button_25300
//data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDMyOC45MTEgMzI4LjkxMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzI4LjkxMSAzMjguOTExOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTMxMC4xOTksMTguNzFDMjk3LjczNSw2LjI0MiwyODIuNjUsMC4wMDcsMjY0Ljk1MSwwLjAwN0g2My45NTRjLTE3LjcwMywwLTMyLjc5LDYuMjM1LTQ1LjI1MywxOC43MDQgICAgQzYuMjM1LDMxLjE3NywwLDQ2LjI2MSwwLDYzLjk2djIwMC45OTFjMCwxNy41MTUsNi4yMzIsMzIuNTUyLDE4LjcwMSw0NS4xMWMxMi40NjcsMTIuNTY2LDI3LjU1MywxOC44NDMsNDUuMjUzLDE4Ljg0M2gyMDEuMDA0ICAgIGMxNy42OTksMCwzMi43NzctNi4yNzYsNDUuMjQ4LTE4Ljg0M2MxMi40Ny0xMi41NTksMTguNzA1LTI3LjU5NiwxOC43MDUtNDUuMTFWNjMuOTYgICAgQzMyOC45MTEsNDYuMjYxLDMyMi42NjYsMzEuMTc3LDMxMC4xOTksMTguNzF6IE0yOTIuMzYyLDI2NC45NmMwLDcuNjE0LTIuNjczLDE0LjA4OS04LjAwMSwxOS40MTQgICAgYy01LjMyNCw1LjMzMi0xMS43OTksNy45OTQtMTkuNDEsNy45OTRINjMuOTU0Yy03LjYxNCwwLTE0LjA4Mi0yLjY2Mi0xOS40MTQtNy45OTRjLTUuMzMtNS4zMjUtNy45OTItMTEuOC03Ljk5Mi0xOS40MTRWNjMuOTY1ICAgIGMwLTcuNjEzLDIuNjYyLTE0LjA4Niw3Ljk5Mi0xOS40MTRjNS4zMjctNS4zMjcsMTEuOC03Ljk5NCwxOS40MTQtNy45OTRoMjAxLjAwNGM3LjYxLDAsMTQuMDg2LDIuNjYzLDE5LjQxLDcuOTk0ICAgIGM1LjMyNSw1LjMyOCw3Ljk5NCwxMS44MDEsNy45OTQsMTkuNDE0VjI2NC45NnoiIGZpbGw9IiMwMDAwMDAiLz4KCQk8cGF0aCBkPSJNMjQ2LjY4MywxNDYuMTg5SDE4Mi43M1Y4Mi4yMzZjMC0yLjY2Ny0wLjg1NS00Ljg1NC0yLjU3My02LjU2N2MtMS43MDQtMS43MTQtMy44OTUtMi41NjgtNi41NjQtMi41NjhoLTE4LjI3MSAgICBjLTIuNjY3LDAtNC44NTQsMC44NTQtNi41NjcsMi41NjhjLTEuNzE0LDEuNzEzLTIuNTY4LDMuOTAzLTIuNTY4LDYuNTY3djYzLjk1NEg4Mi4yMzNjLTIuNjY0LDAtNC44NTcsMC44NTUtNi41NjcsMi41NjggICAgYy0xLjcxMSwxLjcxMy0yLjU2OCwzLjkwMy0yLjU2OCw2LjU2N3YxOC4yNzFjMCwyLjY2NiwwLjg1NCw0Ljg1NSwyLjU2OCw2LjU2M2MxLjcxMiwxLjcwOCwzLjkwMywyLjU3LDYuNTY3LDIuNTdoNjMuOTU0djYzLjk1MyAgICBjMCwyLjY2NiwwLjg1NCw0Ljg1NSwyLjU2OCw2LjU2M2MxLjcxMywxLjcxMSwzLjkwMywyLjU2Niw2LjU2NywyLjU2NmgxOC4yNzFjMi42NywwLDQuODYtMC44NTUsNi41NjQtMi41NjYgICAgYzEuNzE4LTEuNzA4LDIuNTczLTMuODk3LDIuNTczLTYuNTYzVjE4Mi43M2g2My45NTNjMi42NjIsMCw0Ljg1My0wLjg2Miw2LjU2My0yLjU3YzEuNzEyLTEuNzA4LDIuNTYzLTMuODk3LDIuNTYzLTYuNTYzdi0xOC4yNzEgICAgYzAtMi42NjQtMC44NTItNC44NTctMi41NjMtNi41NjdDMjUxLjUzNiwxNDcuMDQ4LDI0OS4zNDUsMTQ2LjE4OSwyNDYuNjgzLDE0Ni4xODl6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==
// http://www.flaticon.com/free-icon/minus-button_25434
//data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQwMS45OTggNDAxLjk5OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDAxLjk5OCA0MDEuOTk4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTM3Ny44NywyNC4xMjZDMzYxLjc4Niw4LjA0MiwzNDIuNDE3LDAsMzE5Ljc2OSwwSDgyLjIyN0M1OS41NzksMCw0MC4yMTEsOC4wNDIsMjQuMTI1LDI0LjEyNiAgICBDOC4wNDQsNDAuMjEyLDAuMDAyLDU5LjU3NiwwLjAwMiw4Mi4yMjh2MjM3LjU0M2MwLDIyLjY0Nyw4LjA0Miw0Mi4wMTQsMjQuMTIzLDU4LjEwMWMxNi4wODYsMTYuMDg1LDM1LjQ1NCwyNC4xMjcsNTguMTAyLDI0LjEyNyAgICBoMjM3LjU0MmMyMi42NDgsMCw0Mi4wMTEtOC4wNDIsNTguMTAyLTI0LjEyN2MxNi4wODUtMTYuMDg3LDI0LjEyNi0zNS40NTMsMjQuMTI2LTU4LjEwMVY4Mi4yMjggICAgQzQwMS45OTMsNTkuNTgsMzkzLjk1MSw0MC4yMTIsMzc3Ljg3LDI0LjEyNnogTTM2NS40NDgsMzE5Ljc3MWMwLDEyLjU2NS00LjQ3LDIzLjMxNC0xMy40MTUsMzIuMjY0ICAgIGMtOC45NDUsOC45NDUtMTkuNjk4LDEzLjQxOC0zMi4yNjUsMTMuNDE4SDgyLjIyN2MtMTIuNTYzLDAtMjMuMzE3LTQuNDczLTMyLjI2NC0xMy40MTggICAgYy04Ljk0NS04Ljk0OS0xMy40MTgtMTkuNjk4LTEzLjQxOC0zMi4yNjRWODIuMjMxYzAtMTIuNTYzLDQuNDczLTIzLjMxNywxMy40MTgtMzIuMjY1QzU4LjkxLDQxLjAyMSw2OS42NjQsMzYuNTUsODIuMjI3LDM2LjU1ICAgIGgyMzcuNTQyYzEyLjU2NiwwLDIzLjMxOSw0LjQ3MSwzMi4yNjUsMTMuNDE3YzguOTQ1LDguOTQ3LDEzLjQxNSwxOS43MDIsMTMuNDE1LDMyLjI2NVYzMTkuNzcxTDM2NS40NDgsMzE5Ljc3MXoiIGZpbGw9IiMwMDAwMDAiLz4KCQk8cGF0aCBkPSJNMzE5Ljc2OSwxODIuNzMxSDgyLjIyN2MtMi42NjMsMC00Ljg1MywwLjg1NS02LjU2NywyLjU2NWMtMS43MDksMS43MTMtMi41NjgsMy45MDMtMi41NjgsNi41Njd2MTguMjcxICAgIGMwLDIuNjY5LDAuODU2LDQuODU5LDIuNTY4LDYuNTdjMS43MTUsMS43MDQsMy45MDUsMi41Niw2LjU2NywyLjU2aDIzNy41NDJjMi42NjMsMCw0Ljg1My0wLjg1NSw2LjU3MS0yLjU2ICAgIGMxLjcxMS0xLjcxMSwyLjU2Ni0zLjkwMSwyLjU2Ni02LjU3di0xOC4yNzFjMC0yLjY2NC0wLjg1NS00Ljg1NC0yLjU2Ni02LjU2N0MzMjQuNjE4LDE4My41ODcsMzIyLjQyOCwxODIuNzMxLDMxOS43NjksMTgyLjczMXoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K

//<div>Icons made by <a href="http://www.flaticon.com/authors/catalin-fertu" title="Catalin Fertu">Catalin Fertu</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
// http://www.flaticon.com/free-icon/minus-square-outlined-button_54373
//data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDYxMiA2MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMiA2MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iX3gzMl9fM18iPgoJCTxnPgoJCQk8cGF0aCBkPSJNNDIwLjc1LDI4Ni44NzVoLTIyOS41Yy0xMC41NTcsMC0xOS4xMjUsOC41NjgtMTkuMTI1LDE5LjEyNWMwLDEwLjU1Nyw4LjU2OCwxOS4xMjUsMTkuMTI1LDE5LjEyNWgyMjkuNSAgICAgYzEwLjU1NywwLDE5LjEyNS04LjU2OCwxOS4xMjUtMTkuMTI1QzQzOS44NzUsMjk1LjQ0Myw0MzEuMzA3LDI4Ni44NzUsNDIwLjc1LDI4Ni44NzV6IE01MzUuNSwwaC00NTlDMzQuMjUzLDAsMCwzNC4yNTMsMCw3Ni41ICAgICB2NDU5QzAsNTc3Ljc0NywzNC4yNTMsNjEyLDc2LjUsNjEyaDQ1OWM0Mi4yNDcsMCw3Ni41LTM0LjI1Myw3Ni41LTc2LjV2LTQ1OUM2MTIsMzQuMjUzLDU3Ny43NDcsMCw1MzUuNSwweiBNNTczLjc1LDUzNS41ICAgICBjMCwyMS4xMzMtMTcuMTE3LDM4LjI1LTM4LjI1LDM4LjI1aC00NTljLTIxLjEzMywwLTM4LjI1LTE3LjExNy0zOC4yNS0zOC4yNXYtNDU5YzAtMjEuMTMzLDE3LjExNy0zOC4yNSwzOC4yNS0zOC4yNWg0NTkgICAgIGMyMS4xMzMsMCwzOC4yNSwxNy4xMzYsMzguMjUsMzguMjVWNTM1LjV6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPC9nPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=
//
// http://www.flaticon.com/free-icon/add-square-outlined-interface-button_54731
//data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDYxMiA2MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDYxMiA2MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iX3gzMV9fMjZfIj4KCQk8Zz4KCQkJPHBhdGggZD0iTTQyMC43NSwyODYuODc1aC05NS42MjVWMTkxLjI1YzAtMTAuNTU3LTguNTY4LTE5LjEyNS0xOS4xMjUtMTkuMTI1Yy0xMC41NTcsMC0xOS4xMjUsOC41NjgtMTkuMTI1LDE5LjEyNXY5NS42MjUgICAgIEgxOTEuMjVjLTEwLjU1NywwLTE5LjEyNSw4LjU2OC0xOS4xMjUsMTkuMTI1YzAsMTAuNTU3LDguNTY4LDE5LjEyNSwxOS4xMjUsMTkuMTI1aDk1LjYyNXY5NS42MjUgICAgIGMwLDEwLjU1Nyw4LjU2OCwxOS4xMjUsMTkuMTI1LDE5LjEyNWMxMC41NTcsMCwxOS4xMjUtOC41NjgsMTkuMTI1LTE5LjEyNXYtOTUuNjI1aDk1LjYyNWMxMC41NTcsMCwxOS4xMjUtOC41NjgsMTkuMTI1LTE5LjEyNSAgICAgQzQzOS44NzUsMjk1LjQ0Myw0MzEuMzA3LDI4Ni44NzUsNDIwLjc1LDI4Ni44NzV6IE01MzUuNSwwaC00NTlDMzQuMjUzLDAsMCwzNC4yNTMsMCw3Ni41djQ1OUMwLDU3Ny43NDcsMzQuMjUzLDYxMiw3Ni41LDYxMiAgICAgaDQ1OWM0Mi4yNDcsMCw3Ni41LTM0LjI1Myw3Ni41LTc2LjV2LTQ1OUM2MTIsMzQuMjUzLDU3Ny43NDcsMCw1MzUuNSwweiBNNTczLjc1LDUzNS41YzAsMjEuMTMzLTE3LjEzNiwzOC4yNS0zOC4yNSwzOC4yNWgtNDU5ICAgICBjLTIxLjEzMywwLTM4LjI1LTE3LjExNy0zOC4yNS0zOC4yNXYtNDU5YzAtMjEuMTMzLDE3LjExNy0zOC4yNSwzOC4yNS0zOC4yNWg0NTljMjEuMTE0LDAsMzguMjUsMTcuMTM2LDM4LjI1LDM4LjI1VjUzNS41eiIgZmlsbD0iIzAwMDAwMCIvPgoJCTwvZz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K
//data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGFBMVEX///8AAAAAAAAAAAAAAAAAAAAAAAAAAABcYkG9AAAAB3RSTlMAIDxIgMDJoM584QAAADlJREFUGNOFjzkCACAIw4oU+P+PXREFM2bogeWR8AVXJNQROIhWiBRBjkJIM1J68c941Q5Lr3P1/gYInwHxRyFQjQAAAABJRU5ErkJggg==

//plus data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAD1BMVEXAwMABAQEBAQEAAAAAAADcECccAAAABHRSTlMAPEjK3fOUzQAAADFJREFUGNNjYGRmQQLMjAzMTAxIgImZgYUBBbDgFGBhIU0AZiluATIMxe9SDM+hex8AtbABVeH7XA4AAAAASUVORK5CYII=
//minus data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAD1BMVEXAwMABAQEBAQEAAAAAAADcECccAAAABHRSTlMAPEjJRPrFdwAAACtJREFUGNNjYGRmQQLMjAzMTAxIgImZgYUBBbBQTQBmKW4BqluL4Tl07wMAnDABJd8eqrEAAAAASUVORK5CYII=

function fallbackStartup() {
    window.setTimeout(() => {
        if (!scriptStarted && !scriptFinished && !success) {
            console.log('starting up using timed fallback');
            loopStartup();
        }
    }, 2000);
}

function loopStartup(evt) {
    console.log('spfdone or yt-navigate-finish', evt);
    success = false;
    theLoop(50);
}

function theLoop(i) {
    if (i-- > 0 && !success) {
        findStuff();
        window.setTimeout(theLoop, 100, i);
    };
}

//// CODE STOLEN FROM YoutubeCenter AND YouTubePlaylistAutoplayDisable TO DEAL WITH STUPID SPF.
// Runs the function when the page is loading and has finished loading
//window.addEventListener('readystatechange', findStuff);
// Runs the function when the page changes via SPF method: https://github.com/youtube/spfjs/
//window.addEventListener('spfdone', findStuff);
window.addEventListener('spfdone', loopStartup);
//window.addEventListener('yt-navigate', findStuff);
//window.addEventListener('yt-page-type-changed', findStuff);
//window.addEventListener('yt-navigate-finish', findStuff);
window.addEventListener('yt-navigate-finish', loopStartup);
//window.addEventListener('yt-navigate-finish', killSPF);
//findStuff();
//killSPF();
//loopStartup(0);
fallbackStartup();

// var old_open = XMLHttpRequest.prototype.open;
// XMLHttpRequest.prototype.open = function(...args) {
//     //console.log('xhr send', 'this', this, 'args', args);
//     if (args && args.length > 1 && args[1].match(/get_video_info/)) {
//         console.log('xhr send', 'this', this, 'args', args);
//         //console.log('=================== HERE HERE HERE ==================');
//         this.addEventListener('load', function() {
//             console.log('LOAD', this);
//             try {
//                 getInfoFromXHR(getParameters(this.responseText));
//                 tries = 0;
//                 tryTitle();
//             } catch (e) {
//                 console.log('problem loading storyboard_spec from xhr intercept', e);
//             }
//             findStuff();
//         });
//     }
//     old_open.apply(this, args);
// }

//VIMEO info
// video at https://vimeo.com/160190376
// source contains URL https://player.vimeo.com/video/160190376/config?byline=0&collections=0&context=Vimeo%5CController%5CClipController.main&default_to_hd=1&outro=nothing&portrait=0&share=1&title=0&watch_trailer=0&s=f32dd867feea75e8b71005f7793d4ba285958b4c_1472286552
// which is JSON with json.request.thumb_preview containing url, frame_height, frame_width, height, width, frames, columns
// json.request.thumb_preview.url = https://i.vimeocdn.com/1472189353-0x9b6eb1264f85669b1a37525cb5b4d18b9edc2b39/sprite/160190376/120?q=48&h=126&ver=1&w=224&n=4