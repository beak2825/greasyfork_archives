// ==UserScript==
// @name        [Google News] Hide already bookmarked article
// @description Google Newsで、Bookmark済みの記事を非表示
// @version     0.3
// @author      takashi
// @match       https://news.google.com/*
// @grant       none
// @namespace https://greasyfork.org/users/314232
// @downloadURL https://update.greasyfork.org/scripts/387051/%5BGoogle%20News%5D%20Hide%20already%20bookmarked%20article.user.js
// @updateURL https://update.greasyfork.org/scripts/387051/%5BGoogle%20News%5D%20Hide%20already%20bookmarked%20article.meta.js
// ==/UserScript==

(function() {
  'use strict';
  setInterval(function() {
    var e = document.querySelectorAll('div[data-n-ca-at="3"]');
    for (var i = e.length; i--;) {
      e.item(i).parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
    }
  },1000);

})();