// ==UserScript==
// @name        twitter - replacing fake JS links with real ones
// @namespace   monnef.tk
// @description Replaces fake JavaScript links to quoted tweets with real links which can be opened by middle-click in Firefox.
// @include     https://twitter.com/*
// @version     2
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/11278/twitter%20-%20replacing%20fake%20JS%20links%20with%20real%20ones.user.js
// @updateURL https://update.greasyfork.org/scripts/11278/twitter%20-%20replacing%20fake%20JS%20links%20with%20real%20ones.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var fixedClass = "alreadyFixed";

var getCurrentMillis = function(){return new Date().getTime();};

var fixQuotedTweets = function() {
  var start = getCurrentMillis();
  $(".QuoteTweet-container:not(." + fixedClass + ")").each(function(){
    var elem = $(this);
    var link = elem.find(".QuoteTweet-innerContainer").attr("href");
    elem.wrap($("<a/>").attr("href", link));
    elem.addClass(fixedClass);
  });
  var end = getCurrentMillis();
  var elapsed = end - start;
  //console.log("Processing of quoted tweets took " + elapsed + "ms.");
};

setInterval(fixQuotedTweets, 1000);
