// ==UserScript==
// @name        云创学习网-直播课程自动播放
// @namespace   http://tampermonkey.net/
// @match       https://yk.myunedu.com/
// @grant       none
// @version     1.0
// @author      youngyy
// @license     MIT
// @run-at      document-end
// @description 云创学习网-直播课程自动播放下一课
// @downloadURL https://update.greasyfork.org/scripts/454531/%E4%BA%91%E5%88%9B%E5%AD%A6%E4%B9%A0%E7%BD%91-%E7%9B%B4%E6%92%AD%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/454531/%E4%BA%91%E5%88%9B%E5%AD%A6%E4%B9%A0%E7%BD%91-%E7%9B%B4%E6%92%AD%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

function addXMLRequestCallback(callback) {
    var oldSend, i;
    if (XMLHttpRequest.callbacks) {
        XMLHttpRequest.callbacks.push(callback);
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                XMLHttpRequest.callbacks[i](this);
            }
            oldSend.apply(this, arguments);
        }
    }
}

function nextVideo() {
    var list = document.querySelector("#root > div > div > div.main-left > ul li.active")
    
    if(!list.nextSibling){
        // 无下一课
        alert("课程已播放完毕")
        return
    }
    list.nextSibling.click()
}

(function () {
    'use strict';
    addXMLRequestCallback(function (xhr) {
        xhr.addEventListener("loadend", function () {
            // 课程目录
            if (xhr.responseURL.includes('yunkai/web/study/liveLessons')) {
                var videos = document.getElementsByTagName("video")
                if (!videos.length) {
                    return
                }
                var elevideo = videos[0]

                elevideo.addEventListener('ended', () => {
                    // 播放结束 点击下一个节点
                    nextVideo()
                }, false);
            }
        });
    });
})();