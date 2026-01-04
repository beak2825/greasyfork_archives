// ==UserScript==
// @name         技行珠海视频自动播放
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  https://jxzh.zh12333.com/zhskillWeb 技行珠海视频自动播放
// @author       You
// @license      AGPL License
// @match        https://jxzh.zh12333.com/zhskillWeb/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502643/%E6%8A%80%E8%A1%8C%E7%8F%A0%E6%B5%B7%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/502643/%E6%8A%80%E8%A1%8C%E7%8F%A0%E6%B5%B7%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parseUrlParams(url) {
        var searchParams = new URLSearchParams(url);
        var params = {};

        for (var pair of searchParams.entries()) {
            var key = pair[0];
            var value = decodeURIComponent(pair[1]);

            if (params[key]) {
                params[key].push(value);
            } else {
                params[key] = [value];
            }
        }

        return params;
    }

    function getNextCourseware(courseList) {
        let locationCoursewareId = parseUrlParams(window.location.href).coursewareId
        for(let i = 0; i < courseList.length; i++) {
            if(courseList[i].querySelector(".item-title div").innerHTML === '100%') {
                continue;
            }
            if(locationCoursewareId !== undefined && parseUrlParams(courseList[i].href).coursewareId[0] === locationCoursewareId[0]) {
                continue;
            }
            return i;
        }
        return courseList.length;
    }

    setInterval(function () {
        if(window.location.href.includes('course_study.html') || window.location.href.includes('course_detail.html')) { // 视频播放页或视频详情页
            localStorage.setItem("playerStatus", "playing");
            window.addEventListener('beforeunload', (event) => {
                localStorage.setItem("playerStatus", "finish");
            });
            let courseList = document.getElementsByClassName('study-link');
            let nextCourse = getNextCourseware(courseList);
            // 有播放完成的弹窗，说明已经播放完一个课件，播放下一个课件
            if(document.getElementsByClassName('modal-in').length > 0 && document.getElementsByClassName('modal-in')[0].style.display === 'block') {
                if (nextCourse >= courseList.length) {
                    window.close();
                }
                document.getElementsByClassName('study-link')[nextCourse].click()
            } else { // 判断其他情况
                let video = document.getElementsByTagName('video');
                // 是否弹出验证码
                let check = document.getElementById('study_check');
                if(check && check.style.display === 'block') {
                    // location.reload();
                    check.style.display = 'none';
                }

                if(video.length > 0) { // 在播放页，无论视频在什么状态，都可以让视频播放
                    if(video[0].currentTime >= video[0].duration) {
                        return;
                    }
                    video[0].play();
                } else { // 不在播放页，播放第一个未完成的课件
                    if (nextCourse >= courseList.length) {
                        window.close();
                    }
                    document.getElementsByClassName('study-link')[nextCourse].click();
                }
            }
        }
        if(window.location.href.includes('user_course_required_list.html?isComplete=0')) { // 在未完成页
            let playStatus = localStorage.playerStatus;
            if(playStatus === 'playing') {
                return;
            }
            if(playStatus === 'finish') {
                localStorage.setItem('playerStatus', 'todo');
                location.reload(); // 刷新页面，加载最新的未完成列表
                return;
            }
            // 点击第一个未完成课程
            let uncomplateList = document.getElementsByClassName('item-img-link');
            if(uncomplateList.length > 0) {
                localStorage.setItem('playerStatus', 'playing');
                uncomplateList[0].click();
                return;
            }
        }
        if(window.location.href.includes('user_course_enterprise_item.html')) { // 在专项培训页
            let playStatus = localStorage.playerStatus;
            if(playStatus === 'playing') {
                return;
            }
            if(playStatus === 'finish') {
                localStorage.setItem('playerStatus', 'todo');
                location.reload(); // 刷新页面，加载最新的未完成列表
                return;
            }
            let courseList = document.getElementsByClassName('item-img-link');
            for(let i = 0; i < courseList.length; i++) {
                let course = courseList[i];
                if(course.querySelector("div>img").src.includes('icon-course-finished.png')) {
                    continue;
                }
                localStorage.setItem('playerStatus', 'playing');
                console.log(localStorage.playerStatus);
                courseList[i].click();
                return;
            }
        }
    }, 5000)
})();