// ==UserScript==
// @name         2024.9.14(自动刷课)
// @namespace    https://onlinenew.enetedu.com/
// @version      1.2
// @description  适用于网址是 https://onlinenew.enetedu.com/ 的网站自动刷课，自动点击播放，检查当前视频是否已经是播放完毕的，当前视频播放完成的则自动播放下一个视频，列表播放完毕后自动返回目录。
// @author       小菜菜
// @match        onlinenew.enetedu.com/*/MyTrainCourse/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508402/2024914%28%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/508402/2024914%28%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        let pageTitle=document.title;
        if(pageTitle=="课程学习"){
            setInterval(() => {
                const ifm = document.getElementsByTagName('iframe')
                if (ifm.length) {
                    const video = ifm[0].contentWindow.document.querySelector('video')
                    // 查看视频播放状态
                    if (video.paused) {
                        console.log('视频暂停播放')
                        // 获取第二个iframe
                        const ifm1 = ifm[0].contentWindow.document.querySelector('iframe')
                        if (ifm1) {
                            // 获取10分钟一次的二次确认按钮
                            const button = ifm1.contentWindow.document.querySelector('button')
                            if (button) {
                                // 点击确定按钮
                                button.click()
                            }
                        } else {
                            // 设置静音
                            video.muted = true
                            // 播放视频
                            video.play()
                        }
                    } else {
                        // 调整播放速率为2倍速
                        video.playbackRate = 2

                        // 检测当前视频播放完成
                        // 获取所有 classcenter-chapter2 下的 ul li 元素
                        const liElements = document.querySelectorAll('.classcenter-chapter2 ul li');

                        // 遍历每一个 li 元素
                        liElements.forEach(function(liElement) {
                            // 获取 li 元素的背景颜色和 span 的文本内容
                            const backgroundColor = window.getComputedStyle(liElement).backgroundColor;
                            const spanText = liElement.querySelector('span') ? liElement.querySelector('span').textContent : '';

                            // 检查背景颜色是否为 "rgb(204, 197, 197)"，并且 span 的文本内容为 "[100%]"
                            if (backgroundColor === "rgb(204, 197, 197)" && spanText === "[100%]") {
                                // 暂停当前视频
                                // video.pause();

                                // 获取 classcenter-chapter2 下，排除 class-green 和 class-orange 的 li 元素
                                const filteredLiElements = document.querySelectorAll('.classcenter-chapter2 li:not(.class-green):not(.class-orange)');

                                // 如果存在匹配的 li 元素
                                if (filteredLiElements.length > 0) {
                                    // 获取第一个符合条件的 li 元素
                                    const firstLiElement = filteredLiElements[0];
                                    // 模拟点击事件
                                    firstLiElement.click();
                                } else {
                                    // 返回课程列表页面
                                    const ele = document.querySelector('.buttonmore-red')
                                    if (ele) {
                                        ele.click()
                                        // 获取所以课程列表
                                        const liElements = document.querySelectorAll('#ullist li');
                                        // 遍历每个 li 标签
                                        liElements.forEach((li) => {
                                            // 查找 li 内的所有 span 标签
                                            const spans = li.querySelectorAll('span');
                                            // 遍历每个 span 检查其文本内容是否包含 "学习"
                                            spans.forEach((span) => {
                                                if (span.textContent.includes("学习")) {
                                                    // 查找该 li 内的目标 <a> 链接
                                                    const learningLink = li.querySelector('a[href*="OnlineCourse"]');
                                                    if (learningLink) {
                                                        // 模拟点击该链接，触发跳转
                                                        window.location.href = learningLink.href;
                                                    }
                                                }
                                            });
                                        });
                                    }
                                }
                            }
                        });
                    }
                }
            }, 5000)

        } else if (pageTitle=="我的培训课程"){
            // 获取所有 li 标签
            const liElements = document.querySelectorAll('#ullist li');

            // 遍历每个 li 标签
            liElements.forEach((li) => {
                // 查找 li 内的所有 span 标签
                const spans = li.querySelectorAll('span');
                // 遍历每个 span 检查其文本内容是否包含 "学习"
                spans.forEach((span) => {
                    if (span.textContent.includes("学习")) {
                        // 查找该 li 内的目标 <a> 链接
                        const learningLink = li.querySelector('a[href*="OnlineCourse"]');
                        if (learningLink) {
                            // 模拟点击该链接，触发跳转
                            window.location.href = learningLink.href;
                        }
                    }
                });
            });
        }
    };
})();
