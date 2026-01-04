// ==UserScript==
// @name         Show Youtube Thumbnails
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Show thumbnails in deprecated Youtube layout
// @author       Kronzky
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397596/Show%20Youtube%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/397596/Show%20Youtube%20Thumbnails.meta.js
// ==/UserScript==

function addThumbs() {
    var thumburl = 'https://i.ytimg.com/vi/THUMBNAIL/hqdefault.jpg';
    var thumbimg = '<div style="width:196px; height:110px; overflow:hidden"><a href="/watch?v=THUMBNAIL"><img style="position:relative; top:-19px" width="198px" src="' + thumburl + '">VIDLEN</a></div>';

    var items = document.getElementsByClassName('yt-lockup');
    for (var i=0; i<items.length-1; i++) {
        if ((items[i].className.indexOf("HASTHUMB"))==-1) {
            var img = items[i].getElementsByTagName("img");
            if (img.length==0) {
                var vidlen = "";
                var leninfo = items[i].getElementsByClassName('accessible-description');
                if (leninfo.length!=0) {
                    leninfo = leninfo[0].innerHTML;
                    if ((leninfo.indexOf(':'))!=-1) {
                        vidlen = leninfo.substr(13,leninfo.indexOf('.')-13);
                    };
                };
                var id;
                if (items[i].hasAttribute("data-context-item-id")) {
                    id = items[i].getAttribute("data-context-item-id");
                    var thumb = thumbimg.replace(/THUMBNAIL/g, id);
                    thumb = thumb.replace('VIDLEN', '<span class="video-time" style="top:90px">'+vidlen+'</span>');
                    items[i].innerHTML = thumb + items[i].innerHTML ;
                } else {
                    var link = items[i].getElementsByTagName("a")[0];
                    link = link.getAttribute("href");
                    link = link.substr(link.indexOf("?v=")+3);
                    thumb = thumbimg.replace("THUMBNAIL", link);
                    thumb = thumb.replace('VIDLEN', '');
                    id = link.substr(0,link.indexOf("&"));
                    items[i].innerHTML = thumb.replace("THUMBNAIL", id) + items[i].innerHTML;
                };
            };
            items[i].className += " HASTHUMB";
        };
    };
};

(function() {
    'use strict';
    document.cookie = 'PREF=f5=30030&f6=8&f1=50000000';
    addThumbs();
    window.addEventListener("scroll", addThumbs, false);
})();