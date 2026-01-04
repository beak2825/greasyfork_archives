// ==UserScript==
// @name         B站播放列表随机播放
// @version      0.3
// @description  在B站播放列表中增加随机播放功能
// @author       brambles<qjnight@gmail.com>
// @match        https://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/3049
// @downloadURL https://update.greasyfork.org/scripts/472220/B%E7%AB%99%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/472220/B%E7%AB%99%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8%E9%9A%8F%E6%9C%BA%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const delay = (t) => new Promise(r => setTimeout(r,t));
    const waitFor = async (f, t) => {
        while(!f()) await delay(t);
    };

    await waitFor(() => !!document.querySelector('#multi_page .list-box > .watched'), 500);

    // 下一首
    const next = () => {
        if (checked) {
            const playList = [...document.querySelectorAll('#multi_page > .cur-list a[href*="/video/"]')].map(el => el.href);
            const nextUrl = playList[Math.floor(Math.random() * playList.length)];
            location.href = nextUrl;
        }

    };

    const nextButton = document.querySelector('#bilibili-player div.bpx-player-ctrl-btn.bpx-player-ctrl-next');
    if (nextButton){
        nextButton.onclick = ev => {
            ev.stopImmediatePropagation();
            next();
        };
    }




    // 初始化 UI
    const controlPad = document.querySelector('#multi_page > .head-con');
    if (!controlPad) return;

    const controlButton = document.createElement('div');

    const controlCheckbox = document.createElement('input');
    controlCheckbox.type = "checkbox";

    controlButton.append("随机播放");
    controlButton.append(controlCheckbox);

    controlPad.append(controlButton);

    // 初始化 UI 事件
    const storageKey = 'BILIBILI_RANDOM_PLAY_' + location.pathname;
    let checked = localStorage.getItem(storageKey) ? true : false;
    controlCheckbox.checked = checked;
    controlCheckbox.onchange = (e) => {
        checked = controlCheckbox.checked;
        localStorage.setItem(storageKey, checked ? '1' : '');
    };

    // 监听完播事件
    while (true) {
        await waitFor(() => {
            const endding = document.querySelector('#bilibili-player .bpx-player-ending-wrap');
            return getComputedStyle(endding).visibility === 'visible';
        }, 1000);

        if (checked) {
            next();
        }

        await delay(1000);
    }

    // Your code here...
})();