// ==UserScript==
// @name         BUPT学堂在线
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  play xuetangx videos
// @author       雁穿云罗
// @match        http://bupt.xuetangx.com/courses/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380661/BUPT%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/380661/BUPT%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF.meta.js
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
                    $(a_tags[i + 1]).click();
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