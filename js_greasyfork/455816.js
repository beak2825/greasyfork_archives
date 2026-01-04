// ==UserScript==
// @name         一键学完键盘侠
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Learn keyboard man one key
// @author       Henry
// @match        https://learn.cuixueshe.com/p/t_pc/course_pc_detail/video/*
// @match        https://appewiejl9g3764.h5.xiaoeknow.com/p/course/content/document/*
// @icon         https://wechatapppro-1252524126.file.myqcloud.com/appewiejl9g3764/image/b_u_61c818086b904_IOVlsE4m/kz80l3jr0hf8.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455816/%E4%B8%80%E9%94%AE%E5%AD%A6%E5%AE%8C%E9%94%AE%E7%9B%98%E4%BE%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/455816/%E4%B8%80%E9%94%AE%E5%AD%A6%E5%AE%8C%E9%94%AE%E7%9B%98%E4%BE%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const href = location.href;

        // 视频
        if (href.includes('learn.cuixueshe.com')) {
            timer = setInterval(findVideo, 1000);

            // PDF
        } else {
            timer = setInterval(findNextBtn, 1000);
        }
    });

    let timer = null;

    function findVideo() {
        const video = document.querySelector('video');
        if (video) {
            clearTimeout(timer);

            handleVideo(video);
        }
    }

    function handleVideo(video) {
        video.addEventListener('loadeddata', () => {
            setTimeout(() => {
                video.pause();
                const duration = video.duration;
                video.currentTime = duration;
                setTimeout(() => {
                    document
                        .querySelectorAll('.section_item_box.no_padding_right')[1]
                        .click();

                    window.close();
                }, 100);
            }, 1000);
        });
    }

    function findNextBtn() {
        const next = document.querySelectorAll('.ContentCatalog-box__text')[2];
        if (next) {
            clearTimeout(timer);

            next.click();
        }
    }

})();