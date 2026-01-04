// ==UserScript==
// @name         EnaeaAssistant-学习公社全自动4X速
// @namespace    http://tampermonkey.net/
// @version      1.8.4
// @license      MIT
// @description  Automate course learning on enaea.edu.cn with 4X video speed control
// @author       beabaed@gmail.com, KKG&DS&CL
// @match        https://study.enaea.edu.cn/circleIndexRedirect.do*
// @match        https://study.enaea.edu.cn/viewerforccvideo.do*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/522614/EnaeaAssistant-%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E5%85%A8%E8%87%AA%E5%8A%A84X%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/522614/EnaeaAssistant-%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E5%85%A8%E8%87%AA%E5%8A%A84X%E9%80%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const SCRIPT_VERSION = '1.8.2'; // Script version
    let currentPagePath = window.location.pathname;
    let continuePlay = setInterval(continuePlayVideo, 3000);
    let continueChapter = setInterval(findAndStartChapter, 3000);
    let continueLesson = setInterval(clickNextPageButton, 3000);
    let pageLoading = false;
    let currentPageComplete = true;
    let playbackSpeed = 4; // Set to 4X for video speed control, it cannot Faster more.

    // Add status display with semi-transparent background
    GM_addStyle(`
        #enaeaHelperStatus {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.6); /* Semi-transparent background */
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 10000;
            display: block;
        }
    `);

    // Wait for the DOM to be fully loaded before creating the status bar
    window.addEventListener('load', () => {
        let statusDiv = document.createElement('div');
        statusDiv.id = 'enaeaHelperStatus';
        document.body.appendChild(statusDiv);
        updateStatus(`Script loaded (v${SCRIPT_VERSION})`);
    });

    function updateStatus(message) {
        let statusDiv = document.getElementById('enaeaHelperStatus');
        if (statusDiv) {
            statusDiv.textContent = `EnaeaHelper v${SCRIPT_VERSION}: ${message}`;
        }
    }

    if (isContentsPage()) {
        continuePlayVideo();
        sleep(2000).then(() => {
            pageLoading = false;
            GM_setValue("baseUrl", window.location.href);
            findAndStartLesson();
        });
    }

    if (isLessonPage()) {
        sleep(2000).then(() => {
            pageLoading = false;
            findAndStartChapter();
        });
    }

    function findAndStartLesson() {
        let incompleteLessonIndex = findIncompleteLesson();
        if (incompleteLessonIndex >= 0) {
            updateStatus('Starting next lesson');
            startNextLesson(incompleteLessonIndex);
            clearInterval(continueLesson);
        } else {
            currentPageComplete = true;
            updateStatus('All lessons on this page completed');
        }
    }

    function findIncompleteLesson() {
        let progressValueList = document.querySelectorAll(".progressvalue");
        for (let i = 0; i < progressValueList.length; i++) {
            if (progressValueList[i].innerText !== '100%') {
                return i;
            }
        }
        return -1;
    }

    function startNextLesson(index) {
        pageLoading = true;
        currentPageComplete = false;
        let goLearnList = document.querySelectorAll(".golearn.ablesky-colortip.saveStuCourse");
        if (goLearnList[index]) {
            sleep(1000).then(() => {
                window.location.href = 'https://study.enaea.edu.cn' + getLessonUrl(goLearnList[index].getAttribute("data-vurl"));
            });
        }
    }

    function getLessonUrl(dataUrl) {
        if (dataUrl.startsWith("/")) {
            return dataUrl;
        } else {
            return "/" + dataUrl;
        }
    }

    function findAndStartChapter() {
        let currentChapter = document.querySelector(".current.cvtb-MCK-course-content");
        if (currentChapter) {
            let currentChapterProgress = currentChapter.querySelector(".cvtb-MCK-CsCt-studyProgress");
            if (currentChapterProgress && currentChapterProgress.innerText === "100%") {
                let incompleteChapterIndex = findIncompleteChapter();
                if (incompleteChapterIndex >= 0) {
                    updateStatus('Starting next chapter');
                    startNextChapter(incompleteChapterIndex);
                } else {
                    updateStatus('All chapters in this lesson completed');
                    completeCurrentLesson();
                }
            }
        }
    }

    function findIncompleteChapter() {
        let progressValueList = document.querySelectorAll(".cvtb-MCK-CsCt-studyProgress");
        for (let i = 0; i < progressValueList.length; i++) {
            if (progressValueList[i].innerText !== '100%') {
                return i;
            }
        }
        return -1;
    }

    function startNextChapter(index) {
        let courseInfoList = document.querySelectorAll(".cvtb-MCK-CsCt-info.clearfix");
        if (courseInfoList[index]) {
            courseInfoList[index].click();
            let chapterTitle = document.querySelectorAll(".cvtb-MCK-CsCt-title.cvtb-text-ellipsis")[index]?.innerText;
            continuePlayVideo();
            sleep(300).then(() => {
                console.log('Start learn: ' + chapterTitle);
                let continueButton = document.getElementById("ccH5jumpInto");
                if (continueButton) {
                    continueButton.click();
                }
            });
        }
    }

    function completeCurrentLesson() {
        let lessonTitle = document.querySelector(".cvtb-top-link.cvtb-text-ellipsis")?.innerHTML;
        console.log('This lesson is completed: ' + lessonTitle);
        let baseUrl = GM_getValue('baseUrl', '');
        if (baseUrl) {
            pageLoading = true;
            window.location.href = baseUrl;
            clearInterval(continueChapter);
            clearInterval(continuePlay);
        }
    }

    function continuePlayVideo() {
        if (isLessonPage()) {
            let video = document.querySelector('video');
            if (video) {
                // Restore video playback position based on progress percentage
                let progress = getCurrentChapterProgress();
                if (progress > 0) {
                    let targetTime = (progress / 100) * video.duration;
                    if (video.currentTime < targetTime) {
                        video.currentTime = targetTime;
                        updateStatus(`Resuming video from ${progress}% progress`);
                    }
                }

                // Set video playback speed to 4X
                if (video.playbackRate !== playbackSpeed) {
                    video.playbackRate = playbackSpeed;
                    updateStatus(`Video speed set to ${playbackSpeed}x`);
                }

                video.muted = true; // Ensure video is muted
                if (video.paused) {
                    video.play(); // Ensure video is always playing
                    updateStatus('Video is playing');
                }

                // Save playback position periodically
                setInterval(() => {
                    let progress = (video.currentTime / video.duration) * 100;
                    GM_setValue('lastPlaybackProgress', progress);
                }, 5000);

                // Automatically play next video when current video ends
                video.onended = () => {
                    GM_setValue('lastPlaybackProgress', 0); // Reset progress
                    updateStatus('Video ended, starting next chapter');
                    findAndStartChapter();
                };
            }
            closePausePopup();
        }
    }

    function getCurrentChapterProgress() {
        let currentChapter = document.querySelector(".current.cvtb-MCK-course-content");
        if (currentChapter) {
            let progressElement = currentChapter.querySelector(".cvtb-MCK-CsCt-studyProgress");
            if (progressElement) {
                let progressText = progressElement.innerText;
                let progress = parseFloat(progressText);
                if (!isNaN(progress)) {
                    return progress;
                }
            }
        }
        return 0;
    }

    function clickNextPageButton() {
        if (isContentsPage() && !isLastPage() && currentPageComplete && !pageLoading) {
            updateStatus('Current page complete, going to next page');
            nextPage();
            sleep(2000).then(() => {
                findAndStartLesson();
            });
        }
    }

    function isContentsPage() {
        return currentPagePath === '/circleIndexRedirect.do' && testURL('action', 'toNewMyClass') && testURL('type', 'course');
    }

    function isLessonPage() {
        return currentPagePath === '/viewerforccvideo.do';
    }

    function nextPage() {
        let nextButton = document.querySelector(".next.paginate_button:not(.paginate_button_disabled)");
        if (nextButton) {
            nextButton.click();
        }
    }

    function isLastPage() {
        return document.querySelector(".next.paginate_button.paginate_button_disabled");
    }

    function closePausePopup() {
        let pauseButton = document.querySelector(".td-content");
        if (pauseButton) {
            console.log('Pause button found');
            let continueButton = document.querySelector("button:contains('Continue Learning')");
            if (continueButton) {
                continueButton.click();
            }
            let answerOptions = document.querySelector(".dialog-content input");
            if (answerOptions) {
                answerOptions.click();
            }
            let dialogButton = document.querySelector(".dialog-button-container button");
            if (dialogButton) {
                dialogButton.click();
            }
        } else {
            console.log('Pause button not found');
        }
    }

    function testURL(name, value) {
        let queryParams = window.location.search.substring(1);
        let variableList = queryParams.split("&");
        for (const element of variableList) {
            let parameterPair = element.split("=");
            if (parameterPair[0] === name) {
                return parameterPair[1] === value;
            }
        }
        return false;
    }

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
})();