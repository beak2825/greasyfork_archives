// ==UserScript==
// @name         音悦Tai
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  音悦Tai免登录1080p,宽屏模式
// @author      alex wang
// @match       http://v.yinyuetai.com/video/*
// @icon        http://www.yinyuetai.com/favicon.ico
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/374350/%E9%9F%B3%E6%82%A6Tai.user.js
// @updateURL https://update.greasyfork.org/scripts/374350/%E9%9F%B3%E6%82%A6Tai.meta.js
// ==/UserScript==

(function () {
    var $ = window.jQuery || unsafeWindow.$;
    var url = location.href,
        jsonapi = 'http://www.yinyuetai.com/insite/get-video-info?json=true&videoId=',
        vregex = /^http:\/\/v\.yinyuetai\.com\/video\/h5\/(\d+).*/gi;
    if (/^http:\/\/v\.yinyuetai.com\/video\/\d+/.test(url)) {
        url = url.replace(/(^http:\/\/v.yinyuetai.com\/video\/)(\d+\S*$)/, '$1h5/$2');
        location.href = url; return;
    }
    var vid = vregex.exec(url)[1];
    GM_xmlhttpRequest({
        url: jsonapi + vid,
        method: 'get',
        onload: function (data) {
            var d = JSON.parse(data.responseText);
            var videoUrlModels = d.videoInfo.coreVideoInfo.videoUrlModels;
            if (!videoUrlModels || videoUrlModels.length == 0) return;
            videoUrlModels.reverse();
            var ulhtml = "";
            for (const item of videoUrlModels) {
                ulhtml += '<li data-url="' + item.videoUrl + '" class="vp-resolution-menu-li" data-index="'
                    + item.bitrateType + '"><span class="vp-resolution-menu-li-text">'
                    + item.qualityLevelName + '</span></li>';
            }
            console.log(videoUrlModels);
            var timer = setInterval(function () {
                $(".vp-resolution-menu-ul").html(ulhtml);
                $(".vp-resolution-menu-ul").on("click", "li", function () {
                    var c = document.querySelector("#video").currentTime;
                    $('#video').attr('src', $(this).data('url'));
                    document.querySelector("#video").currentTime = c;
                    $('.vp-resolution-basebar-text').html($(this).find("span").html());
                    keyBinding();
                    clearInterval(timer);
                });
                $('.vp-resolution-menu-li').first().trigger('click');
            }, 200);
        }
    });
    /**注册快键键 */
    var keyBinding = function () {
        document.onkeydown = function (event) {
            var v = document.querySelector("#video");
            var handled = false;
            switch (event.which) {
                case 37:
                    v.currentTime -= 5; handled = true;
                    break;
                case 38:
                    v.volume += 0.05; handled = true;
                    break;
                case 39:
                    v.currentTime += 5; handled = true;
                    break;
                case 40:
                    v.volume -= 0.05; handled = true;
                    break;
            }
            if (handled) {
                event.preventDefault();
            }

        };
    };
    /*版面样式修改 */
    var css = ".main-right{display: none!important;}"
        + ".main-left{width: 100%!important;}"
        + ".v-container{width: 1395px!important;margin-top: 0!important;}"
        + ".video-container{width: 1395px!important;height: 831px!important;}"
        + ".video-container>video{width: 1395px!important;height: 831px!important;left: 0!important;}"
        + "#vPlay{width: 1395px;height: 831px;}";
    GM_addStyle(css);

    $(".shopgif ").removeClass("shopgif");
    $("body > div.tool-box,.likeBox").remove();
})();