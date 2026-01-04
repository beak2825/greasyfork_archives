// ==UserScript==
// @name         广东省药师协会课程
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动听在“我的课程”里的内容。
// @author       han2ee
// @match      https://www.gdysxh.com/my_classes*
// @run-at        document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464964/%E5%B9%BF%E4%B8%9C%E7%9C%81%E8%8D%AF%E5%B8%88%E5%8D%8F%E4%BC%9A%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/464964/%E5%B9%BF%E4%B8%9C%E7%9C%81%E8%8D%AF%E5%B8%88%E5%8D%8F%E4%BC%9A%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const CLASSES_URL = "https://www.gdysxh.com/my_classes/classes/index.html";
    const TASK_URL_PREFIX = "http://120.25.166.167:8887/#/pages/course/detail";
    const VIDEO_URL_REGEX = /https:\/\/www.gdysxh.com\/my_classes\/classes\/video\/course_id\/\d+\/order_id\/\d+.html/;

    let uniqFlag = null;
    let currentTime = 0;
    setInterval(() => {
        if (document.URL === CLASSES_URL) {
            let tasks = document.querySelectorAll("#concept tr td a");
            tasks.forEach((task) => {
                if (!task.innerText.endsWith("100%")) {
                    console.log(task.innerText);
                    task.click();
                }
            });
        } else if (document.URL.match(VIDEO_URL_REGEX)) {
            // console.log("VIDEO");
            if (uniqFlag != document.URL) {
                uniqFlag = document.URL;
                currentTime = 0;
            }
            let video = document.querySelector('#video');
            if (video) {
                // video.muted=true;
                video.play();
                let curTime = video.currentTime;
                if (curTime >= currentTime) {
                    currentTime = curTime;
                } else { // 视频循环 已经听完 返回
                    document.querySelector("a.btn.back").click();
                }
            }
        }
    }, 3000);
    // Your code here...
})();