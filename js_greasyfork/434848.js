// ==UserScript==
    // @name              autopage50
    // @author            songshu
    // @description       帮助朋友实现页码自动每页50个。
    // @version           2021.11.06
    // @include           *://172.16.19.26/yeWuChuLi/fanKui/*
    // @run-at            document-end
    // @namespace         https://greasyfork.org/zh-CN/users/songshu
    // @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/434848/autopage50.user.js
// @updateURL https://update.greasyfork.org/scripts/434848/autopage50.meta.js
    // ==/UserScript==
    (function () {
      'use strict';
       //alert("欢迎使用帮助朋友实现页码自动每页50个插件");
      //添加图片一键提取
      setTimeout(clock, 1000);
      function clock(){
       getcook(" el-select-dropdown__item selected");
       console.log("主程序已执行！");
      }

     function getcook(divID) {//div获得
      var modmenut,
      AnYigetjpg;
      var modmenutdiv = document.getElementsByClassName(divID);
       // alert(modmenutdiv);
       modmenut= modmenutdiv[0];
       if (modmenut) {
        console.log(modmenut.innerHTML);
           if(modmenut.innerHTML==="<span>10条/页</span>"){
                 console.log("目前页面10条显示");

               var minput=document.getElementsByClassName("el-input el-input--mini el-input--suffix");//el-input__inner

               minput[0].click();
               console.log(minput[0].innerHTML);
         var modmenutlist = document.getElementsByClassName("el-scrollbar__view el-select-dropdown__list");
                console.log(modmenutlist[1].innerHTML);
         var modmenutlists=modmenutlist[1].getElementsByTagName("li");
         var modmenutli=modmenutlists[3];
              modmenutli .click();
             console.log(modmenutli.innerHTML);

           }
           else {
                console.log("已成功选择50条");
           }


      }
     }

    }) ();
