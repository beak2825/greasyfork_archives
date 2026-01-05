// ==UserScript==
// @name         nHentai Downloader
// @namespace    https://holy-donkey.github.io
// @description  Download manga on nHentai.net
// @version      1.2.1
// @icon         http://i.imgur.com/FAsQ4vZ.png
// @author       The Holy Donkey
// @license      MIT
// @match        http://nhentai.net/g/*
// @match        https://nhentai.net/g/*
// @require      https://cdn.jsdelivr.net/jquery/2.2.4/jquery.min.js
// @require      https://cdn.jsdelivr.net/jszip/3.1.3/jszip.min.js
// @require      https://cdn.jsdelivr.net/filesaver.js/1.3.3/FileSaver.min.js
// @noframes
// @connect      self
// @supportURL   https://github.com/holy-donkey/UserScripts/issues
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/24740/nHentai%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/24740/nHentai%20Downloader.meta.js
// ==/UserScript==

jQuery(function($) {
    'use strict';

    function deferredAddZip(i, filename) {
        var deferred = $.Deferred();

        GM_xmlhttpRequest({
            method: 'GET',
            url: images[i],
            responseType: 'arraybuffer',
            onload: function(response) {
                zip.file(filename, response.response);
                $download.html('<i class="fa fa-cog fa-spin"></i> ' + (++current) + '/' + total);
                deferred.resolve(response);
            },
            onerror: function(err) {
                console.error(err);
                deferred.reject(err);
            }
        });

        return deferred;
    }

    var zip = new JSZip(),
        prevZip = false,
        deferreds = [],
        current = 0,
        total = 0,
        images = [],
        $download = $('#download'),
        doc = document,
        tit = doc.title;

    window.URL = window.URL || window.webkitURL;

    $download.one('click', function(e) {
        e.preventDefault();

        $download.attr('href', '#download');

        $(window).on('beforeunload', function() {
            return 'Progress is running...';
        });

        $download.html('<i class="fa fa-cog fa-spin"></i> Waiting...').css('backgroundColor', 'orange');

        $('.lazyload').each(function(i, v) {
            images[i] = location.protocol + $(v).attr('data-src').replace('t.n', 'i.n').replace(/\/(\d+)t\./, '/$1.');
        });

        total = images.length;

        $.each(images, function(i, v) {
            var filename = v.replace(/.*\//g, '');

            deferreds.push(deferredAddZip(i, filename));
        });

        $.when.apply($, deferreds).done(function() {
            zip.generateAsync({
                type: 'blob'
            }).then(function(blob) {
                var zipName = tit.split(' » ')[0].replace(/\s/g, '_') + '.zip';

                if (prevZip) {
                    window.URL.revokeObjectURL(prevZip);
                }
                prevZip = blob;

                $download.html('<i class="fa fa-check"></i> Complete').css('backgroundColor', 'green').attr({
                    href: window.URL.createObjectURL(prevZip),
                    download: zipName
                });

                saveAs(blob, zipName);

                doc.title = '[⇓] ' + tit;
            }, function(reason) {
                 console.error(reason);
            });
        }).fail(function(err) {
            $download.html('<i class="fa fa-exclamation"></i> Fail').css('backgroundColor', 'red');
            console.error(err);
        }).always(function() {
            $(window).off('beforeunload');
        });

    });

});
