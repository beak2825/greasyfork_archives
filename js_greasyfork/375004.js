// ==UserScript==
// @name         XClient设置下载链接
// @namespace    http://t00ls.cn/
// @version      0.2
// @description  XClient 解除弹窗 下载
// @author       Rob0t
// @match        *://xclient.info/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/375004/XClient%E8%AE%BE%E7%BD%AE%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/375004/XClient%E8%AE%BE%E7%BD%AE%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


(function() {
    var host = location.host;

    if(host == 'xclient.info'&&location.href.indexOf("a=dl")!=-1){
        var btn_down_link =document.getElementsByClassName("btn_down_link")[0];
        var code =btn_down_link .getAttribute("data-clipboard-text");
        if (code){
            var url =btn_down_link .getAttribute("data-link");
            var href_txt = "<a class='btn_down_link pop_btn' href='" + url + "#" + code + "' target='_blank'>" + '下 载' + '</a>';
            console.log(code);
            var down_wrap =document.getElementsByClassName("down_wrap")[0];
            down_wrap.innerHTML = href_txt;
        }
    }
})();
