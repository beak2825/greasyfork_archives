// ==UserScript==
// @name         chaoxingJump
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  skip video
// @author       You
// @match        http://mooc1-2.chaoxing.com/mycourse/studentstudy*
// @icon         https://www.google.com/s2/favicons?domain=ouchn.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470406/chaoxingJump.user.js
// @updateURL https://update.greasyfork.org/scripts/470406/chaoxingJump.meta.js
// ==/UserScript==
(function () {
    'use strict';
    block('mouseout', window);
    check();
    // Your code here...
})();
function block(eventName, window) {
    window.addEventListener(eventName, (event) => {
        event.stopImmediatePropagation();
    }, true);
}
function check() {
    var n = nextService();
    var r = retryService();
    var v = videoService();
    console.log("经过测试,interval 在切换视频时不会改变");
    var lock = setInterval(function () {
        console.info("开始检测是否播放完毕.....");
        if(!n.correct()){
            console.log("出现故障了，无法跳转到下一个作业,无法处理，清除定时作业,lock:", lock);
            clearInterval(lock);
            return;
        }
        v.create();
        v.prop();
        if (!v.exist() && !r.retry()) {
            console.log("判定为当前页面没有视频，直接下一个作业");
            n.nextVideo();
            return;
        }
        v.failover();
        v.next(n);
    }, 3000);
}

function retryService() {
    var retryCount = 0;
    var maxRetry = 3;

    return {
        retry() {
            if (retryCount < maxRetry) {
                console.log('可能是由于加载缓慢导致的未初始化问题，重试次数:' + retryCount + '，最大次数:' + maxRetry)
                retryCount++;
                return true;
            } else {
                retryCount = 0;
                return false;
            }
        }
    }

}

function videoService() {
    let video = null;
    let body = null;
    function getBody() {
        try {
            return document.querySelector('#iframe').contentDocument.querySelector('iframe').contentDocument;
        } catch (error) {
            console.log("获取body出现了错误");
            return null;
        }
    }
    return {
        create() {
            body = getBody();
            if (body == null){
               video = null;
               return;
            };
            video = body.querySelector('#video_html5_api');
        },
        prop() {
            if (this.exist() && video.playbackRate == 1) {
                video.playbackRate = 2;
                video.muted = true;
            }
        },
        exist() {
            return video != null && typeof video != 'undefined'
        },
        failover() {
            if (this.exist() && video.paused && video.duration != video.currentTime) {
                console.log("暂停或者没播放完毕，继续播放");
                body.querySelector('.vjs-play-control').click();
                return true;
            }
            return false;
        },
        next(n) {
            if (this.exist() && video.duration == video.currentTime) {
                console.log("播放完毕，下一个视频");
                n.nextVideo();
            }
        }

    }
}

function nextService() {
    // 是否按了下一个的按钮
    let isNext = false;
    // 当前的url,比较下一个按钮是否生效
    let currentURL = window.location.href;

    function isOk() {
        return currentURL !== window.location.href && isNext
    }

    function syncError() {
        return currentURL == window.location.href && isNext
    }

    return {
        nextVideo() {
            console.log("开始播放下一个视频");
            document.querySelector(".orientationright ").click();
            isNext = true;
        },
        correct() {
            if (isOk()) {
                console.log("翻页成功");
                currentURL = window.location.href;
                isNext = false;
            } else if (syncError()) {
                return false;
            }
            return true;
        }
    }

}