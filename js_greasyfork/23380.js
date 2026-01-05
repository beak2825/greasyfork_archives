// ==UserScript==
// @name         Weblations Reader
// @namespace    http://diathedia.com/
// @version      0.3
// @description  Makes reading easier (hopefully)
// @author       Diathedia
// @match        http://weblations.weebly.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/23380/Weblations%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/23380/Weblations%20Reader.meta.js
// ==/UserScript==

var scrCSS = '\
	.spread-img { \
		max-width: 100%; \
        height: auto; \
        margin: auto; \
        display: block; \
	} \
';

$("head").append('<style type="text/css">' + scrCSS + '</style>');

(function() {
    'use strict';

    var gallery;
    var imgURL;
    var imgArray = [];
    var i;

    // Thumbnails
    if ($("div[id*='-gallery']")[0]){
        gallery = $( "div[id*='-gallery']" );
        imgArray = [];

        gallery.children('div').each(function () {
            imgURL = "www.weblations.weebly.com/" + $(this).find('a').attr('href');
            imgArray.push(imgURL);
        });
    }else{
    // Slideshow
        gallery = $( "div[id*='-slideshow']" );
        imgArray = [];

        var scripts = document.getElementsByTagName("script");
        var scriptTxt;

        for(i = 0; i < scripts.length; i++) {
            if(scripts[i].innerHTML.indexOf("wSlideshow.render") != -1) {
                scriptTxt = "" + scripts[i].innerHTML;
                break;
            }
        }

        var cutOff = "{" + scriptTxt.slice(scriptTxt.indexOf("images:[") + 0);
        cutOff = cutOff.substring(0, cutOff.indexOf("]") + 2);
        cutOff = cutOff.replace(/\\/g, '');
        cutOff = cutOff.replace("images", "\"images\"");

        var myJSON = JSON.parse(cutOff);
        $.each(myJSON.images, function(i, item) {
            imgURL = myJSON.images[i].url;

            if (imgURL.indexOf("orig") == -1){
                imgURL = imgURL.replace(".", "_orig.");
            }

            imgArray.push("http://weblations.weebly.com/uploads/" + imgURL);
        });
    }

    if (imgArray.length > 0){
        gallery.empty();
        for (i = 0; i < imgArray.length; i++) {
            gallery.append('<img class="spread-img" src="' + imgArray[i] + '" />');
        }
    }
})();