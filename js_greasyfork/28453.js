// ==UserScript==
// @name        Reddit Infinite Scrolling
// @namespace   darkred
// @author      darkred
// @description Adds infinite scrolling to subreddits and to comments.
// @include     https://www.reddit.com/*
// @version     2015.12.14
// @grant       unsafeWindow
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @require     https://greasyfork.org/scripts/11636-jscroll/code/jScroll.js?version=67302
// @downloadURL https://update.greasyfork.org/scripts/28453/Reddit%20Infinite%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/28453/Reddit%20Infinite%20Scrolling.meta.js
// ==/UserScript==

// Jscroll code
$('#siteTable').jscroll({
  nextSelector: 'span.nextprev a:last',
  contentSelector: '#siteTable .thing, .nav-buttons',
  callback: function () {
    $('.nav-buttons').remove();
  }
});
