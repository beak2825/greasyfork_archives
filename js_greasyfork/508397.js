// ==UserScript==
// @name         B站-播放器自动宽屏
// @namespace    http://tampermonkey.net/
// @version      2024-09-14
// @description  B站进入播放页后，自动点击宽屏按钮，并将播放器滚动到合适的位置
// @author       oahnaLiew
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/508397/B%E7%AB%99-%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/508397/B%E7%AB%99-%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function () {

    'use strict';

    scriptLog('Script started');

    // 顶部导航栏（需要根据其高度计算最后播放器的位置）
    var headerBar = null;
    // 「播放器」对象
    var player = null;
    // 「宽屏」按钮
    var btnWide = null;

    // 尝试获取按钮的次数
    var count = 0;
    // 执行完成标记，避免重复运行
    var done = false;

    // 获取所有需要用到的界面元素
    function getElements() {

        scriptLog('getElements()');

        headerBar = document.querySelector('.bili-header__bar.mini-header');
        player = document.getElementById('bilibili-player');
        btnWide = document.querySelector('.bpx-player-ctrl-btn-icon.bpx-player-ctrl-wide-enter');

        // 必须获取到所有需要的元素才算成功
        if (btnWide && player && headerBar) {
            return true;
        } else {
            return false;
        }
    }

    // 自动宽屏并滚动到合适位置
    function autoWide() {

        scriptLog('autoWide()：' + count);

        // 如果没有获取到需要的元素
        if (!getElements()) {

            // 500 毫秒后重试，最多尝试 20 次（10秒）
            if (count++ < 20) {
                setTimeout(autoWide, 500);
            } else { // 超时，获取不到对象，就算了
                scriptLog('getElements(): timeout! ');
            }

            return;
        }

        scriptLog('Got elements');

        // 获取到元素后，重置尝试次数，后面可能还要用到
        count = 0;

        // 给「宽屏」按钮增加点击事件监听
        btnWide.addEventListener('click', function () {

            scriptLog('btnWide clicked');

            // 每次点击延迟 500 毫秒自动调整播放器位置
            setTimeout(scrollPlayer, 500)
        });

        // 自动点击「宽屏」按钮
        btnWide.click();

        // 标记完成，避免重复执行
        done = true;
    }

    // 将播放器滚动到合适的位置
    function scrollPlayer() {

        scriptLog('scrollPlayer(): ' + count);

        // 获取窗口和所有相关元素的高度
        var windowHeight = window.innerHeight;
        var headerBarHeight = headerBar.getBoundingClientRect().height;
        var playerHeight = player.getBoundingClientRect().height;
        // 获取当前窗口的滚动距离，以及播放器顶部相对于窗口顶部的距离
        var scrollTop = document.documentElement.scrollTop;
        var playerTop = player.getBoundingClientRect().top;

        scriptLog("windowHeight : " + windowHeight);
        scriptLog("headerBarHeight : " + headerBarHeight);
        scriptLog("playerHeight : " + playerHeight);
        scriptLog("scrollTop : " + scrollTop);
        scriptLog("playerTop : " + playerTop);

        // 有时候无法获取到正确的元素高度，直接给定默认值
        if (headerBarHeight == 0) {
            headerBarHeight = 64;
        }
        if (playerHeight == 0) {
            playerHeight = 712;
        }

        // 有时候会获取不到正确的高度
        // if (headerBarHeight == 0 || playerHeight == 0) {

        //     // 500 毫秒后重试，同样只尝试 20 次（10秒）
        //     if (count++ < 20) {

        //         scriptLog('getHeight: ' + count);

        //         setTimeout(scrollPlayer, 500);
        //         // window.requestAnimationFrame(scrollPlayer);
        //         return;

        //     } else { // 超时后给定默认值

        //         scriptLog("getHeight Timeout! ");

        //         if (headerBarHeight == 0) {
        //             headerBarHeight = 64;
        //         }

        //         if (playerHeight == 0) {
        //             playerHeight = 712;
        //         }
        //     }
        // }

        scriptLog("Got Height ");

        var playerFinalTop = 0;

        // 如果 窗口高度 大于 （顶栏 + 播放器 + 空隙）
        if (windowHeight > (headerBarHeight + playerHeight + 10)) {

            scriptLog("Big window");

            // 修改顶栏的 position 属性，可以固定显示
            headerBar.style.position = "fixed";
            // 使播放器顶部距离顶栏10个像素
            playerFinalTop = headerBarHeight + 10;

        }
        // 窗口高度不够
        else {

            scriptLog("Small window");

            // 修改顶栏的 position 属性，使其不要固定显示在顶部
            headerBar.style.position = "absolute";
            // 使播放器顶部距离窗口顶部 10 个像素
            playerFinalTop = 10;
        }

        scriptLog("playerFinalTop : " + playerFinalTop);

        // 滚动到指定位置
        window.scrollTo({
            // 播放器顶部 与 窗口顶部 的距离为 playerFinalTop 个像素
            top: scrollTop + playerTop - playerFinalTop,
            // 使用平滑滚动效果，可选
            behavior: 'smooth' 
        });
        
        scriptLog("window.scrollTo : " + playerFinalTop);

        // 强制触发浏览器重绘，使得对于 headerBar 的 position 属性的修改生效
        headerBar.offsetHeight = headerBar.offsetHeight;

    }

    // 当页面在前台时才执行
    // 因为经常提前在后台打开多个视频标签页，而标签页在后台时不会加载DOM元素，但是脚本依然会运行
    // 等切换到提前在后台打开的视频标签页时，上述代码的早已运行完毕，仍无法获取到所需的元素对象

    // 若是直接前台打开的页面，就直接执行
    if (!document.hidden) {

        scriptLog("页面就在前台，直接执行");
        autoWide();

    } else { // 否则，监听页面可见性变化事件

        document.addEventListener('visibilitychange', function () {

            // 当页面切换到前台，且「未完成」，则执行代码
            // 一定要有「执行完毕」的标记，否则切换标签页时会重复执行
            if (!document.hidden && !done) {
                scriptLog("页面切换到前台");
                autoWide();
            }
        });

    }

    function scriptLog(message) {
        console.log("【B站-自动宽屏】： " + message);
    }

})();