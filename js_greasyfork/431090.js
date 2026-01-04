// ==UserScript==
// @name         liaoxuefeng.com 方向键翻页
// @version      0.0.2
// @description  liaoxuefeng.com 教程 Ctrl+左/右 翻页
// @author       nku100
// @match        *://www.liaoxuefeng.com/wiki/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @namespace https://greasyfork.org/users/190286
// @downloadURL https://update.greasyfork.org/scripts/431090/liaoxuefengcom%20%E6%96%B9%E5%90%91%E9%94%AE%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/431090/liaoxuefengcom%20%E6%96%B9%E5%90%91%E9%94%AE%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    $(document).keydown(function (e) {
        if (e.ctrlKey && e.keyCode == 39) {
            var url = document.querySelector("#x-content > div.x-wiki-prev-next.uk-clearfix > a.uk-float-right").href
            location.assign(url)
        }
        if (e.ctrlKey && e.keyCode == 37) {
            var url = document.querySelector("#x-content > div.x-wiki-prev-next.uk-clearfix > a:nth-child(1)").href
            location.assign(url)
        }
    })
})()