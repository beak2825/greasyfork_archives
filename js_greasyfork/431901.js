// ==UserScript==
// @name         输入框填入
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://*.dgjapp.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/431901/%E8%BE%93%E5%85%A5%E6%A1%86%E5%A1%AB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/431901/%E8%BE%93%E5%85%A5%E6%A1%86%E5%A1%AB%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //document.getElementById("tm_btn").addEventListener("click", do_something);
//搜索框填入内容，添加按钮用于填入

//添加按钮

    var p1=document.createElement("input");
    var p11=document.createElement("input");
    var p2=document.createElement("input");
    var p3=document.createElement("input");
    var p5=document.createElement("input");

//var n1=document.createTextNode("填入");
//p1.appendChild(n1);

//var e1=document.getElementsByTaName
//p1.setAttribute("id","a3");
    //var a25="填入";
p1.setAttribute("class","index_btn");
p1.setAttribute("value","填入5双中筒");
p1.setAttribute("type","button");
    //要使用window全局变量
p1.setAttribute("onclick","window.m2()");
var e1=document.getElementById("SeachConditions");
e1.appendChild(p1);

    p2.setAttribute("class","index_btn");
    p2.setAttribute("value","填入5双");
    p2.setAttribute("type","button");
    p2.setAttribute("onclick","window.m3()");
    //var e2=document.getElementById("SeachConditions");
    e1.appendChild(p2);

    p3.setAttribute("class","index_btn");
    p3.setAttribute("value","填入10双");
    p3.setAttribute("type","button");
    p3.setAttribute("onclick","window.m5()");
    //var e2=document.getElementById("SeachConditions");
    e1.appendChild(p3);
    /*
document.getElementEyId("a3").addEventListener("click",function(){
    var a2=document.getElementsByTagName("input")[28];
    a2.value="中筒";
});*/
//填入内容
//要使用window全局变量
    var i2="商品标题";
    var ii5="规格颜色";
    var i5;
    var i6;
window.m2=function (){
    /*
    for (var i1=0;i1<50;i1++){
        var i3=document.getElementsByTagName("input")[i1].getAttribute("placeholder");
        console.log(typeof i3);
        console.log(i3);
        //if(i3==i2){
       //     console.log("66");
        //}
    }
    */
     for (var i1=0;i1<50;i1++){
        var i3=document.getElementsByTagName("input")[i1].getAttribute("placeholder");
        //console.log(typeof i3);
        //console.log(i3);
        if(i3==i2){
           //console.log("66");
           i5=document.getElementsByTagName("input")[i1];
           i5.value="中筒";
        }
    }
    for (var i11=0;i11<50;i11++){
        var i13=document.getElementsByTagName("input")[i11].getAttribute("placeholder");
        //console.log(typeof i3);
        //console.log(i3);
        if(i13==ii5){
           //console.log("66");
           i6=document.getElementsByTagName("input")[i11];
           i6.value="5";
        }
    }
    var a2=document.getElementsByTagName("input")[17];
    a2.value="1";
    var a12=document.getElementsByTagName("input")[18];
    a12.value="1";
    //var a13=document.getElementsByTagName("input")[20];
    //a13.value="5";
    var a15=document.getElementsByTagName("input")[28];
    a15.value="";

}

window.m3=function (){
    for (var i11=0;i11<50;i11++){
        var i13=document.getElementsByTagName("input")[i11].getAttribute("placeholder");
        //console.log(typeof i3);
        //console.log(i3);
        if(i13==ii5){
           //console.log("66");
           i6=document.getElementsByTagName("input")[i11];
           i6.value="5";
        }
    }
    var a23=document.getElementsByTagName("input")[17];
    a23.value="1";
    var a25=document.getElementsByTagName("input")[18];
    a25.value="1";
    //var a26=document.getElementsByTagName("input")[20];
    //a26.value="5";
    var a27=document.getElementsByTagName("input")[28];
    a27.value="";
    i5.value="";

}

window.m5=function (){
      for (var i11=0;i11<50;i11++){
        var i13=document.getElementsByTagName("input")[i11].getAttribute("placeholder");
        //console.log(typeof i3);
        //console.log(i3);
        if(i13==ii5){
           //console.log("66");
           i6=document.getElementsByTagName("input")[i11];
           i6.value="10";
        }
    }
    var a53=document.getElementsByTagName("input")[17];
    a53.value="1";
    var a55=document.getElementsByTagName("input")[18];
    a55.value="1";
    //var a56=document.getElementsByTagName("input")[20];
    //a56.value="10";
    var a57=document.getElementsByTagName("input")[28];
    a57.value="";
    i5.value="";
}
window.mp11=function(){


}
//unsafeWindow.m2=m2;
    // Your code here...
})();