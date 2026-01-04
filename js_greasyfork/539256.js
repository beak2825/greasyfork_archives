// ==UserScript==
// @name         jlgbjy-helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  make your life easier
// @author       Ccms
// @match        https://www.jlgbjy.gov.cn/portal/study!play.action?id=
// @match        https://www.jlgbjy.gov.cn/student/studying_record!myRecord.action
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at:      document-start
// @downloadURL https://update.greasyfork.org/scripts/539256/jlgbjy-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/539256/jlgbjy-helper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let currentPagePath = window.location.pathname;
    let pageLoading = false;
    let AllComplete = false;
    let playbackSpeed = 10; // Recommended speed: 2-4
    let continueNext;

    if (isLessonPage()) {
        initLessonPage();
    }

    if (isRecordPage()) {
        initRecordPage();
    }

    function initLessonPage() {
        sleep(2000).then(() => {
            pageLoading = false;
            continueNext = setInterval(completeCurrentLesson, 3000);
        });
    }

    function initRecordPage() {
        sleep(2000).then(() => {
            pageLoading = false;
            GM_setValue("baseUrl", window.location.href);
            findAndStartLesson();
        });
    }

    function findAndStartLesson() {
        let incompleteLessonBool = findIncompleteLesson();
        if (incompleteLessonBool == 1) {
            startNextLesson();
        } else {
            AllComplete = true;
			clearInterval(continueNext);
        }
    }

    function findIncompleteLesson() {
		const styTables = document.querySelectorAll(".styTable");
		if (styTables.length < 4) {
			console.log("没有足够的 .styTable 元素");
			return;
		}
        const progressValue = styTables[3].children[1].children[1].children[2].innerText.trim();
		if (progressValue !== '100%') {
			return 1;
		}
        return -1;
    }

    function startNextLesson() {
		const styTables = document.querySelectorAll(".styTable");
		if (styTables.length < 4) {
			console.log("没有足够的 .styTable 元素");
			return;
		}
		const lessonLinkElement = styTables[3].children[1].children[1].children[3].children[0];
        if (!linkElement) {
            console.warn("找不到下课链接");
            return;
        }
		const matchResult = lessonLinkElement.getAttribute("onclick").match(/videoList\((\d+)\)/);
        if (!matchResult) {
            console.warn("无法提取视频ID");
            return;
        }
		const goLearnId = matchResult[1];
		clearInterval(continueNext);
        pageLoading = true;
        sleep(1000).then(() => {
            window.location.href = 'https://www.jlgbjy.gov.cn/portal/study!play.action?id=' + goLearnId;
        });
    }

    function completeCurrentLesson() {
		let lesson_next = document.querySelector(".component_container.next");
		let lesson_play = document.querySelector(".component_base.std.play")
        if (lesson_next && lesson_next.classList.contains("disabled") && lesson_play && lesson_play.disabled) {
			console.log('课程已完成，返回主页...');
			let baseUrl = GM_getValue('baseUrl', '');
			pageLoading = true;
			clearInterval(continueNext);
			window.location.href = baseUrl;
		} else {
			console.log("课程尚未完成，继续等待...");
		}
    }

    function isRecordPage() {
        return currentPagePath.includes("studying_record!myRecord.action");
    }

    function isLessonPage() {
        return currentPagePath.includes("study!play.action");
    }

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
})();