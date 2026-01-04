// ==UserScript==
// @name     hkepcFilter
// @include https://www.hkepc.com/forum/*
// @require http://code.jquery.com/jquery-3.6.0.min.js
// @description You can block some members by editing blacklist.
// @version 1.0
// @license MIT
// @namespace https://greasyfork.org/users/1056810
// @downloadURL https://update.greasyfork.org/scripts/463597/hkepcFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/463597/hkepcFilter.meta.js
// ==/UserScript==

const blackList = [
  "member1",
  "member2",
  "member3",
  "member4",
];

$(document).ready(function () {
  $("tbody").each(function (index) {
    var author = $(this).find(".author").find("cite").text().trim();
    if (blackList.indexOf(author) !== -1) {
      $(this).remove();
    }
  });

  $("tbody").each(function (index) {
    var author = $(this)
      .find(".postauthor")
      .find(".postinfo")
      .find("a")
      .text()
      .trim();

    if (blackList.indexOf(author) !== -1) {
      $(this).remove();
    }
  });

  $(".quote").each(function (index) {
    var author = $(this).find("blockquote").find("font").text().split(" ")[0];

    if (blackList.indexOf(author) !== -1) {
      $(this).remove();
    }
  });
});
