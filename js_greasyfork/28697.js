// ==UserScript==
// @name            twitter_time_list
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @version			    0.1.9
// @description    检查打开的推是否在32小时内有更新
// @include         https://twitter.com/*
// @exclude         https://twitter.com/*/status/*
// @license         WTFPL
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/28697/twitter_time_list.user.js
// @updateURL https://update.greasyfork.org/scripts/28697/twitter_time_list.meta.js
// ==/UserScript==
(function () {
  timer = setTimeout(onSub, 21000);
}) ();
function onSub() {
  var timestamp = Date.parse(new Date());
  var la1 = 0;
  $('._timestamp.js-short-timestamp').each(function () {
    var rqr = $(this).attr('data-time-ms');
    if (Number(rqr) > Number(timestamp) - 115200000) {
      la1++;
    }
  });
  if (!la1) {
    $("[rel='shortcut icon']").first().attr("href","https://graph.facebook.com/favicon.ico");
    $(".ProfileCanopy-navBar.u-boxShadow").css("background-color","#FFADFC");
    $(".AppContent-main.content-main").remove();
  }
}