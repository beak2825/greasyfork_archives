// ==UserScript==
// @name         dyjxjy 1.7
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  from ai build
// @author       xuefeng
// @match        *://*.yxlearning.com/*
// @grant        none
// @license
// @downloadURL https://update.greasyfork.org/scripts/517490/dyjxjy%2017.user.js
// @updateURL https://update.greasyfork.org/scripts/517490/dyjxjy%2017.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 确保页面完全加载后再执行脚本
    window.onload = function () {
        // 确保页面完全加载后再执行脚本,在这使用的是延时的办法
        setTimeout(function () {
            // 获取当前页所有章节的元素的ID
            function getAllUnitID() {
                // 声明一个存储当前课程的每章节id的数组
                var allUnitID = [];
                // 获取所有 class 为 "pt5" 的 ul 元素
                var ulElements = document.querySelectorAll('ul.pt5');

                // 遍历每个 ul 元素
                ulElements.forEach(function (ul) {
                    // 获取 ul 元素下的所有 li 元素
                    var liElements = ul.querySelectorAll('li');

                    // 遍历每个 li 元素并获取其 id
                    liElements.forEach(function (li) {
                        allUnitID.push(li.id);
                    });
                });
                console.log("已经获取所有的章节ID", allUnitID);
                return allUnitID;
            }

            // 找到当前章节的管视频播放的那个video标签，也即当前页面真实的视频标签
            // nowUnitVideoElement 当前章节真实的视频元素标签
            function nowUnitTrueVideo() {
                var nowUnitTrueVideoElement = document.querySelectorAll("video");
                for (var i = 0; i < nowUnitTrueVideoElement.length; i++) {
                    if (nowUnitTrueVideoElement[i].duration) { // 判断当前页面是否有视频标签 duration是看所拿到的视频标签是否有播放时长的属性，如果有那就是真实的视频元素
                        return nowUnitTrueVideoElement[i];//拿到真实的视频元素就返回给调用该函数的变量
                    }
                }
            }

            // 点击这个视频所在的章节（即点击nowUnitID,即点击这个对应标题进入视频播放页）,并确保完全进入该章节后改变promise状态
            // inNowUnitID 进入当前的章节，以便于播放该小标题下的视频
            // nowUnitID 当前小标题的ID(即当前章节的ID)
            const inNowUnitID = (nowUnitID) => {
                return new Promise((resolve) => { // promise 一旦建立就立即执行，但是状态的改变需要resolve()
                    document.querySelectorAll('li[id="' + nowUnitID + '"]')[0].click();
                    setTimeout(() => { resolve("等待时间到，应该已完全进入该章节") }, 10000) //往往是刚通过上句.click()点击该视频之后，改小标题下的视频还没有出来，如果此时接着点击播放视频，就会失败，所以添加了一个延时点击。
                })
            }

            // 进入当前章节后找到真正的视频元素，并且保持持续播放，直到100%
            // getNowUnitTrueVideoElement_AND_keepVideoPlay  获得当前小章节的真实视频元素 并 保证持续播放
            // nowUnitID:当前小章节的ID
            const getNowUnitTrueVideoElement_AND_keepVideoPlay = (nowUnitID) => {
                return new Promise((resolve) => {
                    const isPlaying = () => {
                        const btn = document.querySelector('.bplayer-play-btn');
                        if (!btn) return false;
                        const svg = btn.querySelector('svg');
                        return svg && svg.id === 'stop';
                    };

                    const checkVideo_IS_Done = setInterval(() => {
                        const badge = document.querySelector(`[id="${nowUnitID}-badge"]`);
                        const progress = badge ? badge.textContent.trim() : '';

                        console.log("当前进度:", progress);
                        // 新添加，定时跳过答题
                        // === 自动答题跳过逻辑 ===
                        const questionWrap = document.querySelector('.bplayer-question-wrap');
                        if (questionWrap) {
                            const display = window.getComputedStyle(questionWrap).display;
                            if (display !== 'none') { // 题目弹窗正在显示
                                const skipBtn = document.querySelector('.skip.bplayer-btn');
                                if (skipBtn && !skipBtn.disabled) {
                                    skipBtn.click();
                                    console.log('✅ 已自动跳过题目');
                                }
                            }
                        }
                        // =======================
                        if (progress !== '100%') {
                            try {
                                if (!isPlaying()) {
                                    document.querySelector('.bplayer-play-btn')?.click();
                                    console.log("检测到暂停，已点击播放");
                                }
                            } catch (error) {
                                console.error("播放操作失败:", error);
                            }
                        } else {
                            clearInterval(checkVideo_IS_Done);
                            resolve("本节播放完成");
                        }
                    }, 2000); // 每2秒检查一次
                });
            };



            // 视频播放特殊处理，检测弹出的答题框
            function autoClickSkipButton() { //应该是没有用了
                // 选择需要观察变动的节点
                var targetNode = document.body;
                // 配置观察选项
                var config = { childList: true, subtree: true };

                const changecallback = function (mutations) {
                    mutations.forEach(function (mutation) {
                        if (document.querySelector('div.ccQuestion')) {
                            // 找到并点击 "跳过" 按钮
                            var skipButton = document.querySelector('input[value="跳过"]');
                            if (skipButton) {
                                skipButton.click();
                                // 重新启动观察者，以便处理后续的变化
                                observer.disconnect();
                                observer.observe(document.body, config);
                            }
                        }
                    });
                };

                // 创建一个观察者实例 //应该是没有用了
                var observer = new MutationObserver(changecallback);

                // 开始观察 //应该是没有用了
                observer.observe(targetNode, config);
                console.log("已开启自动跳过答题框");
            }
            //-------------------------事件顺序-------------------------------



            // 获取本课程所有的章节ID（也即allUnitID）
            const allUnitID = getAllUnitID();


            // 开始播放课程所有章节
            const start = async (allUnitID) => {
                console.log("Type of allUnitID:", typeof allUnitID);
                for (const nowUnitID of allUnitID) {
                    console.log("当前播放的是第" + (allUnitID.indexOf(nowUnitID) + 1) + "个小节");
                    const res1 = await inNowUnitID(nowUnitID) //进入当前章节
                    console.log(res1)
                    const res2 = await getNowUnitTrueVideoElement_AND_keepVideoPlay(nowUnitID) //获得当前小章节的视频元素并保持持续播放
                    console.log(res2)
                }
            }
            // 开始
            start(allUnitID);
            // 调用观察者确保跳过答题框
            autoClickSkipButton();  // 不需要传入参数

        }, 20000); // 延迟10秒执行
    };
})();