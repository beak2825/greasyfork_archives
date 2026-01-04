// ==UserScript==
// @name         汕大网课
// @namespace    http://tampermonkey.net/
// @version      2025.03.21
// @description  网课视频自动播放下一级
// @author       Rohero
// @include      https://stu.5zk.com.cn*
// @icon         https://stu.5zk.com.cn/zk8exam/logo_stu.jpg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488764/%E6%B1%95%E5%A4%A7%E7%BD%91%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/488764/%E6%B1%95%E5%A4%A7%E7%BD%91%E8%AF%BE.meta.js
// ==/UserScript==

// DISCLAIMER:
// 本脚本仅供个人学习、研究和测试用途，不得用于任何非法目的。
// 使用本脚本的用户需确保其行为符合所有适用法律法规以及目标网站的服务条款。
// 作者不对因使用本脚本而产生的任何后果负责。

(function () {
    'use strict';

    // 禁止 alert() 弹窗
    window.alert = function() {};

    // 禁止 confirm() 弹窗
    window.confirm = function() { return true; };

    // 禁止 prompt() 弹窗
    window.prompt = function () { return null; };

    // 跳过章节练习的 XHR 请求
    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url) {
            if (url.includes('learn_jjsp.action.php')) {
                console.log('阻止了 XHR 请求，目标 URL:', url);
                return; // 阻止该请求，跳过章节练习
            }
            return open.apply(this, arguments); // 继续其他请求
        };
    })(XMLHttpRequest.prototype.open);

    // 用于检测视频元素的加载
    function observeDOM() {
        const observer = new MutationObserver((mutationsList, observer) => {
            const video = document.querySelector("video");
            if (video) {
                console.log('Video element found');
                observer.disconnect(); // 停止观察
                initVideoPlayer(video); // 初始化视频播放器
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 初始化视频播放器
    async function initVideoPlayer(video) {
        try {
            await new Promise(resolve => setTimeout(resolve, 5000)); // 确保元素已经准备好
            video.muted = true; // 静音播放视频
            video.play().catch(error => {
                console.error('Error during video play:', error.message);
            }); // 播放视频
            video.addEventListener('ended', delayTheNextOne); // 监听视频播放结束事件
            console.log('Event delayTheNextOne listener added');
            document.addEventListener("visibilitychange", () => switchTabPlay(video));
            console.log('Event switchTabPlay listener added');
        } catch (error) {
            console.error('Error during video initialization:', error.message);
        }
    }
    function switchTabPlay(video){
        if(document.visibilityState === "hidden") {
            // 切换 tab 后立即恢复播放
            setTimeout(() => {
                video.play();
                console.log("切换 tab 后恢复播放");
            }, 0);
        }
    }

    // 延迟播放下一个视频的函数
    function delayTheNextOne() {
        console.log('开始播放下一个视频');
        setTimeout(function () {
            const list = document.querySelector('.list.list-activity').getElementsByTagName('li');
            // 遍历元素，获取正在播放的视频
            for (let i = 0; i < list.length; i++) {
                if (list[i].querySelector('i').className === 'si si-control-play text-danger') {
                    // 点击下一个视频
                    if (list[i + 1]) {
                        list[i + 1].querySelector('a').click();
                    } else {
                        console.log('已到最后一个视频');
                    }
                    break; // 防止重复点击
                }
            }
        }, Math.random() * 3000 + 3000); // 随机延迟3-6秒
    }

    // 启动 DOM 观察器以检测视频元素
    observeDOM();

})();
