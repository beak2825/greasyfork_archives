 // ==UserScript==
 // @name 消える投稿(Feederチャット)
 // @author 初投稿マン
 // @version 2.0
 // @description 入力欄に文字を入れてボタンを押すと一定時間で消える投稿をしてくれます。
 // @match *.x-feeder.info/*/
 // @exclude *.x-feeder.info/*/*/*
 // @namespace https://greasyfork.org/users/297030
 // @grant none
// @downloadURL https://update.greasyfork.org/scripts/382428/%E6%B6%88%E3%81%88%E3%82%8B%E6%8A%95%E7%A8%BF%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/382428/%E6%B6%88%E3%81%88%E3%82%8B%E6%8A%95%E7%A8%BF%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.meta.js
 // ==/UserScript==
 (() => {
   'use strict'
   const func = () => {
     $("#post_form_single").val(hoge);
     $("#post_btn").click();
     setTimeout(() => {
       $(".remove_icon").first().click();
       window.confirm = () => {
         return true;
       };
     }, 500);
   };
   let hoge;
   $("<button>").text("消える投稿").prependTo($("#post_btn").parent()).click(func);
   $("<input>").attr('placeholder', '投稿したい内容').prependTo($("#post_btn").parent()).change(function () {
     hoge = $(this).val();
   });
 })();