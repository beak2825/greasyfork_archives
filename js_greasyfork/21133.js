// ==UserScript==
// @name         XClient设置下载链接
// @namespace    http://www.farwmarth.com/
// @version      0.1
// @description  XClient
// @author       far
// @match        http://xclient.info/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/21133/XClient%E8%AE%BE%E7%BD%AE%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/21133/XClient%E8%AE%BE%E7%BD%AE%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


(function() {
    var host = location.host;

    if(host == 'xclient.info'&&location.href.indexOf("a=dl")!=-1){
        var btn_down_link =document.getElementsByClassName("btn_down_link")[0];
        var code =btn_down_link .getAttribute("data-clipboard-text");
        if (code){
            var url =btn_down_link .getAttribute("data-link");
            var href_txt = "<a class='btn_down_link pop_btn' href='" + url + "#" + code + "' target='_blank'>" + '去下载' + '</a>';
            console.log(code);
            var down_wrap =document.getElementsByClassName("down_wrap")[0];
            down_wrap.innerHTML = href_txt;
        }
    }
})();
