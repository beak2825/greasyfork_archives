// ==UserScript==
// @name        m-team https fix - img
// @namespace   m-team
// @version     0.99
// @grant       none
// @include     https://tp.m-team.cc/*
// @description Convert in-site http links to https
// @description:zh-CN 将站内 图片 http 链接转换为 https
// @description:zh-TW 將站內 图片 http 鏈接轉換為 https
// @downloadURL https://update.greasyfork.org/scripts/17506/m-team%20https%20fix%20-%20img.user.js
// @updateURL https://update.greasyfork.org/scripts/17506/m-team%20https%20fix%20-%20img.meta.js
// ==/UserScript==

//替换 站内图片 地址为 https
(function () {
  var snapResults = document.evaluate('//img[starts-with(@src,\'http://img.m-team.cc/\')]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = snapResults.snapshotLength - 1; i >= 0; i--) {
    var elm = snapResults.snapshotItem(i);
    var attrs = elm.attributes;
    for (var j = attrs.length - 1; j >= 0; j--) {
      var name = attrs[j].name;
      var value = attrs[j].value;
      elm.setAttribute(name, value.replace(/http(:\/\/img\.m-team\.cc)/gi, 'https$1'));
    }
  }
}) ();
