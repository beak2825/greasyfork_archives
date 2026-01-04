    // ==UserScript==
    // @name              cookget
    // @author            songshu
    // @description       某些需要提取cookie的地方。
    // @version           2021.1220.01
    // @include           *://eid.jd.com/*
    // @include           *://*me.m.jd.com/*
    // @include           *://*q.jd.com/*   p.m.jd.com 
    // @include           *://p.m.jd.com/*  
    // @include           *://*.jingxi.com/* 
    // @run-at            document-end
    // @namespace         https://greasyfork.org/zh-CN/users/songshu
    // @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/431695/cookget.user.js
// @updateURL https://update.greasyfork.org/scripts/431695/cookget.meta.js
    // ==/UserScript==
    (function () {
      'use strict';
      //alert("欢迎使用cookie提取插件");
      //添加图片一键提取
      setTimeout(clock, 2000);
      
      function clock(){
      getcook("div");
        
      function getcook(divID) {//div获得
      var modmenut,
      AnYigetjpg;
      var modmenutbody = document.getElementsByTagName('body');
      //var modmenutdiv =modmenutbody[0].getElementsByTagName(divID);
      //var i=modmenutdiv.length-1;
      modmenut= modmenutbody[0];
      if (modmenut) {
     
        AnYigetjpg = document.createElement('div');
        AnYigetjpg.setAttribute('id','begbut');
        AnYigetjpg.innerHTML = '<div  style="z-index:99999;margin-top: 2px;left:5px;right:5px;width：auto; position: fixed;bottom: 80px;background:#28c0c6;border:1px #cdcdcd solid; "><a href="https://eid.jd.com/" style="color: #0f1501;">↓↓请把需要处理的ck粘贴在这里↓↓</a> <textarea id="ooinput"  style=""></textarea> <button id="getjpg"  name="getjpg" ><span style="font-size: 22px;margin:3px;">手动提取CK</span></button> <textarea id="autoooinput"  style=""></textarea> <button id="autogetjpg"  name="autogetjpg" ><span style="font-size: 22px;margin:3px;">自动CK</span></button></div>';
        modmenut.insertBefore(AnYigetjpg, modmenut.firstchild);
        document.getElementById('getjpg').addEventListener('click', showck, false); //不重要;
        document.getElementById('autogetjpg').addEventListener('click', showck2, false); //不重要;
        //modmenut.innerHTML = AnYigetjpg.innerHTML;
         console.log("主程序已执行！");
         } 
      }
        
        
     
      }
      
      function showck(){//复制或者显示ck
         console.log("此处往下自由发挥并执行！");
         var cktxt= "";
         //getkeyc();//如果有合适的url的可以自动获取。
         setText();     
      }
       function showck2(){//自动获取的显示ck
         console.log("此处往下自由发挥并执行！");
         var cktxt= "";
         getkeyc();//如果有合适的url的可以自动获取。
         //setText();     
      }

      function getkeyc(){//获取页面的ck
         var cktxt= "";
         //cktxt= getCookie("pwdt_id");//这个只是证明可以获得未隐藏ck
         cktxt=cktxt+getCookie("pt_key");
         cktxt=cktxt+getCookie("pt_pin");//此处可以多次请求不同的信息。*/
         copyText(cktxt);
         console.log(cktxt);       
      }
      
      function copyText(txt) {
      var text = document.getElementById('autogetjpg').innerText;
      var textArea = document.getElementById('autoooinput');
      textArea.value = txt;
      // 选中文本
      textArea.select();
      // 复制
      //document.execCommand('copy');
     }
      
      function setText() {//手动提取
      var text = document.getElementById('getjpg').innerText;
      var textArea = document.getElementById('ooinput');
      //textArea.value = txt;
      // 选中文本
      textArea.select();
        var  Ccookie=textArea.value;
      // 复制
      //document.execCommand('copy');
        var  cktxt="";
        cktxt=cktxt+getCookie2("pt_key",Ccookie);
        cktxt=cktxt+getCookie2("pt_pin",Ccookie);//此处可以多次请求不同的信息。
        textArea.value=cktxt;
         console.log(cktxt);
     }
      
    function getCookie2(cname,Ccookie) {//获得对应的cookie 获得对应的手动内容
        var name = cname + "=";
         var ckget=name+"";
        //var decodedCookie = decodeURIComponent(document.cookie);
        var cookieStr = Ccookie;
        var ca = cookieStr.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                ckget=ckget+ c.substring(name.length, c.length);
            }
        }
        ckget=ckget+";"
        return ckget;
    }
      
      function getCookie(cname) {//获得对应的cookie
        var name = cname + "=";
         var ckget=name+"";
        //var decodedCookie = decodeURIComponent(document.cookie);
        var cookieStr = document.cookie;
        var ca = cookieStr.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                ckget=ckget+ c.substring(name.length, c.length);
            }
        }
        ckget=ckget+";"
        return ckget;
    }
      
    }) ();

