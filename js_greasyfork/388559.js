// ==UserScript==
// @name         2019公需科目去验证框
// @namespace    http://www.44886.com/
// @version      0.6
// @description  2019公需科目去验证框，可以长时间挂着，不用输入验证码。注意：一定要把观看的浏览器标签放最前面才行哦~~
// @author       44886.
// @match        https://rcpx.21tb.com/els/html/courseStudyItem/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388559/2019%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%8E%BB%E9%AA%8C%E8%AF%81%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/388559/2019%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%8E%BB%E9%AA%8C%E8%AF%81%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer;
    timer=setInterval(function(){
        console.log($(".layui-layer-shade").html());
        if($(".layui-layer-shade").html()!=null){
            window.location.reload();
        }
        /*检测小课程是否已经学完，学完刷新到下一课*/
        var must = parseInt($("#minStudyTime").text());
        var aleady = parseInt($("#studiedTime").text());
          if (must>0 && aleady>=must) {
              console.log("小课程学完了，刷新");
              document.location.reload();
          }else{
              console.log("还没完成:"+aleady+'/'+must);
          }

    },5000);
})();