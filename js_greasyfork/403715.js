// ==UserScript==
// @name         全自动批量删除新浪微博
// @namespace    https://mp.weixin.qq.com/s/jif5WcnbS2lsQ3ufeikxmg
// @version      0.1
// @description  全自动批量清理微博已发的条数，是目前有效批量删除的办法
// @author       由刹客网络科技提供 这是公众号文章https://mp.weixin.qq.com/s/jif5WcnbS2lsQ3ufeikxmg
// @match             https://*.weibo.com/*
// @include           https://weibo.com/*
// @include           https://*.weibo.com/*
// @include           https://weibo.com/a/bind/*
// @include           https://account.weibo.com/*
// @include           https://kefu.weibo.com/*
// @include           https://photo.weibo.com/*
// @include           https://security.weibo.com/*
// @include           https://verified.weibo.com/*
// @include           https://vip.weibo.com/*
// @include           https://open.weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403715/%E5%85%A8%E8%87%AA%E5%8A%A8%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/403715/%E5%85%A8%E8%87%AA%E5%8A%A8%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A.meta.js
// ==/UserScript==

(function() {
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

          $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
     }, 500);
};
document.head.appendChild(s);
})();