// ==UserScript==
// @name        himado GoodByeTop Script
// @namespace   Scottie400
// @include     http://himado.in/?sort=movie_id&page=*
// @exclude     http://himado.in/?sort=movie_id&page=*&user_no=*
// @version     1.57
// @grant       none
// @description ひまわり動画において、見たい登録動画を厳選しアクセスしやすくするものです。
/* *****************************************************************************************
◆ひまわり動画において、見たい登録動画を厳選しアクセスしやすくするものです。
　新着順ページが最も早く更新・反映されることを利用し、
　基本的に需要や視聴の蓋然性が低いものなどを瞬時に選別することで、
　｢あれ見たかったのにたくさんの登録で埋もれていて忘れてしまった…！｣という事態を減らします。
　1ページで約1～2日分を一覧でき、10ページまでさかのぼれる仕様となっています。
　本来のひまわり動画の良さを108％引き出し快適化することが可能です。

　ブックマークは「http://himado.in/?sort=movie_id&page=0」に変更すると便利です。

　設定の仕方については、ソースコード内の説明を参照。
　項目は9つで簡潔ですので、全文をちゃんとチェックし各々好みで工夫して設定してください。

  機能が重複するため「Himado BanUser Cleaner」との併用は出来ません。

 ◆Greasemonkey(firefox)、Tampermonkey(Chorome,Opera)というアドオンが必要です。
 　導入方法はこちらを要参照⇒http://dic.nicovideo.jp/a/greasemonkey
 　ユーザースクリプトとは？⇒https://greasyfork.org/

 ◆ひまわり動画側の設定制約
 　⇒http://himado.in/?mode=customview
 　サムネイル--------どれでもOK
 　動画情報表示------すべて・標準・最小（なし以外可）
 　コメント表示------どれでもOK
 　クイックサーチ----チェックON/OFF可　（←クイックサーチは公式で廃止された模様）
 　検索履歴----------チェック必須
 　視聴履歴----------チェック必須

 ※Last Update : 2020-10-07
 ※ご使用は自己責任でお願いします。責任を負いかねます。
 ※設定後にページが変わらないままになる場合は設定の仕方が間違っています。見直しましょう。
 ※推奨環境：Win7が普通に動く程度を満たすスペック・ちゃんと更新しているブラウザ
***************************************************************************************** */
// @downloadURL https://update.greasyfork.org/scripts/12555/himado%20GoodByeTop%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/12555/himado%20GoodByeTop%20Script.meta.js
// ==/UserScript==
//◆ご注意 ～ 編集が終わったら「保存」を忘れずに！◆//



//◆１◆「タイトル "許可" 設定」です。
//　除外しなくていい登録をタイトル中の単語で指定します。
//◆下記のように「'***',」と羅列していきます。最後だけは「,」を書かないこと。見やすく改行しても大丈夫。
//　記入例 var AdmissionT = ['ひまわり', 'きのこ', 'たけのこ'];
//◆「AdmissionT」はタイトル文字列指定。「AdmissionS」は正規表現用です（わかる人のみイジってください）。
//◆追っているモノ等で好みのタイトル指定をして快適にしてください。デフォはオススメのものです。
//　使わない場合はそのまま未記入の空の1行のみで大丈夫です、必須。
var AdmissionT = [
  '追加',
  '予告',
  '限定',
  'ねこ'
];
var AdmissionS = /(\d+話|(\s|#)\d{1,3})/;


//◆２◆「タイトル "排除" 設定」です。
//　取りわけ事前に排除したい登録をタイトル中の単語で指定します。記入方法等は許可設定と全く同じ。
//◆許可設定の後に選別しますので、許可してもこちらの単語に引っかかれば排除されます。
var AdmissionN = [
  'youtube',
  'H264'
];


//◆３◆「カテゴリ "許可" 設定」です。
//　除外しなくていいカテゴリタグを指定します。
//◆こちらも同じく、書き方は「タイトル許可設定」らと同じです。
//◆使える単語は「アニメ・ゲーム・音楽・スポーツ・ドラマ・特撮・エンタメ・ラジオ」のみ。
//◆そんなに設定する必要性はないかも。
var AdmissionC = [

];


//◆４◆「カテゴリ "排除" 設定」です。
//　カテゴリタグを解析し視聴の蓋然性が低いものを排除します。
//◆概ね「true;」で全く問題ないと思いますが、とにかく幅広く担保したい場合は「false;」にしてください。
var AdmissionD = true;


//◆５◆「Youtube "全排除" 設定」です。
//　Youtubeの登録自体すべて消してしまいたい人向け。何らかを見逃す可能性もあるためあまりお薦めしません。
//◆全消ししたい場合は「true;」、設定しない場合は「false;」と入力。
var NoYouT = false;


//◆６◆「人気登録の強調」です。
//◆total再生数がいくら以上で強調したいか指定してください。数を1つだけ記述し「' ',」は要りません。
//　必要ない場合はとても大きい数字（99999999等)にすればOK。
//◆デフォの数値は目安です。
var TotalV = (
  5000
);


//◆７◆ 特別ピックアップ「PickUp HIT」の設定です。このUserScriptの最も便利で肝な機能になります。
//　特定の登録を選別し別個に羅列表示することで、見逃しを極力減らします。
//◆日本語を含む単語を推奨（1～3文字ほどの短い英数字のみでは稀に誤爆する場合があります）。
//◆ほとんどの人はデフォの文字列で十分だと思いますが、
//　広く「'話', '#'」といった指定もいいでしょうし、個人的に追っているモノのキーワードを追加しても可です。
var imiTop = [
  '追加',
  '高画質',
  'HD',
  'ＨＤ',
  '200',
  '限定'
];


//◆８◆「PickUp HIT」の表示の高さを指定できます(任意)。
//　自前のブラウザの大きさに合わせて「'***px';」と調節値を入れてください。概ね775px前後で3行表示です。
//◆高さに応じて横にシークバーが出てきます。
var PUHheight = '780px';


//◆９◆「PickUp HIT」の動作の際、新着順からカット掲載するかコピー掲載するか決められます。お好みでどうぞ。
//　「0;」であればコピー（新着順一覧にもHIT内部にも掲載されます）
//　「1;」であればカット（新着順一覧からは消え、HIT内部にのみ掲載されます）
var CopyorNot = 0;


//◆＋◆「TOP9 Peep」を常に表示しておくか決められます。TOP9が気になる人用。
//　「0;」であればクリック開閉式（デフォルト）、「1;」であれば常に表示。
var NotbatG = 0;



/////////////////////////////////////////////////////////////////////////////////////////////////////
//◆編集不要範囲 ここから
////フェードインアウト ここから
$('#body_search').before('<div class="BlackorWhite"></div>');
$('.BlackorWhite').css('cssText', 'display:none; width:3000px; height:5000px; position:fixed; background-color:#272727; z-index:99;');
$('.BlackorWhite').fadeIn(150, "swing");
////フェードインアウト ここまで

///メイン動作 ここから
var pageNo1 = location.search.match(/\d/g).join("");
    pageNo2 = parseInt(pageNo1);
    pageP1 = (pageNo2+1);
    pageP2 = (pageNo2+2);
    pageP3 = (pageNo2+3);
var pageURL1 = "http://himado.in/?sort=movie_id&page=" + pageP1;
var pageURL2 = "http://himado.in/?sort=movie_id&page=" + pageP2;
var pageURL3 = "http://himado.in/?sort=movie_id&page=" + pageP3;
var pageTag = ".thumbblock_3colum";
$("#fc2count").load(pageURL1+' '+pageTag, function () {
  $('.thumbblock_3colum').insertBefore('#thumb').css({'width':'251px', 'height':'255px', 'display':'inline-block', 'border':'1px solid #666', 'border-radius':'6px', 'padding':'0px', 'float':'unset'});
$("#fc2count").load(pageURL2+' '+pageTag, function () {
  $('.thumbblock_3colum').insertBefore('#thumb').css({'width':'251px', 'height':'255px', 'display':'inline-block', 'border':'1px solid #666', 'border-radius':'6px', 'padding':'0px', 'float':'unset'});
$("#fc2count").load(pageURL3+' '+pageTag, function () {
  $('.thumbblock_3colum').insertBefore('#thumb').css({'width':'251px', 'height':'255px', 'display':'inline-block', 'border':'1px solid #666', 'border-radius':'6px', 'padding':'0px', 'float':'unset'});

$("#fc2count").load("http://himado.in/ .movieBox", function () {
  $('.skycraper').prepend('<div class="Top9Only"></div>');
  $('.movieBox').prependTo('.Top9Only');
  $('.home_info, .home_ucome').remove();
  Top9Only = document.getElementsByClassName('movieBox');
  $(Top9Only[7]).css('cssText', 'display:inline-block!important; transform:scale(0.79787)!important; width:188px!important; height:150px!important; position:relative; left:132px; top:-701px; overflow:hidden;'); $(Top9Only[6]).css('cssText', 'display:inline-block!important; transform: scale(0.79787)!important; width:188px!important; height:150px!important; position:relative; left:-18px; top:-551px; overflow:hidden;'); $(Top9Only[5]).css('cssText', 'display:inline-block!important; transform:scale(0.79787)!important; width:188px!important; height:150px!important; position:relative; left:132px; top:-523px; overflow:hidden;'); $(Top9Only[4]).css('cssText', 'display:inline-block!important; transform:scale(0.79787)!important; width:188px!important; height:150px!important; position:relative; left:-18px; top:-373px; overflow:hidden;'); $(Top9Only[3]).css('cssText', 'display:inline-block!important; transform:scale(0.79787)!important; width:188px!important; height:150px!important; position:relative; left:132px; top:-345px; overflow:hidden;'); $(Top9Only[2]).css('cssText', 'display:inline-block!important; transform:scale(0.79787)!important; width:188px!important; height:150px!important; position:relative; left:-18px; top:-195px; overflow:hidden;'); $(Top9Only[1]).css('cssText', 'display: inline-block !important; transform: scale(0.79787) !important; width:188px!important; height:150px!important; position:relative; left:132px; top:-166px; overflow:hidden;'); $(Top9Only[0]).css('cssText', 'display:inline-block!important; transform:scale(0.79787)!important; width:188px!important; height:150px!important; position:relative; left:-18px; top:-16px; overflow:hidden;'); 
$("#fc2count").load("http://himado.in/ .movieMainContents", function () {
  $('.movieMainContents').prependTo('.Top9Only').css('cssText', 'display:inline-block!important; transform:scale(0.9375)!important;  height: 202.75px!important; position:relative; left:-9px; overflow:hidden;');
  $('.movieBox').slice(8, 20).remove();
  $('.Top9Only').css('cssText', 'height:710px!important; margin-top:24px!important; margin-bottom:20px!important;');
  $('.movieMain_imageMask a img').css('cssText', 'height:168.75px!important;');
  $('.movie_imageMask a img').css('cssText', 'height:113px!important;');


////全体スタイル編集 ここから
var headmenus = document.getElementsByClassName('headmenus');
var sortnavis = document.getElementsByClassName('sortnavi');
var pagenavis = document.getElementsByClassName('pagenavi');
var kensaku = document.getElementsByClassName('l-cnt-130_box111');
var seahis1 = document.getElementsByClassName('head3');
var seahis2 = document.getElementsByTagName('ol');

//$('#body_search').css('cssText', 'text-align:center!important; background-image:url(https://i.imgur.com/2N96tau.png)!important; background-attachment:fixed!important; background-position:right bottom!important; background-repeat:no-repeat!important;');

  $('.l-cnt-100').css({'width':'52%', 'margin-top':'120px'});
$('.m-hder-101').css('cssText', 'width:759px; min-width:759px; display:inline-block; margin-left:-496px; border-bottom:none;');
if($('#loginform').length){
    $('.m-hder-101_wp').css('cssText', 'border-bottom:none; margin-bottom:0px; height:80px;');
}else{
    $('.m-hder-101_wp').css('cssText', 'border-bottom:none; margin-bottom:26px; height:54px;');
}
$('.m-hder-101_cnt').css('cssText', 'margin-right:440px; color:#C0C0C0!important;');
$('.m-hder-101_logo img').css('cssText', 'position:absolute; clip:rect(0px 400px 100px 0px); width:250px; top:0px; margin-top:10px; margin-left:0px;');

$('#header').css({'width':'759px', 'position':'fixed', 'top':'0px', 'background-color':'#272727', 'opacity':'0.94', 'color':'#C0C0C0', 'z-index':'2'}).appendTo('body_top');
    //$('.headmenu').insertBefore(seahis1[0]).css('padding', '20px 5px 2px 11px');
    $('.headmenus').remove();
$('#header table').css('width', '759px');
$('#leftbox').css('width', '760px');
  $('.pagenavi').css({'width':'758px', 'margin-top':'15px', 'font-size':'120%', 'font-weight':'bold'});
  $('.sortnavi').css({'width':'775px', 'margin':'1px 0px'});
  $('.thumbcell').css('height', '50%');
  $('.thumbcomment').css('width', '98%');
  $('.home_head').css('width', '738px');
  $('.rowdata').css('width', '753px');
    $(pagenavis[0]).prependTo('.sortnavi').css({'margin-top':'8px', 'margin-left':'-2px'});
    $(pagenavis[1]).remove();
    $(sortnavis[0]).appendTo('#header');
  $('#searchform').css('width', '758px');
  $('.c-btn-113').css({'background':'#D4D0C8', 'padding':'2px', 'font-size':'13px', 'border-radius':'0px'});
$('.head3').css('margin-top', '20px');
$('iframe').css('height', '0px');
$('#cndxh, .m-hder-102, .l-cnt-100_box10, .l-cnt-100_box30, #group_link, .home_info, .home_ucome, .pagenavi_res, #thumb, .sortnavi_other, #sh_fc2footer_fix, .xnormal, iframe, .m-fter-wp').remove();
////全体スタイル編集 ここまで

////東ゴ◯トー共和国選別計画 ここから
var Nodes = document.getElementsByClassName('thumbblock_3colum');
var TitleALL = document.getElementsByClassName('thumbtitle');
var CategALL = document.getElementsByClassName('thumbleft');
var TagALL = document.getElementsByClassName('thumbtag xmini xnone');
  var numT = TitleALL.length;
  var numC = CategALL.length;
  var num1 = Math.max(numT, numC);
if(AdmissionD === true){
  var AdmissionDen = /(\d|\w|\u|-)+\&nbsp\;|(\d|\w|\u)+[^\x01-\x7E]+\&nbsp\;/;
  var AdmissionDjp = /[^\x01-\x7E]^(?!.*！){5,}\&nbsp\;|(\w|\x20|-)+[^\x01-\x7E]{1,4}\&nbsp\;|[\u4E00-\u9FFF]{4,}\&nbsp\;/;
}else if(AdmissionD === false){
  var AdmissionDen = /s{49}/;
  var AdmissionDjp = /s{49}/;
}
function strlen(str) {
  return str.length - (str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g)||[]).length;}
Back1: for (var h = 119; h >= 0; h--) {
  var isExist1 = Nodes[h].innerHTML;
  var isExist21 = isExist1.indexOf("youtube.com")!== -1;
  var isExist22 = isExist1.indexOf("fc2.com")!== -1;
  var bodyInnerTextC = TagALL[h].innerHTML;
  var isExist23 = AdmissionDen.test(bodyInnerTextC);
  var isExist24 = AdmissionDjp.test(bodyInnerTextC);
    if(NoYouT === true && isExist21 === true){
       (Nodes[h]).remove();
    }else if(isExist23 === true || isExist24 === true){
       (Nodes[h]).remove();
    }else if(isExist21 === true || isExist22 === true) {
      var bodyInnerText1 = TitleALL[h].innerHTML;
      var bodyInnerText2 = CategALL[h].innerHTML;
        for (var i = 0; i < num1; i++) {
          var isExist31 = AdmissionS.test(bodyInnerText1);
          var isExist32 = strlen(bodyInnerText1); //alert(isExist32);
          var isExist33 = bodyInnerText1.indexOf(AdmissionT[i])!== -1;
          var isExist4 = bodyInnerText2.indexOf(AdmissionC[i])!== -1;
            if(isExist31 === false && isExist33 === false && isExist4 === false) {
               continue;
            }else{
              if(isExist32 >= 141 && isExist21 === true){
               continue;
            }else{
               continue Back1;}
            }
        } (Nodes[h]).remove();
    }
}


var Nodes2 = document.getElementsByClassName('thumbblock_3colum');
var TitleALL2 = document.getElementsByClassName('thumbtitle');
  var numT2 = TitleALL2.length;
  var numN = AdmissionN.length;
Back2: for (var f = numT2-1; f >= 0; f--) {
  var bodyInnerText3 = TitleALL2[f].innerHTML;
  for (var g = 0; g < numN; g++) {
    var isExist5 = bodyInnerText3.indexOf(AdmissionN[g])!== -1;
      if(isExist5 === true) {
         $(Nodes2[f]).remove();
         continue Back2;
      }
  }
}
var Nodes3 = document.getElementsByClassName('thumbblock_3colum');
var ViewsALL = document.getElementsByClassName('thumbdata');
  var numV = ViewsALL.length;
for (var j = numV; j >= 1; j--) {
  var bodyInnerText4 = ViewsALL[j-1].innerHTML;
  var SearchString = "\d+";
  var RegularExp = new RegExp(SearchString, "g");
  var isExist6 = bodyInnerText4.match(/[0-9]+\.?[0-9]*/g);
  var num2 = isExist6.length;
    if(isExist6[num2 - 4] >= TotalV) {
       $(Nodes3[j-1]).css('background-color', 'rgba(255,76,76,0.2)');
    }
}
$('#searchform').after('<div id="PickUpHIT"></div>');
  $('.search_rowdate td:first-child').css('background', '#272727 none repeat scroll 0% 0%');
$('#PickUpHIT').css('cssText', 'width:1028px; margin-top:0px; margin-left:0px; background-color:#C0C0C0; z-index:9; overflow:auto!important; text-shadow: 1px 1px 6px #777777, 1px 2px 1px rgba(255,255,255,0.6); text-align:left;');
//$('#PickUpHIT').css('cssText', 'width:1032px; margin-top:2px; margin-left:-2px; font-color:#C0C0C0; background-color:#111; z-index:9; overflow:auto!important; text-shadow:0px 0px 30px rgba(244,255,214,0.6);');
$('#PickUpHIT').css('height', PUHheight);

var TitleALL3 = document.getElementsByClassName('thumbtitle');
  var numT3 = TitleALL3.length;
  var numi = imiTop.length;
Back3: for (var k = numT3-1; k >= 0; k--) {
  var bodyInnerText5 = TitleALL3[k].innerHTML;
  for (var l = 0; l < numi; l++) {
    var isExist7 = bodyInnerText5.indexOf(imiTop[l])!== -1;
      if(isExist7 === true) {
        if(CopyorNot === 0) {
           $(Nodes3[k]).clone().prependTo('#fc2count').css({'height':'255px', 'overflow':'hidden', 'color':'#000000', 'background-color':'rgba(255,150,150,0.5)'});
           //$(Nodes3[k]).clone().prependTo('#fc2count').css({'height':'255px', 'overflow':'hidden', color:'#C0C0C0!important','background-color':'rgba(255,76,76,0.3)'});
           continue Back3;
      }else{
        if(CopyorNot === 1) {
           $(Nodes3[k]).prependTo('#fc2count').css({'height':'255px', 'overflow':'hidden', 'background-color':'rgba(255,76,76,0.3)'});
           continue Back3;
        }
      }
      }
  }
}
$('#fc2count .thumbblock_3colum').prependTo('#PickUpHIT');
$('#fc2count').remove();
////東ゴ◯トー共和国選別計画 ここまで

////ソート・履歴スタイル編集 ここから
var isExist8 = seahis1[0].innerHTML;
var isExist9 = isExist8.indexOf("クイックサーチ")!== -1;
if(isExist9 === true) {
  $('.skycraper').css({'width':'305px', 'height':'2000px', 'position':'absolute', 'left':'auto', 'margin-left':'775px'});
  $(seahis1[1]).css({'width':'125px', 'margin-left':'4px', 'vertical-align':'top', 'float':'left'}).insertAfter(seahis1[0]);
  $(seahis1[2]).css({'width':'160px', 'vertical-align':'top', 'float':'left'}).insertAfter(seahis1[1]);
  $(seahis2[0]).css({'width':'130px', 'height':'auto', 'vertical-align':'top', 'display':'inline-block'});
  $(seahis2[1]).css({'width':'170px', 'height':'auto', 'vertical-align':'top', 'display':'inline-block', 'overflow':'auto'});
  $(seahis1[0]).remove();
  $('#table_quicksearch').css({'margin-top':'25px', 'position':'relative', 'width':'300px', 'height':'800px', 'table-layout':'fixed', 'vertical-align':'top', 'display':'inline-block', 'overflow':'auto'}).insertBefore(seahis1[0]);
} else {
  $('.skycraper').css({'width':'305px', 'position':'absolute', 'top':'46px', 'left':'auto', 'margin-left':'775px'});
  $(seahis1[0]).css({'width':'125px', 'margin-left':'4px', 'vertical-align':'top', 'float':'left'});
  $(seahis1[1]).css({'width':'160px', 'vertical-align':'top', 'float':'left'}).insertAfter(seahis1[0]);
  $(seahis2[0]).css({'width':'130px', 'height':'auto', 'vertical-align':'top', 'display':'inline-block'});
  $(seahis2[1]).css({'width':'170px', 'height':'auto', 'vertical-align':'top', 'display':'inline-block', 'overflow':'hidden'});
}



$('.l-cnt-130_box111').css({'width':'268px', 'vertical-align':'top', 'float':'left', 'margin-left':'10px'}).insertBefore(seahis1[0]);
  $('#normal_search_keyword').css('width', '155px');
  $('.c-box-104').css('right', '-45px');
  $(sortnavis[1]).remove();
  $('.sortnavi_short').css('cssText', 'margin-top:28px; margin-left:13px; margin-bottom:35px;');
  $('.l-cnt-130').remove();

$('#thumb').remove();
$(".pagenavi").empty();
$(document).ready(function(){
  $(".pagenavi").append('<ul class="pagenavi_pager"><a href="#" class="btn1"><span class="pager">❂ Pi©kUp HIT ❂</span></a>………<a href="./?sort=movie_id&page=0" class="pagelink"><span class="pager">1</span></a><a href="./?sort=movie_id&amp;page=4" class="pagelink"><span class="pager">2</span></a><a href="./?sort=movie_id&amp;page=8" class="pagelink"><span class="pager">3</span></a><a href="./?sort=movie_id&amp;page=12" class="pagelink"><span class="pager">4</span></a><a href="./?sort=movie_id&amp;page=16" class="pagelink"><span class="pager">5</span></a><a href="./?sort=movie_id&amp;page=20" class="pagelink"><span class="pager">6</span></a><a href="./?sort=movie_id&amp;page=24" class="pagelink"><span class="pager">7</span></a><a href="./?sort=movie_id&amp;page=28" class="pagelink"><span class="pager">8</span><a href="./?sort=movie_id&amp;page=32" class="pagelink"><span class="pager">9</span></a><a href="./?sort=movie_id&amp;page=36" class="pagelink"><span class="pager">10</span></a>………<a href="#" class="btn2"><span class="pager"> TOP9 Peep⇒</span></a></ul>');
});

$(document).ready(function(){
  $("span.pager").css({'border':'1px solid #7FBFFF', 'margin':'2px', 'padding':'2px 5px', 'font-weight':'inherit'});
  $("#PickUpHIT").hide();
  var flg = "close";
  $(".btn1").click(function(){
    $("#PickUpHIT").toggle(150);
        if(flg == "close"){
           $(this).html('<span class="pager">　　　　Hide　　　　</span>');
            flg = "open";
           $("span.pager").css({'border':'1px solid #7FBFFF', 'margin':'2px', 'padding':'2px 5px', 'font-weight':'inherit'});
        }else{
           $(this).html('<span class="pager">❂Pi©kUp HIT❂</span>');
            flg = "close";
           $("span.pager").css({'border':'1px solid #7FBFFF', 'margin':'2px', 'padding':'2px 5px', 'font-weight':'inherit'});
        }
  });
});
if(NotbatG === 0){
  $(document).ready(function(){
    $(".Top9Only").hide();
    var flg = "close";
    $(".btn2").click(function(){
      $(".Top9Only").slideToggle();
          if(flg == "close"){
             $(this).html('<span class="pager">　　　 Hide 　　　</span>');
              flg = "open";
             $("span.pager").css({'border':'1px solid #7FBFFF', 'margin':'2px', 'padding':'2px 5px', 'font-weight':'inherit'});
          }else{
             $(this).html('<span class="pager"> TOP9 Peep⇒</span>');
              flg = "close";
             $("span.pager").css({'border':'1px solid #7FBFFF', 'margin':'2px', 'padding':'2px 5px', 'font-weight':'inherit'});
          }
    });
  });
}else{ if(NotbatG == 1){
}
}
////ソート・履歴スタイル編集 ここまで

////現在のページ強調（窮策） ここから
var pagelinks = document.getElementsByClassName('pagelink');
for (var n = 0; n < 20; n++) {
  var pageNo4 = pagelinks[n].outerHTML;
  var pageNo5 = pageNo4.substring(35, 38);
      pageNo5 = parseInt(pageNo5);
    if(pageNo1 == pageNo5) {
        $(pagelinks[n]).css('background-color','#FF4C4C');
    }
}
////現在のページ強調（窮策） ここまで

$('.BlackorWhite').fadeOut(1200, "swing");
});
});
});
});
});
///メイン動作 ここまで
//◆編集不要範囲 ここまで
////////////////////////////////////////////////////////////////////////////////////////////////////