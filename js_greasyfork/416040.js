// ==UserScript==
// @name liaoxuefeng.com 左右方向键翻页
// @description liaoxuefeng.com 教程 增加翻页功能
// @namespace Big Scripts
// @match *://www.liaoxuefeng.com/wiki/*
// @grant none
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @version 0.0.1
// @downloadURL https://update.greasyfork.org/scripts/416040/liaoxuefengcom%20%E5%B7%A6%E5%8F%B3%E6%96%B9%E5%90%91%E9%94%AE%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/416040/liaoxuefengcom%20%E5%B7%A6%E5%8F%B3%E6%96%B9%E5%90%91%E9%94%AE%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    $(document).keydown(function (e) {
        if (e && e.keyCode == 39) {
            let url = document.querySelector("#x-content > div.x-wiki-prev-next.uk-clearfix > a.uk-float-right").href
            location.assign(url)
        }
        if (e && e.keyCode == 37) {
            let url = document.querySelector("#x-content > div.x-wiki-prev-next.uk-clearfix > a:nth-child(1)").href
            location.assign(url)
        }
    })
})()