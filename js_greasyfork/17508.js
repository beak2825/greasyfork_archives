// ==UserScript==
// @name        m-team https fix - download
// @namespace   m-team
// @version     0.99
// @grant       none
// @include     https://tp.m-team.cc/*
// @description Convert in-site http links to https
// @description:zh-CN 将种子下载 http 链接转换为 https
// @description:zh-TW 將种子下载 http 鏈接轉換為 https
// @downloadURL https://update.greasyfork.org/scripts/17508/m-team%20https%20fix%20-%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/17508/m-team%20https%20fix%20-%20download.meta.js
// ==/UserScript==

//替换 http 链接为 https
(function () {
  var snapResults = document.evaluate('//a[starts-with(@href,\'http://tp.m-team.cc/\')]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = snapResults.snapshotLength - 1; i >= 0; i--) {
    var elm = snapResults.snapshotItem(i);
    var href = elm.getAttribute('href');
    href = href.replace(/^http/, 'https');
    elm.setAttribute('href', href);
  }
}) ();

