// ==UserScript==
// @name         9GAG Show Controls
// @namespace    http://www.diamonddownloads.weebly.net
// @version      0.1
// @locale       en-US
// @description  Automatically adds the controls attribute to all video elements.
// @author       RGSoftware, R.F Geraci
// @include      https://9gag.com/*
// @include      http://9gag.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @icon         http://icons.iconarchive.com/icons/iconleak/stainless/256/script-icon.png
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/32059/9GAG%20Show%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/32059/9GAG%20Show%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var scrollDiff = 500; //scrolled pixels


    var Tvideo = {
        oldHeight: $(window).scrollTop(),

        hasScrolled: function(amount){
            var height = $(window).scrollTop();
            //Covers boths scrolling up and scrolling down
            if (Math.abs((height - Tvideo.oldHeight)) >= amount){
                Tvideo.oldHeight = height;
                return true;
            }else{
                return false;
            }
        },
        showControls: function(){
            var v = $('video');

            for (var i=0;i<v.length;i++){
                v[i].setAttribute('controls', 'true');
            }
        },

        isVideos: function(){
            return $('video').length > 0;
        },
    };


    //Check onload for any video, 
    //from then when page scrolled

    if (Tvideo.isVideos){
        Tvideo.showControls();
    }

    $(window).scroll(function(){
        if (Tvideo.hasScrolled(scrollDiff)){

            if (Tvideo.isVideos){
                Tvideo.showControls();
            }

        }

    });


})();