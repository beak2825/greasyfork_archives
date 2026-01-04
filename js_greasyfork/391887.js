// ==UserScript==
// @name            twitter_time_list_2_url
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @version			    0.2.1
// @description    检查打开的推是否在32小时内有更新
// @include         https://twitter.com/*
// @exclude         https://twitter.com/*/status/*
// @license         WTFPL
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/391887/twitter_time_list_2_url.user.js
// @updateURL https://update.greasyfork.org/scripts/391887/twitter_time_list_2_url.meta.js
// ==/UserScript==
(function () {
  var timer = setTimeout(onSub, 25000);
}) ();
function onSub() {
  var timestamp = Date.parse(new Date());
  var la1 = 0;
  $('time').each(function () {
    var rqr = new Date($(this).attr('datetime'));
    if (Number(rqr.getTime()) > Number(timestamp) - 115200000) {
      la1++;
    }
  });
  if (!la1) {
    window.location.href='http://127.0.0.1';
  }
}