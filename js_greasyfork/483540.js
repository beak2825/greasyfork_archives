// ==UserScript==
// @name         斗鱼快捷键
// @namespace    null
// @version      0.5
// @description  各种快捷键
// @author       molijin
// @match        https://www.douyu.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483540/%E6%96%97%E9%B1%BC%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/483540/%E6%96%97%E9%B1%BC%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==




(function() {
    'use strict';
    //声音
    const SOUND = 'm';
    //网页全屏
    const WFQ = 's';
    //弹幕
    const DM = 'd';
    //全屏
    const FQ = 'f';
    //清屏
    const QP = 'q';
    //拉高（DouyuEx-斗鱼直播间增强插件的一个按钮）
    const LG = 'c'
    //弹幕输入框获得焦点（非全屏状态下）
    const TEXT = 'Enter'

    document.addEventListener("keydown", function (event) {
        const chatInput = document.querySelector('.ChatSend-txt  ');
        const isInTextarea = document.activeElement.matches('#layout-Player-aside textarea') || document.activeElement === document.getElementById('header-search-input') || document.activeElement === document.querySelector('.inputView-1f53d9');
        if (!isInTextarea && event.key === SOUND) {
            //声音
            const firstElementWithVolumeClass = document.querySelector('[class^="volume"]');
            firstElementWithVolumeClass.click();
        }

        if (!isInTextarea && event.key === WFQ) {
            const fullButton = document.querySelector('.wfs-2a8e83:not(.removed-9d4c42)');
            const fullButton2 = document.querySelector('.wfs-exit-180268:not(.removed-9d4c42)');
            //网页全屏
            if (fullButton !== null) {
                fullButton.click();
            }else{
                fullButton2.click();
            }
        }
        if (!isInTextarea && event.key === FQ) {
            const fullButton = document.querySelector('.fs-781153:not(.removed-9d4c42)');
            const fullButton2 = document.querySelector('.fs-exit-b6e6a7:not(.removed-9d4c42)');
            //全屏
            if (fullButton !== null) {
                fullButton.click();
                document.querySelector('.app-f0f9c7').focus();//大框架获得焦点
            }else{
                fullButton2.click();
            }
        }
        if (!isInTextarea && event.key === DM) {
            const fullButton2 = document.querySelector('.showdanmu-42b0ac');
            const fullButton = document.querySelector('.hidedanmu-5d54e2:not(.removed-9d4c42)');
            //弹幕
            if (fullButton !== null) {
                fullButton.click();
            }else{
                fullButton2.click();
            }
        }


        if (!isInTextarea && event.key === LG) {//拉高
		document.querySelector('.Barrage-toolbarLock').click();
        }
        if (!isInTextarea && event.key === QP) { //清屏
		document.querySelector('.Barrage-toolbarClear').click();
        }
        if (!isInTextarea && event.key === "z") {
		document.querySelector('.layout-Player').scrollIntoView();
        }
        if (event.key === TEXT && !document.activeElement.matches('#layout-Player-aside textarea') ) {//弹幕输入框获得焦点
            document.querySelector('.ChatSend-txt  ').focus();
        }
         if (event.key === TEXT && isInTextarea && chatInput.value.trim() === '') {//弹幕输入框失去焦点
            document.querySelector('.ChatSend-txt  ').blur();
        }
    });
})();
