// ==UserScript==
// @name            Video.mediaset.it native video player and direct links
// @name:it         Mediaset Play - Link diretti e download video
// @namespace       http://andrealazzarotto.com
// @description     This script allows you to watch and download videos on Mediaset Play.
// @description:it  Ti permette di guardare e scaricare i video da Mediaset Play
// @match           https://mediasetinfinity.mediaset.it/*
// @match           https://*.mediasetinfinity.mediaset.it/*
// @match           https://*.mediasetplay.mediaset.it/*
// @match           https://www.mediaset.it/*
// @version         7.1.5
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require         https://unpkg.com/@ungap/from-entries@0.1.2/min.js
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @connect         mediaset.it
// @connect         video.mediaset.it
// @connect         cdnselector.xuniplay.fdnames.com
// @connect         execute-api.eu-west-1.amazonaws.com
// @connect         theplatform.eu
// @connect         akamaized.net
// @connect         mediaset.net
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/2129/Videomediasetit%20native%20video%20player%20and%20direct%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/2129/Videomediasetit%20native%20video%20player%20and%20direct%20links.meta.js
// ==/UserScript==

/* Greasemonkey 4 wrapper */
if (typeof GM !== "undefined" && !!GM.xmlHttpRequest) {
    GM_xmlhttpRequest = GM.xmlHttpRequest;
}

function fetch(params) {
    return new Promise(function(resolve, reject) {
        params.onload = resolve;
        params.onerror = reject;
        GM_xmlhttpRequest(params);
    });
}

var base_selector = "http://link.theplatform.eu/s/PR1GhC/media/guid/2702976343/[[GUID]]?mbr=true&formats=[[FORMATS]]&format=SMIL&assetTypes=HD,HBBTV,widevine,geoIT%7CgeoNo:HD,HBBTV,geoIT%7CgeoNo:HD,geoIT%7CgeoNo:SD,HBBTV,widevine,geoIT%7CgeoNo:SD,HBBTV,geoIT%7CgeoNo:SD,geoIT%7CgeoNo";
var loc = unsafeWindow.location;
var isIframe = loc.href.indexOf("player/") > 0;
var isPlay = loc.href.indexOf("mediasetplay.mediaset.it/video/") > 0;

function boxStyle(selector, color, textcolor) {
	$(selector).css({
		'padding': '.5em',
		'margin': '1em 4em',
		'text-align': 'center',
		'background-color': color,
		'color': textcolor,
        'position': isIframe ? 'absolute' : 'relative',
        'z-index': 200,
	});
	$(selector + ' a').css('color', textcolor);
    $(selector + ' pre').css({
        'white-space': 'pre-wrap',
        'word-break': 'break-all',
    });
    $(selector + ' *').css('font-size', '15px');
    $(selector + ' small').css('font-size', '13px');

    if (isIframe) {
        $('#video-links #close').remove();
        $('#video-links').css({
            'position': 'absolute',
            'bottom': '7em',
            'left': '5%',
            'right': '5%',
            'font-size': '.9em',
            'z-index': '99999999'
        }).append("<span id='close'>&times;</span>");
        $("#close").css({
            'font-weight': 'bold',
            'font-size': '2em',
            'position': 'absolute',
            'top': '0.5em',
            'right': '1em',
            'cursor': 'pointer'
        }).click(function() {
            $("#video-links").fadeOut();
        });
        $('#video-links a').attr('target', '_blank');
    }
}

function writeLive(stream) {
    $('#stream-url').remove();
	$('<div id="stream-url">').insertAfter($('#player-container').parent());
	$('#stream-url').append('<p>Flusso della diretta <strong>da aprire con VLC o <code>streamlink</code>:</strong></p>')
		.append('<pre><code><a href="' + stream + '">' + stream + '</a></code></pre>');
	boxStyle('#stream-url', 'rgba(255,255,255,0.5)', 'black');

	// kill login timeout
	unsafeWindow.userNotLogged = function() { return; };
	setTimeout(function() {
        $('.countdown').remove();
    }, 1000);
}

function handleLive(pageURI) {
    var baseURL = "https://api-ott-prod-fe.mediaset.net/PROD/play/alive/nownext/v1.0?channelId=";
    if (pageURI.indexOf('/diretta/') < 0) {
        return;
    }
    fetch({
        method: 'GET',
        url: baseURL + pageURI.split('/diretta/')[1].split('_c')[1],
        headers: {
            'Accept': 'application/json'
        }
    }).then(function(responseDetails) {
        var r = responseDetails.responseText;
        var data = $.parseJSON(r);
        var instruction = data.response.tuningInstruction;
        for (var i = 0; i < 5; i++) {
            var row = instruction['urn:theplatform:tv:location:any'][i];
            var public = row.publicUrls[0];
            var streaming = row.streamingUrl;
            if (row.format.indexOf('x-mpegURL') > 0) {
                return fetch({
                    method: 'GET',
                    url: public,
                    headers: {
                        'Accept': 'application/atom+xml,application/xml,text/xml'
                    }
                });
            }
        }
    }).then(function(responseDetails) {
        var src = responseDetails.finalUrl;
		writeLive(src);
    });
}

function getInformation(vlink) {
    vlink.url = vlink.url.replace(/vod08\.msf\.cdn/, 'vod05.msf.cdn');
    return fetch({
        method: 'HEAD',
        url: vlink.url
    }).then((response) => {
        if (response.status == 404) {
            let result = Object.assign({}, vlink);
            result.error = true;
            result.size = 0;
            return result;
        }
        let headers = fromEntries(response.responseHeaders.split("\n").map(element => element.trim().toLowerCase().split(":")));
        let size = +headers['content-length'];
        size = Math.round(size / 1024 / 1024);
        let result = Object.assign({}, vlink);
        result.error = false;
        result.size = size;
        return result;
    });
}

var range = (start, stop, step) => {
    var a = [start], b = start;
    while (b < stop) {
        a.push(b += step || 1);
    }
    return (b > stop) ? a.slice(0,-1) : a;
};

var leftPad = (str, padding, length) => {
    str = `${str}`;
    while (str.length < length) {
        str = padding + str;
    }
    return str;
};

var scrapeQualities = async (url) => {
    var start = url.match(/[^_]*_[^\/]*/);
    if (!start) {
        return [];
    }
    start = start[0];

    var suffix = start.match(/_.*/)[0].slice(1);

    var m3u8 = await Promise.all(['ss', 'sd', 'hd'].map(index => {
        var quality_url = `${start}/hlsrc/${index}_no_mpl.m3u8`;
        return getInformation({ na: `M3U8 (${index})`, url: quality_url, h: false, quality: index });
    }));

    var results = await Promise.all(['ss', 'sd', 'hd'].map(index => {
        var quality_url = `${start}/mp4/${index}_no_mpl.mp4`;
        return getInformation({ na: '.MP4', url: quality_url, h: true, quality: index });
    }));

    return m3u8.concat(results).filter(value => !value.error);
};

function getLinks(responseDetails) {
    var r = responseDetails.responseText;
    r = r.replace(/msf.ticdn.it/g, 'msf.cdn.mediaset.net');
    r = r.replace(/netfarmunica/g, 'net/farmunica');
    r = r.replace(/<video/g, '<element');
    var doc = $.parseHTML(r);
    var $xml = $( doc );
    var videos = $xml.find("element");
    var vlinks = [];
    console.log($xml[0].innerHTML);

    var appended = {};
    // parse video URLs
    videos.each(function (i) {
        var url = $( videos.get(i) ).attr("src");
        var type = url.slice(-3);
        var suffix = (url.match(/\/(ss|sd|hd)_/) || [null, null])[1];
        var name = "";
        var highlight = false;
        switch(type) {
            case "est": name = "ISM"; break;
            case "3u8":
            case "pl)": name = suffix ? `M3U8 (${suffix})` : "M3U8"; break;
            case "mpd": return;
            case "flv": name = ".FLV"; break;
            case "f4v": name = ".F4V"; break;
            case "mp4": name = ".MP4"; highlight = true; break;
            case "wmv": name = ".WMV"; break;
        }
        var ending = url.slice(-20);
        if (!appended[ending]) {
            vlinks.push( { na: name, url: url, h: highlight, quality: suffix } );
            appended[ending] = true;
        }
    });

    return vlinks;
}

function displayURLs(vlinks) {
    var container = $('#player-container');
    if (!isIframe && !container.length) {
        return setTimeout(function() {
            displayURLs(vlinks);
        }, 1000);
    }

    // Clean up traces
    $('#video-links, #video-links-actions, #custom-mediaset-style').remove();

    $('.area-container-left-area').css('margin-bottom', '8rem');
    $('head').append('<style id="custom-mediaset-style">.persistent-video-player { overflow: visible !important; }</style>');

    if (isIframe) {
        $('<div id="video-links">').appendTo('body');
    } else {
        container.parent().after('<div id="video-links">');
    }

    // display video URLs
    Promise.all(vlinks.map(getInformation)).then(results => {
        var DRM = false;
        var scrapeURL = '';
        var hasHD = false;
        results.forEach((o, i) => {
            scrapeURL = o.url;
            if (o.quality == 'hd') {
                hasHD = true;
            }
            var s = '<a style="font-weight: ' + (o.h ? 'bold' : 'normal') + '" href="' + o.url + '">' + o.na + (o.size ? ' (' + o.quality + ' ' + o.size + ' MB)' : '') + '</a>';
            $(s).appendTo('#video-links');
            if (i != results.length-1) {
                $('<span>&nbsp;|&nbsp;</span>').appendTo('#video-links');
            }
            if (o.url.indexOf('sampleaes') > 0 && o.url.indexOf('.m3u8') > 0) {
                DRM = true;
            }
        });
        $('<br><small>I flussi M3U8 devono essere registrati da un programma esterno (es. JDownloader o streamlink)</small>').appendTo('#video-links');

        if (DRM || (!hasHD)) {
            var deepScan = () => {
                $('#video-links strong').html('Scansione profonda in corso...');

                scrapeQualities(scrapeURL).then(results => {
                    $('#video-links').empty();
                    if (results.length) {
                        results.forEach((o, i) => {
                            var s = '<a style="font-weight: ' + (o.h ? 'bold' : 'normal') + '" href="' + o.url + '">' + o.na + (o.size ? ' (' + o.quality + ' ' + o.size + ' MB)' : '') + '</a>';
                            $(s).appendTo('#video-links');
                            if (i != results.length-1) {
                                $('<span>&nbsp;|&nbsp;</span>').appendTo('#video-links');
                            }
                        });
                        $('<br><small>I flussi M3U8 devono essere registrati da un programma esterno (es. JDownloader o streamlink)</small>').appendTo('#video-links');
                    } else {
                        $('#video-links').html('<span>Questo video è protetto da DRM perciò <strong>non può essere scaricato.</strong></span>');
                    }
                    boxStyle('#video-links', 'rgba(255,255,255,0.2)', 'white');
                });
            };

            deepScan();
        }

        boxStyle('#video-links', 'rgba(255,255,255,0.2)', 'white');
        if (!isIframe) {
            $("#video-links").after("<div id='video-links-actions'></div>");
            $("#video-links-actions")
                .append('<center style="font-size: 75%">' +
                        '<a href="https://lazza.me/DonazioneScript">Clicca qui per fare una donazione</a>' +
                        '</center>')
                .find('a').css('text-decoration', 'underline');
            boxStyle('#video-links-actions', 'rgba(255,255,255,0.2)', 'white');
        }
    });
}

function get_urls() {
    var params = new URLSearchParams(location.search.slice(1));
    var guid = (loc.href.match(/(FAFU000000([0-9]{4,6})|F[0-9A-F]{14,})/) || [null])[0] || params.get('programGuid') || params.get('id');
    if (!!guid && guid.indexOf('FAFU') == 0) {
        guid = guid.slice(-6);
    }
    $("#video-links, #video-links-actions").remove();
    if (!!guid) {
        console.log("GUID: " + guid);
        var promises = [];
        ['MPEG4', 'M3U'].forEach((format) => {
             promises.push(
                 fetch({
                     method: 'GET',
                     url: base_selector.replace('[[GUID]]', guid).replace('[[FORMATS]]', format),
                     headers: {
                         'Accept': 'application/atom+xml,application/xml,text/xml'
                     }
                 }).then(getLinks)
             );
        });

        Promise.all(promises).then((sets) => {
            var flat = sets.reduce((acc, val) => acc.concat(val), []);
            displayURLs(flat);
        });
    }
}

var old_href = "";
var new_href = "";

function handle_everything() {
    handleLive(loc.href);

    get_urls();
}

$(document).ready(function(){
    setInterval(function() {
        old_href = new_href;
        new_href = loc.href;
        if (new_href != old_href) {
            handle_everything();
        }
    }, 1000);
});