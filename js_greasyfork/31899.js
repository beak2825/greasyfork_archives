// ==UserScript==
// @name         boorufixer
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  fetch & replace small booru thumbnails with larger hires source.
// @author       justrunmyscripts
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        *://*.booru.org/*
// @grant        none
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/31899/boorufixer.user.js
// @updateURL https://update.greasyfork.org/scripts/31899/boorufixer.meta.js
// ==/UserScript==

// @grant        GM_xmlhttpRequest

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) { // 4 = done
            callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

(function($) {
    // 'use strict';

    var sheet = document.createElement('style');
    sheet.innerHTML = `
.thumb img {
    max-width: 100%;
    max-height: 100%;
}  span.thumb {
    height: 400px;
    width: 400px;
}`;
    sheet.innerHTML += `
.zoom {
    transition: transform .2s;
    margin: 0 auto;
    background-color: white;
}

.zoom:hover {
     transform: scale(2.25);
}`;
    document.body.appendChild(sheet);

    var thumbnails = $('.thumb');

    $.each(thumbnails ,function(k, v){
        var hires_img_url_haystack_url = $(v).children()[0].href;

        var extract_hires_img_url_cb = function(r){

            var adiv = document.createElement('div');
            $(adiv).html(r);

            var hires_img_url = $(adiv).find('#image')[0].src;
            var the_image = $(v).find('a img');
            the_image.attr('src', hires_img_url); // replacement!
            the_image.removeAttr('title');
            the_image.addClass('zoom');
            the_image.css("width", '');
        };
        // TODO rrate limit + retry logic?

        httpGetAsync(hires_img_url_haystack_url, extract_hires_img_url_cb);

    });

}).bind(this)(jQuery);