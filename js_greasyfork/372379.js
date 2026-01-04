// ==UserScript==
// @name         video embed
// @namespace https://greasyfork.org/users/196421
// @version      0.0.11
// @description  try to embed video files
// @author       bornofash
// @match        https://www.kaldata.com/forums/*
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @downloadURL https://update.greasyfork.org/scripts/372379/video%20embed.user.js
// @updateURL https://update.greasyfork.org/scripts/372379/video%20embed.meta.js
// ==/UserScript==

function turntovideo(a) {
    if (a.closest('video').length !== 0) {
        return;
    }

    var src = a.attr('href');

    var frame = $('<div></div>');
    var video = $('<video controls data-video-embed></video>'); video.appendTo(frame);
    var source = $('<source>'); source.appendTo(video);
    var link = $('<a></a>'); link.appendTo(video);
    var title = $('<span></span>'); title.appendTo(link);
    var ext = src.split('.').pop();
    frame.addClass('ipsEmbeddedVideo');
    frame.attr('contenteditable', 'false');
    video.attr('class', 'ipsEmbeddedVideo');
    video.attr('src', src);
    video.css('max-width', '100%'); video.css('max-height', '500px'); video.css('width', 'auto');
    source.attr('type', 'video/' + ext);
    source.attr('data-video-src', src);
    source.attr('src', src);
    link.addClass('ipsAttachLink ipsAttachLink_block');
    link.attr('href', src);
    link.attr('data-fileext', ext);
    title.addClass('ipsAttachLink_title');
    title.text(src);

    a.parent().before(frame);
    a.parent().replaceWith('<p><br></p>');
}

(function() {
    'use strict';
    waitForKeyElements('div.cke_editable p a[href$=".webm"], a[href$=".mp4"]', turntovideo);
})();