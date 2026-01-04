// ==UserScript==
// @name         Bilibili仅多P自动连播
// @name:en      Bilibili Smart Playing
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  在B站看单个视频的时候不想自动连播，不让容易拨到推荐的哪些不感兴趣的视频。但是有些多P的视频，不打开自动连播就会只播放一P，这个插件的作用就是在单个多P视频内自动连播，视频之间不自动连播
// @description:en  Do and only do Automatic-Continuesly-Playing on Multi-part video page
// @author       TheRiverElder
// @match        https://www.bilibili.com/video/**/*
// @icon         https://theriverelder.github.io/assets/river_icon_dark.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484130/Bilibili%E4%BB%85%E5%A4%9AP%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/484130/Bilibili%E4%BB%85%E5%A4%9AP%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const GARDIAN_LOOP_PERIOD = 1000;

    function ensureSwitchValue(value) {
        const btnSwitch = document.querySelector("#multi_page > div.head-con > div.head-right > span > span.switch-button");
        if (!btnSwitch) return;
        if (btnSwitch.classList.contains('on') === value) return;

        btnSwitch.click();
        console.log("Switch turned", value);
    }

    function handle() {
        const listElements = Array.from(document.querySelectorAll("#multi_page > div.cur-list > ul.list-box > li"));
        for (let index = 0; index < listElements.length; index++) {
            const element = listElements[index];
            if (!element.classList.contains('on')) continue;

            const lastFlag = index === listElements.length - 1;
            ensureSwitchValue(!lastFlag);
        }
    }

    let pid = null;

    function loop() {
        handle();
        pid = setTimeout(loop, GARDIAN_LOOP_PERIOD);
    }

    loop();

    window.addEventListener("beforeunload", () => {
        ensureSwitchValue(false);
    });

})();