// ==UserScript==
// @name         洛谷修改名字颜色
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  随意修改名字颜色，让您被膜拜
// @author       Fcersoka
// @match        https://www.luogu.com.cn/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464615/%E6%B4%9B%E8%B0%B7%E4%BF%AE%E6%94%B9%E5%90%8D%E5%AD%97%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/464615/%E6%B4%9B%E8%B0%B7%E4%BF%AE%E6%94%B9%E5%90%8D%E5%AD%97%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

$('document').ready(function(){
    if (localStorage.length>0) {
        var str=localStorage.getItem(1);
        var s=document.querySelectorAll(".am-u-md-4.lg-punch.am-text-center a");
        var c=document.querySelectorAll("span");
        if (str=="红色") {
            s[0].className="lg-fg-red";
        }
        else if(str=="绿色"){
            s[0].className="lg-fg-green";
        }
        else if(str=="蓝色"){
            s[0].className="lg-fg-bluelight";
        }
        else if(str=="橙色"){
            s[0].className="lg-fg-orange";
        }
        else if(str=="紫色"){
            s[0].className="lg-fg-purple";
        }
        else if(str=="棕色"){
            s[0].className="lg-fg-brown lg-bold";
        }
        else if(str=="灰色"){
            s[0].className="lg-fg-gray";
        }
        else if(str!=""){
            localStorage.setItem(1, "");
            alert("目前只支持紫色、红色、橙色、绿色、蓝色和灰色");
        }
    }
    var z=document.querySelectorAll(".am-u-lg-3.am-u-md-4.lg-right");
    z[0].innerHTML+="<div class='lg-article' style='padding:16px'><h2>更改名字颜色</h2><input class='am-form-field' id='ltp' placeholder='名字颜色，如红色'><p><a href='https://www.luogu.com.cn/'><button class='am-btn am-btn-primary am-btn-sm' id='ngm' name='goto'>更改</button></a></p></div>";
});

$('#ngm').click(function(){
    var a=document.getElementById("ltp").value;
    localStorage.setItem(1, a);
});
$('#ltp').keypress(function(event){
    if (event.which == 13) {
        var a=document.getElementById("ltp").value;
        localStorage.setItem(1, a);
        location.replace(location.href);
    }
});