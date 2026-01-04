// ==UserScript==
// @name        Jenkins Tools for mira ci
// @namespace   Violentmonkey Scripts
// @run-at      document-ready
// @version     1.0
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/1.7.2/jquery.min.js
// @author      -
// @include     http://ci.mirav.cn:*/job/*
// @description tools for ci
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440797/Jenkins%20Tools%20for%20mira%20ci.user.js
// @updateURL https://update.greasyfork.org/scripts/440797/Jenkins%20Tools%20for%20mira%20ci.meta.js
// ==/UserScript==

const map = {
  'leo.zhaojun': '赵赵',
  '394592901': '三一',
  'a6037220': '胖子',
  'Marandi': '浩然',
  'penghui': '大雄',
}

$('a:contains("githubweb")').each((i, e) => {
  $(e).css('color', '#eef');
  const name = $(e).prev().text();
  if (map[name]) $(e).prev().text(map[name]).css('color', '#4994ec');
});

$('a:contains("commit:")').each((i, e) => {
  $(e).css('color', '#ccc');
});