// ==UserScript==
// @name         细声影视收藏
// @namespace    http://dramas.xlwmin.pub
// @version      1.0.1
// @description  公测版
// @author       细声工作室
// @license      MIT
// @match        *://v.youku.com/v_show/id_*.html*
// @match        *://www.iqiyi.com/v_*.html*
// @match        *://tv.sohu.com/*/n*.shtml*
// @match        *://my.tv.sohu.com/us/*/*.shtml*
// @match        *://film.sohu.com/album/*.html*
// @match        *://v.qq.com/x/cover/*/*.html*
// @match        *://v.qq.com/x/cover/*.html*
// @match        *://www.mgtv.com/b/*/*.html*
// @match        *://v.pptv.com/show/*.html*
// @match        *://www.le.com/ptv/vplay/*.html*
// @match        *://www.1905.com/vod/play/*.shtml*
// @match        *://vip.1905.com/play/*.shtml*
// @match        *://tv.cctv.com/*/*/*/*.shtml*
// @match        *://tv.cctv.com/*/*/*.html*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/37564/%E7%BB%86%E5%A3%B0%E5%BD%B1%E8%A7%86%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/37564/%E7%BB%86%E5%A3%B0%E5%BD%B1%E8%A7%86%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==


Page = {
    entry:function(){
        //创建按钮
        var text = document.createTextNode("★");

        //创建按钮
        var div = document.createElement("div");
        div.setAttribute("title","收藏");
        div.setAttribute("class","whisper-dramas");

        //注册事件
        div.addEventListener("click",this.onClick);

        //添加到页面
        div.appendChild(text);
        document.body.appendChild(div);
    },
    onClick:function(){
        var form = document.createElement("form");
        form.setAttribute("method","POST");
        form.setAttribute("action","http://dramas.xlwmin.pub")
        form.setAttribute("target","_blank");
        form.style.display="none";

        var inputText = document.createElement("input");
        inputText.setAttribute("name","link");
        inputText.setAttribute("type","hidden");
        inputText.setAttribute("value",window.location.href);
        form.appendChild(inputText);

        document.body.appendChild(form);
        form.submit();
    }
};
(function() {
    'use strict';
    GM_addStyle(".whisper-dramas{position:fixed;left:0;bottom:5px;color:#fff;z-index:9999;width:18px;line-height:50px;text-align:center;border-radius:0px 5px 5px 0px;background:#666;cursor:default;font-size:14px;}.whisper-dramas:hover{color:white;background:#880000;cursor:pointer;}");

    Page.entry();
})();