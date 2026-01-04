// ==UserScript==
// @name         河北专技取消暂停播放
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  河北省专业技术人员继续教育播放视频禁止暂停
// @author       zjksdg@sohu.com
// @match        https://contentzyjs.heb12333.cn/videoPlay/play*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heb12333.cn
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528859/%E6%B2%B3%E5%8C%97%E4%B8%93%E6%8A%80%E5%8F%96%E6%B6%88%E6%9A%82%E5%81%9C%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/528859/%E6%B2%B3%E5%8C%97%E4%B8%93%E6%8A%80%E5%8F%96%E6%B6%88%E6%9A%82%E5%81%9C%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href
    console.log(url)


    // 目标video元素
    let video = document.querySelector('video');

    // 如果video元素已经存在，等待其加载完成
    if (video) {
        waitForVideoLoad(video);
        video.play()
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // 不要在这里暂停视频
            }
        });
    } else {
        // 如果video元素不存在，监听DOM变化
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                // 检查是否有新的节点被添加到DOM中
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        // 如果添加的节点是video元素，或者包含video元素
                        if (node.nodeName === 'VIDEO') {
                            video = node;
                            waitForVideoLoad(video);
                            observer.disconnect(); // 停止观察
                        } else if (node.querySelectorAll) {
                            const videos = node.querySelectorAll('video');
                            if (videos.length > 0) {
                                video = videos[0];
                                waitForVideoLoad(video);
                                observer.disconnect(); // 停止观察
                            }
                        }
                    });
                }
            }
        });

        // 开始观察整个文档的DOM变化
        observer.observe(document.body, {
            childList: true, // 观察子节点的添加或删除
            subtree: true,  // 观察所有后代节点
        });
    }

    // 等待video元素加载完成
    function waitForVideoLoad(video) {
        if (video.readyState >= 3) { // 如果已经加载了部分数据
            logVideoInfo(video);
            removePauseBlur();
        } else {
            // 监听loadeddata事件（视频的第一帧已加载）
            video.addEventListener('loadeddata', () => {
                logVideoInfo(video);
            });

            // 监听canplay事件（视频可以播放）
            video.addEventListener('canplay', () => {
                logVideoInfo(video);
                // video.play()
                removePauseBlur();
                setTimeout(()=>{video.play()},1000);
                
            });

            // 监听error事件（加载失败）
            video.addEventListener('error', () => {
                console.log('video元素加载失败。');
            });
        }
    }

    // 输出video元素的信息
    function logVideoInfo(video) {
        console.log('video元素加载完成:');
        console.log(`  src: ${video.currentSrc}`);
        console.log(`  duration: ${video.duration}`);
        console.log(`  width: ${video.videoWidth}`);
        console.log(`  height: ${video.videoHeight}`);
        console.log(`  autoplay: ${video.autoplay}`);
        console.log(`  controls: ${video.controls}`);
        console.log(`  muted: ${video.muted}`);
        console.log(`  paused: ${video.paused}`);
        console.log(`  volume: ${video.volume}`);
        // video.autoplay=true;
        // video.play()
        video.muted=true
    }
})();