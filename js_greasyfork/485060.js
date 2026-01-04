// ==UserScript==
// @name        YouTubeLive_ReactionRemover
// @name:ja     YouTubeLive リアクション削除スクリプト
// @namespace   https://irohastd.hatenablog.com/archive
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      irohasu2274
// @description This script deletes reaction emojis which displayed on YouTubeLive's comments.
// @description:ja 一部のYouTubeliveでコメントの右下に表示される、リアクション用の絵文字を削除するスクリプト。
// @downloadURL https://update.greasyfork.org/scripts/485060/YouTubeLive_ReactionRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/485060/YouTubeLive_ReactionRemover.meta.js
// ==/UserScript==
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      var target = document.getElementsByClassName("style-scope yt-reaction-control-panel-overlay-view-model");
      while (target.length) {
      target.item(0).remove()
      }

  });
});

const config = {childList:true,subtree:true};
observer.observe(document.body, config);