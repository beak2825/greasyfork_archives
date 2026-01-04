// ==UserScript==
// @name         BT之家宽屏+去广告
// @namespace    beautyears
// @version      0.0.2
// @description  BT之家宽屏显示+去广告
// @author       beautyears
// @match        *://www.btbtt.net/*
// @match        *://www.btbtt.co/*
// @match        *://www.btbtt.me/*
// @match        *://www.btbtt.pw/*
// @match        *://www.btbtt.la/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41109/BT%E4%B9%8B%E5%AE%B6%E5%AE%BD%E5%B1%8F%2B%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/41109/BT%E4%B9%8B%E5%AE%B6%E5%AE%BD%E5%B1%8F%2B%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
var bttmp=null;
$('body').css('background','none');
for(var i=0;i<100;i++){
  bttmp=$('body *')[0];
  if(bttmp.id=='wrapper1')
    break;
  $(bttmp).remove();
}
$('.width').css({'max-width':'90%','width':'90%'});