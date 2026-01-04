// ==UserScript==
// @name                论坛帖子按发帖时间排序
// @namespace          a@b.c
// @author             https://greasyfork.org/zh-CN/scripts/18259
// @description        论坛自动按发帖时间排序，支持 discuz 和 phpwind
// @include                */forum-*
// @include                */forum.php?mod=forumdisplay*
// @include                */thread-*
// @include                */thread/*
// @include                */thread.php?fid*
// @include                */index.php?c=thread&fid=*
// @include                *hualongxiang.com/*
// @grant                  none
// @charset                UTF-8
// @version                0.3
// @downloadURL https://update.greasyfork.org/scripts/421223/%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E6%8C%89%E5%8F%91%E5%B8%96%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/421223/%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E6%8C%89%E5%8F%91%E5%B8%96%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==
var bydate = document.querySelector('#filter_dateline_menu > .pop_moremenu a[href*="orderby=dateline"], #filter_threadsort_menu > .pop_moremenu a[href*="orderby=dateline"], #filter_orderby_menu a[href*="orderby=dateline"], .colplural .author a[href*="orderby=dateline"], a[href$="orderby=dateline"]') || document.querySelector('.content_filter a[href*="orderby=postdate"], .thread_sort a[href*="orderway"][href*="postdate"], #threadlist .mr20 a[href][onclick^="orderThreads(\'postdate\')"]')|| document.querySelector('#ajaxtable > .fl a[href*="orderway=postdate"]');
if (bydate && !/\#tabA|-orderway-|orderby=/.test(location.href)) bydate.click();