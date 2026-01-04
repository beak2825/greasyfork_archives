// ==UserScript==
// @name         DisqusTimestampForumlink
// @version      0.2
// @description  Open disqus comment in the forum when its timestamp is clicked
// @author       xy
// @match        https://disqus.com/*
// @namespace https://greasyfork.org/users/809293
// @downloadURL https://update.greasyfork.org/scripts/431499/DisqusTimestampForumlink.user.js
// @updateURL https://update.greasyfork.org/scripts/431499/DisqusTimestampForumlink.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function threadUrl(threadId, hash) {
    const apiKey = 'tWtbL1OV8by298LctEFv9ccPxqJ7DUCg5sS064ItLBAWl11EdFJYcHqIgiZCVvS1';
    var link = 'https://disqus.com/home/discussion/';
    /* global $ */
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: 'https://disqus.com/api/3.0/threads/details.json',
      data: {
        api_key: apiKey,
        thread: threadId,
      },
      async: false,
      success: function(data) {
        var r = data.response;
        link += r.forum + '/' + r.slug + '/' + hash;
      }});
    return link;
  }

  document.addEventListener('click', (event) => {
    const validPaths = ['/home/inbox/', '/by/'];
    const validClasses = ['card-comment-truncated', 'link-gray time'];
    var clicked = event.target;
    if (validPaths.some(s => window.location.href.includes(s))
        && validClasses.some(s => clicked.className.includes(s))) {
      clicked.href = threadUrl(clicked.dataset.threadId, clicked.hash);
    }});
})();