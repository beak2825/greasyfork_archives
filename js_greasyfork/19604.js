// ==UserScript==
// @name         The Blaze Cleaner
// @description  Stop autoplay features on TheBlaze
// @namespace    rfindley
// @include      http://www.theblaze.com/*
// @include      http*://*.soundcloud.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @version      1.2.6
// @copyright    2017+, Robin Findley
// @license      MIT; http://opensource.org/licenses/MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19604/The%20Blaze%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/19604/The%20Blaze%20Cleaner.meta.js
// ==/UserScript==

window.blaze_cleaner = {events:[]};

(function(gobj) {

    var caught_video = false;
    var caught_podcast = false;

    function podcast_stop(e) {
        var origin = event.origin || event.originalEvent.origin;
        if (origin !== 'http://www.theblaze.com' || caught_podcast) return;
        var timeout = 30;
        var interval = setInterval(function(){
            var pb = $('.playButton');
            if (pb.hasClass('playing')) {
                console.log('Podcast stopped!');
                caught_podcast = true;
                clearInterval(interval);
                pb.click();
            } else if (timeout-- <= 0) {
                clearInterval(interval);
            }
        }, 100);
    }

    function video_stop() {
        console.log('Attempting to stop video...');
        caught_video = true;
        var v = $('.jw-video')[0];
        v.pause();
        setTimeout(function(){
            v.onplay = null;
        }, 300);
    }

    function startup() {
        if (location.hostname.match('soundcloud.com') !== null) {
            window.addEventListener("message", podcast_stop, false);
            return;
        }

        if (location.pathname.match(/^\/radio\//) === null) {
            $('.playing-ondemand-show').remove();
        }
        if (location.pathname.match(/^\/podcasts\//) !== null) {
            $('head').append('<style>#ondemand_radio_player_frame {display:block !important;}</style>');
            var target_origin = $('#ondemand_radio_player_frame').attr('src').match(/[^\/]*\.soundcloud\.com/)[0];
            $('#ondemand_radio_player_frame')[0].contentWindow.postMessage({msg:'blaze_stop_podcast'},'https://'+target_origin);
        }

        if (location.pathname.match(/^\/video\//) !== null) {
            var v = $('.jw-video')[0];
            if (v !== undefined) console.log('Found video...');
            v.onplay = video_stop;
            var interval = setInterval(function(){
                if (v.currentTime > 0 && !v.paused) {
                    v.pause();
                    caught_video = true;
                }
                if (caught_video) {
                    clearInterval(interval);
                }
            },10);
        }

        $('article.acontent').remove();
    }

    // Run startup() after window.onload event.
    if (document.readyState === 'complete')
        startup();
    else
        window.addEventListener("load", startup, false);

    // Code run at start of load
    $(':not(body) script').remove();
    $('.sidebar-outer-wrap').remove();
    $('.article-footer').remove();
    //$('.cmr-wrap-outer').remove();

}(window.blaze_cleaner));
