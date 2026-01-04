// ==UserScript==
// @name         VPhoto helper
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  convert small image to large image
// @author       Chao
// @include      https://gallery.vphotos.cn/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/379330/VPhoto%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/379330/VPhoto%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("*** VPhoto Started ***");

    if (typeof GM_registerMenuCommand !== "undefined") {

         function replaceToLargeImageURL(){
             $(".vue-waterfall-slot")
                 .find("a")
                 .each(
                 function(index, item){
                     var href = $(item).attr("href");
                     var largeImgHref = href.replace('logosmall', 'logolarge');
                     $(item).attr("href", largeImgHref);
                 }
             )
         };

        GM_registerMenuCommand("转换为高清图片", replaceToLargeImageURL);
    }
})();