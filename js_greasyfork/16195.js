// ==UserScript==
// @name         搜索框鍵盤功能
// @namespace    https://greasyfork.org/zh-CN/scripts/16195-%E6%90%9C%E7%B4%A2%E6%A1%86%E9%8D%B5%E7%9B%A4%E5%8A%9F%E8%83%BD
// @version      0.2
// @description  try to take over the world!
// @author       zzzmoz
// @include      http://www.baidu.com/s*
// @include      https://www.baidu.com/s*
// @include      https://*.wiktionary.org/wiki/*
// @include      https://*.wikipedia.org/wiki/*
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16195/%E6%90%9C%E7%B4%A2%E6%A1%86%E9%8D%B5%E7%9B%A4%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/16195/%E6%90%9C%E7%B4%A2%E6%A1%86%E9%8D%B5%E7%9B%A4%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var domain=window.location.hostname;
var dkw;//搜索框
if(domain.indexOf("baidu.com")>-1){//百度
    dkw=document.getElementById("kw");
}
else if(domain.indexOf("wikipedia.org")>-1){//wikitionary
    dkw=document.getElementById("searchInput");
}
else if(domain.indexOf("wiktionary.org")>-1){//wikitionary
    dkw=document.getElementById("searchInput");
}


//添加事件
dkw.addEventListener("keydown",function(e){//輸入框通用
    var ikeyCode=e.keyCode;
    if(ikeyCode==188){
        return null;
    }
    e.stopPropagation();
},true);
document.addEventListener("keydown",function(e){//輸入框通用
    var ikeyCode=e.keyCode;
    //console.log("a:........"+ikeyCode);
    switch(ikeyCode){
        case 73: //i
            dkw.focus();
            dkw.select();
            e.preventDefault();
            break;
        case 188: //,
            e.preventDefault();
            dkw.blur();
            break;
        case 229: //，
            //e.preventDefault();
            //dkw.blur();
            break;
        default:
            
    }
});
if(domain.indexOf("baidu.com")>-1){//百度
    document.addEventListener("keydown",function(e){
    var ikeyCode=e.keyCode;
    switch(ikeyCode){
        case 78: //n
            document.querySelector("#page > a:last-child").click();//百度
            break;
    }
});
}
else if(domain.indexOf("wiktionary.org")>-1 || domain.indexOf("wikipedia.org")>-1){//wikitionary/wikipedia
    document.addEventListener("keydown",function(e){
    var ikeyCode=e.keyCode;
    switch(ikeyCode){
        case 72://h,zh
            document.querySelector("#p-lang .interwiki-zh > a").click();
            break;
        case 78://n,ja
            document.querySelector("#p-lang .interwiki-ja > a").click();
            break;
        case 69://e,en
            document.querySelector("#p-lang .interwiki-en > a").click();
            break;
        case 86://v,vi
            document.querySelector("#p-lang .interwiki-vi > a").click();
            break;
        default:
            
    }
});
}


