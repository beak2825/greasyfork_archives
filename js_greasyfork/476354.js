// ==UserScript==
// @name         B站悬浮窗视频自动跳转视频页
// @namespace    https://greasyfork.org/users/759046
// @version      0.1
// @description  自动将你在搜索引擎页中点击的B站视频链接跳转至视频主页面
// @author       233yuzi
// @match        https://www.bilibili.com/?bvid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476354/B%E7%AB%99%E6%82%AC%E6%B5%AE%E7%AA%97%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%A7%86%E9%A2%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/476354/B%E7%AB%99%E6%82%AC%E6%B5%AE%E7%AA%97%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%A7%86%E9%A2%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    autoGo()
    function autoGo() {
        let reg = RegExp(/bvid=/)
        let a = location.href
        if (a.match(reg)) {
            a = a.replace("?bvid=", "video/")
            a = a.split('&')[0]
            a=a+"/?t=1"
            console.log(a)
            location.href = a
        }
    }
})();