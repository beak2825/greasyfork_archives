// ==UserScript==
// @name         MissAV视频控制条增强
// @namespace    http://tampermonkey.net/
// @version      1.1_20240516
// @description  常显视频控制条，优化样式，增加播放/暂停按钮。
// @author       iSwfe
// @match        https://missav.com/*
// @match        https://missav.ai/*
// @match        https://missav.ws/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.ai
// @run-at       document-start
// @grant        unsafeWindow
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/493932/MissAV%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%E6%9D%A1%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/493932/MissAV%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%E6%9D%A1%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Your code here...
    // 【开关】背景色覆盖iPhone非安全区
    const viewportFitCover = false;
    // 【开关】新增【播放控制条Beta】
    const playCtrlEnable = false;
    // 视频控制条按钮间距
    const buttonMargin = '.1rem';
    // 播放/暂停按钮的HTML样式
    const htmlPlay = '▶️';
    const htmlPause = '⏸️';
    // 【开关】修改时间跨度值按钮
    const durationBtnEnable = true;
    // 最长快进/快退时间跨度值
    const maxDuration = 60 * 5;

    (() => {
        // 【沉浸式状态栏/网页主题色】设置主题色
        var meta = document.createElement("meta");
        meta.name = "theme-color";
        meta.content = "#090811";
        document.querySelector("head").appendChild(meta);
        // 【横屏左右沉浸式背景色/视口覆盖非安全区】解决iPhone横屏时背景色未覆盖非安全区（即iPhone刘海区域）的部分
        if (viewportFitCover) {
            var viewport = document.querySelector("head > meta[name=viewport]");
            viewport.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
        }
    })()

    var handle = () => {
        console.log("【视频控制条增强】开始...");

        // 【页面标题】随页面滚动
        var title = document.querySelector("body > div > div.relative > div");
        title.classList.remove('fixed')
        var page = document.querySelector("body > div > div.sm\\:container");
        page.style = "padding-top: 0px";
        // 【页面内容区域】获取元素
        var content = document.querySelector("body > div:nth-child(3) > div.sm\\:container > div > div.flex-1.order-first > div:first-child");
        // 【视频区域】样式调整
        var video = content.querySelector("div:first-child");
        video.id = 'video';
        video.classList.value = 'relative -mx-4 sm:m-0 mt-1';
        // 【视频区域】设备横屏时自动锚点到视频
        window.addEventListener("orientationchange", () => {setTimeout(() => document.querySelector("#video").scrollIntoView(), 400);});
        // 【视频控制条】获取元素
        var bar = video.nextElementSibling;
        // 【播放控制条】新增
        if (playCtrlEnable) {
            var div = document.createElement("div");
            div.classList.value = 'flex -mx-4 sm:m-0 mt-1 bg-black justify-center';
            div.innerHTML = '<button id="btnControl" onclick="video.scrollIntoView();" type="button" class="relative -ml-px inline-flex items-center rounded-md bg-transparent pl-2 pr-2 py-2 font-medium text-white ring-1 ring-inset ring-white hover:bg-primary focus:z-10">🔁</button>';
            content.insertBefore(div, bar);
        }
        // 【视频控制条】显示
        bar.classList.remove('sm:hidden');
        // 【视频控制条】样式调整
        bar.classList.value = 'flex -mx-4 sm:m-0 mt-1 bg-black justify-center';
        // 【视频控制条】加入播放/暂停按钮
        var span = document.createElement("span");
        var player = document.querySelector("body > div:nth-child(3) > div > div > div > div:nth-child(1) > div > div > div > div > video");
        span.classList.value = 'isolate inline-flex rounded-md shadow-sm';
        span.style = `margin: 0 ${buttonMargin}`;
        span.innerHTML = '<button id="btnPlay" onclick="player.togglePlay();" type="button" class="relative -ml-px inline-flex items-center rounded-md bg-transparent pl-2 pr-2 py-2 font-medium text-white ring-1 ring-inset ring-white hover:bg-primary focus:z-10">' + htmlPlay + '</button>';
        bar.insertBefore(span, bar.lastElementChild);
        // 【视频控制条】播放/暂停时，变化播放按钮形态
        player.onplay = () => {document.querySelector("#btnPlay").innerHTML = htmlPause};
        player.onpause = () => {document.querySelector("#btnPlay").innerHTML = htmlPlay};
        // 【视频控制条】修改时间跨度按钮
        if (durationBtnEnable) {
            var leftBtn = bar.querySelector("span:first-child > button:first-child");
            var rightBtn = bar.querySelector("span:last-child > button:last-child");
            leftBtn.removeAttribute('@click.prevent');
            leftBtn.onclick = () => {player.currentTime -= maxDuration};
            leftBtn.innerHTML = leftBtn.innerHTML.replace('10m', '5m');
            rightBtn.removeAttribute('@click.prevent');
            rightBtn.onclick = () => {player.currentTime += maxDuration};
            rightBtn.innerHTML = rightBtn.innerHTML.replace('10m', '5m');
        }


        console.log("【视频控制条增强】完成。");
    };

    var trigger = () => {
        return !! document.querySelector("body > div:nth-child(3) > div.sm\\:container > div > div.flex-1.order-first > div:first-child > div.relative");
    };

    var interval;
    var timeout;
    interval = setInterval(() => {
        if(trigger()){
            clearInterval(interval);
            clearTimeout(timeout);
            handle();
            return;
        }
    }, 200);
    timeout = setTimeout(() => {
        clearInterval(interval);
        console.log("【视频控制条增强】触发条件匹配超时，已取消。");
    }, 10 * 1000);


    // 【去除视频区域跳转广告】
    (() => {
        var handle = () => {
            console.log("【去除视频区域跳转广告】开始...");
            var popDiv = document.querySelector("#video > div");
            popDiv.removeAttribute('@click');
            popDiv.removeAttribute('@keyup.space.window');
            //popDiv.onclick = () => {window.player.togglePlay()};
            console.log("【去除视频区域跳转广告】完成。");
        };

        var trigger = () => {
            return !! document.querySelector("#video > div");
        };

        var interval;
        var timeout;
        interval = setInterval(() => {
            if(trigger()){
                clearInterval(interval);
                clearTimeout(timeout);
                handle();
                return;
            }
        }, 200);
        timeout = setTimeout(() => {
            clearInterval(interval);
            console.log("【去除视频区域跳转广告】触发条件匹配超时，已取消。");
        }, 5 * 1000);
    })();

    // 【去除右下角弹窗广告】
    (() => {
        var handle = () => {
            console.log("【去除右下角弹窗广告】开始...");
            var cornerAd = document.querySelector("body > iframe:last-child");
            cornerAd = cornerAd ? cornerAd : document.querySelector("body > img:last-child");
            console.log("【去除右下角弹窗广告】标签类型:", cornerAd.tagName.toLowerCase());
            cornerAd.remove();
            console.log("【去除右下角弹窗广告】完成。");
        };

        var trigger = () => {
            return document.querySelector("body > iframe:last-child") || document.querySelector("body > img:last-child");
        };

        var interval;
        var timeout;
        interval = setInterval(() => {
            if(trigger()){
                clearInterval(interval);
                clearTimeout(timeout);
                handle();
                return;
            }
        }, 200);
        timeout = setTimeout(() => {
            clearInterval(interval);
            console.log("【去除右下角弹窗广告】触发条件匹配超时，已取消。");
        }, 20 * 1000);
    })();

    // 【去除右下角弹窗视频广告】
    (() => {
        var handle = () => {
            console.log("【去除右下角弹窗视频广告】开始...");
            console.log("【去除右下角弹窗视频广告】classList:", document.querySelector("body > div:first-child").classList.value);
            document.querySelector("body > div:first-child").remove();
            console.log("【去除右下角弹窗视频广告】完成。");
        };

        var trigger = () => {
            var a = document.querySelector("body > div:first-child");
            var b = document.querySelector("#sprite-plyr");
            return a && b && a.classList.value.includes('root-') && a !== b;
        };

        var interval;
        var timeout;
        interval = setInterval(() => {
            if(trigger()){
                clearInterval(interval);
                clearTimeout(timeout);
                handle();
                return;
            }
        }, 200);
        timeout = setTimeout(() => {
            clearInterval(interval);
            console.log("【去除右下角弹窗视频广告】触发条件匹配超时，已取消。");
        }, 20 * 1000);
    })();
})();
