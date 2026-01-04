// ==UserScript==
// @name          超星视频自动播放与跳转
// @namespace     http://tampermonkey.net/
// @version       2025-06-17.3
// @description   自动播放超星视频，并在播放结束后自动点击“下一节”按钮。保持原始音量。
// @author        You
// @match         https://mooc1.chaoxing.com/mycourse/studentstudy?*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/539647/%E8%B6%85%E6%98%9F%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8E%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/539647/%E8%B6%85%E6%98%9F%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8E%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Tampermonkey脚本已启动：超星视频自动播放与跳转 (精简版).");

    let hasVideoBeenProcessed = false; // 标志位：当前页面是否已处理过视频
    let videoCheckInterval = null;    // 定时器ID

    /**
     * 尝试播放视频并在视频结束后导航。
     */
    function attemptVideoPlaybackAndNavigation() {
        console.log("扫描中...");

        // 查找视频 iframe
        // const videoFrame = document.querySelector('iframe#iframe');
        const videoFrame = document.querySelector('iframe#iframe').contentDocument.querySelector('iframe.ans-insertvideo-online');

        if (videoFrame) {
            if (hasVideoBeenProcessed) {
                // console.log("视频iframe已找到，但已在当前页面处理。跳过.");
                return;
            }

            console.log("已找到视频iframe.");

            // 延时2秒，等待 iframe 内容加载和视频播放器完全初始化
            setTimeout(() => {
                let videoElement = null;
                try {
                    // 检查 iframe 的 contentWindow 和 contentDocument 是否可用
                    if (videoFrame.contentWindow && videoFrame.contentWindow.document) {
                        videoElement = videoFrame.contentWindow.document.querySelector('video');
                    } else {
                        // console.log("iframe的contentWindow或document尚未完全加载或不可访问.");
                        return; // 如果 iframe 内容未准备好，则返回，等待下一次定时器循环
                    }
                } catch (e) {
                    console.error("访问iframe内容或视频元素时出错 (可能跨域或未完全加载):", e);
                    return; // 如果出错，让定时器在下一轮重试
                }

                if (videoElement) {
                    console.log("在iframe内部找到视频元素.");

                    // 尝试播放视频
                    if (videoElement.paused) {
                        console.log("视频已暂停，尝试播放并解除静音...");
                        videoElement.muted = false; // 尝试解除静音
                        videoElement.play().then(() => {
                            console.log("视频播放成功启动.");
                            hasVideoBeenProcessed = true; // 标记为已处理
                        }).catch(error => {
                            console.error("视频播放失败:", error);
                            // 如果直接播放失败（例如，NotAllowedError），尝试静音播放作为备用。
                            console.log("尝试静音播放...");
                            videoElement.muted = true; // 强制静音
                            videoElement.play().then(() => {
                                console.log("视频静音播放成功启动.");
                                hasVideoBeenProcessed = true;
                            }).catch(e => {
                                console.error("静音播放也失败:", e);
                            });
                        });
                    } else {
                        console.log("视频已在播放中或未暂停.");
                        hasVideoBeenProcessed = true; // 如果视频已在播放，则视为已处理
                    }

                    // 设置视频播放结束事件监听器
                    videoElement.onended = function() {
                        console.log("视频播放结束. 检查下一节按钮...");
                        const nextButton = document.querySelector('.jb_btn.next');
                        if (nextButton) {
                            console.log("找到“下一节”按钮，等待8秒后尝试跳转.");
                            setTimeout(() => { // Added 8-second delay here
                                console.log("8秒已过，尝试跳转到下一节.");
                                const onclickAttr = nextButton.getAttribute('onclick');
                                const regex = /linkUrl\(([^)]+)\)/;
                                const match = onclickAttr.match(regex);

                                if (match && match[1]) {
                                    const argsString = match[1];
                                    try {
                                        // 动态评估参数字符串，将其转换为数组
                                        const args = JSON.parse(`[${argsString}]`);
                                        if (typeof window.linkUrl === 'function') {
                                            window.linkUrl(...args);
                                            console.log("已通过 linkUrl 函数跳转到下一节.");
                                            hasVideoBeenProcessed = false; // 重置标志位
                                            clearInterval(videoCheckInterval); // 清除定时器
                                        } else {
                                            console.warn("未找到 window.linkUrl 函数，尝试模拟点击按钮.");
                                            nextButton.click(); // 回退到模拟点击
                                        }
                                    } catch (parseError) {
                                        console.error("解析linkUrl参数时出错:", parseError);
                                        console.warn("尝试模拟点击“下一节”按钮作为备用.");
                                        nextButton.click(); // 解析失败则模拟点击
                                    }
                                } else {
                                    console.warn("未能从onclick属性中解析linkUrl参数. 尝试模拟点击按钮.");
                                    nextButton.click(); // 解析失败则模拟点击
                                }
                            }, 8000); // 8-second delay
                        } else {
                            console.log("未找到“下一节”按钮.");
                        }
                    };
                } else {
                    // console.log("2秒延时后，在iframe内部仍未找到<video>元素. 将在下一次扫描中重试.");
                }
            }, 2000); // 延时2秒，等待 iframe 内容加载和视频播放器完全初始化
        } else {
            // console.log("页面上未找到视频iframe元素. 直接检查下一节按钮.");
            const nextButton = document.querySelector('.jb_btn.next');
            if (nextButton) {
                console.log("未找到视频，但存在“下一节”按钮，等待8秒后尝试跳转.");
                setTimeout(() => { // Added 4-second delay here
                    console.log("4秒已过，尝试跳转到下一节.");
                    const onclickAttr = nextButton.getAttribute('onclick');
                    const regex = /linkUrl\(([^)]+)\)/;
                    const match = onclickAttr.match(regex);

                    if (match && match[1]) {
                        const argsString = match[1];
                        try {
                            const args = JSON.parse(`[${argsString}]`);
                            if (typeof window.linkUrl === 'function') {
                                window.linkUrl(...args);
                                console.log("已通过 linkUrl 函数跳转到下一节.");
                                hasVideoBeenProcessed = false; // 重置标志位
                                clearInterval(videoCheckInterval); // 清除定时器
                            } else {
                                console.warn("未找到 window.linkUrl 函数，尝试模拟点击按钮.");
                                nextButton.click();
                            }
                        } catch (parseError) {
                            console.error("解析linkUrl参数时出错:", parseError);
                            console.warn("尝试模拟点击“下一节”按钮作为备用.");
                            nextButton.click();
                        }
                    } else {
                        console.warn("未能从onclick属性中解析linkUrl参数. 尝试模拟点击按钮.");
                        nextButton.click();
                    }
                }, 4000); // 4-second delay
            } else {
                // console.log("既未找到视频也未找到“下一节”按钮. 将继续扫描.");
            }
        }
    }

    // 每0.5s启动一次检查，以应对动态加载的内容
    videoCheckInterval = setInterval(attemptVideoPlaybackAndNavigation, 3000);

    // 监听URL变化，并在URL变化时重置视频处理标志，以便新页面能重新检测视频。
    let lastKnownUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== lastKnownUrl) {
            console.log("URL已更改，重置状态.");
            lastKnownUrl = window.location.href;
            hasVideoBeenProcessed = false; // 在导航到新页面时重置标志
            // 清除旧的interval并设置新的，以确保在新页面上重新开始检测
            if (videoCheckInterval) {
                clearInterval(videoCheckInterval);
            }
            videoCheckInterval = setInterval(attemptVideoPlaybackAndNavigation, 3000);
        }
    }, 1000); // 每秒检查一次URL
})();