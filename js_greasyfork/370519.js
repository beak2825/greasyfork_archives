// ==UserScript==
// @name         czatko webm
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  wyświetlanie mp4 i webm na czatku
// @author       You
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @match        https://client.poorchat.net/jadisco
// @grant        all
// @downloadURL https://update.greasyfork.org/scripts/370519/czatko%20webm.user.js
// @updateURL https://update.greasyfork.org/scripts/370519/czatko%20webm.meta.js
// ==/UserScript==

(function() {
    'use strict';


$(function() {
    var urlG = '';
    var currentMessage = '';
    var validFormats = ['mp4', 'webm'];
    var regex = /(https?:\/\/[^\s]+)/g
    if (window.top === window.self) {
        console.log('dd');
    }
    else {
        $(document).on('DOMNodeInserted', '.message', function(e) {
            var prevMessage = currentMessage;
            currentMessage = $(this).find('.text span').html();
            if(currentMessage != undefined) {
                //currentMessage = currentMessage.replace(/["']/g, "");
                if(prevMessage != currentMessage) {

                    currentMessage.replace(regex, function(url) {
                        urlG = url;
                    });
                    urlG = urlG.replace('</a>', '');
                    var ext = urlG.split('.').pop();
                    console.log(currentMessage);
                    if(jQuery.inArray(ext, validFormats) !== -1) {
                        $(this).append('<video class="post" preload="auto" autoplay="autoplay" muted="muted" loop="loop" webkit-playsinline="" style="width: 240px"><source src="'+ urlG +'" "></video>');
                    }
                    urlG = '';
                }
            }
        })
    }
});
    
})();