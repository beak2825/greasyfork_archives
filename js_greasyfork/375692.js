// ==UserScript==
// @name 禁止小草检测abp及其他广告清理
// @namespace Violentmonkey Scripts
// @include     http*://*t66y.com/*
// @include     http*://*xn--zbsq6i.tk/*
// @include     http*://*xn--r8vr95c.ml/*
// @include     http*://其他域名自行添加，中文需要转换成以上格式/*
// @grant none
// @version 0.0.1.20181220145615
// @description 小草站会检测abp，并且贴子内容的广告非常不好清除。\r\n比如 第六天魔王 发的贴子，内容中非常多的广告。\r\n可能随时会更新代码。
// @downloadURL https://update.greasyfork.org/scripts/375692/%E7%A6%81%E6%AD%A2%E5%B0%8F%E8%8D%89%E6%A3%80%E6%B5%8Babp%E5%8F%8A%E5%85%B6%E4%BB%96%E5%B9%BF%E5%91%8A%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/375692/%E7%A6%81%E6%AD%A2%E5%B0%8F%E8%8D%89%E6%A3%80%E6%B5%8Babp%E5%8F%8A%E5%85%B6%E4%BB%96%E5%B9%BF%E5%91%8A%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==
spinit = function(){};
(function() {
  readS1= null;
  readS= null;
  r1eadS = null;
  adhtml = null;
  
  $(".tpc_content iframe").remove();
  
  var _keywords = ["【影片名稱】","種子連結","MP4"];
  var _keywords_in = false;
  
  var ttt_html = $(".tpc_content").eq(0).html();
  $.each(_keywords,function(i, _n){
    var ttt = ttt_html.split(_n);
    if( typeof(ttt[1]) != "undefined" && !_keywords_in){
      _keywords_in = true;
      ttt[0] = "";
      $(".tpc_content").eq(0).html(ttt.join(_n).replace(/(<br\s?\/?>)+/gi, '$1').replace(/(<br\s?\/?>\s?&nbsp;)+/gi, '$1'));
    }
  });
  
  
  //$(".tpc_content").html().replace( /([a-z])+/g,'qqq' );
  /*
  if( _keywords_in){
      //无相应关键词
      $(".tpc_content:eq(0) a[href^='http://www.viidii.info']").each(function(i){
         //console.log($(this).attr("href"));
         if( $(this).text().indexOf("http://") == -1){
            //$(this).remove();
         }
      });
      
      $(".tpc_content:eq(0) img[data-link]").each(function(i){
         console.log($(this).attr("data-link"),this.width,this.height);
          if (!this.complete || (typeof this.naturalWidth == "undefined" && this.naturalWidth == 0) || !this.src) {
            console.log('删除',this.complete);
            //$(this).remove();
          }
      });    
  }
  */

  $(".tpc_content:eq(0) a").each(function(i){
    if( $(this).text().indexOf("以下內容被隱藏") != -1){
      $(this).remove();
    }
    if( $(this).text().indexOf("點擊這里打開新視窗") != -1){
      $(this).remove();
    }
  });  
  
 // $(".tpc_content").eq(0).html($(".tpc_content").eq(0).replace(/(<br\s?\/?>\|)+/gi, '$1')/gi, '$1'));
  
})();