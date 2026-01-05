// ==UserScript==
// @name        DontSetupLazy
// @namespace   https://github.com/segabito/
// @description 動画のロードを待たずに初期化する
// @include     http://www.nicovideo.jp/watch/*
// @version     0.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4718/DontSetupLazy.user.js
// @updateURL https://update.greasyfork.org/scripts/4718/DontSetupLazy.meta.js
// ==/UserScript==

(function() {

  if (window.WatchJsApi) {
    var require = window.require;
    require(['watchapp/model/WatchInfoModel', 'lodash', 'prepareapp/PlayerStartupObserver'], function(WatchInfoModel, _, pso) {
      var watchInfoModel = WatchInfoModel.getInstance();
      if (!watchInfoModel.initialized) {
        console.log('%cinitialize Immediately', 'background: lightgreen;');

        window.setTimeout(function() {
          if (pso._executed) {
            return;
          }
          console.time('initialize Immediately');
          pso._dispatch();
          pso._executed = true;
          console.timeEnd('initialize Immediately');
        }, 0);
      }
    });
  }
 })();
