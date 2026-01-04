// ==UserScript==
// @name         zjutyjs_selectCourses
// @namespace    https://github.com/silevilence/zjutyjs
// @version      0.3
// @description  improve the selectCourse pages
// @author       Silevilence
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js
// @match        http://yjs.zjut.edu.cn/tasks/selectCourse-tree.asp
// @match        http://yjs.zjut.edu.cn/tasks/selectCourse-master.asp
// @match        http://yjs.zjut.edu.cn/tasks/selectCourse.asp
// @downloadURL https://update.greasyfork.org/scripts/39430/zjutyjs_selectCourses.user.js
// @updateURL https://update.greasyfork.org/scripts/39430/zjutyjs_selectCourses.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 提取课程号和班级号的正则
    const regId = /selectCourse-detail-noLearn.asp\?kcbh=(\d+)&bjdm=(\d+)/;

    let linksAdd;

    // 删除课程的表格
    let linksDel = $('form[action="selectCourse-tree-DelItem.asp"] table tbody tr td a');
    linksDel.each(function () {
        let href = $(this).attr('href');
        let ids = regId.exec(href);
        let courseId = ids[1];
        // noinspection SpellCheckingInspection
        $(this).parent().prev().prev().html(`<input type="checkbox" name="ckbdel" value="${courseId}">`);
    });

    // 增加课程的表格
    linksAdd = $('form[action="selectCourse-master-AddItem.asp"] table tbody tr td a');
    linksAdd.each(function () {
        let href = $(this).attr('href');
        let ids = regId.exec(href);
        let courseId = ids[1],
            classId = ids[2];
        // noinspection SpellCheckingInspection
        $(this).parent().prev().prev().html(`<input type="checkbox" name="cboke" value="${courseId}${classId}">`);
    });
})();