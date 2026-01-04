// ==UserScript==
// @name         testScripts
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Write contestID and problem to the clipboard
// @author       imomo
// @include      https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416160/testScripts.user.js
// @updateURL https://update.greasyfork.org/scripts/416160/testScripts.meta.js
// ==/UserScript==

/*ユーザー設定項目*/

//クリップボードにコピーするものの設定 all以外:[コンテストID] / all:[スクリプト名] [コンテストID]　[問題名(a,b...,f)]
var copyTarget = "";
//コピーできたか通知するかどうか　onの場合のみ通知を行います
var notification = "on";

//(※必要な方のみ)シェルスクリプト、もしくはシェルスクリプトを呼び出すコマンドを設定
var callScripts = "";

/*設定項目終わり*/

var copystr;
window.onload = function(){
    const copyButton = document.createElement("input");
    copyButton.setAttribute("type","button");
    copyButton.setAttribute("value","コピー");
    copyButton.setAttribute("id","scriptbutton");
    copyButton.setAttribute("size",10);
    document.getElementsByClassName('h2')[0].appendChild(copyButton);

    document.getElementById("scriptbutton").onclick = function(){
        //問題ページのURLを取得
      var contestUrl = location.href;
      //パス毎に分割
      var problemPass = contestUrl.split("/");
      //contestID及び問題種別を格納
      var contestID = problemPass[problemPass.length - 3];
      var problem =contestUrl.substr(-1);
      if(!isNaN(problem))problem = String.fromCharCode(96 + Number(problem));

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