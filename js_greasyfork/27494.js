// ==UserScript==
// @name        himado To HTML5 Script (former To Flash Script)
// @namespace   Scottie400
// @include     http://himado.in/*
// @exclude     http://himado.in/
// @exclude     http://himado.in/?keyword*
// @exclude     http://himado.in/?mode*
// @exclude     http://himado.in/?sort*
// @version     2.01
// @grant       none
// @description ひまわり動画において、終了したFlashの使用を避け、自動でHTML5プレイヤーに移動するスクリプトです。
/* ***************************************************************************************************************
 ◆ひまわり動画において、不具合の多いHTML5から自動でFlashプレイヤーに移動するスクリプト……でしたが、
 　Flashが終了したことに伴い、自動でHTML5プレイヤーに移動するスクリプトです。
 　運営さんには早めにFlashプレイヤーを廃止して欲しいところです。

 ◆Greasemonkey(firefox)、Tampermonkey(Chorome,Opera)というアドオンが必要です。
 　導入方法はこちらを要参照 ⇒ http://dic.nicovideo.jp/a/greasemonkey
 　ユーザースクリプトとは？ ⇒ https://greasyfork.org/

 ※Last Update : 2021-05-12
 ※ご使用は自己責任でお願いします。責任を負いかねます。
 ※推奨環境：Win7が普通に動く程度を満たすスペック・ちゃんと更新しているブラウザ
*************************************************************************************************************** */
// @downloadURL https://update.greasyfork.org/scripts/27494/himado%20To%20HTML5%20Script%20%28former%20To%20Flash%20Script%29.user.js
// @updateURL https://update.greasyfork.org/scripts/27494/himado%20To%20HTML5%20Script%20%28former%20To%20Flash%20Script%29.meta.js
// ==/UserScript==


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 編集不要範囲 ここから

$(function(){
    if(document.URL.match(/\/\d{6}$/)) {
      window.location.replace("http://himado.in/?id=" + $(location).attr('pathname').replace(/\//g,''));
      return false;
   } else if(document.URL.match(/\&flashplayer&sid=/)) {
      preventDefault();
      return false;
   } else if(document.URL.match(/\&flashplayer/)) {
      window.location.replace("http://himado.in/" + $(location).attr('search').replace(/\&flashplayer/g,''));
      return false;
   }
})();

// 編集不要範囲 ここまで
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////