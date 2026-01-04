// ==UserScript==
// @name         Bilibili Speed Controller / b站视频播放速度调整
// @namespace    https://github.com/wxupjack
// @version      23.3.31
// @description  修改这个b站新播放器的播放速度，按键s减速0.1，d增速0.1，r重置1.0x 或者恢复到之前的倍率，v为隐藏播放器左上角指示器,
// @author       wxupjack
// @match        *://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462850/Bilibili%20Speed%20Controller%20%20b%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/462850/Bilibili%20Speed%20Controller%20%20b%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

GM_addStyle ( `
    .controller {
        position: absolute;
        top: 12px;
        left: 16px;
        opacity: 0.4;
        background: gray;
        color: white;
        padding: 8px;
        border-radius: 6px;
    }
` );

(function() {
    'use strict';
    /*jshint esversion: 8 */

    function wait(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(()=>{console.log('biliSpeedCtrl loaded'); resolve(ms);}, ms);
        })
    }
    (async ()=>{
        await wait(1000);
        var speedCtl = null;
        do {
            // 有b站特色的视频播放新标签, 直接拿第一个值 2.0
            speedCtl = document.querySelector('.bpx-player-ctrl-playbackrate-menu-item');
            await wait(1000); // wait 1 more second until the player loaded
        } while (!speedCtl)

        console.log('got control element ', speedCtl);

        // core function
        const changeSpeed = (speed) => {
            speedCtl.setAttribute('data-value', speed);
            speedCtl.click();
        }

        // this method support multiple key binding
        // (except for keys whose event.key is word, e.g. Shift, Enter)
        const keyMap = {
            plus: "dD",
            minus: "sS",
            reset: "rR",
            show: "vV"
        };

        const allKeys = Object.values(keyMap).join('');

        //var curSpeed = parseFloat(speedCtl.getAttribute('data-value')); // 2.0x
        //console.log('get current speed:  ', curSpeed, 'x');
        var curSpeed = 1.0;
        changeSpeed( curSpeed );

        // memory: the value before reset speed
        var memSpeed = 1.8; // same as VSC default

        // speed change offset
        const offset = 0.1;

        // add controller indicator on the top left of the player
        var player = document.querySelector('.bpx-player-video-wrap');
        let controller=document.createElement("div");
        controller.classList.add('controller');
        controller.id = 'bili-speed-control';
        controller.innerHTML = curSpeed.toFixed(1);
        player.appendChild(controller);
        var showCtrl = true;


        // keybind
        var keydown = document.onkeydown || function () {};
        document.onkeydown = function (event) {

            if (!allKeys.includes(event.key)) {
                keydown();
                return;
            }

            // console.log('key: ', event.key, 'cur s: ', curSpeed);
            // event.preventDefault();
            if (keyMap.minus.includes(event.key)) {
                curSpeed -= offset;
            }
            else if (keyMap.plus.includes(event.key)) {
                curSpeed += offset;
            }
            // reset/resume the player speed
            else if (keyMap.reset.includes(event.key)) {
                if (curSpeed == 1.0) {
                    curSpeed = memSpeed;
                    memSpeed = 1.0;
                }else{
                    memSpeed = curSpeed;
                    curSpeed = 1.0;
                }
            }
            // switch off/on the controller div
            else if (keyMap.show.includes(event.key)) {
                controller.style.display = showCtrl ? 'none' : '';
                showCtrl = !showCtrl;
            }
            curSpeed = parseFloat(curSpeed.toFixed(1));
            changeSpeed( curSpeed );
            controller.innerHTML = curSpeed.toFixed(1);
        }
    })();
})();