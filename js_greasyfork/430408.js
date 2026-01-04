// ==UserScript==
// @name        天籁安全教育培训网络平台-自动签到
// @version     0.01
// @author      Sunev
// @description     自动签到
// @include         *://www.tlsafety.com/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @namespace https://greasyfork.org/users/469928
// @downloadURL https://update.greasyfork.org/scripts/430408/%E5%A4%A9%E7%B1%81%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%B9%B3%E5%8F%B0-%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/430408/%E5%A4%A9%E7%B1%81%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%B9%B3%E5%8F%B0-%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

// HACK XMLHttpRequest
function ajaxEventTrigger(event) {
    var ajaxEvent = new CustomEvent(event, {
        detail: this
    });
    unsafeWindow.dispatchEvent(ajaxEvent);
}
var oldXHR = unsafeWindow.XMLHttpRequest;

function newXHR() {
    var realXHR = new oldXHR();
    realXHR.addEventListener('abort', function () {
        ajaxEventTrigger.call(this, 'ajaxAbort');
    }, false);
    realXHR.addEventListener('error', function () {
        ajaxEventTrigger.call(this, 'ajaxError');
    }, false);
    realXHR.addEventListener('load', function () {
        ajaxEventTrigger.call(this, 'ajaxLoad');
    }, false);
    realXHR.addEventListener('loadstart', function () {
        ajaxEventTrigger.call(this, 'ajaxLoadStart');
    }, false);
    realXHR.addEventListener('progress', function () {
        ajaxEventTrigger.call(this, 'ajaxProgress');
    }, false);
    realXHR.addEventListener('timeout', function () {
        ajaxEventTrigger.call(this, 'ajaxTimeout');
    }, false);
    realXHR.addEventListener('loadend', function () {
        ajaxEventTrigger.call(this, 'ajaxLoadEnd');
    }, false);
    realXHR.addEventListener('readystatechange', function () {
        ajaxEventTrigger.call(this, 'ajaxReadyStateChange');
    }, false);
    return realXHR;
}
unsafeWindow.XMLHttpRequest = newXHR;

// 必要组件的加载情况
var essentials = {
    video_min_js: false,
    videoplay_js: false,
    videoplay_vid: false
};
// 劫持 xmlhttpRequest 组件
unsafeWindow.addEventListener('ajaxLoad', function (e) {
    var url = e.detail.responseURL;
    var response = e.detail.response;
    dealResponse(url, response);
});
var dealResponse = function (url, response) {
    // video.min.js 框架异步加载完成
    if (url.match(/http:\/\/www\.tlsafety\.com\/Public\/js\/video\.min\.js/ig) !== null) {
        window.eval(response);
        essentials.video_min_js = true;
        tryEssentials();
    }
    // videoplay.js 异步加载完成
    if (url.match(/http:\/\/www\.tlsafety\.com\/Public\/js\/Home\/Index\/videoplay\.js/ig) !== null) {
        essentials.videoplay_js = true;
        tryEssentials();
    }
    // videoplay_vid 异步加载完成
    if (url.match(/http:\/\/www\.tlsafety\.com\/Home\/Index\/videoplay/ig) !== null) {
        essentials.videoplay_vid = true;
        tryEssentials();
    }
};
var tryEssentials = function() {
    if (essentials.video_min_js && essentials.videoplay_js && essentials.videoplay_vid) {
        $(document).ready(function () {
            // 屏蔽考勤验证码
            unsafeWindow.showTimer = function() {};

            // 如果微信考勤弹出，直接关闭考勤
            $("#wxcheckModal").on('show.bs.modal', function () {
                setTimeout(function () {
                    $("#wxcheckModal").modal("hide");
                }, Math.random() * 10 + 5);
                // setTimeout(function () { location.reload(); }, Math.random() * 10 + 5)
            });

            // 在沙箱初始化播放控件
            var myPlayer = videojs("video_1", {
                "techOrder": ["html5"],
                "width": 720,
                "autoplay": false,
                "preload": false,
                controlBar: {
                    muteToggle: false,
                    playToggle: true,
                    progressControl: true
                }
            }, function () {
                calNextTime();
                $('video').bind('contextmenu', function () { return false; });
            });

            // 页面打开后，直接播放到最大进度
            myPlayer.on('loadeddata', function () {
                myPlayer.play();
                var maxTime = $("#testpanel").data("maxtime");
                myPlayer.currentTime(maxTime);
            });
        });
    }
};
