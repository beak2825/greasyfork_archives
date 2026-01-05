// ==UserScript==
// @name         谷歌在线翻译替换%0A为%20
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @include      https://translate.google.*/*
// @include      http://fanyi.baidu.com/*
// @author       wxj
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24809/%E8%B0%B7%E6%AD%8C%E5%9C%A8%E7%BA%BF%E7%BF%BB%E8%AF%91%E6%9B%BF%E6%8D%A2%250A%E4%B8%BA%2520.user.js
// @updateURL https://update.greasyfork.org/scripts/24809/%E8%B0%B7%E6%AD%8C%E5%9C%A8%E7%BA%BF%E7%BF%BB%E8%AF%91%E6%9B%BF%E6%8D%A2%250A%E4%B8%BA%2520.meta.js
// ==/UserScript==



//window.alert(input);
var preinput="";
window.setInterval(comp,2000);
function comp(){
    var input=window.location.href;
    if(preinput!==input){ //说明改变了输入
        preinput=input;
        rep(input);
    }
    else{
    }
}
//替换函数
function rep(input){
    if(input.indexOf("%0A")!=-1||input.indexOf("Fig.%20")!=-1){ //含有%0A
        var newinput=input.replace(/\%0A/g,"\%20");
        var newinput1=newinput.replace(/Fig\.\%20/g,"Fig\.");
        //var newiput1=newinput.replace(/Fig\.\%20/g,"Fig\.");
        //window.alert(newinput);
        location.href= newinput1;
        //alert("包含");
    }
    else{
        //alert("不包含");
    }
}

