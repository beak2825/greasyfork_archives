// ==UserScript==
// @name         什么值得买屏蔽小冰的评论
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.smzdm.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/394521/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E5%B1%8F%E8%94%BD%E5%B0%8F%E5%86%B0%E7%9A%84%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/394521/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E5%B1%8F%E8%94%BD%E5%B0%8F%E5%86%B0%E7%9A%84%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

$(document).ready(function(){
  $("span[itemprop='author']:contains('小冰')").parents('li.comment_list').hide();
});