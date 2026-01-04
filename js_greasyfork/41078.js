// ==UserScript==
// @name        Clipstreams UserHide Script
// @namespace   Scottie400
// @include     http://clipstreams.net/videos.php*
// @version     1.02
// @grant       none
// @description Clipstreams.netにおいて、特定のユーザーを表示しないように出来るスクリプトです。
/* ***************************************************************************************************************

 ◆Clipstreams.netにおいて、特定のユーザーを表示しないように出来るスクリプトです。
   デフォルトではNG機能が無いため、簡易的に非表示にすることを可能にしました。
   毎日のように複数投稿するユーザーが多いため、
   最初から追う予定のないユーザーを消せるようにすることで見逃し防止に役立ちます。
   編集内容は1項目のみです。

 ◆Greasemonkey(firefox)、Tampermonkey(Chorome,Opera)というアドオンが必要です。
 　導入方法はこちらを要参照 ⇒ http://dic.nicovideo.jp/a/greasemonkey
 　ユーザースクリプトとは？ ⇒ https://greasyfork.org/

 ※Last Update : 2018-08-05
 ※ご使用は自己責任でお願いします。責任を負いかねます。
 ※設定後にページが変わらないままになる場合は設定の仕方が間違っています。見直しましょう。
 ※推奨環境：Win7が普通に動く程度を満たすスペック・ちゃんと更新しているブラウザ
*************************************************************************************************************** */
// @downloadURL https://update.greasyfork.org/scripts/41078/Clipstreams%20UserHide%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/41078/Clipstreams%20UserHide%20Script.meta.js
// ==/UserScript==
//◆ご注意 ～ 編集が終わったら「保存」を忘れずに！◆//



//◆１◆「投稿者 "非表示" 設定」です。
//　非表示したい投稿者のユーザー名で指定します。基本的にすべてのページに適応。
//◆下記のように「'***',」と羅列していきます。最後だけは「,」を書かないこと。見やすく改行しても大丈夫。
//　記入例 var AdmissionN = ['牛乳', 'たまご', '食パン'];
//◆編集が終わったら「保存」を忘れずに！
var AdmissionN = [
  '牛乳',
  'たまご',
  '食パン'
];



/////////////////////////////////////////////////////////////////////////////////////////////////////
//◆編集不要範囲 ここから
$(function () {
  $('.pagination').prependTo('#content');
  $('.pagination').css({'margin-top':'10px', 'margin-bottom':'25px'});
});

var Nodes1 = document.getElementsByClassName('video_list2');
var TitleALL1 = document.getElementsByClassName('views_center2');
  var numT1 = TitleALL1.length;
  var numN1 = AdmissionN.length;
Back1: for (var f = numT1-1; f >= 0; f--) {
  var bodyInnerText1 = TitleALL1[f].innerHTML;
  for (var g = 0; g < numN1; g++) {
    var isExist1 = bodyInnerText1.indexOf(AdmissionN[g])!== -1;
      if(isExist1 === true) {
         $(Nodes1[f]).remove();
         continue Back1;
      }
  }
}

var Nodes2 = document.getElementsByClassName('video_list4');
var TitleALL2 = document.getElementsByClassName('views_center');
  var numT2 = TitleALL2.length;
  var numN2 = AdmissionN.length;
Back2: for (var f = numT2-1; f >= 0; f--) {
  var bodyInnerText2 = TitleALL2[f].innerHTML;
  for (var g = 0; g < numN2; g++) {
    var isExist2 = bodyInnerText2.indexOf(AdmissionN[g])!== -1;
      if(isExist2 === true) {
         $(Nodes2[f]).remove();
         continue Back2;
      }
  }
}
//◆編集不要範囲 ここまで
////////////////////////////////////////////////////////////////////////////////////////////////////