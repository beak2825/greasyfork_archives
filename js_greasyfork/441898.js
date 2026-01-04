// ==UserScript==
// @name        蓉城先锋 cddyjy.com
// @namespace   cddyjy
// @match       https://rcxf.cddyjy.com/dywkt/educationTraining/detailspage*
// @grant       none
// @version     2.3
// @author      compass
// @description 2024/10/22 09:16:00
// @downloadURL https://update.greasyfork.org/scripts/441898/%E8%93%89%E5%9F%8E%E5%85%88%E9%94%8B%20cddyjycom.user.js
// @updateURL https://update.greasyfork.org/scripts/441898/%E8%93%89%E5%9F%8E%E5%85%88%E9%94%8B%20cddyjycom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitForElement(selector, timeout = 10000, elementId = false) {
        return new Promise((resolve, reject) => {
            let timer = 0;
            const interval = setInterval(() => {
                let element;
                if (elementId) {
                    // 如果 useId 为 true，则使用 document.getElementById
                    element = document.getElementById(selector);
                } else {
                    // 否则使用 document.querySelector
                    element = document.querySelector(selector);
                }

                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (timer >= timeout) {
                    clearInterval(interval);
                    reject(new Error(`Timeout waiting for element: ${selector}`));
                } else {
                    timer += 100;
                }
            }, 100);
        });
    }

    async function waitForElementByIdPrefixAndText(idPrefix, text, timeout = 10000) {
        return new Promise((resolve, reject) => {
            let timer = 0;
            const interval = setInterval(() => {
                // 获取所有以 idPrefix 开头的 ID 元素
                const elements = document.querySelectorAll(`[id^="${idPrefix}"]`);

                // 遍历这些元素，寻找包含特定文本的元素
                for (let i = 0; i < elements.length; i++) {
                    if (elements[i].textContent.trim() === text) {
                        clearInterval(interval);
                        resolve(elements[i]);
                        return;
                    }
                }

                if (timer >= timeout) {
                    clearInterval(interval);
                    reject(new Error(`Timeout waiting for element with ID prefix "${idPrefix}" and text "${text}"`));
                } else {
                    timer += 100;
                }
            }, 100);
        });
    }
    async function findIncompleteCourse() {
        const rows = document.querySelectorAll('.ant-table-tbody tr.ant-table-row-level-0');

        for (const row of rows) {
            const progressCell = row.querySelector('.ant-table-row-cell-ellipsis[title="100.00%"]');
            const progressText = progressCell ? progressCell.getAttribute('title') : '';
            if (progressText !== '100.00%') {
                const studyButton = row.querySelector('.ant-table-fixed-columns-in-body a');
                if (studyButton) {
                    return studyButton;
                }
            }
        }

        throw new Error('No incomplete courses found.');
    }

    async function goToNextPage() {
        const nextPageButton = document.querySelector('.ant-pagination-next:not(.ant-pagination-disabled) .ant-pagination-item-link');
        if (nextPageButton) {
            nextPageButton.click();
            console.log("Clicked next page button.");
            await sleep(1000); // 等待页面加载
            console.log("Continuing with next page...");
        } else {
            console.log("Reached the last page. Ending script execution.");
            return false; // 没有下一页，返回 false 结束脚本
        }
    }

    async function checkUrlAndExecute() {
        console.log("Checking current URL...");
        if (window.location.href.match(/https:\/\/rcxf\.cddyjy\.com\/dywkt\/educationTraining\/detailspage/)) {
            console.log("Current URL matches the expected pattern. Executing autoStudy...");
            await autoStudy();
        } else {
            console.log("Current URL does not match the expected pattern. Skipping script execution.");
        }
    }

    async function autoStudy() {
        try {
            console.log("Searching for the first incomplete course...");
            let studyButton;

            try {
                studyButton = await findIncompleteCourse();
                console.log("Found the first incomplete course.");
            } catch (error) {
                console.log("All courses on this page are completed.");
                const nextPageResult = await goToNextPage();

                // 如果有下一页，则重新查找课程
                studyButton = await findIncompleteCourse();
            }

            studyButton.click();

            // 等待视频或文本加载
            console.log("Waiting for video player or text content to load...");
            let videoPlayer;
            try {
                videoPlayer = await waitForElement('#my-player_html5_api', 20000); // 使用 id 查找视频元素
                console.log("Video player loaded.");
            } catch (error) {
                console.log("Video player not found, checking for text content...");
                // 如果找不到视频播放器，则查找文本元素
                const textContent = await waitForElement('.ant-modal-content',1000);
                console.log("Text content loaded.");

                // 轮询检查提示框是否出现
                console.log("Polling for dialog to appear...");
                let dialogAppeared = false;
                let closeDialogButton;
                const maxWaitTime = 610000; // 最大等待时间为 60 秒
                const pollInterval = 10000; // 每隔 1 秒检查一次

                const startTime = Date.now();
                while (!dialogAppeared && Date.now() - startTime < maxWaitTime) {
                    try {
                        //获取提示框
                        const dialog = await waitForElementByIdPrefixAndText('rcDialogTitle','提示',5000);
                        console.log(dialog)
                        if (dialog)
                        {
                          console.log("Dialog appeared.");
                          closeDialogButton = await waitForElement('.ant-modal-close', 1000);
                          dialogAppeared = true;
                          break;
                        }
                    } catch (error) {
                        console.log(error)
                        console.log("Dialog not yet appeared, polling again...");
                        await sleep(pollInterval);
                    }
                }

                if (dialogAppeared) {
                    console.log("Dialog appeared after waiting.");
                    closeDialogButton.click();
                    console.log("Closed dialog using close button.");
                } else {
                    console.log("Maximum wait time reached without dialog appearing.");
                }
            }

            if (videoPlayer) {
                // 确保视频已准备好播放
                console.log("Waiting for video to be ready...");
                await new Promise((resolve) => {
                    videoPlayer.oncanplay = () => {
                        console.log("Video is ready to play.");
                        resolve();
                    };
                });

                // 播放视频
                videoPlayer.play();
                console.log("Video started playing.");

                // 等待视频播放结束
                console.log("Waiting for video to end...");
                await new Promise((resolve) => {
                    videoPlayer.addEventListener('ended', () => {
                        console.log("Video ended.");
                        resolve();
                    });
                });
            }

            // 关闭视频播放弹窗
            if (videoPlayer) {
                console.log("Waiting for the video modal to appear...");
                const closeVideoPopupButton = await waitForElement('.ant-modal-close', 20000); // 再次等待关闭按钮出现
                if (closeVideoPopupButton) {
                    closeVideoPopupButton.click();
                    console.log("Closed video popup using close button.");
                }
            }

            // 继续查找下一个课程
            console.log("Sleeping for 1 second before continuing...");
            await sleep(1000); // 等待一段时间让页面重新加载
            console.log("Continuing with next course...");

            // 在每次递归调用前检查URL
            await checkUrlAndExecute();
        } catch (error) {
            console.error(error.message);
            // 在发生错误时重试
            console.log("Retrying in 5 seconds...");
            setTimeout(autoStudy, 5000);
        }
    }

    // 初始化时检查URL并执行
    checkUrlAndExecute();
})();