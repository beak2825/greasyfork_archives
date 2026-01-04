// ==UserScript==
// @name         Weibored.js HTTPS
// @namespace    http://vito.sdf.org
// @version      0.2.1
// @description  删除所有微博 HTTPS版
// @author       Vito Van     yanhuihang修改
// @match        https://weibo.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419628/Weiboredjs%20HTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/419628/Weiboredjs%20HTTPS.meta.js
// ==/UserScript==
'use strict';

var s = document.createElement('script');
s.setAttribute(
  'src',
  'https://lib.sinaapp.com/js/jquery/2.0.3/jquery-2.0.3.min.js'
);
s.onload = function() {
  setInterval(function() {
    if (!$('a[action-type="feed_list_delete"]')) {
      $('a.next').click();
    } else {
      $('a[action-type="feed_list_delete"]')[0].click();
      $('a[action-type="ok"]')[0].click();
    }

    // scroll bottom let auto load
    $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
  }, 800);
};
document.head.appendChild(s);
