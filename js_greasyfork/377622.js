// ==UserScript==
// @name         Snuke? Smeke?
// @namespace    https://github.com/morioprog
// @version      1.0
// @description  Highlight "すぬけ" and "すめけ".
// @author       morio__
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://*.contest.atcoder.jp/tasks/*
/* load jQuery */
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/377622/Snuke%20Smeke.user.js
// @updateURL https://update.greasyfork.org/scripts/377622/Snuke%20Smeke.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const Background = 1;
    const Text = 2;
    // --------ハイライト方法の設定--------
    // Background : 背景色を変更
    // Text       : 文字色を変更
    const Mode = Background;
    var Highlights = [
        ["すぬけ", "snuke", "#FF7F50"],
        ["すめけ", "smeke", "#87CEFA"]
    ];
    // ---------------------------------
    var template = "<span style='";
    switch (Mode) {
      case Background:
            template += "background-color";
            break;
      case Text:
            template += "color";
            break;
      default:
            break;
    }
    $("p,li").each(function() {
      var statement = $(this).html();
      Highlights.forEach(function(highlight) {
        var after = template + ":" + highlight[2] + "'>" + highlight[0] + "</span>";
        statement = statement.replace(new RegExp(highlight[0], "g"), after);
      });
      $(this).html(statement);
    });
})();

