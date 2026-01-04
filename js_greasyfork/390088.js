// ==UserScript==
// @name     markdown/scrapbox記法URL取得
// @version  1
// @grant    none
// @namespace https://twitter.com/root_T2
// @description Copy URL in markdown/scrapbox format
// @description:ja
// @downloadURL https://update.greasyfork.org/scripts/390088/markdownscrapbox%E8%A8%98%E6%B3%95URL%E5%8F%96%E5%BE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/390088/markdownscrapbox%E8%A8%98%E6%B3%95URL%E5%8F%96%E5%BE%97.meta.js
// ==/UserScript==

// クリップボード
// https://qiita.com/butakoma/items/642c0ec4b77f6bb5ebcf
// https://qiita.com/simiraaaa/items/2e7478d72f365aa48356
// ショートカット
// https://stackoverflow.com/questions/3168574/how-can-i-create-a-shortcut-for-firefox-in-greasemonkey
// ascii code http://www9.plala.or.jp/sgwr-t/c_sub/ascii.html

var title = document.title;
title = title.replace(/\s*[\[\]]\s*/g,' ');
// scrapbox用
var str = '[' + title + ' ' + document.URL + ']';
// markdown
var str2 = '[' + title + '](' + document.URL + ')';


(function(){
document.addEventListener('keydown', function(e) {
  // pressed alt+a
  if (e.keyCode == 65 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
    var listener = function(e){

    e.clipboardData.setData("text/plain" , str);
    // 本来のイベントをキャンセル
    e.preventDefault();
    // 終わったら一応削除
    document.removeEventListener("copy", listener);
    }
  // コピーのイベントが発生したときに、クリップボードに書き込むようにしておく
  document.addEventListener("copy" , listener);

  // コピー
  document.execCommand("copy");
  // markdown alt+q
  }else if(e.keyCode == 81 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey){
    var listener = function(e){

      e.clipboardData.setData("text/plain" , str2);
      e.preventDefault();
      document.removeEventListener("copy", listener);
      }
    document.addEventListener("copy" , listener);
    document.execCommand("copy");
  }
}, false);
})();
