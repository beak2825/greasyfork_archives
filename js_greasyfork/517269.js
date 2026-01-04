// ==UserScript==
// @name         redmine-issue-gantt
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在 issue 列表 主题前面增加一个甘特图的快捷链接
// @author       小慢
// @match        *://*/projects/*/issues* 
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xjjj.co
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517269/redmine-issue-gantt.user.js
// @updateURL https://update.greasyfork.org/scripts/517269/redmine-issue-gantt.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var subjectElements = document.getElementsByClassName("subject");
    for (var subject of subjectElements) {
        var subjectJumpElement =  subject.firstElementChild;
        var issueHref = subjectJumpElement.getAttribute('href')

        // 从编辑链接的href属性中提取数字
        var matchNum = issueHref.match(/(\d+)/);
        if (matchNum) {
           var issueId = matchNum[1];
           var gurrtA = $('<a style=" margin-right: 20px;"  href="/issues/gantt?utf8=%E2%9C%93&set_filter=1&gantt=1&f%5B%5D=status_id&op%5Bstatus_id%5D=o&f%5B%5D=parent_id&op%5Bparent_id%5D=~&v%5Bparent_id%5D%5B%5D='+issueId+'&f%5B%5D=&query%5Bdraw_selected_columns%5D=0&query%5Bdraw_selected_columns%5D=1&c%5B%5D=assigned_to&query%5Bdraw_relations%5D=0&query%5Bdraw_relations%5D=1&query%5Bdraw_progress_line%5D=0&months=6&month=11&year=2024&zoom=4">甘特图</a>');
           if (window.location.href.includes("/projects/course_modularization/")) {
              gurrtA = $('<a style=" margin-right: 20px;"  href="/projects/course_modularization/issues/gantt?utf8=%E2%9C%93&set_filter=1&gantt=1&f%5B%5D=status_id&op%5Bstatus_id%5D=o&f%5B%5D=parent_id&op%5Bparent_id%5D=~&v%5Bparent_id%5D%5B%5D='+issueId+'&f%5B%5D=&query%5Bdraw_selected_columns%5D=0&query%5Bdraw_selected_columns%5D=1&c%5B%5D=assigned_to&query%5Bdraw_relations%5D=0&query%5Bdraw_relations%5D=1&query%5Bdraw_progress_line%5D=0&months=6&month=11&year=2024&zoom=4">甘特图</a>');
              
           } 
           if (window.location.href.includes("/projects/cc_sprint/")) {
                gurrtA = $('<a style=" margin-right: 20px;"  href="/projects/cc_sprint/issues/gantt?utf8=%E2%9C%93&set_filter=1&gantt=1&f%5B%5D=status_id&op%5Bstatus_id%5D=o&f%5B%5D=parent_id&op%5Bparent_id%5D=~&v%5Bparent_id%5D%5B%5D='+issueId+'&f%5B%5D=&query%5Bdraw_selected_columns%5D=0&query%5Bdraw_selected_columns%5D=1&c%5B%5D=assigned_to&query%5Bdraw_relations%5D=0&query%5Bdraw_relations%5D=1&query%5Bdraw_progress_line%5D=0&months=6&month=11&year=2024&zoom=4">甘特图</a>');
           }
           if (window.location.href.includes("/projects/cooperation_sprint/")) {
            gurrtA = $('<a style=" margin-right: 20px;"  href="/projects/cooperation_sprint/issues/gantt?utf8=%E2%9C%93&set_filter=1&gantt=1&f%5B%5D=status_id&op%5Bstatus_id%5D=o&f%5B%5D=parent_id&op%5Bparent_id%5D=~&v%5Bparent_id%5D%5B%5D='+issueId+'&f%5B%5D=&query%5Bdraw_selected_columns%5D=0&query%5Bdraw_selected_columns%5D=1&c%5B%5D=assigned_to&query%5Bdraw_relations%5D=0&query%5Bdraw_relations%5D=1&query%5Bdraw_progress_line%5D=0&months=6&month=11&year=2024&zoom=4">甘特图</a>');
       }
           $(subject).prepend(gurrtA)
       }
    }
})();