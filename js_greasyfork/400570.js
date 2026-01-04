// ==UserScript==
// @name        央行网院
// @namespace   Violentmonkey Scripts
// @match        http://www.pbcstu.cn/*
// @grant        unsafeWindow
// @version     4.4
// @author      -
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @description  1、解除网页禁止复制功能，便于考试时复制题目。2、自动播放下一章节视频。
// @downloadURL https://update.greasyfork.org/scripts/400570/%E5%A4%AE%E8%A1%8C%E7%BD%91%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/400570/%E5%A4%AE%E8%A1%8C%E7%BD%91%E9%99%A2.meta.js
// ==/UserScript==

(function() {
  'use strict';
  console.log("start.....");
  
  
  $(document).ready(function(){
    
    //原网页不允许选择复制，此处代码解除该功能。
    document.body.onselectstart = function () {return true;};
    
    //自动进入下一章节播放视频。
    //function confirm(){return true;}
    //documnet.body.confirm = function(s){return true;};
    var txt =`<script type="text/javascript">function confirm(str){return true;}</script>`;
    $("body").prepend(txt);
  });

})();