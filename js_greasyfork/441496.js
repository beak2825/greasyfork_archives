// ==UserScript==
// @name         在线学习autoPlayer
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  刷课时专用
// @author       Jero
// @match        https://www.tampermonkey.net/changelog.php?version=4.14&ext=dhdg
// @match        https://hzzj-kfkc.webtrn.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at       document-end
// @license           AGPL
// @downloadURL https://update.greasyfork.org/scripts/441496/%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0autoPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/441496/%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0autoPlayer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var __main = function () {
        var iframe1 = document.querySelector('.contentIframe')
        var iframe2 = iframe1.contentWindow.document.querySelector('#mainFrame')
        var sectionwraps = iframe1.contentWindow.document.querySelectorAll('.s_sectionwrap')
        var container_display_button = iframe2.contentWindow.document.querySelector('#container_display_button')
        var pointtis = iframe1.contentWindow.document.querySelectorAll('.s_pointti')
        var index = 0

        var videoEvent = function () {
            // 播放完成移除事件
            var video = iframe2.contentWindow.document.querySelector('video')
            video.removeEventListener('ended', videoEvent)
            setTimeout(function () {
                // 播放下一个
                index++
                pointtis[index].click()
            }, 2000)

            // 再次绑定事件
            setTimeout(monitorVideo, 10000)
        }

        var monitorVideo = function () {
            var video = iframe2.contentWindow.document.querySelector('video')
            video.addEventListener('ended', videoEvent)
        }
        for (var i = 0; i < sectionwraps.length; i++) {
            var sectionwrap = sectionwraps[i];
            if (sectionwrap.style.display !== 'none') {
                index = i
            }
        }

        // 进入课程自动播放
        container_display_button.click()
        setTimeout(function () {
            // 监听 video 播放结束事件
            monitorVideo()
        }, 2000)
    }

    __main()
    // Your code here...
})();