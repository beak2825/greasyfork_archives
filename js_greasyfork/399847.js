// ==UserScript==
// @name         智慧树自动刷网课
// @namespace    https://github.com/injahow
// @version      0.1.4
// @description  智慧树自动播放网课视频，支持调速默认15倍速
// @author       injahow
// @match        *://studyh5.zhihuishu.com/videoStudy*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399847/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E5%88%B7%E7%BD%91%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/399847/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E5%88%B7%E7%BD%91%E8%AF%BE.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';

    var videoLists = document.getElementsByClassName('el-scrollbar__view')[0];//视频目录
    var current_play_video = videoLists.getElementsByClassName('current_play')[0];//当前视频单元
    var clearfix_video_i = 0;//当前视频对应的列表id
    var next_video_i = 0;
    var clearfix_video = document.getElementsByClassName('clearfix video');//可播放的视频列表
    var lists_length = clearfix_video.length;

    var playVideo = document.getElementById('playButton');
    var volume = document.getElementsByClassName('volumeIcon')[0];
    console.log('injahow:视频静音！');
    volume.click();

    var speedTab = document.getElementsByClassName('speedTab speedTab15')[0];
    speedTab.id = 'mySpeedTab';
    var setSpeed = document.getElementById('mySpeedTab');
    /**
     * 设置15倍速，如果报错请适当调低
     */
    setSpeed.setAttribute('rate', '15');
    setSpeed.click();

    var myPlayer = document.getElementById('vjs_container_html5_api')
    //console.log('injahow:播放器信息：', myPlayer);

    // 间隔10s执行检查
    setInterval(function(){
        console.log('injahow:播放记录检查！');

        current_play_video = videoLists.getElementsByClassName('current_play')[0];//当前播放的视频单元
        for (let i in clearfix_video)//i表示<li>...</li> 选择class="pl5  hour"为章节编号
        {
            //console.log('injahow:clearfix_video_i：', i);
            let clearfix_video_i_pl5 = clearfix_video[i].getElementsByClassName('pl5')[0].innerText;
            let current_play_video_pl5 = current_play_video.getElementsByClassName('pl5')[0].innerText;
            if (clearfix_video_i_pl5 === current_play_video_pl5){
                //console.log( 'injahow:当前章节ID：',current_play_video_pl5, '===', clearfix_video_i_pl5);
                clearfix_video_i = parseInt(i);//注意i为字符串，特殊情况暂不考虑
                break;
            }
        }
        //console.log('injahow:当前视频信息：', current_play_video);
        let time_finish = current_play_video.getElementsByClassName('time_icofinish')[0];
        if(time_finish.hasAttribute('hidden')){//报错忽略...
            console.log('injahow:学习ing...');
        } else {
            console.log('injahow:当前视频学习完毕！');
            next_video_i = clearfix_video_i + 1;
            // 这里是模拟列表点击
            clearfix_video[next_video_i].click();
            // 刷新页面，重载脚本
            console.log('injahow:准备刷新页面！');
            setTimeout(function(){
                location.reload();
            }, 1000);
        }
    }, 10000);

    // 视频播放监听
    myPlayer.onplay = function(){
        console.log('injahow:视频开始播放！');
    };

    // 视频暂停监听
    myPlayer.onpause = function(){
        console.log('injahow:视频已暂停！');
        //case 1.弹出题目窗口
        //case 2.用户或其他触发视频暂停
        //case 3.视频播放完毕
        //3.1.学习完，3.2.学习未完
        //case 4.视频播放结束 end...

        setTimeout(function(){
            console.log('injahow:继续播放！');
            playVideo.click();
        }, 5000);

        // 可能不是题目，报错不影响
        let tm = document.getElementsByClassName("el-scrollbar__view")[1];
        let tm_opt_a = tm.getElementsByClassName("topic-item")[0];
        tm_opt_a.click();//只选择第一个选项，对错不影响
        setTimeout(function(){
            console.log('injahow:关闭题目弹窗！');
            let btn6 = document.getElementsByClassName('btn')[6];
            btn6.click();
        }, 3000);

    };

}, 3000);
