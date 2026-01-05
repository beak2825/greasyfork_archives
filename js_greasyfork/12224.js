// ==UserScript==
// @name        himado Bugger Ban Script
// @namespace   Scottie400
// @include     http://himado.in/*
// @version     2.13
// @grant       none
// @description ひまわり動画において、さまざまな視聴の障害に対して自動で対処しスッキリ快適にするスクリプトです。
/* ***************************************************************************************************************
✔以前リリースした「himado User Ban Script」と「himado Author Comment Ban」を統合し改良・改名したものになります。

 ◆ひまわり動画において、さまざまな視聴の障害に対して自動で対処しスッキリ快適にするスクリプトです。
 　主に、不快な登録者のページや登録者コメントの非表示、バナーなどデザインを崩してしまう要素の排除等が可能です。
 　アカウントは「名前」と「番号」で自由に追加指定でき、
 　特定の文字列や6桁の数字がある場合は残す…という指定も可能にしてあります。
 　また、不意なネタバレ防止等のため、百害あって一利あまり無しなテキストコメント欄の非表示選択もできます。

 　「オプション」もありますので、最後の行まで全文をチェックしてからの利用を推奨します。

 ◆Greasemonkey(firefox)、Tampermonkey(Chorome,Opera)というアドオンが必要です。
 　導入方法はこちらを要参照 ⇒ http://dic.nicovideo.jp/a/greasemonkey
 　ユーザースクリプトとは？ ⇒ https://greasyfork.org/

 ※Last Update : 2016-10-08
 ※ご使用は自己責任でお願いします。責任を負いかねます。
 ※設定後にページが変わらないままになる場合は設定の仕方が間違っています。見直しましょう。
 ※推奨環境：Win7が普通に動く程度を満たすスペック・ちゃんと更新しているブラウザ
*************************************************************************************************************** */
// @downloadURL https://update.greasyfork.org/scripts/12224/himado%20Bugger%20Ban%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/12224/himado%20Bugger%20Ban%20Script.meta.js
// ==/UserScript==
//◆ご注意 ～ 編集が終わったら「保存」を忘れずに！◆//


/*--------------------------------------------------------------------------------------------------
◇デザイン崩れ防止設定（１項目）◇
　正直言いまして、この機能が一番有用です。察しの良い人のみ喜んでください。
　某AdBl◯ckでも消せないものまで抹消します。
--------------------------------------------------------------------------------------------------*/
//◆１◆「デザイン崩れ防止」……という名の「ひまわり上のア◯ｏ広◯の非表示設定」です。
//　利用したい場合は「true;」、利用しない場合は「false;」とだけ入力。
//◆いや僕は私は見たい！といった方以外は大抵true;のままで問題無いかと思います。
var Designsafe = true;



/*--------------------------------------------------------------------------------------------------
◇登録者コメントBAN機能設定（３項目）◇
　特定のユーザーアカウントの登録者コメントが目に触れないようにできます。
 「登録ページ全体BAN」と同じユーザーを指定はできますが、「登録ページ全体BAN」の方が優先です。
--------------------------------------------------------------------------------------------------*/
//◆２◆ここに「登録者コメントを消したいユーザーアカウントの指定」をしてください。
//　アカウント名で指定の場合は「敬称」部分は除外必須。ただしアカウント番号を指定した方が確実です。
//◆下記のように「'***',」と羅列していきます。最後だけは「,」を書かないこと。見やすく改行してもOK。
//　記入例 var BanUserName = ['ひまわり', 'no=456789', 'no=567890'];
//◆もし若いアカウント番号を指定したい場合は、「'no=333"'」と指定すると万が一の誤爆も無く安心です。
//◆使わない場合はそのまま未記入の空の1行のみで大丈夫です。必須。
var BanUserName1 = [
  'ひまわり',
  'no=456789',
  'no=567890'
];

//◆３◆「除外設定」です。指定の書き方はBanUserNameと同じ。
//◆文章中にこの単語が含まれるならば拒否対象ユーザーの登録主コメントであっても表示してもいい…、
//　この内容の可能性があるならば拒否対象であっても見たい……といった条件付けに使えます。
//◆Sの方は「/数字6桁」が含まれる場合消さないようにする設定です（わかる人のみイジってください）。
var AdmissionU1 = [

];
var AdmissionS = /\/\d{6,6}(?!\d)/;

//◆４◆「タイトル除外設定」です。指定の書き方はBanUserNameと同じ。
//◆用途は上の「除外設定」とほとんど同じです。
//◆例えば「お知らせ」「誘導」「追加」などと入れる。
var AdmissionT1 = [
  'お知らせ'
];



/*--------------------------------------------------------------------------------------------------
◇登録ページ全体BAN機能設定（３項目）◇
　見たくないユーザーの登録にアクセスしてしまっても、即時ブラックアウトし再生数増に加担しません。
　ちょっと見たい場合でも「元サイト」から見られるようにし、通報フォームは残しました。
--------------------------------------------------------------------------------------------------*/
//◆５◆ここには「登録ページ全体を非表示にしたいユーザーアカウントの指定」をしてください。
//　アカウント名で指定の場合は「敬称」部分は除外必須。ただしアカウント番号を指定した方が確実です。
//◆下記のように「'***',」と羅列していきます。最後だけは「,」を書かないこと。見やすく改行してもOK。
//　記入例 var BanUserName = ['ひまわり', 'no=456789', 'youtube.com'];
//◆もし若いアカウント番号を指定したい場合は、「'no=333"'」と指定すると万が一の誤爆も無く安心です。
//　特定の配信元自体をブロックしたい場合は、「'youtube.com'」などとURLの一部を追加すればOK。
//◆使わない場合はそのまま未記入の空の1行のみで大丈夫です。必須。
var BanUserName2 = [

];

//◆６◆「除外設定」です。指定の書き方はBanUserNameと同じ。
//◆この配信元ならば拒否対象ユーザーの登録であっても通してもいい…、
//　このユーザーならば拒否配信元であっても見たい……といった条件付けに使えます。
var AdmissionU2 = [

];

//◆７◆「タイトル除外設定」です。指定の書き方はBanUserNameと同じ。
//◆用途は上の「除外設定」とほとんど同じです。
//◆例えば「予告」「追加」などと入れる。
var AdmissionT2 = [
  '予告'
];

//◆８◆ は編集不要範囲内にある「編集可能範囲」を参照。
//◆オプション設定が２つありますが、需要はあまりない機能かも？



/*--------------------------------------------------------------------------------------------------
◇テキストコメント非表示設定（１項目）◇
　テキコメで無用にヒートアップして時間を潰してしまうような人にもオススメ。
--------------------------------------------------------------------------------------------------*/
//◆９◆「テキストコメント表示設定」です。
//　表示したい場合は「true;」、非表示にしたい場合は「false;」とだけ入力。
var NoTC = true;





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 編集不要範囲 ここから
if(Designsafe === true) {
    if($('.l-cnt-100_box10, #main_title_body').length) {
      $('.l-cnt-100').css('cssText', 'max-width:1200px!important; width:1200px!important;');
    }
    $('iframe').css('height', '0px');
    $('#as-sys, .ad_player, .barrage, #cndxh, .l-cnt-100_box10, .l-cnt-100_box30, #player_ad_window, #group_link, #lianyue_single_header_ad, #sh_fc2footer_fix, a[target="_blank"] img, iframe, .m-fter-wp').remove();
}
$('.m-hder-101_wp').css('cssText', 'min-height:59px;');


if($('#author_comment').length) {
var bodyInnerText1 = document.getElementById('author_comment').innerHTML;
var bodyInnerText2 = document.getElementById('movie_title').innerHTML;
var numU1 = AdmissionU1.length;
var numT1 = AdmissionT1.length;
var num1 = Math.max(numU1+1, numT1+1);
for (var h = 0; h < num1; h++) {
    var isExist1 = bodyInnerText1.indexOf(AdmissionU1[h])!== -1;
    var isExist2 = AdmissionS.test(bodyInnerText1);
    var isExist3 = bodyInnerText2.indexOf(AdmissionT1[h])!== -1;
    if (isExist1 === false && isExist2 === false && isExist3 === false) {
        continue;
    } return;
}
var bodyInnerTextA = document.getElementById('topmovie_right_box').innerHTML;
var num2 = BanUserName1.length;
for (var i = 0; i < num2; i++) {
    var isExist4 = bodyInnerTextA.indexOf(BanUserName1[i])!== -1;
      if (isExist4 === true) {
        $('#author_comment').remove();
      }
}
}

if($('#topmovie_right_box').length) {
var bodyInnerText3 = document.getElementById('topmovie_right_box').innerHTML;
var bodyInnerText4 = document.getElementById('movie_title').innerHTML;
var numU2 = AdmissionU2.length;
var numT2 = AdmissionT2.length;
var num3 = Math.max(numU2, numT2);
for (var j = 0; j < num3; j++) {
    var isExist5 = bodyInnerText3.indexOf(AdmissionU2[j])!== -1;
    var isExist6 = bodyInnerText4.indexOf(AdmissionT2[j])!== -1;
    if (isExist5 === false && isExist6 === false) {
        continue;
    } return;
}
var num4 = BanUserName2.length;
  for (var k = 0; k < num4; k++) {
var isExist7 = bodyInnerText3.indexOf(BanUserName2[k]);
  if (isExist7 > 0) {
      $( function() {
        $('#player').remove();
        $('#midmovie, #movie_left_box, #movie_right_box').remove();
        $('#topmovie, #othersource, .tab_box, #commentdl, #commentlink, #trackback, #playerembed, #sizechange').css('display', 'none');
        $('#topmovie_right_box').css({'border-left':'none', 'width':'500px'});
        $('#watch_menu li').css({'margin-top':'30px', 'background':'none', 'font-size':'20px'});
      });
      $(function(){
        $('#topmovie_right_box').each(function(){
          var txt = $(this).html();
          $(this).html(
            txt.replace(/ソース/,"")
          );
        });
      });
      $(function() {
        $('#movie_title').prependTo($('#topmovie_right_box')).css('width', '780px');
        $('#topmovie_left_box').remove();
      });
      tabdisplay('movieinfo');
      $('.datablock').css('display', 'none');
      $('.rowdata').css('width', '990px');
    }


//// 編集可能範囲（オプション） ここから

   //◆８◆下記4つは「オプション」です。お好みで各々の行の前に「////」を記述or削除してください。
   //　「//」が無いと実行、「//」があると使用しません。
   ////1.何をブロックしたかアラートが出ます。
   //// 　  alert('「' + BanUserName2[i] + '」の登録です。')

   ////2.即行でブラウザバックします。新しいタグ・ウィンドウで開いた場合は戻らず放置されます。
   //// 　  history.back( - 1); return false;
}
}
   ////3.デザイン崩れのため[登録者ページ]を削除 (ユーザ名からも飛べるため不要と判断、必要な場合は先頭に「////」を記述or削除)。
            $('span#userlinktext').remove();

   ////4.自分の登録動画ページにおけるデザイン崩れのため[Myシリーズに追加]を削除 (●●●部分に自分のユーザー名または番号を入れる)。
            var tourokudes = ['●●●'];
            var num5 = tourokudes.length;
            for (var l = 0; l < num5; l++) {
                var isExist8 = bodyInnerTextA.indexOf(tourokudes[l])!== -1;
                   if (isExist8 === true) {
                      $('span#mylinkadd').remove();
                   }
            }
//// 編集可能範囲（オプション） ここまで


if(NoTC === false) {
   $('#movie_left_box').remove();
   $('#fc2count').css('cssText', 'margin-top:100px;');
}
// 編集不要範囲 ここまで
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////