// ==UserScript==
// @name         YGestures
// @namespace    http://monodog.net/
// @version      0.6.1
// @license      CC-BY-NC-SA-4.0
// @description  for Android Browser without Touch Gestures(particularly Yandex)【向手机版yandex浏览器注入前进&后退手势&&网页文本粘贴功能，并可临时禁用某一手势】
// @author       Monodog Theiions
// @icon         https://monodog.neocities.org/js/icon/YGestures.png
// @homepage     https://greasyfork.org/zh-CN/scripts/392713-ygestures
// @supportURL   mailto:wung.thy@gmail.com
// @match        http://*/*
// @include      https://*/*
// @exclude      *://*login*
// @run-at       document-body
// @require      https://cdn.jsdelivr.net/npm/hammerjs@2.0.8
// @grant        unsafeWindow
// @contributionURL https://qr.alipay.com/fkx02998fhy75rwy0pjx2eb
// @compatible   Yandex for Android , etc
// @incompatible All Browser without Touch
// @downloadURL https://update.greasyfork.org/scripts/392713/YGestures.user.js
// @updateURL https://update.greasyfork.org/scripts/392713/YGestures.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let YGScript ;
    let head=document.getElementsByTagName("head")[0];
    function WriteJsFunction(cont,html) {
        cont.innerHTML ="<div>js...</div>"+html;
    let oldScript = cont.getElementsByTagName('script')[0];
    let newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.innerHTML = oldScript.innerHTML;
    head.appendChild(newScript);
    head.removeChild(YGScript);
    YGScript=newScript;
    }


    if(window.navigator.userAgent.toLowerCase().indexOf("linux")>10)// code here
     {
        let YGBool=0;
        let allowNone="none";
        let copyStr="";
        let array=["上隐藏*下显示*左前进*右后退，按住禁用滑动事件","右滑已经禁用，按住继续更改","水平滑动已经禁用，按住继续更改","上下功能已对调，左右滑动已禁用，按住还原"];
        let body=document.getElementsByTagName("body")[0];
        var floatDIV = document.createElement("div");
        YGScript = document.createElement("script");
        head.appendChild(YGScript);
        floatDIV.style.cssText=
            "z-index: 9999;width:100%; height:30px; background:SlateBlue;color:Ivory;line-height:30px;display:none;position: fixed;bottom: 0;font-size:12px";
        floatDIV.innerHTML=array[0];
        body.appendChild(floatDIV);
        let footArea = document.createElement("textarea");
         footArea.rows="9";footArea.style.cssText=
            "z-index: 9999;width:60%;border:solid 1px #f00; background:Ivory;color:SlateBlue;display:none;position: fixed;bottom: 30px;font-size:12px";
         body.appendChild(footArea);
         let pingGoogle=false;
         let imgStic=document.createElement("img");
         imgStic.src="https://about.google/assets/img/menu.png?cache="+parseInt(new Date().getTime()/9999);
         imgStic.onload = function() {
             pingGoogle=true;
             body.removeChild(imgStic);
         }
         body.appendChild(imgStic);
        new Hammer(body).on("pan", function(e) {
        let _e = event || window.event;
        if(Math.abs(e.deltaY) < 2 * Math.abs(e.deltaX) + 2 ) {
          if(Math.abs(e.deltaX)< 2 * Math.abs(e.deltaY)+ 2 && Math.abs(e.deltaX)>2 ) {
            if(e.deltaX>0){
            //let e = event || window.event;
            copyStr=(document.elementFromPoint(_e.clientX, _e.clientY).innerHTML);
            floatDIV.style.display="block";
            if(footArea.style.display=="none")floatDIV.innerHTML=array[YGBool]+"#@向上拖拽启动粘贴";
            copyStr=copyStr.replace(/<[^>]*>/g, '\r\n');footArea.value=copyStr;
            }
           else if(e.deltaY>2){
               if(footArea.value==""||footArea.style.display=="none"){
              //alert(e.deltaX+';'+e.deltaY);
                   YGBool=0;
               floatDIV.innerHTML=array[YGBool];
               floatDIV.style.display=allowNone;
               ;footArea.style.display="none";
               copyStr="";
               }
               else if(footArea.value.substr(0,4)=="http"){
                   window.open(footArea.value);
               }
               else{
                   if(copyStr!="<"+footArea.value+">"){
                   copyStr=footArea.value;
                   if(!pingGoogle) window.open("https://www.baidu.com/s?wd="+copyStr);
                   else window.open("https://www.google.com/search?ie=UTF-8&q="+copyStr);
                   copyStr="<"+footArea.value+">";
                      }
               }
           }
           else{
              "unsafe#cannot use";
           }
          }
        }
        else if(((e.deltaY<0)!=(YGBool==3))&&footArea.style.display=="none") {floatDIV.style.display=allowNone;}
        else floatDIV.style.display= "block";})
            .on("swipeleft", function (e) {
        if(Math.abs(e.deltaX) > 2 * Math.abs(e.deltaY) + 2 && YGBool<2 ) window.history.go(1);})
            .on("swiperight", function (e) {
        if(Math.abs(e.deltaX) > 2 * Math.abs(e.deltaY) + 2 && YGBool==0 ) window.history.go(-1);})
            .on("pressup", function (x) { var e = event || window.event;
            let ele=document.elementFromPoint(e.clientX,e.clientY);
            if(ele!=footArea&&ele!=floatDIV)  {copyStr=ele.innerHTML;
            floatDIV.style.display="block";}
            if(footArea.style.display=="none")floatDIV.innerHTML=array[YGBool]+"#@向上拖拽启动粘贴";
            copyStr=copyStr.replace(/<[^>]*>/g, '\r\n');footArea.value=copyStr;})



            new Hammer(floatDIV).on("pressup", function (e) {
            if(footArea.style.display=="block");
            else if(copyStr=="") floatDIV.innerHTML=array[YGBool=(YGBool+1)&3];
            else floatDIV.innerHTML=array[YGBool=(YGBool+1)&3]+"#@向上拖拽启动粘贴";})
            .on("pan", function (e) {
        if(-(e.deltaY) > 2 * Math.abs(e.deltaX) + 2 ) {
            let fv=footArea.value;
            if(footArea.style.display=="block"&&
                fv.substr(0,8)=="<script>"&&fv.substr(-9)=='</script>'){
                WriteJsFunction(floatDIV,"<script>\nfunction YG_Script(){\n"+fv.slice(8,-9)+";\nreturn 'true';\n}\n<\/script>");
                copyStr=""+YG_Script();
            }
            footArea.style.display=(copyStr!=""||YGBool<2)?"block":"none";
            floatDIV.style.display="block";
            YGBool=2;
            footArea.value=(copyStr=="")?body.innerHTML:copyStr;
            floatDIV.innerHTML=footArea.style.display!="none"?"左滑收起，左滑转上滑安全收起；":array[YGBool];

            //footArea.value=document.getElementsByTagName("head")[0].innerHTML;
        }
        if(Math.abs(e.deltaX) > 2 * Math.abs(e.deltaY) + 2 ) {
           if(e.deltaX<0) {
               if(YGBool!=3&&footArea.style.display=="none"){
                   window.opener=null;
                   window.open('','_self');
                   window.close();}
               footArea.style.display="none";
               YGBool=3;copyStr="";
               floatDIV.innerHTML=array[YGBool];}
           else  if(footArea.style.display=="none") {allowNone="block";floatDIV.innerHTML="控制模块已锁定";}
           else if(footArea.value.substr(0,4)=="http"){
                   window.open(footArea.value);
               }
               else{
                   if(copyStr!="<"+footArea.value+">"){
                   copyStr=footArea.value;
                   if(!pingGoogle) window.open("https://www.baidu.com/s?wd="+copyStr);
                   else window.open("https://www.google.com/search?ie=UTF-8&q="+copyStr);
                   copyStr="<"+footArea.value+">";
                      }
               }
           }

        })
    }
})();