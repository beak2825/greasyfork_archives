// ==UserScript==
// @name remove t.co
// @description  Bypass t.co redirection from Twitter external links
// @namespace https://github.com/kkren
// @match *://twitter.com/*
// @grant none
// @require https://cdn.jsdelivr.net/npm/jquery@2.2.4/dist/jquery.min.js
// @run-at document-end
// @version 0.5
// @downloadURL https://update.greasyfork.org/scripts/32522/remove%20tco.user.js
// @updateURL https://update.greasyfork.org/scripts/32522/remove%20tco.meta.js
// ==/UserScript==


function replace() {
  var i = 0;
  var urls = $("[href*='t.co']").length;
  for (; i < urls; i++) {
    if ($("[href*='t.co']").eq(i).attr("data-expanded-url") != undefined) {
      var expanded = $("[href*='t.co']").eq(i).attr("data-expanded-url");
    } else {
      var expanded = $("[href*='t.co']").eq(i).attr("title");
    }
    $("[href*='t.co']").eq(i).attr("href", expanded);
  }
}
//滚动加载
mo = new MutationObserver(function(allmutations) {
  //alert();
  replace();
});
var targets = document.body;
mo.observe(targets, {
  'childList': true,
  'characterData': true,
  'subtree': true
});
replace();
