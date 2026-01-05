// ==UserScript==
// @name        himado BanUser Cleaner
// @namespace   Scottie400
// @include     http://himado.in/*
// @version     1.00
// @grant       none
// @description ひまわり動画において、「この投稿者の動画を非表示」の機能を補強するスクリプトです。
/* ***************************************************************************************************************
 ◆ひまわり動画において、「この投稿者の動画を非表示」の機能を補強するスクリプトです。
   デフォルトの機能では、見たくない・邪魔であるユーザーは「非表示設定動画」と表示が残ってしまいますが、
   半透明にして目立たなくしたり、完全に消すことが出来ます。
   編集内容は4項目のみで簡潔です。
   
   機能が重複するため「himado GoodByeTop Script」との併用は出来ません。

 ◆Greasemonkey(firefox)、Tampermonkey(Chorome,Opera)というアドオンが必要です。
   導入方法はこちらを要参照 ⇒ http://dic.nicovideo.jp/a/greasemonkey
   ユーザースクリプトとは？ ⇒ https://greasyfork.org/

 ※Last Update : 2016-11-18
 ※ご使用は自己責任でお願いします。責任を負いかねます。
 ※設定後にページが変わらないままになる場合は設定の仕方が間違っています。見直しましょう。
 ※推奨環境：Win7が普通に動く程度を満たすスペック・ちゃんと更新しているブラウザ
*************************************************************************************************************** */
// @downloadURL https://update.greasyfork.org/scripts/24922/himado%20BanUser%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/24922/himado%20BanUser%20Cleaner.meta.js
// ==/UserScript==
//◆ご注意 ～ 編集が終わったら「保存」を忘れずに！◆//


/*--------------------------------------------------------------------------------------------------
◇「非表示設定動画」の完全消去（４項目）◇
　ひまわり動画の機能である「非表示ユーザー設定」で消した「非表示設定動画」を完全に消し去ります。非常にオススメ。
--------------------------------------------------------------------------------------------------*/
//◆Ａ◆ 変更する必要は特にありません。
var AdmissionN = ['非表示設定動画'];

//◆Ｂ◆「非表示設定動画」の削除の仕方を決めます。「true;」で完全削除、「false;」で半透明表示（◆Ｃ◆で調整可）です。
var RemoveN = true;

//◆Ｃ◆「非表示設定動画」の半透明度（不透明度）を決めます。数値は0.0～1.0まで。リンクは生きたままになります。
var OpacityN = [0.2];

//◆Ｄ◆「Youtube "無差別削除" 設定」です。
//  Youtubeの登録すべて削除or半透明化てしまいたい人向け。すっきりはしますが、何らかを見逃す可能性もあるためあまりお薦めしません。
//◆すべて削除してしまいたい場合は「true;」、設定しない場合は「false;」と入力。
var NoYouT = false;




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 編集不要範囲 ここから
var Nodes1 = document.getElementsByClassName('movieBox floatLeft');
var TitleALL1 = document.getElementsByClassName('top_new_movie_title');
var Nodes2 = document.getElementsByClassName('thumbblock_3colum');
var TitleALL2 = document.getElementsByClassName('thumbtitle');
  var numT1 = TitleALL1.length;
  var numT2 = TitleALL2.length;
  var numN = AdmissionN.length;


$('table#thumb').after('<div id="MovieBox"></div>');
$('#MovieBox').css('cssText', 'width:852px; margin-top:0px; margin-left:0px; overflow:auto!important; text-align:left;');

Back0: for (var b = numT2-1; b >= 0; b--) {
  $(Nodes2[b]).prependTo('#MovieBox').css({'width':'282px', 'height':'255px', 'display':'inline-block', 'border':'1px solid #888', 'border-radius':'6px', 'padding':'0px', 'float':'unset', 'overflow':'hidden'});
  continue Back0;
}

if(RemoveN === true){
Back1: for (var d = numT1-1; d >= 0; d--) {
  var bodyInnerText1 = TitleALL1[d].innerHTML;
  for (var e = 0; e < numN; e++) {
    var isExist1 = bodyInnerText1.indexOf(AdmissionN[e])!== -1;
      if(isExist1 === true) {
         $(Nodes1[d-1]).css({'visibility':'collapse'}); //.remove();
         continue Back1;
       }
  }
}
Back2: for (var f = numT2-1; f >= 0; f--) {
  var bodyInnerText2 = TitleALL2[f].innerHTML;
  for (var g = 0; g < numN; g++) {
    var isExist2 = bodyInnerText2.indexOf(AdmissionN[g])!== -1;
      if(isExist2 === true) {
         $(Nodes2[f]).remove(); //.css({'visibility':'collapse'});
         continue Back2;
      }
  }
}
var Nodes3 = document.getElementsByClassName('thumbblock_3colum');
var TitleALL3 = document.getElementsByClassName('thumbtitle');
  var numT3 = TitleALL3.length;
Back3: for (var h = numT3-1; h >= 0; h--) {
  var isExist3 = Nodes3[h].innerHTML;
  var isExistYT = isExist3.indexOf("www.youtube.com")!== -1;
    if(NoYouT === true && isExistYT === true){
       $(Nodes3[h]).remove(); //.css({'visibility':'collapse'});
       continue Back3;
    }
}
}
else {
Back1: for (var d = numT1-1; d >= 0; d--) {
  var bodyInnerText1 = TitleALL1[d].innerHTML;
  for (var e = 0; e < numN; e++) {
    var isExist1 = bodyInnerText1.indexOf(AdmissionN[e])!== -1;
      if(isExist1 === true) {
         $(Nodes1[d-1]).css({opacity: OpacityN});
         continue Back1;
       }
  }
}
Back2: for (var f = numT2-1; f >= 0; f--) {
  var bodyInnerText2 = TitleALL2[f].innerHTML;
  for (var g = 0; g < numN; g++) {
    var isExist2 = bodyInnerText2.indexOf(AdmissionN[g])!== -1;
      if(isExist2 === true) {
         $(Nodes2[f]).css({opacity: OpacityN});
         continue Back2;
      }
  }
}
var Nodes3 = document.getElementsByClassName('thumbblock_3colum');
var TitleALL3 = document.getElementsByClassName('thumbtitle');
  var numT3 = TitleALL3.length;
Back3: for (var h = numT3-1; h >= 0; h--) {
  var isExist3 = Nodes3[h].innerHTML;
  var isExistYT = isExist3.indexOf("www.youtube.com")!== -1;
    if(NoYouT === true && isExistYT === true){
       $(Nodes3[h]).css({opacity: OpacityN});
       continue Back3;
    }
}
}
// 編集不要範囲 ここまで
////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */