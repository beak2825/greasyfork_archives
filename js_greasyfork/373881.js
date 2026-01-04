// ==UserScript==
// @name         清华学堂在线视频自动播放
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  自动播放、设置二倍速、切换一下个视频
// @author       Rika
// @match        http://tsinghua.xuetangx.com/courses/*
// @match        http://next.xuetangx.com/courses/*
// @match        http://www.xuetangx.com/courses/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373881/%E6%B8%85%E5%8D%8E%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/373881/%E6%B8%85%E5%8D%8E%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==


let video;
let code = setInterval(function () {
    const a_tags = $('a[href^="' + location.pathname.split('courseware')[0] + 'courseware/"]');
    if (a_tags.length === 0) return;
    // const now_a_tag = $('a[href="' + location.pathname + '"]');

    if ((video = $('video')).length === 0) {
        if ($('.seq_video').length === 0) {
            for (let i = 0; i < a_tags.length; i++)
                if (a_tags[i].href === location.toString()) {
                    location.href=jQuery(a_tags[i + 1])[0].href;
                    break;
                }
            return;
        }
        else
            return;
    }
    clearInterval(code);
    console.log(video);
    $('.xt_video_player_quality ul li').click()
    video[0].playbackRate = 10;
    video[0].autoplay = true;
    video[0].oncanplay = function () {
        const play_btn = $('.xt_video_player_play_btn');
        if (!play_btn.hasClass('xt_video_player_play_btn_pause'))
            play_btn.click();

    };
    video[0].onended = function () {
        const next_button = $('li.next a');
        if (!next_button.hasClass('disabled'))
            next_button.click();
        else {
            for (let i = 0; i < a_tags.length; i++)
                if (a_tags[i].href === location.toString()) {
                    $(a_tags[i + 1]).click();
                    break;
                }
        }
    };
}, 1000);