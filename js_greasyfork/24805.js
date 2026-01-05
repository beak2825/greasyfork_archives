// ==UserScript==
// @name       Link not display retweet For twitter
// @namespace  namespace
// @version    0.1
// @description  リツイートを非表示にするリンクを生成します。リンクをクリックすると、タイムライン上のリツイートを非表示にできます。
// @match    https://twitter.com/*
// @require http://code.jquery.com/jquery-2.1.1.min.js
// @copyright  2014+, qa2
// @downloadURL https://update.greasyfork.org/scripts/24805/Link%20not%20display%20retweet%20For%20twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/24805/Link%20not%20display%20retweet%20For%20twitter.meta.js
// ==/UserScript==

$(function() {
const notRT = $("<button>")
  .text("NotRT")
  .css("color", "Red")
  .on("click", () => {
  $(".tweet").has(".js-retweet-text").css("display", "none")
 })
  // add element
  $("#global-actions").before(notRT)
});

