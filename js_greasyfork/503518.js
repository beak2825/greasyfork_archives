// ==UserScript==
// @name         去除哔哩哔哩右下角"大家围观的直播"和广告
// @namespace    http://tampermonkey.net/
// @version      2024-08-16
// @description  移除哔哩哔哩视频评论区右下角的傻逼玩意
// @author       zhou2008
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503518/%E5%8E%BB%E9%99%A4%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8F%B3%E4%B8%8B%E8%A7%92%22%E5%A4%A7%E5%AE%B6%E5%9B%B4%E8%A7%82%E7%9A%84%E7%9B%B4%E6%92%AD%22%E5%92%8C%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/503518/%E5%8E%BB%E9%99%A4%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8F%B3%E4%B8%8B%E8%A7%92%22%E5%A4%A7%E5%AE%B6%E5%9B%B4%E8%A7%82%E7%9A%84%E7%9B%B4%E6%92%AD%22%E5%92%8C%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    let old = history.pushState
    history.pushState = function(...arg) { // 你说得对，但是你看完视频之后点击新视频不算重新加载
        chenruinmsl()
        return old.call(this,...arg)
    }
    window.onload = function() {
        chenruinmsl()
    }
    function chenruinmsl() {
        setTimeout(function() {
            try {
                document.getElementsByClassName("pop-live-small-mode")[0].hidden = true
            } catch (_) {} // 有时候可能会没有直播导致错误
            document.getElementById("right-bottom-banner").hidden = true // 但广告是一定会有的(陈睿你妈死了)
        }, 5000) // 加载完成五秒后执行
    }
})();