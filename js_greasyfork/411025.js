// ==UserScript==
// @name                      dy最低分辨率
// @version                   1.059
// @description               斗鱼
// @author                    hwh
// @match                     *://*.douyu.com/0*
// @match                     *://*.douyu.com/1*
// @match                     *://*.douyu.com/2*
// @match                     *://*.douyu.com/3*
// @match                     *://*.douyu.com/4*
// @match                     *://*.douyu.com/5*
// @match                     *://*.douyu.com/6*
// @match                     *://*.douyu.com/7*
// @match                     *://*.douyu.com/8*
// @match                     *://*.douyu.com/9*
// @match                     *://*.douyu.com/topic/*
// @match                     *://www.douyu.com/member/cp/getFansBadgeList
// @match                     *://passport.douyu.com/*
// @match                     *://msg.douyu.com/*
// @match                     *://yuba.douyu.com/*
// @match                     *://v.douyu.com/*
// @match                     *://cz.douyu.com/*
// @require                   http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant                     GM_openInTab
// @grant                     GM_xmlhttpRequest
// @grant                     GM_setClipboard
// @grant                     GM_setValue
// @grant                     GM_getValue
// @grant                     GM_listValues
// @grant                     GM_deleteValue
// @grant                     GM_cookie
// @grant                     GM_registerMenuCommand
// @grant                     unsafeWindow
// @connect                   douyucdn.cn
// @connect                   douyu.com
// @connect                   122.51.5.63
// @connect                   greasyfork.org
// @antifeature               tracking
// @namespace Test FBL
// @downloadURL https://update.greasyfork.org/scripts/411025/dy%E6%9C%80%E4%BD%8E%E5%88%86%E8%BE%A8%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/411025/dy%E6%9C%80%E4%BD%8E%E5%88%86%E8%BE%A8%E7%8E%87.meta.js
// ==/UserScript==

"use strict";

if(!jQuery._FNB){jQuery._FNB={};jQuery._cnt=1;jQuery._cnt2=1;}
var _FBL={
  "FBL":[
    '流畅',
    '高清',
    '超清'
  ]
};
(function(w,$,c){
  $.extend(c,{
    init:function(){
        console.log('1111111111')
      var $t=$('#t_fbl_tb');
      if($t.length>0){$t.remove();}
      $('body').append('<div id="t_fbl_tb" style="position:fixed;right:30px;top:100px;z-index:999;width:165px;height:auto;border:1px solid #000;background-color:#fff;">'+
      '<div style="margin:1px;">&nbsp;'+
      '<input type="checkbox" id="t_fbl_ch" checked/>分辨率'+
      '</div>'+
      '</div>'
      );
    }
  });

})(window,jQuery,jQuery._FNB);// 扩展core

(function($){
  $._FNB.init();

setInterval(function(){
    $._cnt++;
    if($._cnt%4==0 ){
        if('0px'!=$('div .AnchorPocketTips').css('top')){
            $('div .AnchorPocketTips').css('top',0);
        }
        if('0px'!=$('div .SuperFansBubble').css('top')){
            $('div .SuperFansBubble').css('top',0);
        }
        if($('div .IconCardAdBoundsBox').length>0){
            $('div .IconCardAdBoundsBox').remove();
        }
        $._cnt=1;
    }

  var $ch=$('#t_fbl_ch');
  if($ch.is(':checked')){
    var flag=false;
    var $nFilm;
    for(var i=0;i<_FBL.FBL.length;i++){
      $nFilm=$("div[class^='rate'] div[class^='tip'] li:contains('"+_FBL.FBL[i]+"')");
      if(!!$nFilm && $nFilm.length>0 ){
        break;
      }
    }
    var $curFilm=$("div[class^='text'] div[class^='textLabel']");
    if(!!$nFilm && $nFilm.length>0&&_FBL.FBL[i]!=$curFilm.text().trim()){
        $nFilm.click();
    }
    var $stop=$('div[title="暂停"][class*="pause-"]');
      var $stop2=$('div[title="播放"][class*="play-"][class*="removed-"]');
     // console.log("1:"+$stop[0]+",2:"+$stop2[0])
    //var $msg=$('div[title="关闭弹幕"]');
      if(!!$stop2 && $stop2.length>0){
         $stop.click();
      }
    //if(!$stop.is(":hidden")){$stop.click();}
    //if(!$msg.is(":hidden")){$msg.click();}

  }
},5000);
})(jQuery);