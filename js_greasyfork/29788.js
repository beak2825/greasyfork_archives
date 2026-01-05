// ==UserScript==
// @name         链接精简
// @namespace    none
// @version      2017.05.17
// @description  淘宝、天猫、百度搜索 链接精简
// @author       HungH
// @include      *.taobao.com/*
// @include      *.tmall.com/*
// @include      *www.baidu.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/29788/%E9%93%BE%E6%8E%A5%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/29788/%E9%93%BE%E6%8E%A5%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

function addbutton(){//添加按钮
    var oD_box=document.createElement("div");
    oD_box.id="oD_box";
    oD_box.style="position:fixed;top:300px;right:30px;  width:150px; z-index:99999999;";//按钮位置
    var oD_button=document.createElement("button");
    oD_button.id="oD_button";
    oD_button.type="button";
    oD_button.textContent="链接转换";//按钮显示文字
    oD_button.style="padding:4px 0;  position: relative;  top:-1px; width:90px; ";
    //按钮功能-链接转换
    oD_button.onclick=function (){
        function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return null;
    }
    var site = window.location.href.match(/^http(s)?:\/\/[^?]*/);
    var wd = getQueryString("wd");
    var id = getQueryString("id");
    var q = getQueryString("q");
    if (wd != null) {
        var pureUrl = site[0] + "?wd=" + wd;
    } else if (id != null) {
        var pureUrl = site[0] + "?id=" + id;
    } else if (q != null) {
        var pureUrl = site[0] + "?q=" + q;
    } else if (site[0].substr(site[0].length - 13) == "view_shop.htm") {
        var pureUrl = window.location.protocol + "//" + window.location.host;
    } else {
        var pureUrl = site[0];
    }
    var reload = prompt("净化后的网址是：",pureUrl);
    if(reload != null){
        window.location.href = pureUrl;
    }
};
    oD_box.appendChild(oD_button);
    document.body.appendChild(oD_box);
}

//显示按钮
(function() {
    addbutton();
})();