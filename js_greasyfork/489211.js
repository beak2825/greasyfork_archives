// ==UserScript==
// @name         网站视频倍速
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  改动百度网盘视频的倍速！
// @author       pps
// @match        https://pan.baidu.com/pfile/video?path=*.mp4&theme=light&from=home
// @icon         https://nd-static.bdstatic.com/m-static/v20-main/favicon-main.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489211/%E7%BD%91%E7%AB%99%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/489211/%E7%BD%91%E7%AB%99%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ctrlPressed = false;
    let speed;
    function initFn(callback){
        return new Promise(resolve=>{
            const checkInterval = setInterval(function checkElementExistence() {
                const ad_video = document.querySelectorAll('div[data-vjs-player]')[1].style.zIndex == -1;
                const play_video = document.querySelectorAll('div[data-vjs-player]')[0].classList.contains('vjs-playing');
                if (ad_video && play_video) {
                    clearInterval(checkInterval); // 停止定时检查
                    callback && callback()
                    resolve('ok')
                } else {
                    console.log('Element not found'); // 当元素不存在时，在控制台输出 "Element not found"
                }
            }, 2000); // 每秒检查一次，可以根据需求调整时间间隔
        })
    }
    async function run (){
        await initFn(function(){
            const btns = document.querySelectorAll('.vp-video__control-bar--setup .vp-video__control-bar--button-group')[2];
            const HP_btn = btns.querySelector('.is-svip');
            HP_btn.click();
        });
        await initFn(speedFn)
    }
    run()

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Control') {
            ctrlPressed = true;
        } else if (event.key === 'ArrowRight' && ctrlPressed) {
            speedFn()
            ctrlPressed = false;
        } else {
            ctrlPressed = false;
        }
    });
    const speedFn = ()=>{
        const video = document.querySelector('video.vjs-tech');
        video.pause()
        speed = Number(prompt('请输入快进倍速！','1.5'));
        console.log(video)
        video.playbackRate = speed;
        video.play();
    }
    })();