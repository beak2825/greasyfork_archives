// ==UserScript==
// @name         私人刷题
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  仅供私人使用
// @author       Vcbal
// @match        https://ggfw.hrss.gd.gov.cn/zxpx/auc/play/player*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483225/%E7%A7%81%E4%BA%BA%E5%88%B7%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/483225/%E7%A7%81%E4%BA%BA%E5%88%B7%E9%A2%98.meta.js
// ==/UserScript==
setTimeout(function(){
    if($($($('.outter')[0]).parent('.prism-big-play-btn')).css('display')=='block'){
        $('.outter')[0].click();
    }
    p.on("ended", function() {
      $('body').stopTime();
      p.dispose;
      overWatch();
    });
    map = {};
  }, 1000);