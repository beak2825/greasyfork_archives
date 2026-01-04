// ==UserScript==
// @name         WUXUEJIAOYU
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  个人作业脚本!
// @author       xinliushi
// @match        https://learning.wuxuejiaoyu.cn/openlearning/console/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wuxuejiaoyu.cn
// @grant        none
// @license      Mozilla
// @downloadURL https://update.greasyfork.org/scripts/452181/WUXUEJIAOYU.user.js
// @updateURL https://update.greasyfork.org/scripts/452181/WUXUEJIAOYU.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    var eleInterval = setInterval(() => {init()}, 1500);

       function init(){
           if(document.getElementById('tdFrameBtm') != undefined){
               clearInterval(eleInterval);

               var newNodeGet = document.createElement("a");
               newNodeGet.href = "#";
               newNodeGet.innerText = "获取";
               newNodeGet.className = 'func_narrow';
               newNodeGet.onclick = getanswer
               document.getElementById('tdFrameBtm').appendChild(newNodeGet);

               var newNodeSet = document.createElement("a");
               newNodeSet.href = "#";
               newNodeSet.innerText = "输出";
               newNodeSet.className = 'func_narrow';
               newNodeSet.onclick = setanswer
               document.getElementById('tdFrameBtm').appendChild(newNodeSet);

               function getanswer(){
                   var eleBtn = self.parent['w_main'].frames['cboxIframe'].contentWindow.frames['w_lms_content'].frames['w_lms_sco'];

                   var child = eleBtn.document.querySelectorAll('[style="color:darkred;font-size:10pt"]')

                   var index = 0;

                   for(var i = 0;i < child.length;i++){
                       if(child[i].innerText.indexOf("参考答案") != -1){
                           sessionStorage.setItem(index,child[i].innerText.substring(child[i].innerText.indexOf('：') + 1 ,child[i].innerText.indexOf(']')));
                           index++;
                       }
                   }

                   if(sessionStorage.length > 0){
                       alert("已获取答案");
                   }else if(sessionStorage.length == 0){
                       alert("没有答案可获取");
                   }
                   console.log(sessionStorage);
               }

               function setanswer(){
                   var eleBtn = self.parent['w_main'].frames['cboxIframe'].contentWindow.frames['w_lms_content'].frames['w_lms_sco'];

                   if(sessionStorage.length > 0){
                       var child = eleBtn.frames['w_right'].document.querySelectorAll('[optiontype="radio"],[isitt001input="1"],[optiontype="checkbox"]');
                       for(var i = 0;i < child.length;i++){
                           console.log(child[i].tagName);
                           if(child[i].tagName == "INPUT"){
                               child[i].value = sessionStorage.getItem(i);
                           }else if(child[i].attributes.optiontype.value == "radio"){
                               child[i].querySelector('[value="'+sessionStorage.getItem(i)+'"]').click();
                           }else if(child[i].attributes.optiontype.value == "checkbox"){
                               var array = sessionStorage.getItem(i).split('');
                               array.forEach(item => child[i].querySelector('[value="'+item+'"]').click());
                           }
                       }
                   }else if(sessionStorage.length == 0){
                       alert("没有答案可输出");
                   }
               }
           }
       }
})();