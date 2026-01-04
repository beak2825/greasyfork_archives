// ==UserScript==
// @name         蝌蚪窝视频去除VIP限制、移除广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  蝌蚪窝视频去除VIP限制、移除广告、添加视频下载按钮
// @author       alexskky
// @include      /^http[s]?:\/\/www\.xiaobi.*\.com\/.*$/
// @icon         data:image/ico;base64,AAABAAEAEBACAAAAAACwAAAAFgAAACgAAAAQAAAAIAAAAAEAAQAAAAAAQAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAA/4QAAH/+AACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAH/+AACAAQAAf/4AAH/+AAB//gAAf/4AAH/+AAB//gAAf/4AAH/+AAB//gAAf/4AAH/+AAB//gAAf/4AAH/+AACAAQAA
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437272/%E8%9D%8C%E8%9A%AA%E7%AA%9D%E8%A7%86%E9%A2%91%E5%8E%BB%E9%99%A4VIP%E9%99%90%E5%88%B6%E3%80%81%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/437272/%E8%9D%8C%E8%9A%AA%E7%AA%9D%E8%A7%86%E9%A2%91%E5%8E%BB%E9%99%A4VIP%E9%99%90%E5%88%B6%E3%80%81%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    main();
})();

function main() {

    removeAD();
    setInterval(removeAD, 1000);

    if ($('.video-info').length > 0){
        let videoPosterUrl = $('[property="og:image"]').attr('content');
        let videoDownloadUrl = $('#tab_video_info .item a:last')[0].href;
        let videoPlayUrl = videoDownloadUrl.slice(0, videoDownloadUrl.lastIndexOf('/?'));
        createVideoEle(".player", videoPlayUrl, videoPosterUrl);
        createDownloadBtn(videoDownloadUrl);
    }
}

function removeAD() {
    $('.pc_ad').remove();
    $('.place').remove();
    $('.right-vip').remove();
    $('#bottomNav').remove();
    if (typeof layer !== 'undefined') {
      layer.closeAll();
    }
}

function createVideoEle(ele, videoPlayUrl, videoPosterUrl) {
    var videoDiv = '<div id="user_video_div"><video id="user_video" controls="controls" autoplay="autoplay"></video></div>';
    $(ele).html(videoDiv);
    $('#user_video').attr('src', videoPlayUrl);
    $('#user_video').attr('poster', videoPosterUrl);
    $('#user_video_div').css({
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        background: '#000'
    });
    $('#user_video').css({
        width: '100%',
        height: '100%',
        background: '#000'
    });
    $(document).keydown(function(e) {
        if (e.keyCode === 39) {
            $('#user_video')[0].currentTime += 5;
        } else if (e.keyCode === 37) {
            $('#user_video')[0].currentTime -= 5;
        }
    });

    $('#user_video').on('click', function(e) {
        return this.paused ? this.play() : this.pause();
    });
}

function createDownloadBtn(videoUrl) {
    var top = $('#user_video').offset().top + 2;
    var left = $('#user_video').offset().left + $('#user_video').width() - 92;

    var downloadBtn =
        '<a style="position:absolute; top: ' +
        top +
        'px; left: ' +
        left +
        'px; background: #e9e9e9; color: green; width: 90px; height: 30px; line-height: 30px; z-index: 99999; text-align: center; font-size: 20px; border-radius: 5px; cursor: pointer;" href="' +
        videoUrl +
        '" target="_blank">下载</a>';
    $(document.body).append(downloadBtn);
}