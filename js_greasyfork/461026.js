// ==UserScript==
// @name         河北工业大学长江雨课堂
// @namespace    http://tmpermonkey.net/
// @version      1.2
// @description  雨课堂视频自动播放
// @author       倚栏听风
// @match        https://changjiang.yuketang.cn/v2/*
// @match        https://changjiang.yuketang.cn/web/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461026/%E6%B2%B3%E5%8C%97%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E9%95%BF%E6%B1%9F%E9%9B%A8%E8%AF%BE%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/461026/%E6%B2%B3%E5%8C%97%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E9%95%BF%E6%B1%9F%E9%9B%A8%E8%AF%BE%E5%A0%82.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function goNextVideo(step) {
        var url = window.location.href;
        if (url == 'https://changjiang.yuketang.cn/web/?index') {
            url = localStorage.getItem('oldUrl')
            var errorCount = localStorage.getItem('errorCount')
            if (errorCount == null) {
                errorCount = 1
            } else {
                errorCount = parseInt(errorCount) + 1
            }
            if (errorCount >= 5) {
                localStorage.removeItem("errorCount")
                localStorage.removeItem("oldUrl")
                window.location.href = "https://changjiang.yuketang.cn/v2/web/index"
                return
            }
            localStorage.setItem('errorCount', errorCount)
        }
        localStorage.setItem('oldUrl', url);
        var videoId = url.split('/')[8];
        var newVideoId = parseInt(videoId) + step;
        var newUrl = url.replace(videoId, newVideoId);
        window.location.href = newUrl;

    }


    function execute() {
        if (window.location.href == 'https://changjiang.yuketang.cn/web/?index') {
            goNextVideo(2)
        }
        var progress = 'null';

        try {
            progress = document.querySelectorAll('span.text')[1].textContent.split("：")[1];
        } catch (e) {
            console.log('读取时出错，查看是否为video');
            var elem = document.querySelector('#video-box');
            if (elem.innerHTML == '') {
                goNextVideo(1);
                return;
            } else {
                location.reload();
            }
        }
        try {
            progress = parseInt(progress.split("%")[0]);
            document.querySelector('div.title-fl:first-child').innerText = '脚本检测到进度：' + progress + '%';
            if (progress >= 95) {
                goNextVideo(1);
                return;
            }
            setTimeout(execute, 2000);
        } catch (e) {
            console.log('读取时出错，尝试重试');
            location.reload();
        }

    }

    var url = window.location.href;
    if (url.match("/video-student")) {
        setTimeout(() => {
            var text = document.getElementsByClassName('text text-ellipsis')[0].innerText;
            if (text.match("作业") || text.match("讨论题") || text.match("推荐资料")) {
                goNextVideo(1);
            }
        }, 2000)

        if (window.onurlchange === null) {
            window.addEventListener("urlchange", () => {
                setTimeout(execute, 2000);
            });
        }
        setTimeout(execute, 2000);
    } else {
        setTimeout(execute, 2000);
    }

})();