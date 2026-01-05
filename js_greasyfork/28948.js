// ==UserScript==
// @name	    Google ncr 2017
// @namespace   http://bbs.kafan.cn/thread-1803567-1-1.html
// @version     2
// @description	自动重定向至google.com
// @author      adia
// @include     http://*.google.co.jp/*
// @include     https://*.google.co.jp/*
// @match       http://*.google.co.jp/*
// @match       https://*.google.co.jp/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28948/Google%20ncr%202017.user.js
// @updateURL https://update.greasyfork.org/scripts/28948/Google%20ncr%202017.meta.js
// ==/UserScript==
window.location.href = window.location.href.replace(/google\.co\.jp\/\?/, 'google.com/ncr#newwindow=1&');