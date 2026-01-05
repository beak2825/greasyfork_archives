// ==UserScript==
// @name         Wantedly Like
// @namespace    https://greasyfork.org/ja/users/61980-kuma
// @version      0.3.7
// @description  try to take over the world!
// @author       kuma
// @match        https://www.wantedly.com/*
// @exclude     https://www.wantedly.com/feed?filter_type=liked
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/22658/Wantedly%20Like.user.js
// @updateURL https://update.greasyfork.org/scripts/22658/Wantedly%20Like.meta.js
// ==/UserScript==

(function() {
  'use strict';

  $(function() {
    var isPC = $('#global-header').length;
    var target = isPC ? '.post-like-button:not(.liked)' : '[class*=PostLikeButton--btn-off]';
    if (~location.href.indexOf('companies')) {
      console.log('company');
      return;
    }
    function start() {
      var num = $(target).length;
      $('#wantedlyLike').text(num);
      if (num) {
        $(target)[0].click();
      } else if (~location.href.indexOf('feed')){
        var height = Math.max(
          document.documentElement.clientHeight,
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        );
        window.scrollTo(0, height);
      }
      setTimeout(start, 300 * (Math.random() * 2 + 4));
    }
    $('body').append('<div id="wantedlyLike" style="font-size:40px;color:black;position:fixed;top:50px;left:50px;z-index:9999999;"></div>');
    start();
    $(window).on('ajaxComplete', function(e, t, c) {
      if (c.type === 'GET' && c.url.indexOf('/feed?') > -1) {
        console.log(t, c);
        history.pushState(null, null, c.url.replace('&layout=false', ''));
      } else if (/internal\/posts\/.*\/like/.test(c.url) && t.status !== 200) {
        console.log(t);
        var reg = /page=(\d*)/;
        var match = location.href.match(reg);
        var nextPage = match ? Number(match[1]) + 1 : NaN;
        if (nextPage) {

          location.href = location.href.replace(reg, 'page=' + nextPage);
        }
      }
    });
  });
})();
