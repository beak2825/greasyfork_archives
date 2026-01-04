// ==UserScript==
// @name         BiliBili视频助手
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  BiliBili视频助手，提供自动宽屏、自动洗脑循环等功能
// @author       tuntun
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441875/BiliBili%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/441875/BiliBili%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const _historyWrap = function(type) {
        const orig = history[type];
        const e = new Event(type);
        return function() {
            const rv = orig.apply(this, arguments);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };
    history.pushState = _historyWrap('pushState');
    history.replaceState = _historyWrap('replaceState');

    const isAutoWidescreen = false;
    let firstVisible = true;
    const repeat = (time = 0) => {
        setTimeout(()=> {
            let setting = document.querySelector('.bilibili-player-video-btn-setting');
            if (setting !== null) {
                const event1 = new MouseEvent('mouseover');
                setting.dispatchEvent(event1);
                let btn = document.querySelector('.bilibili-player-video-btn-setting-left-repeat input');
                // console.dir(btn)
                if (!btn.checked) {
                    btn.click();
                    // console.log('repeat')
                }
                const event2 = new MouseEvent('mouseout');
                setting.dispatchEvent(event2);
                if (firstVisible) {
                    firstVisible = !firstVisible;
                }
            }
        }, time);
    }
    const widescreen = (time = 0) => {
        // console.log('widescreen');
        if (isAutoWidescreen) {
            setTimeout(()=> {
                let widescreenBtn = document.querySelector('.bilibili-player-video-btn-widescreen');
                widescreenBtn.click();
            }, time);
        }
    }
    window.addEventListener(
        'load',
        async () => {
            repeat(3000);
        },
        false,
    )
    document.addEventListener("visibilitychange", function() {
        if (document.visibilityState === 'visible' && firstVisible) {
            // console.log(document.visibilityState);
            widescreen(1500)
            repeat(3000);
            firstVisible = !firstVisible;
        }
    });
    let preBv = location.pathname;
    // console.log(preBv);
    window.addEventListener('pushState', function(e) {
        const newBv = e.arguments[2].slice(0, 19);
        // console.log(newBv);
        repeat();
        if(preBv !== newBv){
            widescreen();
            preBv = newBv;
        }
    });
    window.addEventListener('popstate', function(event) {
        repeat();
        widescreen();
    })
})();