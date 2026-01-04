// ==UserScript==
// @name         Avday vip
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  avday.tv 破解
// @author       you
// @license MIT
// @match        https://avday.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/469082/Avday%20vip.user.js
// @updateURL https://update.greasyfork.org/scripts/469082/Avday%20vip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if (window.location.href.startsWith('https://avday.tv/watch/long/')) {
        var m3u8_url = document.querySelector("#video-player source").getAttribute('src').replace('/intro', '');
        document.querySelector("#video-player source").setAttribute('src', m3u8_url);
    } else if (window.location.href.startsWith('https://avday.tv/watch/short/')) {
        var poster = document.querySelector('meta[property="og:image"]').content;
        var av_id = poster.split('/')[5];
        var video_src = 'https://player.awvvvvw.live/tv_adult/'+av_id+'/'+av_id+'.m3u8';
        var el = document.createElement('source');
        el.setAttribute('type', 'application/x-mpegURL');
        el.setAttribute('src', video_src);
        var image = document.createElement('img');
        image.setAttribute('src', poster);
        console.log(document.querySelector("#video-player"));
        document.querySelector("#video-player").appendChild(el);
        document.querySelector("#video-player").appendChild(image);


// 删除遮挡
        document.querySelector('#unlock-msg').remove()
 // 初始化播放器
        const videoCate =  'short';
    const videoCode = window.location.href.split('/')[-1];
    function isIE() {
        var e = navigator.userAgent.toLowerCase();
        return e.indexOf("msie") != -1 && parseInt(e.split("msie")[1])
    }
        var isAndroid = false;
    if (/Android/i.test(navigator.userAgent)) isAndroid = true;
    $(document).ready(function() {
        var iev = isIE();
        var videoImg = $('#video-player-block').find('img').attr('src');
        if (!iev || iev > 10) {
            var player = videojs('video-player', {
                                fluid: true,
                autoplay: false,
                preload: 'auto',
                muted: false,
                controlBar: {
                    volumePanel: {
                        inline: false
                    }
                },
                html5: {
                    nativeAudioTracks: false,
                    nativeVideoTracks: false,
                    playsinline: true,
                    hls: {
                                                debug: false,
                        overrideNative: true
                    }
                },
                plugins: {}
            },
            function() {
                                this.on('error',
                function() {
                    $('#unlock-msg').html("<div style='font-size: 18px;color:#fff;margin-top:10px;'>抱歉，影片發生錯誤，請重新整理頁面或切換線路再試一次。<br />若還是無法看請清除網站暫存後重新瀏覽，或則請點選下方的問題回報通知，謝謝。</div>").css({top: '139px', 'text-align': 'center', background: 'rgba(0, 0, 0, 0.7)'}).removeClass("d-none");
                });
            });
            player.volume(0.3);
                    } else {
            $('#unlock-msg').html("<div style='font-size: 18px;color:#fff;margin-top:10px;'>觀看高清(HD)影片需安裝 IE 11 以上的版本，或者推薦安裝 <a href='https://www.google.com/chrome/browser/desktop/index.html' target='_blank'>Chrome 瀏覽器</a> 即可開始試看</div>").css({top: '139px', 'text-align': 'center', background: 'rgba(0, 0, 0, 0.7)'}).removeClass("d-none");
        }
    });
    var time = 10;
    var videoElement = document.getElementById('video-player');
    document.onkeyup = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode === 37) {
            videoElement.currentTime !== 0 ? videoElement.currentTime -= time : 1;
            return false;
        } else if (e && e.keyCode === 39) {
            videoElement.volume !== videoElement.duration ? videoElement.currentTime += time : 1;
            return false;
        }
    };



    }
})();