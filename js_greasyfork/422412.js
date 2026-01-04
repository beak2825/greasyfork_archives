// ==UserScript==
// @name         USD yuket Loaded function
// @namespace    http://todou.com
// @version      1.1
// @description  Script for JS practice purpose.
// @author       You
// @match        https://tsinghua.yuketang.cn/*/video/*
// @match        http://tsinghua.yuketang.cn/*/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422412/USD%20yuket%20Loaded%20function.user.js
// @updateURL https://update.greasyfork.org/scripts/422412/USD%20yuket%20Loaded%20function.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    console.log('Tampermonkey script started running!');
 
    window.addEventListener('DOMContentLoaded', function (event) {
        console.log('DOM and resources fully loaded and parsed');
        setTimeout(mainFunc, 1000);
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
            window.location.href = nextURL();
        }
    };
 
    let videoFinished = function (video) {
        return video.duration === video.currentTime;
    };
 
    let videoFinished2 = function(process_span) {
        return process_span.innerText.substr(-4) === '100%';
    }
 
    let nextURL = function() {
        let current_url = document.URL;
        let video_id = current_url.split('/').pop();
        current_url = current_url.slice(0, -video_id.length);
        return current_url + (parseInt(video_id) + 1);
    };
 
})();