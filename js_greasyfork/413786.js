// ==UserScript==
// @name         自动看课 21tb
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include      http://goldenriver.21tb.com/els/html/course*
// @connect      goldenriver.21tb.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413786/%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE%2021tb.user.js
// @updateURL https://update.greasyfork.org/scripts/413786/%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE%2021tb.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function _auto_play() {
        console.log('定时检测开启');
        setInterval(function () {
            const playStatus = videoPlay.getStatus();
            const items = $('#courseItemId .item-no');
            switch (playStatus) {
                case 'playing':
                    // videoPlay.setSpeed(2);
                    console.log('正在播放,已设置为2倍倍速');
                    break;
                case 'pause':
                    // videoPlay.play();
                    window.location.reload();
                    console.log('播放暂停,已自动恢复播放');
                    break;
                case 'ended':
                    items.first().click();
                    console.log('播放完成，自动跳到下个视频,还有' + items.length + '个视频未看完');
                    break;
                default:
                    window.location.reload();
                    console.log('未处理播放状态: ' + playStatus);
            }

            // 全部看完
            if (items.length === 0) {
                locationNextCourse();
            }
        }, 3000);

        setInterval(function () {
            const playStatus = videoPlay.getStatus();
            const items = $('#courseItemId .item-no');
            if (playStatus === 'playing') {
                if ($('.cl-catalog-playing').not('.item-no').length) {
                    items.first().click();
                    console.log('当前正在播放已完成的视频,已自动播放未完成的视频');
                }
            }
        }, 30000);

        setInterval(function () {
            $('#goStudyBtn').click();
        }, 3000);
    }

    function locationNextCourse() {
        // 课程列表接口地址
        const url = 'http://goldenriver.21tb.com/els/html/courseCenter/courseCenter.loadCourseQueryList.do?processType=category&courseType=NEW_COURSE_CENTER&courseInfo.categoryId=4dadce68aa5746f1a0c6ac4903482b6d&statue=0&courseInfo.stepToGetScore=&courseInfo.terminal=&courseInfo.courseReleaseYearType=&courseInfo.nameOrCode=&page.pageSize=50&page.pageNo=1&page.sortName=publishDate&categoryId=&current_app_id=&_=1602873221171';

        $.get(url, function (data, status) {
            let flag = false;
            let nextCourseId = '';
            data.rows.filter(function (item) {
                return item.courseStatus === 'SELECTED';
            }).forEach(function (row) {
                console.log(row.courseStatus);
                if (flag) {
                    nextCourseId = row.courseId;
                    flag = false;
                    return true;
                }
                if (getUrlParam('courseId') === row.courseId) {
                    flag = true;
                }
            });
            if (nextCourseId) {
                console.log('页面跳转中...');
                window.location.href = 'http://goldenriver.21tb.com/els/html/course/course.courseInfo.do?courseId='
                    + nextCourseId + '&courseType=NEW_COURSE_CENTER&p=';
            }
        });
    }

    function getUrlParam(name) {
        const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        const r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    _auto_play();
})();