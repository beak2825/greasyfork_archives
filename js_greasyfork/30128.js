// ==UserScript==
// @name        小小木虫
// @namespace   http://userscripts.org/users/tumuyan
// @include     http://emuch.net/bbs/*
// @exclude     http://emuch.net/bbs/*emobile=1*
// @exclude     http://emuch.net/bbs/index.php
// @version     1
// @description 小木虫论坛的排版很糟糕,本来打算再次升级我的作品"bbs new look",又看到小木虫本来就有简洁的手机版。 于是写了这个脚本，它能够在打开小木虫论坛的版块,或者小木虫论坛的帖子时,自动跳转到手机版.
// @downloadURL https://update.greasyfork.org/scripts/30128/%E5%B0%8F%E5%B0%8F%E6%9C%A8%E8%99%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/30128/%E5%B0%8F%E5%B0%8F%E6%9C%A8%E8%99%AB.meta.js
// ==/UserScript==
location.href=document.URL + "&emobile=1"