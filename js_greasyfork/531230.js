// ==UserScript==
// @name         bilibili调速插件
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  bilibili调速插件，可以修改速度菜单栏选项，同时支持键盘操作，c键加速0.1x，x键减速0.1x
// @author       henyuer
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531230/bilibili%E8%B0%83%E9%80%9F%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/531230/bilibili%E8%B0%83%E9%80%9F%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const CURRENT_RATE = "current_rate"; //关键字，内容存储在本地
    let rates = ['2.0', '1.75', '1.5', '1.25', '1.0', '0.75', '0.5', '0.25']; //速率表
    let initRate; //上次关闭时的速率

    //获取上次观看速率
    let getCurrentRate = () => {
        let saved = parseFloat(localStorage.getItem(CURRENT_RATE))
        initRate = isNaN(saved) || saved <= 0 ? 1 : saved;
        console.log(initRate);
    }

    let isBangumi = () => {
        const path = window.location.pathname;
        if (path.startsWith("/bangumi/play")) return true;
        return false;
    }


    //重建速率选择表
    //仅替换li元素，尽量少的影响dom树
    let rebuildRateMenu = () => {
        const oldRateUl = document.querySelector(".bpx-player-ctrl-playbackrate-menu");
        while (oldRateUl.firstChild) {
            oldRateUl.removeChild(oldRateUl.firstChild);
        }
        rates.forEach(rate => {
            const li = document.createElement("li");
            li.classList.add("bpx-player-ctrl-playbackrate-menu-item");
            li.dataset.value = parseFloat(rate);
            li.innerHTML = rate + 'x';

            // 添加li的click事件，存储新的速率，其余操作应该父元素会冒泡执行
            li.addEventListener('click', () => {
                localStorage.setItem(CURRENT_RATE, rate);
            })
            oldRateUl.appendChild(li);
        })
    }

    let setInitSpeed = () => {
        const video = document.querySelector('video');
        if (!video) return;

        video.playbackRate = initRate;
    }

    //监测播放器控件是否插入
    let observeAndExe = () => {
        const ctrObserver = new MutationObserver(() => {
            if (document.querySelector(".bpx-player-ctrl-playbackrate-menu")) {
                getCurrentRate();
                rebuildRateMenu();
                setInitSpeed();
                ctrObserver.disconnect();
            }
        });
        const controlWrap = document.querySelector(".bpx-player-control-wrap");
        //普通video只需要监听controlWrap
        if (!isBangumi()) {
            ctrObserver.observe(controlWrap, { childList: true, subtree: true });
            return;
        }
        //bangumi需要监听到player wrap
        const playWrap = document.querySelector("#bilibili-player-wrap");
        const WrapObserver = new MutationObserver(() => {
            if (document.querySelector(".bpx-player-control-wrap")) {
                const curControlWrap = document.querySelector(".bpx-player-control-wrap");
                ctrObserver.observe(curControlWrap, { childList: true, subtree: true });
                WrapObserver.disconnect();
            }
        })
        WrapObserver.observe(playWrap, { childList: true, subtree: true });
    }

    observeAndExe();

    //DOM root添加键盘事件
    document.addEventListener('keydown', (e) => {
        //确保焦点不在可编辑区
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BILI-COMMENTS' || e.target.isContentEditable) {
            return;
        }

        const video = document.querySelector('video');
        if (!video) return;

        let speed = video.playbackRate;
        if (e.key === 'x')
            speed = Math.max((speed - 0.1).toFixed(2), 0.1);
        else if (e.key === 'c')
            speed = Math.min((speed + 0.1).toFixed(2), 8.0);

        const lies = document.querySelectorAll(".bpx-player-ctrl-playbackrate-menu")
        if (lies.length > 0) {
            lies.forEach(li => {
                if (li.dataset.value === speed) li.click();
            })
        }
        else return;

        video.playbackRate = speed;
        localStorage.setItem(CURRENT_RATE, speed);

        e.preventDefault();
        e.stopImmediatePropagation();

    }, true)

})();