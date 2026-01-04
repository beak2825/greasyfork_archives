// ==UserScript==
// @name        ニコニコ動画 自動再生(HTML5版)
// @description ニコニコ動画を自動再生します。
// @description ブラウザのメディア自動再生をニコニコ動画に許可していない場合、自動再生されないことがあります。
// @include     http://www.nicovideo.jp/watch/*
// @include     https://www.nicovideo.jp/watch/*
// @author      toshi (https://github.com/k08045kk)
// @license     MIT License
// @see         https://opensource.org/licenses/MIT
// @version     5.1
// @see         1 - HTML5版に対応
// @see         2 - Flash版を削除(Chromeで動作しないため)
// @see         3 - 2019/06/11 - 別動画移動後も自動再生するように変更
// @see         4 - 2019/06/19 - メモリリーク改善
// @see         5 - 2019/06/20 - 別動画移動時にページトップへ移動する
// @grant       none
// @namespace https://www.bugbugnow.net/
// @downloadURL https://update.greasyfork.org/scripts/367632/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E8%87%AA%E5%8B%95%E5%86%8D%E7%94%9F%28HTML5%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/367632/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E8%87%AA%E5%8B%95%E5%86%8D%E7%94%9F%28HTML5%E7%89%88%29.meta.js
// ==/UserScript==

// 自動再生
(function(){
  // 自動再生を試行する間隔(ms)
  var INTERVAL = 1000;
 
  var element = document.querySelector('.VideoStartButton');
  if (element != null) {
    // HTML5版
    window.addEventListener('load', function(){
      window.setInterval(function() {
        var btn = document.querySelector('.VideoStartButton');
        if (btn != null) {
          btn.click();
          // ページトップへ移動する
          window.scroll({top:0});
        }
        btn = null;
      }, INTERVAL);
    }, false);
  }
})();
