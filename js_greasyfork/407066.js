// ==UserScript==
// @name         相槌くん(人狼)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  会話中に相手が興味のない話を延々とし始めた時に便利なスクリプトです。ボタンを押すだけで適当に相槌を打ってくれます。
// @author       waki285
// @match       *.zinro.net/m/*
// @exclude     *.zinro.net/m/*/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407066/%E7%9B%B8%E6%A7%8C%E3%81%8F%E3%82%93%28%E4%BA%BA%E7%8B%BC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407066/%E7%9B%B8%E6%A7%8C%E3%81%8F%E3%82%93%28%E4%BA%BA%E7%8B%BC%29.meta.js
// ==/UserScript==
(() => {
  'use strict';
  const say = text => {
    $("#post_form_single").val(text + " ".repeat(Math.random * 10));
    $("#post_btn").click();
  };
  const main = () => {
    var random = Math.floor(Math.random() * 12) + 1;
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
    case 11:
      say("ふむふむ");
      break;
    case 12:
      say("ほうほう");
      break;
    }
  };
  $('<button>', {
    text: "相槌くん"
  }).click(main).appendTo($('#post_btn').parent())
})();