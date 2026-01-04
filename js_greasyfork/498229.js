// ==UserScript==
// @name         study-hardly-wego
// @namespace    www.weigaogroup.com
// @version      0.0.2
// @description  好好学习（威高大学）
// @author       Song
// @match        *://km.weigaoholding.com:9081/kms/learn/kms_learn_courseware/kmsLearnCourseware.do?*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498229/study-hardly-wego.user.js
// @updateURL https://update.greasyfork.org/scripts/498229/study-hardly-wego.meta.js
// ==/UserScript==
(function () {


    function awaitReady() {

        function detectReady() {
            if (window.frames.length < 1) return false;
            let v = findVideo();
            return v !== null && v !== undefined;
        }

        return new Promise((resolve, reject) => {
            let intervalId = setInterval(() => {
                if (detectReady()) {
                    if (intervalId) clearInterval(intervalId);
                    resolve();
                }
            }, 500);
        });
    }

    function findVideo() {
        let frames = window.frames;
        let f = frames[0];//name=mediaFrame
        let v = f.document.querySelector('video');
        return v;
    }

    function play() {
        let v = findVideo();
        setTimeout(() => {
            v.play().then(() => {
                console.debug('自动播放');
            });
        }, 1e3)
    }

    function endCourse() {
        setTimeout(() => {
            let btn = document.querySelector('#finish_btn .course_btn');
            btn.dispatchEvent(new MouseEvent('click'));
        }, 1e3);
    }

    function init() {
        let v = findVideo();
        if (v.readyState === 4) {
            play();
        } else {
            v.addEventListener('readystatechange', () => {
                if (v.readyState === 4) {
                    play();
                }
            });
            v.addEventListener('canplay', play);
        }

        v.addEventListener('ended', endCourse);

        document.addEventListener('visibilitychange', (e) => {
            console.info('visibilitychange', e.visibilityState);
            if (document.visibilityState === 'visible') {
                play();
            }
        });
    }

    awaitReady().then(() => {
        console.info('[course] ready');
        init();
    })
    // play();
})();
