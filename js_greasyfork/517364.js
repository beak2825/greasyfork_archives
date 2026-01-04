// ==UserScript==
// @name         Chaoxing Auto Play Next Video
// @namespace    http://tampermonkey.net/
// @version      1.6
// @license      GPL-3.0 License
// @description  Automatically plays the next video on Chaoxing platform
// @match        https://mooc1.chaoxing.com/mycourse/studentstudy?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517364/Chaoxing%20Auto%20Play%20Next%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/517364/Chaoxing%20Auto%20Play%20Next%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 延迟10秒后首次执行检查任务点状态的函数
    setTimeout(() => {
        checkTaskPoints();
        // 每7分钟执行一次检查任务点状态的函数
        // setInterval(checkTaskPoints, 7 * 60 * 1000);
    }, 5000);

    async function checkTaskPoints() {
        const iframeDoc = document.getElementById("iframe")?.contentDocument;
        if (!iframeDoc) {
            console.log("未找到 iframe，无法执行操作。");
            return;
        }

        const taskIcons = iframeDoc.getElementsByClassName("ans-job-icon");

        if (taskIcons.length === 0) {
            console.log("没有找到任何任务点。");
            return;
        }

        console.log(`发现 ${taskIcons.length} 个任务点。`);
        // let allTasksCompleted = true;

        for (let i = 0; i < taskIcons.length; i++) {
            const ariaLabel = taskIcons[i].ariaLabel;
            
            // allTasksCompleted = true;

            if (ariaLabel === "任务点未完成") {
                // allTasksCompleted = false;
                console.log(`任务点 ${i + 1} 未完成，尝试播放视频。`);

                try {
                    const videoFrame = iframeDoc.getElementsByClassName("ans-attach-online ans-insertvideo-online")[i]?.contentDocument;
                    if (!videoFrame) {
                        console.log("未找到视频框架，跳到下一个任务点。");
                        continue;
                    }

                    videoFrame.getElementsByClassName("vjs-big-play-button")[0]?.click();
                    await delay(10000);

                    let totalTime = videoFrame.getElementsByClassName("vjs-duration-display")[0]?.textContent;
                    let currentTime = videoFrame.getElementsByClassName("vjs-current-time-display")[0]?.textContent;

                    totalTime = convertTimeToSeconds(totalTime);
                    currentTime = convertTimeToSeconds(currentTime);

                    if (!totalTime || isNaN(totalTime)) {
                        console.log("无法获取视频总时长，跳到下一个任务点。");
                        continue;
                    }

                    console.log(`视频总时长为 ${totalTime} 秒`);

                    let remainingTime = totalTime - currentTime + 10;
                    console.log(`剩余播放时间为 ${remainingTime} 秒。`);

                    let retries = 3;
                    while (retries > 0) {
                        await delay(remainingTime * 1000);

                        if (taskIcons[i].ariaLabel === "任务点已完成") {
                            // allTasksCompleted = true;
                            console.log(`任务点 ${i + 1} 已完成，跳转到下一个任务点。`);
                            break;
                        } else {
                            currentTime = convertTimeToSeconds(videoFrame.getElementsByClassName("vjs-current-time")[0]?.textContent);
                            remainingTime = totalTime - currentTime;
                            console.log(`任务点未完成，剩余播放时间为 ${remainingTime} 秒。`);

                            await delay((remainingTime + 10) * 1000);

                            if (taskIcons[i].ariaLabel === "任务点已完成") {
                                // allTasksCompleted = true;
                                console.log(`任务点 ${i + 1} 已完成。`);
                                break;
                            } else {
                                retries--;
                                console.log(`任务点仍未完成，剩余检查次数：${retries}`);
                            }
                        }
                    }

                    if (retries === 0) {
                        // allTasksCompleted = true;
                        console.log(`任务点 ${i + 1} 检查3次未完成，跳到下一个任务点。`);
                    }

                } catch (error) {
                    console.log("未找到视频播放按钮或视频时长元素，无法自动播放视频。", error);
                }

                continue;
            } else {
                // allTasksCompleted = true;
                console.log(`任务点 ${i + 1} 已完成，检查下一个任务点。`);
            }
        }

        // console.log("allTasksCompleted: ", allTasksCompleted);

        // 如果所有任务点完成，则点击下一步并重新加载页面
        // if (allTasksCompleted) {
            console.log("所有任务点已完成，跳转到下一个视频或章节。");
            document.getElementById("prevNextFocusNext")?.click();

            // 等待1秒钟再重新加载页面，以确保点击操作完成
            setTimeout(() => {
                location.reload();
            }, 1000);
        // }
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function convertTimeToSeconds(timeStr) {
        if (!timeStr) return 0;
        const parts = timeStr.split(':').map(Number);
        return parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0];
    }
})();
