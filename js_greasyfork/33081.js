// ==UserScript==
// @name         Mimic - Youtube MP3 Downloader
// @version      10.09.2017.r002
// @namespace    http://ophite.cz
// @author       mimic
// @description  Allows you to download MP3 at 320 kbps from a YouTube video.
// @match        http*://www.youtube.com/*
// @match        http*://www.onlinevideoconverter.com/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/33081/Mimic%20-%20Youtube%20MP3%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/33081/Mimic%20-%20Youtube%20MP3%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var InjectJs = (function () {
        const _convertUrl = 'https://www.onlinevideoconverter.com/video-converter';

        var inject = function() {
            $(document).ready(function() {
                onPageLoad();
            });
        };
        var onPageLoad = function() {
            if (document.body && document.domain == 'www.youtube.com') {
                setTimeout(insertButtonToYoutube, 1500);
            }
            if (document.body && document.domain == 'www.onlinevideoconverter.com') {
                setTimeout(updateFormAndConvert, 500);
            }
            if (window.location.href.indexOf('/success?') > 0) {
                convertDone();
            }
        };
        var updateFormAndConvert = function() {
            const selectedType = '.mp3';
            $('.radiovideo1 .audio-format').each(function() { $(this).removeClass('active'); });
            $('.radiovideo1 .video-format').each(function() { $(this).removeClass('active'); });
            $('.radiovideo1 .audio-format span:contains(' + selectedType + ')').closest('a').addClass('active');
            $('#select_main > span').text(selectedType);
            $('#advancedoptions').show();
            $('#audioBitrate li a').each(function() { $(this).removeClass('active'); });
            $('#audioBitrate li a').first().addClass('active');
            $('#audioBitrate > span').text('320 kbps');
            document.getElementById('convert1').click();
        };
        var insertButtonToYoutube = function() {
            let convertUrl = _convertUrl + '?url=' + encodeURIComponent(document.URL);
            $('h1').parent().append('<h2>[<a id="dmp3" target="_blank" href="' + convertUrl + '" style="color: #fa0; text-decoration: none; font-weight: normal;">Download MP3 (320kbps)</a>]</h2>');
            $('#dmp3').on('click', function() {
                window.open(convertUrl);
            });
        };
        var convertDone = function() {
            let downloadUrl = $('#downloadq').attr('href');
            $('body').append('<a id="dmp3link" href="' + downloadUrl + '"></a>');
            document.getElementById('dmp3link').click();
            setTimeout(window.close, 1000);
        };
        return inject;
    })();
    new InjectJs();
})();