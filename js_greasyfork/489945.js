// ==UserScript==
// @name         YouTube Rotate 90°
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  把Youtube影片旋轉0°、90°、180°、270°，讓你輕鬆觀看影片!
// @license MIT
// @match        https://*.youtube.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.js
// @downloadURL https://update.greasyfork.org/scripts/489945/YouTube%20Rotate%2090%C2%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/489945/YouTube%20Rotate%2090%C2%B0.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    var clickCount = 0;
    var safeTest = window.location.href;

    function transform90() {
        setTimeout(function() {
            var $videoContainer = $(".html5-video-container");
            var width = $videoContainer.outerWidth();
            var height = $videoContainer.outerHeight();
            var heightTest = width - height;
            $(".video-test1").html('<style>.video-stream{width:calc(100% - '+heightTest+'px)!important;}</style>');
        }, 20);
    }

    function transform(x) {
        $(".video-test, .video-test1").remove();
        var $videoContainer = $(".html5-video-container");
        
        switch(x) {
            case 1:
                $videoContainer.append('<div class="video-test"></div>');
                $videoContainer.append('<div class="video-test1"></div>');
                $(".video-test").html('<style>.html5-video-container {display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important;}.video-stream{position:relative !important; transform:rotate(90deg) !important; height:auto !important; left:0 !important; top:0 !important;}</style>');
                transform90();
                break;
            case 2:
                $videoContainer.append('<div class="video-test"></div>');
                $videoContainer.append('<div class="video-test1"></div>');
                $(".video-test").html('<style>.html5-video-container {display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important;}.video-stream{position:relative !important; transform:rotate(180deg) !important; height:auto !important; left:0 !important; top:0 !important;}</style>');
                break;
            case 3:
                $videoContainer.append('<div class="video-test"></div>');
                $videoContainer.append('<div class="video-test1"></div>');
                $(".video-test").html('<style>.html5-video-container {display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important;} .video-stream{position:relative !important; transform:rotate(270deg) !important; height:auto !important; left:0 !important; top:0 !important;}</style>');
                transform90();
                break;
            case 4:
                clickCount = 0;
                break;
        }
    }

    function build() {
        $(".video-test, .video-test1, .video-test2, .transform90").remove();

        var $ytpContainer = $(".ytp-embed, .ytd-miniplayer #player-container #ytd-player");
        $ytpContainer.prepend('<div class="video-test2"></div>');
        $(".video-test2").html('<style>.ytp-autohide .transform90-top{opacity: 0 !important; -moz-transition: opacity .1s cubic-bezier(0.4,0.0,1,1) !important; -webkit-transition: opacity .1s cubic-bezier(0.4,0.0,1,1) !important; transition: opacity .1s cubic-bezier(0.4,0.0,1,1) !important;} .ytp-transform90-icon {margin: auto !important; width: 36px !important; height: 36px !important; position: relative !important;}.ytp-big-mode .ytp-transform90-icon {width: 54px !important; height: 54px !important;} .ytp-transform90-title{font-weight: 500 !important; text-align: center !important; font-size: 14px !important;} .ytp-big-mode .ytp-transform90-title{font-size: 20px !important;}</style>');
        $ytpContainer.find('.ytp-chrome-top-buttons').prepend('<button class="ytp-button transform90 transform90-top" data-tooltip-opaque="true" aria-label="" style="width: auto;height: auto;"><div class="ytp-transform90-icon" style="transform:scaleX(-1);"><svg version="1.1" x="0px" y="0px" viewBox="0 0 453.227 453.227" style="enable-background:new 0 0 453.227 453.227;" xml:space="preserve" width="50%" height="100%" class=""><g><g><g><g><path d="M139.453,120.747L1.107,259.093L139.453,397.44L277.8,259.093L139.453,120.747z M61.373,259.093l77.973-77.973     l78.08,77.973l-77.973,77.973L61.373,259.093z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF"/><path d="M395.88,125.44C358.333,88,309.267,69.227,260.093,69.227V0l-90.56,90.56l90.56,90.453v-69.12     c38.187,0,76.48,14.613,105.6,43.733c58.347,58.347,58.347,152.853,0,211.2c-29.12,29.12-67.413,43.733-105.6,43.733     c-20.693,0-41.28-4.373-60.48-12.907l-31.787,31.787c28.587,15.787,60.373,23.787,92.267,23.787     c49.173,0,98.24-18.773,135.787-56.213C470.867,322.027,470.867,200.427,395.88,125.44z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF"/></g></g></g></g> </svg></div><div class="ytp-transform90-title">Video Rotate 90°</div></button>');
      
        if ($ytpContainer.length === 0) {
            $(".ytp-right-controls").prepend('<button class="transform90 ytp-button" title="Video Rotate 90°" aria-label="Video Rotate 90°" style="display: inline-flex;justify-content: center; transform:scaleX(-1);"><svg version="1.1" x="0px" y="0px" viewBox="0 0 453.227 453.227" style="enable-background:new 0 0 453.227 453.227;" xml:space="preserve" width="50%" height="100%" class=""><g><g><g><g><path d="139.453,120.747L1.107,259.093L139.453,397.44L277.8,259.093L139.453,120.747z M61.373,259.093l77.973-77.973     l78.08,77.973l-77.973,77.973L61.373,259.093z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF"/><path d="M395.88,125.44C358.333,88,309.267,69.227,260.093,69.227V0l-90.56,90.56l90.56,90.453v-69.12     c38.187,0,76.48,14.613,105.6,43.733c58.347,58.347,58.347,152.853,0,211.2c-29.12,29.12-67.413,43.733-105.6,43.733     c-20.693,0-41.28-4.373-60.48-12.907l-31.787,31.787c28.587,15.787,60.373,23.787,92.267,23.787     c49.173,0,98.24-18.773,135.787-56.213C470.867,322.027,470.867,200.427,395.88,125.44z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF"/></g></g></g></g> </svg></button>');
        }

        $('.transform90').on("click", function() {
            clickCount++;
            transform(clickCount);
        });
    }

    function observeTEST() {
        var composeBox = $('#player-container video')[0];
        var composeObserver = new MutationObserver(function(e) {
            if(safeTest !== window.location.href) {
                safeTest = window.location.href;
                clickCount = 0;
                build();
            }
        });
        if(!composeBox) {
            window.setTimeout(observeTEST, 500);
            return;
        }
        var config = { characterData: true, childList: true, attributes: true };
        composeObserver.observe(composeBox, config);
    }

    $(document).ready(function() {
        build();
        observeTEST();

        $(window).resize(function() {
            transform(clickCount);
        });

        document.addEventListener("fullscreenchange", function(event) {
            transform(clickCount);
        });

        $(".ytp-size-button").on("click", function() {
            transform(clickCount);
        });
    });

})(jQuery);
