// ==UserScript==
// @name         锁帖页跳转Printable
// @namespace    https://fang.blog.miri.site
// @version      0.2
// @description  在锁帖页面添加一个跳转到Printable的链接
// @author       Mr_Fang
// @match        https://www.mcbbs.net/forum.php?mod=viewthread&tid=*
// @match        https://www.mcbbs.net/thread-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418593/%E9%94%81%E5%B8%96%E9%A1%B5%E8%B7%B3%E8%BD%ACPrintable.user.js
// @updateURL https://update.greasyfork.org/scripts/418593/%E9%94%81%E5%B8%96%E9%A1%B5%E8%B7%B3%E8%BD%ACPrintable.meta.js
// ==/UserScript==
 
(function() {
    if (typeof jQuery == 'undefined') {
        console.error("%c脚本“锁帖页跳转Printable”已停止运行：\n无法加载jQuery。", "font-weight:bold");
        return false;
    }
    var tid = null;
    var filename = window.location.href.split("/").slice(window.location.href.split("/").length - 1,window.location.href.split("/").length).toString(String).split(".")[0];
    function GetQueryValue(queryName) {
        var query = decodeURI(window.location.search.substring(1));
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == queryName) { return pair[1]; }
        }
        return null;
    }
    console.log(filename);
    tid = GetQueryValue('tid');
    if(tid == null){
        filename = filename.split('-');
        tid = filename[1];
    }
    console.log(tid);
 
    jq("#messagetext").append('<p class="alert_btnleft"><a href="/thread-' + tid + '-1-1.html?action=printable">[ 使用Printable查看 ]</a></p>');
})();