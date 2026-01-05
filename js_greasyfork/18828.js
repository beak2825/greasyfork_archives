// ==UserScript==
// @name        CNKI 中国知网自动导出 EndNote 格式题录
// @namespace   http://yuelong.info
// @author      YUE Long
// @description 参见博客 http://blog.yuelong.info/post/cnki-endnote-js.html
// @include     http://*.cnki.net/kns/ViewPage/viewsave.aspx?*
// @version     1.1.2
// @grant       none
// @supportURL  http://blog.yuelong.info/post/cnki-endnote-js.html
// @downloadURL https://update.greasyfork.org/scripts/18828/CNKI%20%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91%E8%87%AA%E5%8A%A8%E5%AF%BC%E5%87%BA%20EndNote%20%E6%A0%BC%E5%BC%8F%E9%A2%98%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/18828/CNKI%20%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91%E8%87%AA%E5%8A%A8%E5%AF%BC%E5%87%BA%20EndNote%20%E6%A0%BC%E5%BC%8F%E9%A2%98%E5%BD%95.meta.js
// ==/UserScript==

var myurl = window.location.href;
if (myurl.indexOf("EndNote") == -1) {
    submitFun('EndNote');
} else {
    if (myurl.indexOf("epub.cnki.net") !== -1) {
        $(".save.txt").trigger("click");
    }
    if (myurl.indexOf("search.cnki.net") !== -1) {
        $("#exportTxt").trigger("click");
    }
    //window.close();
}