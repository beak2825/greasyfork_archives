// ==UserScript==
// @name        t.co bypass
// @namespace   http://darcsys.com
// @include     https://twitter.com/*
// @include     https://tweetdeck.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     1
// @grant       none
// @description fairly self explanatory, but just in case, this package will replace t.co urls on twitter and tweetdeck by using other attributes in the anchor tag.
// @downloadURL https://update.greasyfork.org/scripts/3528/tco%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/3528/tco%20bypass.meta.js
// ==/UserScript==

$(document).bind('DOMSubtreeModified', function(){
  $("a[data-touched!='true']").each(function(){
    $(this).attr("data-touched", "true");
    if($(this).attr("href").match("//t.co/")){
      $(this).attr("href", $(this).attr("data-expanded-url") != "" ? $(this).attr("data-expanded-url") : $(this).attr("title"));
    }
  });
});

