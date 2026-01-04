// ==UserScript==
// @name         ithomeurl m to www
// @namespace    https://greasyfork.org/zh-CN/scripts/429421-ithomeurl-m-to-www
// @version      0.2
// @description  今日热榜it之家移动端页面跳转到桌面端
// @author       sh
// @match        *://m.ithome.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429421/ithomeurl%20m%20to%20www.user.js
// @updateURL https://update.greasyfork.org/scripts/429421/ithomeurl%20m%20to%20www.meta.js
// ==/UserScript==

(function() {
    var url = window.location.href.split("/")
    var url_2 = url[4].substring(0,3)
    var url_3 = url[4].substring(3,)
    var new_url = "https://www.ithome.com/0/" + url_2 + "/" + url_3
    window.location.replace(new_url)
})();