// ==UserScript==
// @name         洛谷代码折叠
// @namespace    https://www.luogu.com.cn/user/237530
// @version      0.2
// @description  支持折叠洛谷页面中的代码，过长代码自动折叠
// @author       rzh123
// @match        https://www.luogu.com.cn/*
// @icon         https://cdn.luogu.com.cn/fe/logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446807/%E6%B4%9B%E8%B0%B7%E4%BB%A3%E7%A0%81%E6%8A%98%E5%8F%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/446807/%E6%B4%9B%E8%B0%B7%E4%BB%A3%E7%A0%81%E6%8A%98%E5%8F%A0.meta.js
// ==/UserScript==

var threshold=1500;
function insertAfter(ele,pos){
    var par=pos.parentNode;
    if (par.lastChild==pos){
        par.appendChild(ele);
    }
    else{
        par.insertBefore(ele,pos.nextSibling);
    }
}
function doshow(obj){
    var codebtn=document.createElement("A");
    codebtn.href="javascript:;";
    codebtn.innerHTML="[折叠代码]";
    codebtn.onclick=function(){dohide(obj);codebtn.parentNode.removeChild(codebtn);};
    obj.style.display="block";
    insertAfter(codebtn,obj);
}
function dohide(obj){
    var codebtn=document.createElement("A");
    codebtn.href="javascript:;";
    codebtn.innerHTML="[展开代码]";
    //codebtn.style.marginTop="3px";
    codebtn.onclick=function(){doshow(obj);codebtn.parentNode.removeChild(codebtn);};
    obj.style.display="none";
    insertAfter(codebtn,obj);
}
function main(){
    var nodes=document.all,obj,obj2;
    for(var i=0;i<nodes.length;++i){
        obj=nodes[i];
        if(obj.tagName=="PRE"&&obj.childElementCount==1&&obj.firstElementChild.tagName=="CODE"){
            obj2=obj.firstElementChild;
            //console.log(obj2.textContent);
            //console.log(obj2.textContent.length);
            if(obj2.textContent.length>threshold){
                dohide(obj2);
            }
            else{
                doshow(obj2);
            }
        }
    }
}
window.onload=function(){
    'use strict';
    main();
};