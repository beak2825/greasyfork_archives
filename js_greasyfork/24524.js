// ==UserScript==
// @name        ニコニコ動画HTML5 動画説明欄自動オープン
// @namespace   ncode
// @include     http://www.nicovideo.jp/watch/*
// @include     https://www.nicovideo.jp/watch/*
// @version     2
// @description ニコニコ動画のHTML5版プレイヤーの動画説明欄を自動的にオープンします
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24524/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BBHTML5%20%E5%8B%95%E7%94%BB%E8%AA%AC%E6%98%8E%E6%AC%84%E8%87%AA%E5%8B%95%E3%82%AA%E3%83%BC%E3%83%97%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/24524/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BBHTML5%20%E5%8B%95%E7%94%BB%E8%AA%AC%E6%98%8E%E6%AC%84%E8%87%AA%E5%8B%95%E3%82%AA%E3%83%BC%E3%83%97%E3%83%B3.meta.js
// ==/UserScript==
(function(){
  var counter = 0;
  var timer = setInterval(function() {
    counter++;
    if (counter > 10) {
      clearInterval(timer);
      return;
    }
    try {
      var buttons = document.getElementsByClassName('VideoDescriptionExpander-buttonExpand');
      if(!buttons) return;
      buttons.item(0).click();
      clearInterval(timer);
    } catch(e) {
    }
  }, 300);
})();