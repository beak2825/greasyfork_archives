// ==UserScript==
// @name         Text-to-Image
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Re-enable Text-to-Image in GameFAQs signatures
// @author       Brock Adams with SUPER MINOR edits by -l_____________l-
// @match        https://gamefaqs.gamespot.com/boards/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421092/Text-to-Image.user.js
// @updateURL https://update.greasyfork.org/scripts/421092/Text-to-Image.meta.js
// ==/UserScript==

// most of this is from https://stackoverflow.com/questions/18709491/use-greasemonkey-to-change-text-to-images-on-a-static-site lol


(function() {
    'use strict';
    var $ = window.$;
    var imageExtensions = ["gif", "png", "jpg", "bmp"];
    var imgExtRegex = new RegExp(
    '\\.(' + imageExtensions.join('|') + ')$', 'i'
    );
   // console.log(imgExtRegex);

     //-- This jQuery selector is custom for each new site...
     var imgLinks = $(".sig_text > a");
    // console.log(imgLinks);


    //-- Also custom for the site...
    var urlBase = "";

    //-- Remove non-image links.
    var finalLinks = imgLinks.filter(function () {
    // console.log(imgExtRegex.test(this.textContent));
    return imgExtRegex.test(this.textContent);
    });

    finalLinks.each(function () {
        var jThis = $(this); // This is one of the links
        var filename = $.trim(jThis.text());
     //   console.log(filename);

    //-- Rreplace link content with image:
    jThis.html(
        '<img src="' + urlBase + filename + '" height="200" />'
    );
    });

    }
)();