// ==UserScript==
// @name         RollBackNJUJiaoWuCourseListButton
// @namespace    i don't know what this does
// @license      LGPLv3
// @version      2024-02-27
// @description  To make the `本学期课程` button in nju jiaowu page go back to its old behavior.
// @author       礼堂丁真
// @match        http://elite.nju.edu.cn/jiaowu/student/teachinginfo/index.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nju.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488459/RollBackNJUJiaoWuCourseListButton.user.js
// @updateURL https://update.greasyfork.org/scripts/488459/RollBackNJUJiaoWuCourseListButton.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var a = document.getElementById('Function').getElementsByTagName('li')[0].getElementsByTagName('a')[0]
    a.href = "http://elite.nju.edu.cn/jiaowu/student/teachinginfo/courseList.do?method=currentTermCourse"
    a.removeAttribute('target')
})();