// ==UserScript==
// @name         gp_chinahrt 自动刷课
// @namespace    http://tampermonkey.net/
// @version      2024-10-15
// @description  auto play video for gp.chinahrt.com (四川继续教育)
// @author       You
// @match        https://*.chinahrt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chinahrt.com
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512868/gp_chinahrt%20%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/512868/gp_chinahrt%20%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCourses(responseBody) {
        var data = JSON.parse(responseBody);
        var GM_courses = JSON.parse(localStorage.getItem('GM_courses_KEY')) || [];
        if (data.data.courseStudyList != null) {
            var courseStudyList = data.data.courseStudyList;
            for (var i = 0; i < courseStudyList.length; i++) {
                if (parseInt(courseStudyList[i].learnPercent) < 100) {
                    var trainplanId = courseStudyList[i].trainplanId;
                    var courseId = courseStudyList[i].courseId;
                    courseStudyList[i]._href = `https://edu.chinahrt.com/151/play_video/${trainplanId}/new/${courseId}`;
                    GM_courses.push(courseStudyList[i]);
                }
            }
            // window.location.href = url;
        }
        // remove learnPercent = 100
        GM_courses = GM_courses.filter(course => parseInt(course.learnPercent) < 100);
        // remove duplicate courses
        GM_courses = GM_courses.filter((course, index, self) =>
            index === self.findIndex((t) => (
                t.courseId === course.courseId
            ))
        );
        alert(`已缓存 ${GM_courses.length} 个未学完的课程\n
        ${GM_courses.map(course => course.courseName).join('\n')}
            `);
        localStorage.setItem('GM_courses_KEY', JSON.stringify(GM_courses));
    }

    // Hijack fetch
    window.fetch = new Proxy(window.fetch, {
        apply: async function(target, thisArg, argumentsList) {
            // console.log('Fetch request:', argumentsList);

            // Call the original fetch function
            const response = await Reflect.apply(target, thisArg, argumentsList);

            // Clone the response to read its body
            const clonedResponse = response.clone();
            const responseBody = await clonedResponse.text();

            // console.log('Fetch response:', responseBody);

            if (argumentsList[0].includes('selected_course')) {
                getCourses(responseBody);
            }

            return response;
        }
    });


    if (window === window.top) {
        document.addEventListener('DOMContentLoaded', function() {
            // create a div
            /**
             *
             * <div class="menu-item menu-item-151" data-v-12f8603f="" style="--569c9fac: 1rem; --1eaf1b29: #FFFFFFFF;" data-v-d43ed8f8=""><!----><!--[-->首页<!--]--></div>
             */
            var div = document.createElement('div');
            // div.className = 'menu-item menu-item-151';
            // div.setAttribute('data-v-12f8603f', '');
            // div.setAttribute('style', '--569c9fac: 1rem; --1eaf1b29: #FFFFFFFF;');
            // div.setAttribute('data-v-d43ed8f8', '');
            div.innerHTML = '清空缓存';
            div.onclick = function() {
                localStorage.removeItem('GM_courses_KEY');
            };
            var menuE = document.querySelector('.menu.nav-menu-item');
            document.body.appendChild(div);
        });

        window.addEventListener('message', function(event) {
            if (event.data == 'final') {
                var GM_courses = JSON.parse(localStorage.getItem('GM_courses_KEY')) || [];
                if (GM_courses.length > 0) {
                    var course = GM_courses.shift();
                    localStorage.setItem('GM_courses_KEY', JSON.stringify(GM_courses));
                    this.location.href = course._href;
                }
            } else if (event.origin === 'https://videoadmin.chinahrt.com') {
                if (event.data === 'reloadPages') {
                    window.location.reload();
                }
            }
        });
    }

    function autoPlay() {
        if (window.DPlayer == undefined) {
            return;
        }
        window.DPlayer.prototype.play = new Proxy(window.DPlayer.prototype.play, {
            apply: function(target, thisArg, argumentsList) {
                if (window.dp == undefined) {
                    window.dp = thisArg;
                }
                return Reflect.apply(target, thisArg, argumentsList);
            }
        });
        window.DPlayer.prototype.pause = new Proxy(window.DPlayer.prototype.pause, {
            apply: function(target, thisArg, argumentsList) {
                if (window.dp == undefined) {
                    window.dp = thisArg;
                }
                return Reflect.apply(target, thisArg, argumentsList);
            }
        });

        window.setInterval(function() {
            if (window.dp != undefined) {
                if (window.dp.video.paused) {
                    window.dp.play();
                }
                window.dp.volume(0, true, true);
                window.dp.options.mutex = false;
                // console.log(window.dp.video.currentTime);
                window.dp.notice(window.dp.video.currentTime);
            }
            Object.defineProperty(document, 'visibilityState', {
                value: 'visible',
                configurable: true
            });
            // 创建并触发 visibilitychange 事件
            var visibilityChangeEvent = new Event('visibilitychange');
            document.dispatchEvent(visibilityChangeEvent);
        }, 1000);

        // 每隔 5 分钟刷新一次页面
        setInterval(function() {
            // window.location.reload(); // 刷新iframe
            window.parent.postMessage('reloadPages', '*');
        }, 300000); // 300000 毫秒 = 5 分钟
    }

    setTimeout(autoPlay, 5000); // 5 秒后执行 autoPlay 函数
}
)();