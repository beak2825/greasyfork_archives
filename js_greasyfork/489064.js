// ==UserScript==
// @name         kekys自动连播插件
// @namespace    https://kekys.com
// @version      0.2
// @description  播放完视频自动跳到下一个
// @author       王泥巴
// @match        https://*.keke1.com/*
// @match        https://*.keke2.com/*
// @match        https://*.keke3.com/*
// @match        https://*.keke4.com/*
// @match        https://*.keke5.com/*
// @match        https://*.keke6.com/*
// @match        https://*.keke7.com/*
// @match        https://*.keke8.com/*
// @match        https://*.keke9.com/*
// @match        https://*.keke10.com/*
// @match        https://*.keke11.com/*
// @match        https://*.keke12.com/*
// @match        https://*.keke13.com/*
// @match        https://*.keke14.com/*
// @match        https://*.keke15.com/*
// @match        https://*.keke16.com/*
// @match        https://*.keke17.com/*
// @match        https://*.keke18.com/*
// @match        https://*.keke19.com/*
// @match        https://*.keke20.com/*
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/489064/kekys%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/489064/kekys%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    const video = document.querySelector("#my-video > video")
    video.addEventListener('ended', function() {
        // 在这里执行视频播放完毕后的操作
        var currentURL = window.location.href;
        var regex = /(\d+)(?=\.html$)/;
        var match = currentURL.match(regex);

        if (match) {
            // 提取数字并加1
            var num = parseInt(match[0]) + 1;

            // 构建新的URL
            var newURL = currentURL.replace(regex, num);

            // 在当前页面打开新的URL
            setTimeout(function() {
                console.log("5秒已过，将跳转到下一个页面。");
                window.open(newURL, '_self');
            }, 500);
        } else {
            alert('无法从URL中提取数字', currentURL)
        }
    });

})();