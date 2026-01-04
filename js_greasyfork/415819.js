// ==UserScript==
// @name         AtCoderDevotionScript
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Write contestID and problem to the clipboard
// @author       imomo
// @include      https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415819/AtCoderDevotionScript.user.js
// @updateURL https://update.greasyfork.org/scripts/415819/AtCoderDevotionScript.meta.js
// ==/UserScript==

/*ユーザー設定項目*/

//クリップボードにコピーするものの設定 all以外:[コンテストID] / all:[スクリプト名] [コンテストID]　[問題名(a,b...,f)]
var copyTarget = "";
//ショートカットに設定するキーを設定　デフォルトはQです(大文字で入力して下さい)
var shotcutKey = 'Q';
//コピーできたか通知するかどうか　onの場合のみ通知を行います
var notification = "on";

//(※必要な方のみ)シェルスクリプト、もしくはシェルスクリプトを呼び出すコマンドを設定
var callScripts = "";

/*設定項目終わり*/
var copystr;
onkeydown = function(){
  if((event.ctrlKey || event.metaKey)&&event.keyCode==shotcutKey.charCodeAt()){
      //問題ページのURLを取得
      var contestUrl = location.href;
      //パス毎に分割
      var problemPass = contestUrl.split("/");
      //contestID及び問題種別を格納
      var contestID = problemPass[problemPass.length - 3];
      var problemTitle = document.title.toLowerCase();
      var problem = problemTitle.substr(0,1);

      if(copyTarget == "all")copystr = callScripts + " " + contestID + " " + problem;
      else copystr = contestID;
      // 空div 生成
      var tmp = document.createElement("div");
      // 選択用のタグ生成
      var pre = document.createElement('pre');

      // 親要素のCSSで user-select: none だとコピーできないので書き換える
      pre.style.webkitUserSelect = 'auto';
      pre.style.userSelect = 'auto';
      tmp.appendChild(pre).textContent = copystr;

      // 要素を画面外へ
      var s = tmp.style;
      s.position = 'fixed';
      s.right = '200%';

      // body に追加
      document.body.appendChild(tmp);
      // 要素を選択
      document.getSelection().selectAllChildren(tmp);

      // クリップボードにコピー
      document.execCommand("copy");

      // 要素削除
      document.body.removeChild(tmp);
      //通知
      if(notification == "on"){
          if(copyTarget == "all")alert(callScripts + " " + contestID + " " + problem+" copied!!");
          else alert(contestID + " copied!!");
      }
  }
}