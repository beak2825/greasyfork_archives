// ==UserScript==
// @name         9anime Bingewatcher+ (Yu Yu Hakusho Dub Mod)
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      1.5
// @description  custom Yu Yu Hakusho version, skips intro recap and end credits, auto-advances to next episode, turns series into one long movie
// @include      https://www*.9anime.*/watch/yu-yu-hakusho-ghost-files-dub*
// @exclude      https://9anime.*/watch/yu-yu-hakusho-ghostfiles-dub.mozv/ep-1
// @include      https://vidstream.pro/*
// @include      https://mcloud.to/*
// @include      https://mcloud2.to/*
// @include      https://streamtape.com/*
// @include      https://*.mp4upload.com:*/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @author       drhouse
// @icon         https://www.google.com/s2/favicons?domain=9anime.to
// @downloadURL https://update.greasyfork.org/scripts/422925/9anime%20Bingewatcher%2B%20%28Yu%20Yu%20Hakusho%20Dub%20Mod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422925/9anime%20Bingewatcher%2B%20%28Yu%20Yu%20Hakusho%20Dub%20Mod%29.meta.js
// ==/UserScript==

(function($){

    function openFullscreen(elem) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE / Edge */
            elem.msRequestFullscreen();
        }
    }

    function waitForElementToDisplay(selector, time) {
        if($(selector)!=null) {
            setTimeout(function(){
                var elem = $('video').parent().parent().parent().get(0);
                openFullscreen(elem);
                $(elem).focus();
            }, 1000);


            var newYearCountdown = setInterval(function(){

                var player = $('video').get(0);

                var duration = player.duration;
                var current = player.currentTime;

                if (typeof code_happened === 'undefined') {
                    player.currentTime = current + 115;
                    window.code_happened = true;
                }

                if (current > "1305"){
                    if (typeof code_happened2 === 'undefined') {
                        player.currentTime = duration;
                        window.code_happened2 = true;
                    }
                }

                //console.log('duration='+duration)
                //console.log('current='+current)

                var link = $("body");
                link.addEventListener("keydown", function(event) {

                    var x = event.key;
                    var z = event.keyCode;

                    if (x == '0') { // 0 key skip 90s
                        player.currentTime = current + 90;
                    }

                    if (x == 'v') { // V key skip 90s
                        player.currentTime = current + 90;
                    }

                    if (x == 'n') { // V key skip end
                        player.currentTime = player.duration;
                    }

                    if (x == 't') { // V key skip end
                        player.currentTime = current + 6;
                    }
                }) 
            }, 1000);
        }
        else {
            setTimeout(function() {
                waitForElementToDisplay(selector, time);
            }, time);
        }
    }

    waitForElementToDisplay('#player', 1000);

})(jQuery);
