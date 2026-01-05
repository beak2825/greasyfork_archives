// ==UserScript==
// @name	    Google ncr
// @namespace   http://bbs.kafan.cn/thread-1803567-1-1.html
// @version     0.2
// @description	自动重定向至google.com
// @author      adia
// @include     http://*.google.co.jp/search?*
// @include     https://*.google.co.jp/search?*
// @match       http://*.google.co.jp/search?*
// @match       https://*.google.co.jp/search?*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24705/Google%20ncr.user.js
// @updateURL https://update.greasyfork.org/scripts/24705/Google%20ncr.meta.js
// ==/UserScript==
window.location.href = window.location.href.replace(/google\.co\.jp\/search\?/, 'google.com/ncr#newwindow=1&');
