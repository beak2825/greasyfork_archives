// ==UserScript==
// @name         虎牙自动领宝箱
// @namespace    https://greasyfork.org/
// @version      2.1
// @description  定时轮询开箱
// @author       Cosil
// @include        *www.huya.com/*
// @downloadURL https://update.greasyfork.org/scripts/383659/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E9%A2%86%E5%AE%9D%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/383659/%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E9%A2%86%E5%AE%9D%E7%AE%B1.meta.js
// ==/UserScript==
$(function() {
     var t2 = setInterval(function(){
          //console.log("t2 is live");
          var box = $(".player-box-stat3");
          if($(box[5]).parent().children("p")[3].innerHTML == ""){
               box.each(function(){
                    if(this.style.visibility=="visible"){
                         this.click();
                         $("#player-box")[0].style.display="none";
                    }
               });
          }else{
          clearInterval(t2);
          console.log("宝箱已领取完毕");
          }
     }, 10000);
})