// ==UserScript==
// @name            remove_obstructivevideo_himaSORT_0.4
// @namespace  excludehima
// @version         0.4
// @description  ひまわり動画の検索結果ページから邪魔な転載動画、不快動画を表示から消します。仮バージョン。
// @author      
// @include        http://himado.in/?sort=*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/30302/remove_obstructivevideo_himaSORT_04.user.js
// @updateURL https://update.greasyfork.org/scripts/30302/remove_obstructivevideo_himaSORT_04.meta.js
// ==/UserScript==

//動作環境テスト：chromeのみ
//必要環境　　　：Tampermonkey必須
//やっていること：ひまわりの新着、再生数(本日)、再生数(全期間)、コメント数Myリスト数新着などの検索結果から
//　　　　　　　　設定された単語（strNGword）が含まれる動画（.thumbcell）を表示から消す。

//どなたかTOPページなどにも使えるように改良してくださると助かります
//仮バージョン使用する場合は自己責任でお願いします

//ここで排除する動画タイトルに含まれる言葉を設定
var strNGword = ['民進','速報','安倍','自民','中国','サヨ','議院','虎ノ門','発狂','韓国','ニュース','【','たかじん','維新'];

window.onload = function(){

//検索結果から動画タイトルのリストを取得
   var moviecnt = 29;
   var titlelist = [];
   var cntflg = 0;
  
   for(var j =0; j < moviecnt; j++ ){
      titlelist.push($('.thumbtitle a').eq(j).text());   
   }

//設定した文字がマッチングしたら検索結果一覧から除外
   for (var k = 0; k < moviecnt; k++) {
      for (var cnt3 in strNGword){
        var reg3 = new RegExp(strNGword[cnt3]);
        if(titlelist[k].match(reg3)){
          $('.thumbcell').eq(k+cntflg).remove();
          cntflg = cntflg -1;
          break;
        }
	       
       }
    }
  }