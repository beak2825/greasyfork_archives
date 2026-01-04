// ==UserScript==
// @name         巴哈動畫瘋 - 全螢幕自動播放
// @namespace    https://hollen9.github.io
// @version      1.0.1
// @description  自動全螢幕、同意並跳過廣告──執行本腳本後，收看動畫瘋影片將無須手動點選「我同意」。並且，廣告在 30 秒後會自動跳過。
// @author       Hollen9
// @match        https://ani.gamer.com.tw/animeVideo.php?*
// @match        http://ani.gamer.com.tw/animeVideo.php?*
// @grant        GM_updatingEnabled
// @downloadURL https://update.greasyfork.org/scripts/395754/%E5%B7%B4%E5%93%88%E5%8B%95%E7%95%AB%E7%98%8B%20-%20%E5%85%A8%E8%9E%A2%E5%B9%95%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/395754/%E5%B7%B4%E5%93%88%E5%8B%95%E7%95%AB%E7%98%8B%20-%20%E5%85%A8%E8%9E%A2%E5%B9%95%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var sn_PlayButton = ".vjs-big-play-button .vjs-hidden",
        sn_agree = ".choose-btn-agree",
        sn_skipAds = ".nativeAD-skip-button.enable",
        sn_fullscreen = ".vjs-fullscreen-control";

    // https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
    ;(function ($, window) {

        var intervals = {};
        var removeListener = function(selector) {

            if (intervals[selector]) {

                window.clearInterval(intervals[selector]);
                intervals[selector] = null;
            }
        };
        var found = 'waitUntilExists.found';

        $.fn.waitUntilExists = function(handler, shouldRunHandlerOnce, isChild) {

            var selector = this.selector;
            var $this = $(selector);
            var $elements = $this.not(function() { return $(this).data(found); });

            if (handler === 'remove') {

                // Hijack and remove interval immediately if the code requests
                removeListener(selector);
            }
            else {

                // Run the handler on all found elements and mark as found
                $elements.each(handler).data(found, true);

                if (shouldRunHandlerOnce && $this.length) {

                    // Element was found, implying the handler already ran for all 
                    // matched elements
                    removeListener(selector);
                }
                else if (!isChild) {

                    // If this is a recurring search or if the target has not yet been 
                    // found, create an interval to continue searching for the target
                    intervals[selector] = window.setInterval(function () {

                        $this.waitUntilExists(handler, shouldRunHandlerOnce, true);
                    }, 500);
                }
            }

            return $this;
        };

    }(jQuery, window));
    var parseAds_interval;
    function clickPlay() {
        $(sn_PlayButton).click();
    }
    function clickAgree() {
        $(sn_agree)[0].click();
        console.log("已跳過！");
    }
    function clickSkipAds(){
        console.log("發現跳廣告按鈕！");
        //var text = $('.vast-skip-button').text();
        //console.log(text);
        parseAds_interval = setInterval(invHandler_parseAdsWaitTime,1000);
    }
    function clickFullscreen() {
        $(sn_fullscreen)[0].click();
    }
    function invHandler_parseAdsWaitTime(){
        /*var sec = 30;
        sec = parseInt($('.vast-skip-button').text().substring(3,5));
        if (sec === 0) {
            clearInterval(parseAds_interval);
            $('.vast-skip-button').click();
        }*/
        var text = $(sn_skipAds).text();
        if (text === "點此跳過廣告") {
            clearInterval(parseAds_interval);
            $(sn_skipAds).click();
        }
    }
    //Start
    $(sn_PlayButton).waitUntilExists(clickPlay);
    $(sn_agree).waitUntilExists(clickAgree);
    $(sn_skipAds).waitUntilExists(clickSkipAds);
    $(sn_fullscreen).waitUntilExists(clickFullscreen);
})();
