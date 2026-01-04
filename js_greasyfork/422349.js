// ==UserScript==
// @name         Tsinghua Yukuotang Autoplay
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  A script for JS practice purpose.
// @author       You
// @match        https://tsinghua.yuketang.cn/*/video/*
// @match        http://tsinghua.yuketang.cn/*/video/*
// @match        https://pro.yuketang.cn/v2/web/xcloud/video-student/*
// @match        http://pro.yuketang.cn/v2/web/xcloud/video-student/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422349/Tsinghua%20Yukuotang%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/422349/Tsinghua%20Yukuotang%20Autoplay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tampermonkey script started running!');

    window.addEventListener('load', function (event) {
        console.log('DOM and resources fully loaded and parsed');
        setTimeout(mainFunc, 4000);
    }); // load or DOMContentLoaded (run at document-start!)

    let mainFunc = function () {
        //let video = $('video')[0]; // add [0] !!!
        let video = document.getElementsByTagName('video')[0];
        if (video === null || typeof video === 'undefined') {
            console.log('No video on this page!');
            window.location.href = nextURL();
        }
        else {
            let span_items = document.querySelectorAll('span');
            let process_span_index = -1;
            for (let i = 0; i < span_items.length; i++) {
                let text = span_items[i].innerText;
                let pos = text.indexOf("完成度");
                if (pos != -1) {
                    console.log('Process info matched: ' + text);
                    process_span_index = i;
                    break;
                }
            }

            setInterval(worker, 1000, video, span_items[process_span_index]);
        }
    }

    let worker = function (video, process_span) {
        if (videoFinished(video) || videoFinished2(process_span)) {
            console.log('Video finished!');
            window.location.href = nextURL(); // pass the id of page to stop at
        }
    };

    let videoFinished = function (video) {
        return video.duration === video.currentTime;
    };

    let videoFinished2 = function(process_span) {
        return process_span.innerText.substr(-4) === '100%';
    }

    let nextURL = function(end_id) {
        let current_url = document.URL;
        let video_id = current_url.split('/').pop();
        if (video_id === String(end_id)) {
            window.close()
        }
        current_url = current_url.slice(0, -video_id.length);
        return current_url + (parseInt(video_id) + 1);
    };

})();
