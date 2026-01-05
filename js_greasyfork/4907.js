// ==UserScript==
// @name        SME.sk s HTML5 prehrávačom videa namiesto Flashu
// @namespace   http://jansokoly.com
// @include     http://*.sme.sk/*
// @version     1.0
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @description User script, ktorý SME.sk prinúti používať na prehrávanie videí HiDPI-friendly HTML5 video, nie Flash.
// @downloadURL https://update.greasyfork.org/scripts/4907/SMEsk%20s%20HTML5%20prehr%C3%A1va%C4%8Dom%20videa%20namiesto%20Flashu.user.js
// @updateURL https://update.greasyfork.org/scripts/4907/SMEsk%20s%20HTML5%20prehr%C3%A1va%C4%8Dom%20videa%20namiesto%20Flashu.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('[id^=smeplayer_id]').each(function() {
        var videoElement = $(this)

        var videoId = videoElement.attr('id').substr(12);
        var videoChild = videoElement.children(':eq(0)');

        if (videoChild.prop('tagName').toLowerCase() == 'embed') {
            // tv.sme.sk, kde su videa spustane automaticky

            videoChild.css('display', 'none');

            // ak je v url "vhd", znamena to, ze pouzivatel na tv.sme.sk zvolil prehratie videa vo vysokej kvalite
            if (location.href.indexOf("vhd") > -1)
                st_create_html5_video_code('smeplayer_id' + videoId, new Array(950, 534, 'autoplay', videoId, ''));
            else
                st_create_html5_video_code('smeplayer_id' + videoId, new Array(630, 354, 'autoplay', videoId, ''));
        }
        else {
            // embedovane videa v clankoch, ktore nie su spustane automaticky

            var stillSource = videoElement.find('img:eq(0)').attr('src');

            jQuery('<a/>', {
               id: 'playHTML5Video',
               href: '#',
               title: '',
               rel: 'external',
               text: 'Spustiť HTML5 video',
               onclick: "st_create_html5_video_code('smeplayer_id" + videoId + "', new Array(480, 270, 'autoplay', " + videoId + ", '" + stillSource + "')); return false;"
            }).insertAfter(this);
        }

        return false;
    });

    // na titulke sme.sk je video v inom elemente
    $('#smeplayer_hs').each(function () {
        var clickfn = $(this).find('div > a').attr('onclick');
        var videoId = clickfn.split("'")[3];

        jQuery('<div/>', { id: 'playHTML5VideoWrap', style: 'text-align: center;' }).insertAfter(this);
        jQuery('<a/>', {
            id: 'playHTML5Video',
            href: '#',
            title: '',
            rel: 'external',
            text: 'Spustiť HTML5 video',
            onclick: "st_create_html5_video_code('smeplayer_hs', new Array(490, 276, 'autoplay', " + videoId + ", '')); return false;"
        }).appendTo($('#playHTML5VideoWrap'));
    });
});