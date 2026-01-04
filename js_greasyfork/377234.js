// ==UserScript==
// @name 网易云音乐下载助手
// @description 用于在网页端直接下载网易云音乐
// @version 0.1.2
// @match https://music.163.com/
// @require https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @compatible Chrome
// @supportURL https://www.sunyq.xin/index.php/2019/01/29/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E7%BC%96%E5%86%99%E5%85%A5%E9%97%A8-%E7%BD%91%E6%98%93%E4%BA%91%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7/
// @namespace https://www.sunyq.xin/index.php/2019/01/29/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E7%BC%96%E5%86%99%E5%85%A5%E9%97%A8-%E7%BD%91%E6%98%93%E4%BA%91%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7/
// @downloadURL https://update.greasyfork.org/scripts/377234/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/377234/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    var iframe = $("#g_iframe");
    iframe.on('load', function () {
        var url = geturl(getid());
        if (window.location.href.search(".*://music\\.163\\.com/#/song\\?id=\\d+")!=-1)
            insertElem(url, iframe);
    });
})();

function getid() {
    var id = window.location.href.split('=')[1];
    return id;
}

function geturl(id) {
    var str1 = "http://music.163.com/song/media/outer/url?id=";
    var str2 = ".mp3"
    return str1 + id + str2;
}

function insertElem(url, iframe) {
    var element = '<a class="u-btn2 u-btn2-2 u-btni-addply f-fl" hidefocus="true" title="直接下载" target="_blank" href="' + url + '"><i><em class="ply"></em>直接下载</i></a>';
    $("#content-operation", iframe[0].contentWindow.document.body).append(element);
}