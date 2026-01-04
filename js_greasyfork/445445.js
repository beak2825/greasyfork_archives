// ==UserScript==
// @name              NT动漫去广告
// @version           40
// @author            KA
 
// @description       www.ntyou.cc去广告
// @license MIT
 
// @include *://*.ntyou.cc/*
// @namespace https://greasyfork.org/users/917798
// @downloadURL https://update.greasyfork.org/scripts/445445/NT%E5%8A%A8%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/445445/NT%E5%8A%A8%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function(){
    setInterval(function(){
         var child=document.getElementById("HMRichBox");
         if(child !=null){
             document.body.removeChild(child);
             }
         },300)
    setInterval(function(){
         var child=document.getElementById("HMcoupletDivright");
         if(child !=null){
             document.body.removeChild(child);
             }
         },300)
    setInterval(function(){
         var child=document.getElementById("HMcoupletDivleft");
         if(child !=null){
             document.body.removeChild(child);
             }
         },300)

})()