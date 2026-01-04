// ==UserScript==
// @name        DbBt
// @namespace   Violentmonkey Scripts
// @match       *://javdb.com/*
// @require      http://code.jquery.com/jquery-migrate-1.2.1.min.js
// @grant       none
// @version     1.1
// @author      -
// @description 2023/1/26 17:43:30
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458892/DbBt.user.js
// @updateURL https://update.greasyfork.org/scripts/458892/DbBt.meta.js
// ==/UserScript==
//

(function() {
  'use strict';
  $(document).ready(function() {
    console.log("loading");
    let timer = setInterval(function(){
      try{
        if($('#fanHaoA').length == 0){
          let preFix = '';
          let subFix = '';
          let pushTime = document.querySelector("body > section > div > div.video-detail > div.video-meta-panel > div > div:nth-child(2) > nav > div:nth-child(2) > span").textContent;
          let year = new Date(pushTime).getFullYear();
          if(year <= '2019'){
            preFix = 'hd ';
            subFix = '';
          }else{
            preFix = '';
            subFix = ' 2k';
          }
          let fanHaoDiv = document.querySelector("body > section > div > div.video-detail > h2 > strong:nth-child(1) > savdiv");
          let fanHao = preFix + fanHaoDiv.textContent + subFix;
          console.log("番号："+ fanHao);
          let aHtml1 = '<a id="fanHaoA"href="https://bt4g.org/search/' + fanHao + '" target="_blank">';
          let buttonHtml = '<img src="https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/magnet00.png" href="https://bt4g.org/search/' + fanHao + '"';
          let st1 = 'style="z-index:9123456789;display:inline-block;cursor:pointer;margin:0px 5px 2px;border-radius:50%;border:0px;vertical-align:middle;outline:none!important;padding:0px!important;height:20px!important;width:20px!important;left:0px!important;top:0px!important;"';
          let st2 = '/>';
          let aHtml2 = '</a>';
          $(fanHaoDiv).parent().after(aHtml1+buttonHtml+st1+st2+aHtml2);
          console.log("番号按钮已添加");
        }else{
          console.log("番号按钮已存在");
          clearInterval(timer);
        }
      }catch(error){

      }
      console.log("end");
    }, 100);
  });
})();