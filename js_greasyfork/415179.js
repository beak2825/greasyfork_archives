// ==UserScript==
// @name         BT之家 去页面广告
// @namespace    hoowong
// @version      1.0beta
// @description  BTBTT NOAD
// @author       beautyears
// @match        *://www.btbtt.net/*
// @match        *://www.btbtt.co/*
// @match        *://www.btbtt.me/*
// @match        *://www.btbtt.pw/*
// @match        *://www.btbtt.la/*
// @match        *://www.btbtt.us/*
// @match        *://www.88btbtt.com/*
// @match        *://www.51btbtt.com/*
// @match        *://www.52btbtt.com/*
// @match        *://www.91btbtt.com/*
// @match        *://www.mebtbtt.com/*
// @match        *://www.btbtt.life/*
// @match        *://www.btbtt.live/*
// @match        *://www.btbtt.xyz/*
// 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415179/BT%E4%B9%8B%E5%AE%B6%20%E5%8E%BB%E9%A1%B5%E9%9D%A2%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/415179/BT%E4%B9%8B%E5%AE%B6%20%E5%8E%BB%E9%A1%B5%E9%9D%A2%E5%B9%BF%E5%91%8A.meta.js
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