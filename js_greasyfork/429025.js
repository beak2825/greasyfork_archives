// ==UserScript==
// @name         湘大视频优化
// @namespace    http://xtdx.web2.superchutou.com/
// @version      0.4
// @description  视频功能自动化
// @author       You
// @match        http://xtdx.web2.superchutou.com/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://unpkg.com/layui@2.6.8/dist/layui.js
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/429025/%E6%B9%98%E5%A4%A7%E8%A7%86%E9%A2%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/429025/%E6%B9%98%E5%A4%A7%E8%A7%86%E9%A2%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document.body).append(`<link href="http://unpkg.com/layui@2.6.8/dist/css/layui.css" rel="stylesheet">`);
    $(document.body).append(`<link href="http://unpkg.com/layui@2.6.8/dist/css/modules/layer/default/layer.css?v=3.5.1" rel="stylesheet">`);
    GM_registerMenuCommand ("启动", startPlay, "P");
    GM_registerMenuCommand ("设置", playSetting, "S");
})();

// 开始
function startPlay() {
    console.log('script has loaded');
    init(1000);
    $('.ant-list .ant-list-items a').on('click', () => {
        init();
    });
    setInterval(() => {
        if (video_player.j2s_realPlayVideoTime() == 0) {
            video_player.j2s_seekVideo(0);
            video_player.j2s_resumeVideo();
            init();
            console.log('自动播放失败，再次执行');
        }
        console.log(video_player.j2s_realPlayVideoTime());
        console.log('防呆机制运行中');
    }, 10000);
}

function init(waittime = 5000) {
     layer.msg((waittime / 1000) + '秒后自动播放');
     setTimeout(() => {
        h5_video = $('video')[0];
        video_player = unsafeWindow.video_player;
        if (video_player) {
            var title = video_player.HTML5.videoInfo.title;
            var vid = video_player.HTML5.vid;
            console.log('当前播放课程：' + title);
            console.log('当前播放vid：' + vid);
            if (h5_video.paused) {
                video_player.j2s_seekVideo(0); // 从头播放
                video_player.j2s_resumeVideo();
            }
            h5_video.addEventListener('timeupdate', skipVideo);
            video_player.on('s2j_onPlayOver', () => {
                if (GM_getValue('is_autoplay')) {
                    playNextVideo();
                }
            });
            video_player.on('s2j_onPlayerError', e => {
               console.log(e);
            });
        }
    }, waittime);
}

function skipVideo() {
    if (canPlayNextVideo()) {
        h5_video.pause();
        h5_video.removeEventListener('timeupdate', skipVideo);
        playNextVideo();
    }
}

function playSetting() {
    const html = `<div id="setting" class="layui-container">
                    <form class="layui-form" action="">
                        <div class="layui-form-item">
                            <label class="layui-form-label">连播</label>
                            <div class="layui-input-block layui-col-sm7">
                                <input lay-filter="is_autoplay" id="is_autoplay" type="checkbox" name="autoplay" lay-skin="switch">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label layui-col-sm5">进度</label>
                            <div id="play_prog" class="layui-input-block layui-col-md7">
                                <input type="checkbox" lay-skin="switch">
                            </div>
                        </div>
                    </form>
                </div>`;
                
    layer.open({
       type: 1,
       anim: 1,
       title: '播放设置',
       id: 'player_setting',
       resize: false,
       area: ['900px'],
       content: html
    });
    
    
    layui.use('form', function(){
        var form = layui.form;
        var is_autoplay = GM_getValue('is_autoplay');
        if (is_autoplay) {
            $('#is_autoplay').prop('checked', true);
        }
        
        var play_prog = GM_getValue('play_prog');
        
        form.on('switch(is_autoplay)', function(data){
            var is_autoplay = data.elem.checked;
                GM_setValue('is_autoplay', is_autoplay);
        });
        layui.use('slider', function(){
            var slider = layui.slider;
            //渲染
            slider.render({
                elem: '#play_prog',
                min: 5,
                max: 100,
                value: play_prog,
                change: function(value){
                    GM_setValue('play_prog', value);
                }
            });
        });
        form.render();
    });
}

// 判断跳转下个视频条件是否满足
function canPlayNextVideo() {
    var is_autoplay = GM_getValue('is_autoplay');
    var skip_time_percent = GM_getValue('play_prog'); // 跳转时间%
    var duration =  h5_video.duration; // 视频总长度
    var skip_time = Math.floor(duration * (skip_time_percent / 100)); // 跳转时间从百分比转换为秒
    var current_time = h5_video.currentTime;
    // console.log('当前时间：' + current_time);
    // console.log('跳过时间：' + skip_time);
    // console.log('视频总时间：' + duration);
    //当视频播放到指定时间的时候做处理
    if(is_autoplay && current_time >= skip_time){
        return true;
    }
    return false;
}

// 得到要播放（排除已播放）的下一个视频
function getNextVideo() {
    var dom_playlist = $('.ant-list .ant-list-items a');
    var cur_video_index = 0;
    var next_play_video = 0;
    var unplayed_videos = [];
    // 获得当前播放视频序号
    $(dom_playlist).each(function (i, e) {
        if ($(e).attr('class') == 'catalog_playing___3PDRN') {
            cur_video_index = i;
        }
        // 未播放完的视频组
        if (!$(e).find('i').hasClass('looked___1DdoP')) {
            unplayed_videos.push(i);
        }
    });
    
    if (unplayed_videos.length > 0) {
        for (const i in unplayed_videos) {
            if (unplayed_videos[i] > cur_video_index) {
                next_play_video = unplayed_videos[i];
                break;
            }
        }
    }
    return next_play_video;
}


// 跳转到下一个视频
function playNextVideo() {
    var next_video_index = getNextVideo();
    console.log('下个视频索引：' + next_video_index);
    if (next_video_index){
        layer.msg('当前进度已完成，3秒后播放下一个', { time: 3000 }, () => {
            console.log('跳转了');
            $('.ant-list .ant-list-items a')[next_video_index].click();
        });
    } else {
        layer.alert('所有章节已播放完毕');
        return false;
    }
}