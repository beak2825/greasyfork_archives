// ==UserScript==
// @name        nicosJumpCanceller
// @namespace   https://github.com/segabito/
// @description 「＠ジャンプ」を無効化
// @include     http://www.nicovideo.jp/watch/*
// @version     1.0.3
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/439/nicosJumpCanceller.user.js
// @updateURL https://update.greasyfork.org/scripts/439/nicosJumpCanceller.meta.js
// ==/UserScript==

(function() {

  if (!window.require) {
    return;
  }

  var monkey = function() {
    window.WatchJsApi.nicos.addEventListener('nicoSJump', function(e) {
        e.cancel();
        require('watchapp/init/PopupMarqueeInitializer').popupMarqueeViewController.onData(
          '「@ジャンプ」コマンドをキャンセルしました'
        );
    });
  };

  require(['watchapp/model/WatchInfoModel'], function() {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'UTF-8');
    script.appendChild(document.createTextNode("(" + monkey + ")()"));
    document.body.appendChild(script);
  });

})();

