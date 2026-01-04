// ==UserScript==
// @name        423down自动登录
// @namespace   https://greasyfork.org/users/91873
// @match       https://www.423down.com/
// @include     http*://*.423down.com/*
// @include     http*://423down.com/*
// @grant       none
// @version     1.0.0.0
// @author      wujixian
// @description 423down auto Login
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/466929/423down%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/466929/423down%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  //获取当前所有cookie
  var strCookies = document.cookie;
  if (strCookies.indexOf("wordpress_logged")==-1) {
    document.cookie="wordpress_logged_in_1be7ff3fe7182ee46f8a34f915954197=zm1477878%7C1684943136%7CisRj0BYNDnb39MPerbZlzLlzDgvD4LsqrBqtvvRVjzu%7Ce3f31ec5eaa98b5d5d4715cd7a192f0014c5a4bbeddf3dc435414c4cc3ad2da8;domain=.423down.com;path=/;";
    document.cookie="PHPSESSID=v5ifmlkcqa1dabclr1cdmvkaml;domain=www.423down.com;path=/;";
    document.cookie="wordpress_test_cookie=WP%20Cookie%20check;domain=.423down.com;path=/;";
    document.cookie="X_CACHE_KEY=76a8c3562213265eb6188aad69294eb9;domain=www.423down.com;path=/;";
    location.reload();
  }
}) ();