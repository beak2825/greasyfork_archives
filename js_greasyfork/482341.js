// ==UserScript==
// @name add.js
// @author tomo
// @description for greasyfor editor　テキストの高さを計算する
// @include *
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @version 0.1 うまく動かず。特に最初のサイズが指定できない。
// @namespace https://greasyfork.org/users/1222402
// @downloadURL https://update.greasyfork.org/scripts/482341/addjs.user.js
// @updateURL https://update.greasyfork.org/scripts/482341/addjs.meta.js
// ==/UserScript==
//var $ = window.jQuery;
//userscriptを他のuserscriptに適応して、さらにページの操作をしようとすると
//うまく行かないことがある。特に今回はjqueryが効かず＄は関数でないとなった。


window.addEventListener('load', (function(){
    //checkboxの状態の取得も書き換えもうまく行かなそう。
    //セキュリティの問題で制限があるか
    alert("asdf");
    //if (document.getElementById('#enable-source-editor-code').checked == false){};
})(),false); 



////////////////////////////////////////////////////////////////////////////////
/*
  // イベント設定
  window.addEventListener("scroll",function() {
 // // windowを使用する場合、キー入力した際に位置がずれる
 //   var top = window.scrollY;
 //   var left= window.scrollX;    

 // // 要素htmlから高さを取得する場合もずれが生じる
 //   var ele = document.querySelector('html');
 //   var left = ele.scrollLeft;
 //   var top = ele.scrollTop;　

    var top = $(window).scrollTop();
    var left= $(window).scrollLeft();

    window.sessionStorage.setItem(['scroll_top'],[top]);
    window.sessionStorage.setItem(['scroll_left'],[left]);
 //   console.log(window.sessionStorage.getItem(['scroll_top']));
  });
*/

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/* コードを直接htmlに記載しないと、body要素に対するスクリプトはうまく行かない */
// だから別にした。
/*
  // https://web-dev.tech/front-end/javascript/textarea-auto-height/ 
  // textareaタグを全て取得
  const textareaEls = document.querySelectorAll("textarea");

  textareaEls.forEach((textareaEl) => {
    // デフォルト値としてスタイル属性を付与
    textareaEl.setAttribute("style", `height: ${textareaEl.scrollHeight + 50}px;`);
    // inputイベントが発生するたびに関数呼び出し
    textareaEl.addEventListener("input", setTextareaHeight);
  });
*/
/*
  // textareaの高さを計算して指定する関数
  function setTextareaHeight() {
    ////////高さを記録する///////////////////  
       //セッション取得
       
    var top = window.sessionStorage.getItem(['scroll_top']);        
    var left = window.sessionStorage.getItem(['scroll_left']);

    console.log(top);
    // 指定位置にスクロール
    //window.scrollTo(left, top);
    setScroll(left, top);

    //セッション破棄
    //window.sessionStorage.clear();   
      
    ////////高さを変更する///////////////////  
    this.style.height = "auto";
    this.style.height = `${this.scrollHeight + 50}px`;
  }

    // スクロール位置設定
   function setScroll(x, y) {
     var ele = document.querySelector('html');
     ele.scrollLeft = x;
     ele.scrollTop = 1000;
   }
*/




////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
/*-----------https://qiita.com/tsmd/items/fce7bf1f65f03239eef0------------------------*/
/*
function flexTextarea(el) {
  const dummy = el.querySelector('.FlexTextarea__dummy');
  el.querySelector('.FlexTextarea__textarea').addEventListener('input', e => {
      alert("asdfasdf");
    dummy.textContent = e.target.value + '\u200b';
  });
}

document.querySelectorAll('.FlexTextarea').forEach(flexTextarea);
*/


