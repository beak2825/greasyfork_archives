// ==UserScript==
// @name         Youtube video url exporter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Huykhong
// @match        https://*.youtube.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @run-at document-end

// @downloadURL https://update.greasyfork.org/scripts/408645/Youtube%20video%20url%20exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/408645/Youtube%20video%20url%20exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var copyToClipboard = function (text) {
        var $txt = $('<textarea />');
        $txt.val(text).css({ width: "1px", height: "1px" }).appendTo('body');
        $txt.select();
        if (document.execCommand('copy')) {
            $txt.remove();
        }
    };

    var urls = '';
    $( $('a[id="video-title"]') ).each(function( index ) {
        urls += "https://youtube.com/"+$( this ).attr('href')+"\n";
    });
    if(urls === ''){
        alert('no url found');
    }else{
        copyToClipboard(urls);
        alert('URLs copied to clipboard');
    }
})();