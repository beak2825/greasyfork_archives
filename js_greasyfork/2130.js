// ==UserScript==
// @name            La7.tv direct link
// @name:it         La7.it - Link diretti
// @namespace       http://andrealazzarotto.com/
// @version         3.1.0
// @description     This script gives you the direct link while watching a video on La7.it
// @description:it  Ottieni il link diretto ai video su La7.it
// @author          Andrea Lazzarotto
// @match           https://la7.it/*
// @match           https://*.la7.it/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @grant           unsafeWindow
// @connect         kdam.iltrovatore.it
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/2130/La7tv%20direct%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/2130/La7tv%20direct%20link.meta.js
// ==/UserScript==

/* Greasemonkey 4 wrapper */
if (typeof GM !== "undefined" && !!GM.xmlHttpRequest)
  GM_xmlhttpRequest = GM.xmlHttpRequest;

var appendURL = function(element, url, entry_id) {
    var identifier = 'direct-link-' + entry_id;
    if ($('#' + identifier).length)
        return;
	element.after('<div id="' + identifier + '"></div>');
	$('#' + identifier).css({
		'padding': '5px 0',
		'margin': '15px auto',
		'width': '20rem',
		'max-width': '90%',
		'border': '1px solid #888',
		'text-align': 'center',
		'background-color': '#cfc',
		'box-shadow': '0px 5px 15px 0px rgba(0, 0, 0, .7)',
		'font-family': 'sans-serif'
	}).append("<a href='" + url + "'>MP4 Direct Link</a>");
	$("#direct-link-" + entry_id + " a")
		.css('color', 'black')
		.css('text-decoration', 'none')
		.css('font-size', '15px');
};

var handleObject = function(obj) {
    var content = obj.text();
	var entry_id = content.split('entry_id')[1].split('/')[1];

    // Prevent double matches
    if (content.indexOf("@context") > 0) {
        return;
    }

    // Use super-easy iOS URL when available
    console.log(content);
    console.log(unsafeWindow.iosUrl);
    if (content.indexOf('window.iosUrl') > 0 && unsafeWindow.iosUrl && unsafeWindow.iosUrl.indexOf('.mp4') > 0) {
        appendURL(obj.parent(), unsafeWindow.iosUrl, entry_id);
    }

    var hints = [];
    if (content.indexOf('"m3u8"') > 0) {
        hints = content.split('"m3u8"')[1].split('http')[1].split('"')[0].split(',').slice(1,-1);
    }

	// Thanks to: https://web.archive.org/web/20140330171953/http://www.leoiannacone.com/2014/03/il-caso-la7-it-e-la-questione-del-nuovo-player/
	var data_url = 'http://kdam.iltrovatore.it/p/103/sp/10300/playManifest/entryId/' + entry_id;
	console.log(data_url);
	GM_xmlhttpRequest({
		method: 'GET',
		url: data_url,
		headers: {
			'Accept': 'application/atom+xml,application/xml,text/xml'
		},
		onload: function(responseDetails) {
			var r = responseDetails.responseText;
			var doc = $.parseXML(r);
			var $xml = $(doc);

			var media_url = $xml.find("media").attr('url');
            if (!media_url) {
                // Skip DRM protected content
                return;
            }
            if (hints.length > 1) {
                media_url = media_url.replace(hints[0], hints[hints.length-1]);
            }
			appendURL(obj.parent(), media_url, entry_id);
		}
	});
};

$(document).ready(function(){
	var objects = $('script:contains("entry_id")');
	objects.each(function() {
        handleObject($(this));
    });
});