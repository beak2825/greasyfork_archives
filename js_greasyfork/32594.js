// ==UserScript==
// @name         【F7】12377一键举报
// @namespace    http://12377.cn/
// @version      0.1
// @description  【F7】一键举报，速成举报狂魔!
// @author       trotsky1997
// @grant        none
// @include     	http://*
// @include			https://*
// @downloadURL https://update.greasyfork.org/scripts/32594/%E3%80%90F7%E3%80%9112377%E4%B8%80%E9%94%AE%E4%B8%BE%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/32594/%E3%80%90F7%E3%80%9112377%E4%B8%80%E9%94%AE%E4%B8%BE%E6%8A%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onkeydown= function (e) {

        var theEvent = window.event || e;
        var code = theEvent.keyCode || theEvent.which;
        if (code == 118) {
            var href = window.location.href;
            var title = document.title;
            document.write("感谢您，公民！");
            window.location.href="http://report.12377.cn:13225/toreportinputNormal_anis.do?"+href +"#" + title; 
        }

    };
    //跳转完成
    //window.onload=function(){ 

    if ( location.hostname + location.pathname== "report.12377.cn/toreportinputNormal_anis.do") {
        //alert("bingo!");
        var pageurl = location.search;
        var webname = location.hash;
        webname = webname.substr(1);
        pageurl = pageurl.substr(1);
        //alert(pageurl);
        document.getElementById("webname").value = webname;
        document.getElementById("pageurl").value = pageurl;


    }
    //};

})();