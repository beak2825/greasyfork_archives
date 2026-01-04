// ==UserScript==
// @name         bilibili字幕自动打开
// @namespace    http://tampermonkey.net/
// @version      1.15
// @description  自动打开哔哩哔哩字幕，只在有播放列表时开启，方便看课程，不需要每次都点击字幕
// @author       lisisuidegithub
// @match        https://www.bilibili.com/video/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509684/bilibili%E5%AD%97%E5%B9%95%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/509684/bilibili%E5%AD%97%E5%B9%95%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let interval; // 声明轮询变量

    // 等待页面完全加载完毕后执行脚本
    window.onload = function() {
        let lastUrl = window.location.href; // 存储上一个 URL

        // 初始检测播放列表和字幕
        checkAndOpenSubtitle();

        // 监听 DOM 变化
        const observer = new MutationObserver(() => {
            let currentUrl = window.location.href;


            // 检查 URL 是否发生变化
            if (currentUrl !== lastUrl) {
                console.log('URL发生变化');
                console.log('currentUrl:'+currentUrl)
                console.log('lastUrl:'+lastUrl)
                lastUrl = currentUrl; // 更新上一个 URL

                clearInterval(interval); // 停止当前轮询
                checkAndOpenSubtitle(); // 重新检测播放列表和字幕
            }
        });

        // 开始观察 DOM 变化，监听整个页面的变化
        observer.observe(document.body, { childList: true, subtree: true });

        function checkAndOpenSubtitle() {

            //let boxList = document.querySelector("#mirror-vdcon > div.right-container > div > div.rcmd-tab > div.video-pod.video-pod > div.video-pod__body > div.video-pod__list.multip.list")
            //let boxList = document.querySelector('div.video-pod__body > div.video-pod__list > multi-p, div.video-pod__body > div.video-pod__list.multip.list')
            //console.log(boxList)
//
            //if (!boxList ) {
            //    console.log('不存在列表！')
            //    return
            //}

            let list = document.querySelector('meta[itemprop="description"][name="description"]')
            let match = list.content.match(/共计(\d+)条/);// '【4K60】林俊杰为恩师献唱《谢幕》共计2条视频，包括：《谢幕》Hires、低码率等，UP主更多精彩视频，请关注UP账号。'
            let num = match ? match[1] : 1;
            console.log('共计' + num + '条视频');

            if (num <= 1) {
                console.log('不存在列表！')
                return
            }


            // if (!lastUrl.includes('p=')) {
            //     console.log('不存在列表！')
            //     return
            // }

            //// 检测是否存在播放列表
            //const listBox = document.querySelector('div.video-pod.video-pod');
            //if (!listBox) {
            //    console.log('不存在播放列表');
            //    return
            //}

            console.log('存在播放列表！');
            clearInterval(interval); // 确保清除旧的轮询
            waitForSubtitleButton();

        }

        // 轮询检测列表和字幕
        function waitForSubtitleButton() {

            // 检测字幕是否已开启
            var subtitlePanel = document.querySelector('.bili-subtitle-x-subtitle-panel .bili-subtitle-x-subtitle-panel-text.bili-subtitle-x-subtitle-panel-text-mouse-move-cursor')
            if (subtitlePanel) {
                console.log('字幕已开启！！！')
                // clearInterval(interval)
                return
            }


            const maxAttempts = 20; // 设置最大尝试次数
            let attempts = 0;

            console.log('尝试开启字幕......')

            interval = setInterval(() => {
                // 检测字幕是否已开启
                var subtitlePanel = document.querySelector('.bili-subtitle-x-subtitle-panel .bili-subtitle-x-subtitle-panel-text.bili-subtitle-x-subtitle-panel-text-mouse-move-cursor')
                if (subtitlePanel) {
                    console.log('字幕已开启！！！')
                    clearInterval(interval)
                    return
                }

                attempts++;
                if (attempts > maxAttempts) {
                    console.log('尝试次数过多，停止轮询！');
                    console.log('不存在字幕！');
                    clearInterval(interval);
                    return
                }
                console.log(`第${attempts}次尝试......`)
                // var subtitleButton = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-subtitle[aria-label="字幕"] .bpx-player-ctrl-btn-icon .bpx-common-svg-icon');
                //var subtitleButton = document.querySelector('div.bpx-player-ctrl-subtitle-language-item')
//
                //if (subtitleButton) {
                //    subtitleButton.click(); // 点击字幕按钮
                //    console.log('字幕开启成功！');
                //    clearInterval(interval);
                //    return
                //}
                // 获取所有符合条件的元素
                var subtitleElements = document.querySelectorAll('div.bpx-player-ctrl-subtitle-major-inner > div.bpx-player-ctrl-subtitle-language-item > div.bpx-player-ctrl-subtitle-language-item-text');
                //console.log(subtitleElements)

                if (subtitleElements && subtitleElements.length > 0) {
                    var flag = false;
                    // 遍历所有符合条件的元素
                    // 选择中文字幕
                    subtitleElements.forEach(element => {
                        //console.log(element.textContent);
                        //console.log(element)
                        // 检查元素的文本内容是否为“中文”或“中文简体”
                        if (element.textContent.includes('中文')) {
                            element.click(); // 模拟点击操作
                            flag = true;
                            console.log(element.textContent.trim() + '字幕开启成功！');
                            clearInterval(interval); // 停止检测
                            return
                        }
                    });
                    // 没有中文则切换为第一个字幕
                    var element = subtitleElements[0]
                    if (!flag) {
                        element.click();
                        flag = true;
                        console.log(element.textContent.trim() + '字幕开启成功！');
                        clearInterval(interval); // 停止检测
                        return
                    }
                }

            }, 1000); // 每秒检测一次字幕按钮
        }
    };
})();
