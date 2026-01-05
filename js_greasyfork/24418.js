// ==UserScript==
// @name         FA No Custom Thumbnails
// @namespace    FurAffinity.Net
// @version      3
// @description  Changes all thumbnails for the default sized submission
// @author       JaysonHusky
// @match        *://www.furaffinity.net/*
// @exclude      *://www.furaffinity.net/view/*
// @exclude      *://www.furaffinity.net/msg/*
// @exclude      *://www.furaffinity.net/controls/*
// @exclude      *://www.furaffinity.net/journal/*
// @exclude      *://www.furaffinity.net/staff/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/24418/FA%20No%20Custom%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/24418/FA%20No%20Custom%20Thumbnails.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var thumburl;
   	$("img[src*='t.facdn.net']").each(function(index){
        var thumbnail_url=$(this).attr('src');
        if(thumbnail_url.indexOf('@150-') !=-1){
            thumburl=thumbnail_url.replace("@150","@400");
	        $(this).attr("src",thumburl);
        }
        else if(thumbnail_url.indexOf('@200-') !=-1){
            thumburl=thumbnail_url.replace("@200","@400");
	        $(this).attr("src",thumburl);
        }
        else if(thumbnail_url.indexOf('@250-') !=-1){
            thumburl=thumbnail_url.replace("@250","@400");
	        $(this).attr("src",thumburl);
        }
        else if(thumbnail_url.indexOf('@300-') !=-1){
            thumburl=thumbnail_url.replace("@300","@400");
	        $(this).attr("src",thumburl);
        }
        else {
            thumburl=thumbnail_url.replace("@150","@400");
	        $(this).attr("src",thumburl);
        }
	});
})();