// ==UserScript==
// @name        m-team https fix - default tracker
// @namespace   m-team
// @version     0.99
// @grant       none
// @include     https://tp.m-team.cc/*
// @description Convert in-site http links to https
// @description:zh-CN 站内种子默认下载 https tracker 版本
// @description:zh-TW 站內種子默認下載 https tracker 版本
// @downloadURL https://update.greasyfork.org/scripts/17509/m-team%20https%20fix%20-%20default%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/17509/m-team%20https%20fix%20-%20default%20tracker.meta.js
// ==/UserScript==

//替换默认 download 链接为 https tracker 版本
(function () {
  var snapResults = document.evaluate('//a[starts-with(@href, \'download.php?\')]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = snapResults.snapshotLength - 1; i >= 0; i--) {
    var elm = snapResults.snapshotItem(i);
    var href = elm.getAttribute('href');
    href = href + '&https=1';
    elm.setAttribute('href', href);
  }
}) ();
