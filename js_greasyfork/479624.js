// ==UserScript==
// @name         GoogleAlwaysBest
// @namespace    https://github.snkms.com/
// @version      1.13
// @description  Hello world, beautiful world, I love Ads.
// @author       5026
// @match        https://www.youtube.com/*
// @grant        none
// @license      GPL-3.0-only
// @require      https://code.jquery.com/jquery-3.6.3.min.js#sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=
// @downloadURL https://update.greasyfork.org/scripts/479624/GoogleAlwaysBest.user.js
// @updateURL https://update.greasyfork.org/scripts/479624/GoogleAlwaysBest.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    let timer = setInterval(()=>{
        if(location.pathname === '/watch'){
            const video = document.querySelector('video');
            const hasAd = document.querySelector('.ytp-ad-player-overlay-layout, .ytp-ad-player-overlay') || document.querySelector('.ytp-ad-module')?.childNodes.length > 0;
            const hasSurvey = document.querySelector(".ytp-ad-survey-layout, .ytp-ad-survey")?.length > 0;

            if(video){
                if(hasAd){
                    if(!$(video).attr('data-speedup')){
                        video.muted = true; // video.volume = 0;
                        setTimeout(()=>{
                            video.paused && video.play();
                            video.currentTime = video.duration - 0.1;
                            video.playbackRate = 16;
                        }, 1500);


                        $(video).attr('data-speedup', true);
                    }


                    $('.ytp-ad-skip-button')?.click();
                    $('.ytp-ad-skip-button-modern')?.click();
                }
                else{
                    $(video).removeAttr('data-speedup');
                }
            }
            else if(hasAd && hasSurvey){
                $('.ytp-ad-skip-button')?.click();
                $('.ytp-ad-skip-button-modern')?.click();
            }

            if(document.querySelector("#movie_player > div.video-ads.ytp-ad-module")?.textContent.length > 0){
                $('.ytp-ad-skip-button')?.click();
                $('.ytp-ad-skip-button-modern')?.click();
            }
        }
    },150);
})(jQuery);