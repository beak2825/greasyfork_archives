// ==UserScript==
// @name        RSI direct link
// @namespace   http://andrealazzarotto.com/
// @include     http://rsi.ch/*
// @include     http://*.rsi.ch/*
// @include     https://rsi.ch/*
// @include     https://*.rsi.ch/*
// @version     4.2.3
// @description This script gives you the direct links while watching a video on rsi.ch.
// @copyright   2013+, Andrea Lazzarotto & GreenDragon - GPLv3 License
// @author      Andrea Lazzarotto, GreenDragon
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @connect     il.srgssr.ch
// @connect     codww-vh.akamaihd.net
// @connect     cdn.rsi.ch
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/2131/RSI%20direct%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/2131/RSI%20direct%20link.meta.js
// ==/UserScript==

/* Greasemonkey 4 wrapper */
if (typeof GM !== "undefined" && !!GM.xmlHttpRequest) {
    GM_xmlhttpRequest = GM.xmlHttpRequest;
}

$('head').append("<style>.direct-links, .direct-links > a { color: white !important; font-weight: bold !important; } .direct-links > a:hover { text-decoration: underline !important; } .direct-links > .sep { color: yellow !important; } .direct-links-iframe, .direct-links-iframe > a { color: #af001d !important; font-weight: bold !important; } .direct-links-iframe > a:hover { text-decoration: underline !important; } .direct-links-iframe > .sep { color: white !important; }</style>");

var layerURL = "http://il.srgssr.ch/integrationlayer/1.0/ue/rsi/video/play/";

var render_piece = function (html) {
    var tree = $(html);
    if (!tree.length)
        return '';
    var output = [];
    var lastColor = null;
    tree.find('span').each(function () {
        var element = $(this);
        var thisColor = element.attr('tts:color');
        if (lastColor && lastColor != thisColor)
            output.push('\n-');
        lastColor = thisColor;
        output.push(element.text().trim());
    });
    var joined = output.join(' ');
    joined = joined.replace(/\ +\n/, '\n').replace(/(^\n|\n$)/, '');
    joined = joined.replace(/\n+/, '\n').replace(/\ +/, ' ');
    return joined;
};

var render_part = function (html, id) {
    var tree = $(html);
    var begin = tree.attr('begin').replace('.', ',');
    var end = tree.attr('end').replace('.', ',');
    return id + '\n' +
        begin + ' --> ' + end + '\n' +
        render_piece(html);
};

var handle_subtitles = function (subURL, element_id, title) {
    if (!subURL)
        return;

    if (subURL.toLowerCase().endsWith('srt')) {
        console.log("[handle_subtitles] Found SRT subtitles");
        $('#' + element_id).append('<span class="sep"> | </span><a href="' + subURL + '" target="_blank">SRT</a>');
        return;
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: subURL,
        onload: function (responseDetails) {
            var r = responseDetails.responseText;

            var srt_content = '';
            var sub_type = '';
            if (subURL.toLowerCase().endsWith('vtt')) {
                console.log("[handle_subtitles] Found VTT subtitles");
                sub_type = 'VTT';
                srt_content = r
                    .replace(/(WEBVTT.*)[\r\n]*/g, '')
                    .replace(/(\d{2}:\d{2}:\d{2})\.(\d{3}\s+)\-\-\>(\s+\d{2}:\d{2}:\d{2})\.(\d{3}\s*)/g, '$1,$2-->$3,$4')
                    .replace(/\<.+\>(.+)/g, '$1')
                    .replace(/\<.+\>(.+)\<.+\/\>/g, '$1');
            }
            else if (subURL.toLowerCase().endsWith('xml')) {
                console.log("[handle_subtitles] Found TTML subtitles");
                sub_type = 'TTML';
                var srt_list = [];
                var doc = $.parseXML(r);
                var $xml = $(doc);

                $xml.find('p').each(function (index, value) {
                    srt_list.push(render_part(value.outerHTML, index + 1));
                });

                srt_content = srt_list.join('\n\n')
            }

            if (srt_content.length > 0) {
                $('#' + element_id)
                    .append('<span class="sep"> | </span><a class="srt-link">SRT</a>')
                    .append('<span class="sep"> | </span><a href="' + subURL + '" target="_blank">' + sub_type + '</a>')
                    .find('.srt-link').attr('href', 'data:text/plain;charset=utf-8,' +
                        encodeURIComponent(srt_content)).attr('download', 'sottotitoli.srt');
            }
        }
    });
};

var setup_links = function (element, id, qualities, subtitles, box_class) {
    element.parent().find('.' + box_class).remove();

    element.after('<div class="' + box_class + '" id="' + id + '"></div>');

    for (var key = 0; key < qualities.length; key++) {
        var chunks = qualities[key].split(',');
        var last = chunks[chunks.length - 1];
        var pos = parseInt(last.split('index_')[1]);

        var url = 'http://mediaww.rsi.ch/' + chunks[0].split('net/i/')[1] + chunks[pos + 1] + '.mp4';
        console.log('[setup_links] Found direct URL -> ' + url);

        $('#' + id)
            .append('<span class="sep"> | </span>')
            .append('<a href="' + url + '">Link ' + (key + 1) + '</a>');
    }

    handle_subtitles(subtitles, id);

    $('#' + id + ' span:first-child').remove();

    $('#' + id + ' a').css('font-weight', 'bold');

    $('#' + id).css({
        'margin': '.75em 0',
        'box-sizing': 'border-box',
        'width': 'auto',
        'text-align': 'center'
    });
};

var setup_error = function (element, id, box_class) {
    element.parent().find('.' + box_class).remove();

    element.after('<div class="' + box_class + '" id="' + id + '">Link non disponibili</div>');

    console.log('[setup_error] Video not available');

    $('#' + id + ' span:first-child').remove();

    $('#' + id + ' a').css('font-weight', 'bold');

    $('#' + id).css({
        'margin': '.75em 0',
        'box-sizing': 'border-box',
        'width': 'auto',
        'text-align': 'center'
    });
};

var setup_video = function (id, target_element, box_class) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: layerURL + id.toString() + '.xml',
        onerror: function (responseDetails) {
            setup_error(target_element, selector, box_class);
        },
        onload: function (responseDetails) {
            var r = responseDetails.responseText;
            var doc = $.parseXML(r);
            var $xml = $(doc);

            console.log("[setup_video] Loaded XML file for " + id);

            var manifestURL = $($xml.find('Playlist[protocol="HTTP-HLS"] > url').get(0)).text();
            if (!!!manifestURL) {
                setup_error(target_element, selector, box_class);
                return;
            }
            console.log("[setup_video] Manifest URL: " + manifestURL);

            var subtitles = $($xml.find('TTMLUrl').get(0)).text();
            if (!!subtitles)
                console.log("[setup_video] Subtitles URL: " + subtitles);
            else
                console.log("[setup_video] Subtitles not present");

            var qualities = [];
            var chunks = manifestURL.split(',');
            for (var pos = 0; pos < chunks.length - 2; pos++)
                qualities.push(manifestURL.replace('master.m3u8', 'index_' + pos + '_av.m3u8'));

            var selector = 'link-' + id;

            setup_links(target_element, selector, qualities, subtitles, box_class);
        }
    });
};

var setup_frames = function () {
    // Handle iframe videos
    var dividers = [':', '%3A'];
    for (var i = 0; i < dividers.length; i++) {
        var divider = 'video' + dividers[i];
        $("iframe[src*='" + divider + "']").each(function () {
            var frame = $(this);
            var id = parseInt(frame.attr('src').split(divider)[1].split('&')[0]);
            if (!!id && (frame.data('done') !== id)) {
                // Mark element immediately to avoid multiple requests
                frame.data('done', id);
                console.log("[setup_frames] Marking " + id + " as done");

                var target_element = frame.parent();
                if (!!$('.srg-showcase-video').length) {
                    // Handle video iframe in showcase template
                    console.log("[setup_frames] showcase template detected");
                    target_element = $('.content').first();
                }
                else if (!!$('.mfp-desc').length) {
                    // Handle video iframe in MagnificPopup
                    $('.mfp-desc').first().prepend('<div id="empty-placeholder" style="display:none"></div>');
                    target_element = $('#empty-placeholder').first();
                }

                setup_video(id, target_element, 'direct-links-iframe');
            }
        }); // end each
    }
};

var setup_html5 = function () {
    // Handle HTML5 video
    var video_obj = $("[aria-label='Player Video']").first();
    var id;
    if (location.href.indexOf('id=') > 0) {
        id = parseInt(location.href.split("id=")[1].split('&')[0]);
    }
    else if (location.href.indexOf('urn=') > 0 && location.href.indexOf(':video:') > 0) {
        id = parseInt(location.href.split("urn=")[1].split('&')[0].split(':video:')[1]);
    }
    
    if (!!id && (video_obj.attr('data') !== id)) {
        // Mark element immediately to avoid multiple requests
        video_obj.attr('data', id);
        console.log("[setup_html5] Marking " + id + " as done");

        setup_video(id, video_obj.parent(), 'direct-links');
    }
    else {
        console.log("[setup_html5] Unsupported HTML5 video URL");
    }
};

$(document).arrive("iframe[src*='video:'], iframe[src*='video%3A']", {existing: true}, function () {
    console.log('[rsi_observer] IFrame video detected');
    setup_frames();
});

$(document).arrive("[aria-label='Player Video']", {existing: true}, function () {
    if (location.href.indexOf('/video/') > 0) {
        console.log('[rsi_observer] HTML5 video detected');
        setup_html5();
    }
    else {
        console.log('[rsi_observer] Unsupported HTML5 video detected');
    }
});
