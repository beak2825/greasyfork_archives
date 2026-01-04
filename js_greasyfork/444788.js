// ==UserScript==
// @name         去你的手机版贴吧
// @version      0.21
// @description  将百度搜索页面中的贴吧网页转换为PC版
// @author       Aront
// @match        https://tieba.baidu.com/mo/q/*
// @icon         https://tb3.bdstatic.com/public/icon/favicon-v2.ico
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/163117
// @downloadURL https://update.greasyfork.org/scripts/444788/%E5%8E%BB%E4%BD%A0%E7%9A%84%E6%89%8B%E6%9C%BA%E7%89%88%E8%B4%B4%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/444788/%E5%8E%BB%E4%BD%A0%E7%9A%84%E6%89%8B%E6%9C%BA%E7%89%88%E8%B4%B4%E5%90%A7.meta.js
// ==/UserScript==

var domain = location.hostname;
var query = window.location.search.substring(1);

function getQueryVariable(variable)
{

    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

//将百度搜索页面中的贴吧网页转换为PC版
function fuckMotieba(){
    var tid =getQueryVariable("tid")
    var PcUrl = "https://tieba.baidu.com/p/" + tid
    window.location.href=PcUrl
}

(function() {
    if (query.indexOf("topic") !=0 ){
        fuckMotieba()
    }
})();