 // ==UserScript==
 // @name         mafBailey
 // @namespace    GeorgeBailey.GeorgeBailey
 // @version      0.3
 // @description  Website Improvement
 // @author       You
 // @match        *forum.mafiascum.net*
 // @grant        none
 // @include      *forum.mafiascum.net*
 // @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/409310/mafBailey.user.js
// @updateURL https://update.greasyfork.org/scripts/409310/mafBailey.meta.js
 // ==/UserScript==

  try {

     $(document).ready(function(){

     $("body *").contents().each(function() {
       if(this.nodeType==3){
         this.nodeValue = this.nodeValue.replace(/\w+/g, 'GeorgeBailey')
       }



     });

 })

 function addGlobalStyle(css) {
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css;
   head.appendChild(style);
 }






       var imgs = document.getElementsByTagName("img");
 for(var i=0, l=imgs.length; i<l; i++) {
 imgs[i].src = "https://cdn.drawception.com/images/panels/2017/8-18/3saj57KB5m-2.png";
 }


       var a = document.getElementsByTagName("div");
 for(var x=0, c=a.length; x<c; x++) {
 addGlobalStyle('div {  background-image: url("https://thedailyeconomy.org/wp-content/uploads/2024/06/Max_Stirner.jpg"); }');
 }

addGlobalStyle('body {  background-image: url("https://i.imgur.com/wjx16lY.png"); }');

  } catch(e) {
     console.log("GeorgeBailey");
  }
