// ==UserScript==
// @name        调整eyny论坛帖子宽度为全屏显示
// @namespace   lolicraft
// @match        *://www.eyny.com/*
// @include     http://*.eyny.com/index.php
// @include     http://*.eyny.com/
// @include     http://www.eyny.com/
// @include     https://*.eyny.com/index.php
// @require		 https://code.jquery.com/jquery-latest.js
// @version     1.2
// @grant       none
// @run-at		 document-end
// @license MIT
// @description 调整eyny论坛帖子宽度为全屏显示，嗯。
// @downloadURL https://update.greasyfork.org/scripts/436581/%E8%B0%83%E6%95%B4eyny%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E5%AE%BD%E5%BA%A6%E4%B8%BA%E5%85%A8%E5%B1%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/436581/%E8%B0%83%E6%95%B4eyny%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E5%AE%BD%E5%BA%A6%E4%B8%BA%E5%85%A8%E5%B1%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

// 调整enny论坛帖子宽度为100%

// Your Settings here
function Main()
{
   $(".wp").width("100%")
}
Main()
