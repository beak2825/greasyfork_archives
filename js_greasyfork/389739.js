// ==UserScript==
// @name        图片站辅助脚本
// @namespace   https://greasyfork.org/users/14059
// @description 辅助,把大图显示为小图等,也可以屏蔽各种多余内容,完全的自定义
// @include     https://www.uu131.net/*
// @include     https://www.7tuba.net/*
// @include     https://www.ku137.net/*
// @require     http://cdn.staticfile.org/jquery/3.1.1/jquery.min.js
// @author      setycyas
// @version     1.02
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/389739/%E5%9B%BE%E7%89%87%E7%AB%99%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/389739/%E5%9B%BE%E7%89%87%E7%AB%99%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function(){
  /* 脚本正式开始 */

  'use strict';
  console.log("图片大小变更辅助脚本运行中!");
  var $jq = $.noConflict();

  /****************************************
  ######## version 1.02,20190904 ###########
  ######## 脚本正式开始 ###################
  ****************************************/

  /* Global Variable */
  var yuming_G = (window.location+'').split('/')[2]; // 域名

  /* Functions */
  function main(){
    //www.7tuba.net,7图吧,或www.ku137.net,ku137图片站,是同一个代码的
    if (yuming_G == 'www.7tuba.net' || yuming_G == 'www.ku137.net'){
      console.log('检测到现在的域名是:www.7tuba.net,运行对应脚本');
      $jq('div.content img.tupian_img').css({'width':'300px'});
      //$jq('.center').css({'display':'none'});
      $jq('.center').remove();
      $jq('.dibu1').remove();
      $jq('.dibu2').remove();
    }
    //www.uu131.net,uu131吧
    if (yuming_G == 'www.uu131.net'){     
      console.log('检测到现在的域名是:www.uu131.net,运行对应脚本');
      $jq('div.contentc img.tupian_img').css({'width':'300px'});
      //$jq('.dibu1').css({'display':'none'});
      //$jq('.dibu2').css({'display':'none'});
      $jq('.dibu1').remove();//没什么卵用,一样会加载,与display:none差不了太多
      $jq('.dibu2').remove();
    }
  }
  
  /* Main Script */
  $jq(document).ready(main);

/* 脚本结束 */
})();
