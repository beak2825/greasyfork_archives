// ==UserScript==
// @name         New3 Userscript
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @license MIT
// @description  try to take over the world!
// @author       You
// @match        https://huodong.xueanquan.com/2022mmspaq/yitu.html
// @match        https://huodong.xueanquan.com/2022mmsmaq/yitu.html
// @match        https://huodong.xueanquan.com/2022safeedu/jiating.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xueanquan.com

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440950/New3%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/440950/New3%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function demo (timeout,cb){
        setTimeout(function(){
            // console.log(character);
            cb?cb():null;
        },timeout);
    }//supop logint;
    var p;


    demo(1000,function(){

        demo(1000,function(){

            let stupar;
            stupar=document.querySelector("body > div.container-fluid > div:nth-child(1) > div > div:nth-child(3) > div > div > div > ul > li.active > a > p");
            //stupar.click();
            demo(1000,function(){
                let stuparfinish;

                stuparfinish=document.querySelector("body > div.container-fluid > div.small-screen.row > div.span3 > div:nth-child(1) > div > div > a");
               stuparfinish.click();
                demo(1000,function(){
                if(document.querySelector("#layui-layer2 > div.layui-layer-btn.layui-layer-btn-c > a")!=null)
                {
                document.querySelector("#layui-layer2 > div.layui-layer-btn.layui-layer-btn-c > a").click();
                }
                demo(1000,function(){
                if(document.querySelector("body > div.container-fluid > div.small-screen.row > div.span9 > div:nth-child(1) > div > ul > li.noact > a > p")!=null)
                {
               document.querySelector("body > div.container-fluid > div.small-screen.row > div.span9 > div:nth-child(1) > div > ul > li.noact > a > p").click();
                }
                demo(1000,null);
            });
            });
            });
        });
    });



   // function(){
     //               var elment1=document.querySelector("body > div.container-fluid > div:nth-child(1)");
     //               var para = document.createElement("a");
     //               para.href="javascript:window.opener=null;window.open('','_self');window.close();";
     //               para.innerText="s关闭s";
     //               para.setAttribute("Id","closeself");
     //               elment1.parentElement.insertBefore(para,elment1);
     //               document.getElementById("closeself").click();
     //               demo(1000,null); }





//var elment1= document.querySelector("body > div.nav.layui-layout-admin > div > ul.layui-nav.layui-layout-left > li:nth-child(6) > a");
//  var para = document.createElement("a");
//  para.href="javascript:window.opener=null;window.open('','_self');window.close();";
//  para.innerText="关闭";
//  para.setAttribute("Id","closeself");
//  elment1.parentElement.insertBefore(para,elment1);
//  document.getElementById("closeself").click();
//  demo(5000,null);


// Your code here...
})();