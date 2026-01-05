// ==UserScript==
// @name         Soundcloud Album Art Downloader
// @namespace    http://www.dieterholvoet.com
// @version      1.10.0
// @description  Allows you to download album art on the Soundcloud website.
// @author       Dieter Holvoet
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @include      http://www.soundcloud.com/*
// @include	     http://soundcloud.com/*
// @include	     https://www.soundcloud.com/*
// @include	     https://soundcloud.com/*
// @grant        GM_download
// @grant        GM_info
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/14591/Soundcloud%20Album%20Art%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/14591/Soundcloud%20Album%20Art%20Downloader.meta.js
// ==/UserScript==

setInterval(function() {
    var possibleClasses = [".listenArtworkWrapper", ".listenInfo"],
        sizes = { 't500x500': '500x500', 'original': 'original size' },
        regexp = /t\d{3}x\d{3}/gi;

    $('.modal__content:not(.appeared)')
        .addClass('appeared')
        .each(handleModal);

    function handleModal() {
        var imageURL;

        for (var i = 0; i < possibleClasses.length; i++) {
            if ($(possibleClasses[i] + " .image__full").length > 0) {
                imageURL = $(possibleClasses[i] + " .image__full").css('background-image');
            }
        }

        if (!imageURL) {
            logError('No suitable selector found!');
        } else {
            imageURL = /url\("(.+)"\)/.exec(imageURL)[1];
        }

        $(".modal__content .image__full").parent().remove();
        $(".modal__content .imageContent").append("<img style='width: 500px; height: 500px; margin-bottom: 15px;' src='" + imageURL.replace(regexp, 't500x500') + "'>");

        Object.keys(sizes).forEach(function (size) {
            var url = imageURL.replace(regexp, size);
            $.ajax({
                type: 'HEAD',
                url: url,
                complete: function(xhr) {
                    if (xhr.status !== 200) {
                        return;
                    }

                    $(".modal__content .imageContent").append(
                        makeButton(url, sizes[size])
                    );
                }
            });
        });
    }

    function makeButton(url, sizeLabel) {
        var $btn = $('<button />')
            .css({ margin: '10px auto 0 auto', display: 'block', width: '100%'})
            .attr('class', 'sc-button sc-button-medium sc-button-responsive')
            .text('Download ' + sizeLabel);

        $btn.on('click', function(e) {
            e.preventDefault();
            download(url);
        });

        return $btn;
    }

    function download(url) {
        url = url.split('?')[0];
        if (!url.startsWith('http')) {
            url = window.location.protocol + (url.startsWith('//') ? '' : '//') + url;
        }

        var fileNameParts = url.split('/');
        var fileName = fileNameParts[fileNameParts.length - 1];

        var options = {
            url: url,
            name: fileName,
            onerror: function (e) {
                logError('Download failed. Reason: ' + e.error);
            }
        };

        GM_download(options);
    }

    function logError(message) {
        var details = {
            title: GM_info.script.name,
            text: message,
        };

        GM_notification(details);
        console.error('%c' + GM_info.script.name + '%c: ' + message, 'font-weight: bold', 'font-weight: normal');
    }
}, 250);
