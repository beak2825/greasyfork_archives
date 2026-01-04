// ==UserScript==
// @name         课程自动进入考试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  课程如果是待考试自动触发考试按钮
// @author       You
// @match        https://www.cmechina.net/cme/polyv.jsp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cmechina.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474002/%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/474002/%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get all course list items
    const courseListItems = document.querySelectorAll('.s_r_ml li');
    let findPendingExam = false;
    let findNotLearn = false;
    // Loop through each course list item
    courseListItems.forEach(courseListItem => {
        debugger
        if (courseListItem.getAttribute("class")=='cur') {
            return;
        }
        if (courseListItem.getAttribute("class")==null) {
            findNotLearn = true;
        }
        const titleElement = courseListItem.querySelector('a');
        const statusElement = courseListItem.querySelector('i');

        if (titleElement && statusElement) {
            const isPendingExam = statusElement.textContent.includes('待考试');

            if (isPendingExam) {
                findPendingExam = true;
            }
        }
    });
    if (findPendingExam && !findNotLearn) {
        gotoExam();
    }
})();