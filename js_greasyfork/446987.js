// ==UserScript==
// @name         企查查
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description  企查查点击对应的获取按钮就能复制企业地址，法人名称和联系电话至剪切板，方便复制粘贴
// @author       Ying
// @match        https://www.qcc.com/web/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446987/%E4%BC%81%E6%9F%A5%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/446987/%E4%BC%81%E6%9F%A5%E6%9F%A5.meta.js
// ==/UserScript==
 
javascript: (function() {
$('.clearfix').css({"display":"none"});
  $('.pull-right').css({"display":"none"});

var tel = document.createElement("input");
    tel.setAttribute("name","number");
    tel.setAttribute("class","btn btn-primary");
    tel.setAttribute("value","获取地址");
    tel.setAttribute("style","width:130px;height:45px;");
    $('.npanel-heading').append(tel);
 
    tel.onclick=function(){
        var nr = document.getElementsByClassName("relate-info")[0];
        var nt = nr.getElementsByClassName("rline")[2];
        var pt = nt.getElementsByTagName("span")[0];
        var pp = pt.getElementsByClassName("copy-value")[0].innerText;
        GM_setClipboard(pp);
        console.log(pp)
    };
 
  var nam = document.createElement("input");
    nam.setAttribute("name","number");
    nam.setAttribute("class","btn btn-primary");
    nam.setAttribute("value","获取联系人");
    nam.setAttribute("style","width:130px;height:45px;");
    $('.npanel-heading').append(nam);
 
    nam.onclick=function(){
        var nr = document.getElementsByClassName("relate-info")[0];
        var nt = nr.getElementsByClassName("rline")[0];
        var pt = nt.getElementsByClassName("f")[0];
        var pp = pt.getElementsByClassName("val")[0].innerText;
        GM_setClipboard(pp);
        console.log(pp)
    };
 
var phone = document.createElement("input");
    phone.setAttribute("name","number");
    phone.setAttribute("class","btn btn-primary");
    phone.setAttribute("value","获取电话");
    phone.setAttribute("style","width:130px;height:45px;");
    $('.npanel-heading').append(phone);
 
    phone.onclick=function(){
        var nr = document.getElementsByClassName("relate-info")[0];
        var nt = nr.getElementsByClassName("rline")[1];
        var pt = nt.getElementsByClassName("f")[0];
        var pp = pt.getElementsByClassName("val")[0].innerText;
        GM_setClipboard(pp);
        console.log(pp)
    };
})();