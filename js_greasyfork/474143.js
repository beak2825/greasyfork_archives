// ==UserScript==
// @name         Youtube 画质锁定
// @namespace    YYoutube quality lock
// @version      2023.08.29.01
// @description  Youtube 画质锁定（一次选择后一直有效）
// @author       James Wood
// @match        *://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474143/Youtube%20%E7%94%BB%E8%B4%A8%E9%94%81%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/474143/Youtube%20%E7%94%BB%E8%B4%A8%E9%94%81%E5%AE%9A.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // 获取之前选择的视频画质
    let vidQuality = await GM.getValue('videoQuality', 1);
    console.log('之前选择的视频画质:', vidQuality);

    document.addEventListener('yt-player-updated', () => {

        /* 检查页面类型 */
        if (window.location.pathname != '/watch') {
            return;
        }

        console.log('视频播放器已更新');

        /* 加载设置面板 */
        let settingsBtn = document.querySelector('.ytp-settings-button');
        settingsBtn.click();
        settingsBtn.click();
        console.log('已点击设置按钮');

        /* 打开画质选择面板 */
        let qualityBtn = document.querySelector('.ytp-menuitem-content div:not(.ytp-menuitem-toggle-checkbox)');
        qualityBtn.click();
        let qualityOptions = document.querySelectorAll('.ytp-quality-menu .ytp-menuitem:not(:has(.ytp-premium-label))');
        console.log('可选画质:', qualityOptions);

        /* 关闭画质选择面板 */
        settingsBtn.click();
        settingsBtn.click();
        console.log('已关闭画质选择面板');

        /* 选择视频画质 */
        let nth_option = qualityOptions.length - vidQuality;
        console.log('nth_option:', nth_option);
        let selectedOption = qualityOptions[Math.max(0, nth_option)];
        console.log('selectedOption:', selectedOption);
        selectedOption.click();
        console.log('已选择视频画质:', selectedOption.textContent);

        /* 添加画质选择的事件监听器 */
        for (let i = 0; i < qualityOptions.length; ++i) {
            qualityOptions[i].addEventListener('click', () => {
                GM.setValue('videoQuality', qualityOptions.length - i);
                console.log('已更新视频画质:', qualityOptions.length - i);
            });
        }
    });

    console.log('YouTube固定视频画质脚本开始执行');
})();