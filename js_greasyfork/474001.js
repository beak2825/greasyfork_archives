// ==UserScript==
// @name         课件列表自动进入课程页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动进入课程页面准备考试
// @author       haifennj
// @match        https://www.cmechina.net/cme/course.jsp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cmechina.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474001/%E8%AF%BE%E4%BB%B6%E5%88%97%E8%A1%A8%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E8%AF%BE%E7%A8%8B%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/474001/%E8%AF%BE%E4%BB%B6%E5%88%97%E8%A1%A8%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E8%AF%BE%E7%A8%8B%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Get all course list items
const courseListItems = document.querySelectorAll('.course_list');
let findNotLearned = false;
// Loop through each course list item
courseListItems.forEach(courseListItem => {
  const titleElement = courseListItem.querySelector('.course_tit a');
  const statusElement = courseListItem.querySelector('.course_text span');

  if (titleElement && statusElement) {
    const isPendingExam = statusElement.textContent.includes('待考试');
    const isNotLearned = statusElement.textContent.includes('未学习');

    if (isNotLearned) {
      titleElement.click();
    }
    if (isPendingExam) {
      titleElement.click();
    }
  }
});

})();