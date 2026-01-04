// ==UserScript==
// @name            蛋蛋常去网站去广告
// @version         1.0
// @author          D
// @description     广告很烦人
// @include         *://www.dmmbus*
// @namespace       蛋蛋帅过吴彦祖

// @downloadURL https://update.greasyfork.org/scripts/381290/%E8%9B%8B%E8%9B%8B%E5%B8%B8%E5%8E%BB%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/381290/%E8%9B%8B%E8%9B%8B%E5%B8%B8%E5%8E%BB%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
;(function() {

  'use strict'
  //javbus
  //顶部广告
  var ad = document.getElementsByClassName("ad-table");
  var i;
  for (i = 0; i < ad.length; i++) {
    ad[i].style.display = "none";
  }
  //底部广告
  var ad2 = document.getElementsByClassName("ptb10");
  var ad2par=ad2[0].parentNode; //找到父级节点
  ad2par.style.display = "none";
  //中间广告
  var ad3 = document.getElementsByClassName("pt10");
  //console.log(ad3.length);
  for (i = 0; i < ad3.length; i++) {
    ad3[i].style.display = "none";
  }
})()
