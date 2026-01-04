// ==UserScript==
// @name         BT之家宽屏+去广告
// @namespace    beautyears
// @version      0.0.3
// @description  BT之家宽屏显示+去广告
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
// @match        *://btbtt11.com/*
// @match        *://btbtt12.com/*
// @match        *://btbtt13.com/*
// @match        *://btbtt15.com/*
// @match        *://btbtt17.com/*
// @match        *://btbtt18.com/*
// @match        *://btbtt19.com/*
// @match        *://www.btbtt12.com/*
// @match        *://www.btbtt13.com/*
// @match        *://www.btbtt15.com/*
// @match        *://www.btbtt17.com/*
// @match        *://www.btbtt18.com/*
// @match        *://www.btbtt19.com/*
// @match        *://btbtt12.com/*
// @match        *://btbtt13.com/*
// @match        *://btbtt15.com/*
// @match        *://btbtt17.com/*
// @match        *://btbtt18.com/*
// @match        *://btbtt19.com/*
// @match        *://www.btbtt12.com/*
// @match        *://www.btbtt13.com/*
// @match        *://www.btbtt15.com/*
// @match        *://www.btbtt17.com/*
// @match        *://www.btbtt18.com/*
// @match        *://www.btbtt19.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406455/BT%E4%B9%8B%E5%AE%B6%E5%AE%BD%E5%B1%8F%2B%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/406455/BT%E4%B9%8B%E5%AE%B6%E5%AE%BD%E5%B1%8F%2B%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
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