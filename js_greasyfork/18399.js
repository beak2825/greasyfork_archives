// ==UserScript==
// @name        reddit
// @namespace   manobastardo
// @include     https://www.reddit.com/*
// @version     1.0.2
// @grant       none
// @description reddit upvote post on hover|remove matching text from post|hide all posts on next page clicked
// @downloadURL https://update.greasyfork.org/scripts/18399/reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/18399/reddit.meta.js
// ==/UserScript==

var elements = $(".entry");

elements.find("a.title").each(
  function() {
   $(this).text(
   function () {
     return $(this).text().replace(/\b(til|lpt|(\s+|)today(\s+|)i(\s+|)learned)(\s+|)([^a-zA-Z0-9]|)(\s+|)(that|of|about|)\b/ig, '');
   })
  }
);

elements.parent().hover(
  function(){
    var time_value=$(this).find(".live-timestamp").attr("datetime");
    var time_regex=/(\d{4})-(\d{2})-(\d{2}).(\d{2}):(\d{2}):(\d{2})/;
    var [, year, month, day, hour, min, sec] = time_regex.exec(time_value);
    var date_old=new Date(year, month-1, day, hour, min, sec);
    date_old.setHours(0,0,0,0);

    var date_new = new Date();
    date_new.setMonth(date_new.getMonth() - 6);
    date_new.setHours(0,0,0,0);
    
    console.log(date_old, date_new);
    if (date_old > date_new) {
      $(this).find(".arrow.up")[0].click();
    }
  }
);

function hidden() {
  if (elements.find(".hide-button.state-button span a[action='hide']").length) {
    return setTimeout(hidden, 1000);
  }
  $(".nextprev a")[0].click();
}

$(".nextprev a").click(
  function(event) {
    var visible = elements.find(".hide-button.state-button span a[action='hide']")
    if (visible.length) {
      event.preventDefault();
      visible.each(
      function (){
        $(this)[0].click();
      });
      hidden();
      return false;
    }
});