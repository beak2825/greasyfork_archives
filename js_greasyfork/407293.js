// ==UserScript==
// @name         ACFun弹幕姬(仮)
// @namespace    https://queb.fun/
// @version      0.1
// @description  try to take over the world!
// @author       FairyScript
// @match        *://live.acfun.cn/live/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407293/ACFun%E5%BC%B9%E5%B9%95%E5%A7%AC%28%E4%BB%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407293/ACFun%E5%BC%B9%E5%B9%95%E5%A7%AC%28%E4%BB%AE%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  //const css = CSSF();
  //$('body').append($('<style>').html(css));

  let msgCount = 0;
  setTimeout(function () {
    console.log('start');
    const messageContainer = $('.live-feed-messages');
    messageContainer.on('scroll',function(){
      const msg = $(this).children();
      if(msg.length !== msgCount){
        msgCount = msg.length;
        const lastMsg = msg.last();
        const msgType = lastMsg.attr('class');
        switch(msgType){
          case 'gift': {
            const giftText = lastMsg.find('span').last().html();
            if(/香蕉/.test(giftText)) lastMsg.children('div').attr('class','gift-banana');
          }
        }
      }
    });
},2000);
})();