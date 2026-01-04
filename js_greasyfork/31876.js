// ==UserScript==
// @name thevideo.me Downloader
// @namespace https://thevideo.me/
// @version 0.2
// @description thevideo.me Download Link
// @author ShafterOne
// @match https://thevideo.me/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/31876/thevideome%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/31876/thevideome%20Downloader.meta.js
// ==/UserScript==

$( document ).ready(function() {
    if($('#vplayer_html5_api').attr('src').length){
        var streamUrl = $('#vplayer_html5_api').attr('src').replace('false','true');
        var dlBtn = '<a href="'+streamUrl+'" target="_blank" id="oldl-link" style="position:absolute;left:10px;top:10px;z-index:99999999;color:#fff;padding:10px;background-color:blue">Download</a>';
        var removeLink = '<span id="remove-oldl-link"style="position:absolute;left:74px;top:5px;z-index:999999999;color:#fff;border-radius:50%;padding:0 5px;background:red;font-weight:bold;cursor:pointer">x<span>';
        $('body').prepend(dlBtn+removeLink);
    }
    $( "#remove-oldl-link" ).click(function() {
        $( "#remove-oldl-link,#oldl-link").remove();
    });
});