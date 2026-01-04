// ==UserScript==
// @name         fantia.jp无料视频放大
// @namespace    http://tampermonkey.net/
// @version      1.40
// @description  用来放大fantia.jp网站里作者视频的播放窗口大小，简简单单一段代码，欢迎大佬添加新功能！
// @author       秀和
// @match        *://fantia.jp/posts/*
// @icon         https://fantia.jp/favicon.ico
// @run-at        document-body
// @grant         GM_setValue
// @grant        GM_getValue
// @grant       GM_setClipboard
// @license     MIT
// @grant       unsafeWindow
// @grant      window.close
// @grant      window.focus
// @noframes
// @nocompat Chrome
// @downloadURL https://update.greasyfork.org/scripts/447988/fantiajp%E6%97%A0%E6%96%99%E8%A7%86%E9%A2%91%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/447988/fantiajp%E6%97%A0%E6%96%99%E8%A7%86%E9%A2%91%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
//1.1更新：GM/FF 兼容选项记得勾选“转换 CDATA 部分为 Chrome 兼容的格式”
   window.onload = function(){
       let judge=document.getElementsByClassName("post-content-body");
     //  alert(judge.length);
       for(let i=0;i<judge.length;i++){
       let NewDIV=document.createElement("div");
       NewDIV.style.padding="10px";
       NewDIV.style.width="100%";
       document.getElementsByClassName("content-block type-file")[i].appendChild(NewDIV);//生成新DIV

       //放大
       let button1=document.createElement("button");
       button1.className="button[i]";
       button1.innerText="点击我放大视频";
       button1.style.background="#22c283";//颜色弄得和下载按钮差不多
       button1.style.color="#ffffff";
       button1.style.border="1px solid transparent";
       button1.style.float="left";
       button1.style.width="40%";
       button1.style.height="30px";
       button1.style.borderradius="10px";//border-radius
//       let click= div.innerHTML='<span id="span-1">span1</span><span class="sp">span class</span>';
       button1.onclick=function(){
 //              alert("我被点击了");
           let VideoStyle=judge[i];
           //let Widget=document.getElementsByClassName("panel panel-default panel-widget")[2];
           let Widgets=document.getElementsByClassName("col-md-4")[0];
           Widgets.style.display="none";//隐藏右导航栏
           VideoStyle.style.width="1080px";
       };
       //document.body.append(div);
     NewDIV.appendChild(button1);//放入新DIV中

     //缩小
       let button2=document.createElement("button");
       button2.innerText="点击我缩小视频";
       button2.style.background="#22c283";//颜色弄得和下载按钮差不多
       button2.style.color="#ffffff";
       button2.style.border="1px solid transparent";
       button2.style.float="right";
       button2.style.width="40%";
       button2.style.height="30px";
       button2.style.borderradius="10px";
//       let click= div.innerHTML='<span id="span-1">span1</span><span class="sp">span class</span>';
       button2.onclick=function(){
 //              alert("我被点击了");
           let VideoStyle=judge[i];
           //let Widget=document.getElementsByClassName("panel panel-default panel-widget")[2];
           let Widgets=document.getElementsByClassName("col-md-4")[0];
           Widgets.style.display="inline";//隐藏右导航栏
           VideoStyle.style.width="100%";
       };
       //document.body.append(div);
     NewDIV.appendChild(button2);//放入新DIV中
          }
       };
})();