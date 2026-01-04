// ==UserScript==
// @license MIT
// @name         KM watermark remover
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  remove ID watermark from KM website
// @author       大喜啾
// @include      *.netease.com*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/465778/KM%20watermark%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/465778/KM%20watermark%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setTimeout(function(){ //延迟1s消除水印
//alert("开始查找");
        var watermark=document.getElementById("nis-water-container");//获取KM水印元素的节点
//alert("查找完nis-water-container");
        var watermark2=document.getElementsByClassName("__wm");//获取DM水印元素的节点
//alert("查找完__wm");
//      document.querySelector('.mask_div').removeAttribute('class');
//alert("有这个div3");
        if(watermark)
        {
          //   alert("开始去除nis-water-container");
            watermark.parentNode.removeChild(watermark);//删除水印节点，由于没有直接删除节点自身的方法，这里先获取父节点，再使用删除子节点的方法
        }
        else
        {
         //           alert("没有nis-water-container");
            window.setTimeout(function(){ //如果删除失败，3s后再次尝试删除
                var watermark=document.getElementById("nis-water-container");
                watermark.parentNode.removeChild(watermark);
            },3000);
        }
        if(watermark2){
       //      alert("有__wm");
            watermark2[0].innerHTML=".test::after{ visibility: hidden }";//由于DM的节点属性会自我恢复，使用插入伪元素方法隐藏该节点
                document.head.appendChild(watermark2[0]);
        }
        else{
        //            alert("没有__wm");
            window.setTimeout(function(){ //如果插入失败，3s后再次尝试插入
                var watermark2=document.getElementsByClassName("__wm");
                watermark2[0].innerHTML=".test::after{ visibility: hidden }";
                document.head.appendChild(watermark2[0]);
            },3000);
        }
    },1000);
})();