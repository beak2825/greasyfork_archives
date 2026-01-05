// ==UserScript==
// @name         RT_CN CSSer
// @namespace    http://ihead.info/
// @version      0.1
// @description  中文推特昨日热榜 / 7天收藏榜 美化脚本
// @author       @ihead
// @match        http://xixitalk.github.io/twitter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10924/RT_CN%20CSSer.user.js
// @updateURL https://update.greasyfork.org/scripts/10924/RT_CN%20CSSer.meta.js
// ==/UserScript==
var styleEl = document.createElement('style');
styleEl.type = 'text/css';
styleEl.innerHTML = 'body{background-color:#f5f8fa;margin:0;padding:0;}img{margin:6;}tr{background:#eee;}tr:nth-child(2n){background:#ccc}tr{background-color:expression((this.sectionRowIndex % 2 == 0) ? "#eee":"#ccc")}';
document.documentElement.appendChild(styleEl);

var tags = document.getElementsByTagName('table');
// This loops over all of the <table> tags.
for (var i = 0; i < tags.length; i++) {
  // This replaces the src attribute of the tag with the modified one
  tags[i].border = tags[i].border.replace('1', '0');
}