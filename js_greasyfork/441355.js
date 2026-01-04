// ==UserScript==
// @name         BiliBili视频速度控制
// @namespace    https://github.com/NicerWang
// @version      0.4
// @description  自定义Bilibili视频播放速度（仅新版播放器，支持番剧与普通视频）
// @author       NicerWang
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/441355/BiliBili%E8%A7%86%E9%A2%91%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/441355/BiliBili%E8%A7%86%E9%A2%91%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let speeds;
    let speed = 2;
    let selected = false;
    let isBangumi = false;
    // 番剧/普通视频检测
    const getSpeeds = ()=>{
        let speedsVideo = document.querySelectorAll("li.bpx-player-ctrl-playbackrate-menu-item");
        let speedsBangumi = document.querySelectorAll("ul.squirtle-speed-select-list li");
        isBangumi = (speedsVideo.length == 0);
        speeds = speedsVideo.length == 0 ? speedsBangumi : speedsVideo;
    }
    // 番剧速度高亮显示
    const emphasisBangumi = ()=>{
        for(let i = 0; i < speeds.length; i++){
            speeds[i].className = "squirtle-select-item";
        }
        speeds[0].className = "squirtle-select-item active";
    }
    // 分P/分集切换检测函数
    async function registerVideoChangeHandler() {
        const observer = new MutationObserver(e => {
            if (e[0].target.src) {
                getSpeeds();
                init();
            }
        });
        observer.observe(document.querySelector('#bilibili-player video'), {attributes:true});
    }
    // 初始化
    let timer = setInterval(()=>{
        getSpeeds();
        if(speeds.length != 0){
            clearInterval(timer);
            // 默认恢复到1.0x
            speeds[3].click();
            init();
            registerVideoChangeHandler();
        }
    },300)
    // 更改自定义速度的标签名称
    let speedLabelSetter = ()=>{
        speeds[0].dataset.value = speed; // 用于普通视频的速度高亮显示
        speeds[0].innerText = speed + 'x(自定)';
        speeds[0].style.wordBreak = 'keep-all';
        speeds[0].style.overflow = 'hidden';
        speeds[0].style.textOverflow = 'ellipsis';
    }
    const init = ()=>{
        speeds[0].innerText = speed + 'x(自定)';
        speeds[0].onclick = function(e){
            if(!selected){
                // 如果没有被选中，则被正常选中
                selected = true;
                if(isBangumi){
                    player.setPlaybackRate(speed);
                    emphasisBangumi();
                    e.stopPropagation();
                }
            }else{
                // 如果已经被选中，则弹出提示框
                let input = prompt("播放速度：（输入[0.25,4.00]之内的数字）");
                if(input == null){
                    e.stopPropagation();
                    return;
                }
                input = Number(input);
                if( isNaN(input) || input < 0.25 || input > 4 ){
                    alert("速度超出范围");
                }
                else{
                    speed = input;
                    player.setPlaybackRate(speed);
                }
                e.stopPropagation();
            }
            speedLabelSetter();
        };
        // 切换其他速度时，取消选中状态
        for(let i = 1; i < speeds.length; i++){
            speeds[i].addEventListener('click',()=>{
                selected = false;
            })
        }
        // 用于番剧集数切换时保持速度高亮显示
        if(selected && isBangumi){
            emphasisBangumi();
        }
    }
})();