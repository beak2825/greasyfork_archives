// ==UserScript==
// @name         相槌くん(Feederチャット)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  会話中に相手が興味のない話を延々とし始めた時に便利なスクリプトです。ボタンを押すだけで適当に相槌を打ってくれます。
// @author       反物質ムショクニウム
// @match       *.x-feeder.info/*/
// @exclude     *.x-feeder.info/*/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386058/%E7%9B%B8%E6%A7%8C%E3%81%8F%E3%82%93%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/386058/%E7%9B%B8%E6%A7%8C%E3%81%8F%E3%82%93%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.meta.js
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
      say("うん");
      break;
    case 2:
      say("へえ");
      break;
    case 3:
      say("草");
      break;
    case 4:
      say("あー");
      break;
    case 5:
      say("なるほど");
      break;
    case 6:
      say("マジ？");
      break;
    case 7:
      say("ほう");
      break;
    case 8:
      say("確かに");
      break;
    case 9:
      say("そうなのか");
      break;
    case 10:
      say("ほえー");
      break;
    }
  };
  $('<button>', {
    text: "相槌くん"
  }).click(main).appendTo($('#post_btn').parent())
})();