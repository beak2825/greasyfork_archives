// ==UserScript==
// @name         「ふむ」(Feederチャット)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  「ふむ」と言ってくれます。たまに顔文字がつきます
// @author       Rlclr
// @match       *.x-feeder.info/*/
// @exclude     *.x-feeder.info/*/*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526950/%E3%80%8C%E3%81%B5%E3%82%80%E3%80%8D%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526950/%E3%80%8C%E3%81%B5%E3%82%80%E3%80%8D%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.meta.js
// ==/UserScript==
(() => {
  'use strict';
  const getInput = () => {
    const single = $('#post_form_single');
  
    if (single.css('display') !== 'none') {
      return single;
    }
  
    return $('#post_form_multi');
  };
 
  const say = text => {
   getInput().val(text + " ".repeat(Math.random * 10));
    $("#post_btn").click();
  };
  const main = () => {
    var random = Math.floor(Math.random() * 10) + 1;
    switch (random) {
    case 1:
      say("ふむ");
      break;
    case 2:
      say("ふむ");
      break;
    case 3:
      say("ふむ");
      break;
    case 4:
      say("ふむ");
      break;
    case 5:
      say("ふむ");
      break;
    case 6:
      say("ふむ");
      break;
    case 7:
      say("ふむ");
      break;
    case 8:
      say("ふむ");
      break;
    case 9:
      say("ふむ");
      break;
    case 10:
      say("ふむ('ω')");
      break;
    }
  };
  $('<button>', {
    text: "ふむ"
  }).click(main).appendTo($('#post_btn').parent())
})();