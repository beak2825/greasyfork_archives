// ==UserScript==
// @name         Stream to VLC
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Opens VLC from streaming sites
// @author       mattiadr, giuseppe-dandrea
// @match        http*://openload.co/*
// @match        http*://openloads.co/*
// @match        http*://oload.download/*
// @match        http*://oload.fun/*
// @match        http*://turbovid.me/*
// @match        http*://www.flashx.to/*
// @match        http*://www.flashx.tv/*
// @match        http*://www.flashx.sx/*
// @match        http*://www.rapidvideo.com/*
// @match        http*://wstream.video/*
// @match        www.video.mediaset.it/*
// @match        http*://speedvideo.net/*
// @match        http*://*mp4upload.com/embed*
// @match        http*://didattica.polito.it/portal/pls/portal/sviluppo.videolezioni.vis*
// @match        http*://didattica.polito.it/portal/pls/portal/sviluppo.pagina_corso.main?t=3&p_sottopagina=VC*
// @grant        window.close
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/34206/Stream%20to%20VLC.user.js
// @updateURL https://update.greasyfork.org/scripts/34206/Stream%20to%20VLC.meta.js
// ==/UserScript==

(function() {

/* global vars */
/*******************************************************************************************************************************************************************/
let url = null;
let suppress_close = false;

/* helper functions */
/*******************************************************************************************************************************************************************/
function play_url(url) {
	if (url !== null) {
		window.location.href = 'vlcs:' + url;
		if (GM_getValue("VLC_first_time", true)) {
			alert("Please always remember choice or you will need to edit source code (see Readme for more info)");
			GM_setValue("VLC_first_time", false);
		} else {
			new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
				//Comment the next line to be able  authorize xdg-open
				if (!suppress_close) window.close();
			});
		}
	}
}

function wait_until_video_click() {
	new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
		if ($('video')[0].src.indexOf('http') != -1) {
			url = $('video')[0].src;
			play_url(url);
		} else {
			wait_until_video_click();
		}
	});
}

function wait_until_wstream_click() {
	new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
		var video = $('video');
		url = find_valid_url(video);
		if (url) play_url(url)
		else wait_until_wstream_click();
	});
}

function wait_until_mediaset_ready() {
	new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
		if ($('video > source')[0].src.indexOf('http') != -1) {
			url = $('video > source')[0].src;
			play_url(url);
		} else {
			wait_until_mediaset_ready();
		}
	});
}

function find_valid_url(video_tag_list) {
	for (var i = 0; i < video_tag_list.length; i++) {
		if (video_tag_list[i].src && video_tag_list[i].src.indexOf('http') != -1 ) {
			return video_tag_list[i].src;
		}
	}
	return false;
}
/* pages functions */
/*******************************************************************************************************************************************************************/
let page = {};

page['openload.co'] = function() {
	$('#videooverlay').trigger('click');
	url = $('#olvideo_html5_api')[0].src;
}

page['openloads.co'] = page['openload.co'];
page['oload.download'] = page['openload.co'];
page['oload.fun'] = page['openload.co'];

page['turbovid.me'] = function() {
	$('html').removeClass(" js ");
	if ($('#video-content').length === 0) {
		//$('#container > h2').append("<h1 style=\"color:red;\">WAIT AND CLICK ON BUTTON</h1>");
		$('#container > h2').append("<h1 style=\"color:red;\">WAIT, THE BUTTON WILL BE PRESSED AUTOMATICALLY</h1>");
		new Promise((resolve) => setTimeout(resolve, 9000)).then(() => {
		   $('#btn_download').trigger('click');
		});
	} else {
		//$('#content > h2').append("<h1 style=\"color:red;\">CLICK ON VIDEO TO START VLC</h1>");
		wait_until_video_click();
	}
}

page['flashx.to'] = function() {
	if ($('video').size() === 0) {
		$('#main > center > h2').append("<h1 style=\"color:red;\">WAIT, THE BUTTON WILL BE PRESSED AUTOMATICALLY</h1>");
		new Promise((resolve) => setTimeout(resolve, 6000)).then(() => {
			$('#btn_download').trigger('click');
		});
	} else {
		new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
			url = $('video')[0].src;
			play_url(url);
		});
	}
}

page['flashx.tv'] = page['flashx.to'];

page['flashx.sx'] = function() {
	page['flashx.to']();

	$('body').append("<h1 id=\"info\" style=\"color:red;padding:20px\">CLICK ON VIDEO (until the ads end) TO START VLC.</h1>");
	$("#info").append("<h1 style=\"color:lime;padding:120px;font-size:15px;\">Remember to close the tab if the video is in an iframe, because the script cannot close tabs from iframes and probably there is a MINER in the site</h1>");
	$('body > center > div > div:nth-child(2) > div.BJPPopAdsOverlay').remove();
	wait_until_video_click();
}

page['rapidvideo.com'] = function() {
	url = $('video')[0].src;
}

page['wstream.video'] = function() {
	//$('#video-content > table > tbody > tr > td:nth-child(1) > h3').append("<h1 style=\"color:red;\">CLICK ON VIDEO TO START VLC</h1>");
	wait_until_wstream_click();
}

page['video.mediaset.it'] = function() {
	new Promise((resolve) => setTimeout(resolve, 3000)).then(() => {
		wait_until_mediaset_ready();
	});
}

page['speedvideo.net'] = function() {
	wait_until_video_click();
}

page['mp4upload.com'] = function() {
	new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
		url = $('video')[0].src;
		play_url(url);
	});
}

page['didattica.polito.it'] = function() {
	let vlcButton = $('<button class="btn btn-default btn-sm">PLAY ON VLC</button>');
	vlcButton.click(function() {
		let url_ = $('video > source')[0].src;
		play_url(url_);
	});
	$('#btnTag').after(vlcButton);
	$('#btnTag').after('\n&nbsp;&nbsp;\n');
	$('#portlet_corso_container > div > div > div.container-fluid > div > div.col-md-8 > div > div').append(vlcButton);
	suppress_close = true;
}

/* main */
/*******************************************************************************************************************************************************************/
for (let key in page) {
	// check if the key is inside page and not inherited from parent
	if (page.hasOwnProperty(key) && window.location.href.indexOf(key) != -1) {
		page[key]();
		play_url(url);
		break;
	}
}

})();
