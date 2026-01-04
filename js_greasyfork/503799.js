// ==UserScript==
// @name         移除哔哩哔哩主页广告
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  你所热爱的，就是你的生活
// @author       zhou2008
// @match        https://www.bilibili.com
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @require      https://update.greasyfork.org/scripts/474584/1245726/ElementGetter%E5%BC%80%E6%BA%90%E5%BA%93.js
// @downloadURL https://update.greasyfork.org/scripts/503799/%E7%A7%BB%E9%99%A4%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%BB%E9%A1%B5%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/503799/%E7%A7%BB%E9%99%A4%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%BB%E9%A1%B5%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

/*global elmGetter*/
(function() {
    elmGetter.get(".recommended-swipe").then(elm => { // 主页滑动广告
        elm.hidden = true // 不能remove，会导致排版错误
    })
    elmGetter.get(".adblock-tips").then(elm => { // 顶部傻逼提示
        elm.remove() // 这个傻逼玩意隐藏没用
    })
    elmGetter.each(".bili-video-card", document, elm => {
        if (!(elm.getAttribute("class").includes("enable-no-interest"))) { // 不能按不感兴趣的就是推广
            if (elm.parentNode.getAttribute("class").includes("feed-card")) {
                elm.parentNode.remove()
            } else {
                elm.remove()
            }
        }
    })
    elmGetter.each(".floor-single-card, .bili-live-card", document, elm => { // 傻逼玩意
        elm.hidden = true // 为什么这个傻逼玩意也不能remove
    })
})();