// ==UserScript==
// @name         hitomi.la Download Tweaker
// @description  Tweaks the download script so that filenames follow %04d format
// @namespace    redturtle
// @author       redturlte
// @version      1.7
// @match        https://hitomi.la/doujinshi/*
// @match        https://hitomi.la/manga/*
// @match        https://hitomi.la/cg/*
// @match        https://hitomi.la/gamecg/*
// @noframes
// @connect      self
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/388825/hitomila%20Download%20Tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/388825/hitomila%20Download%20Tweaker.meta.js
// ==/UserScript==

$(document).ready(function () {
    download_gallery = function (galleryname) {
        $("#dl-button").hide();
        var progressbar = $("#progressbar");
        progressbar.show();
        progressbar.progressbar({
            value: false
        });

        urls_to_download = [];
        image_names_to_download = [];
        $.each(galleryinfo['files'], function (i, image) {
            var url = url_from_url_from_hash(galleryid, image);
            urls_to_download.push(url);
            image_names_to_download.push((i + 1 < 10 ? '000' + (i + 1).toString() : i + 1 < 100 ? '00' + (i + 1).toString() : i + 1 < 1000 ? '0' + (i + 1).toString() : (i + 1).toString()) + image.name.substring(image.name.length - 4, image.name.length));
        });
        zip = new JSZip();
        currently_downloading_url_index = 0;
        if (galleryname) {
            galleryname_to_download = galleryname;
        }
        download_next_image();
    };
});