// ==UserScript==
// @name       Dospy论坛自动签到
// @version    0.0.2
// @namespace    undefined
// @description  自动签到工具
// @include      http://bbs.dospy.com/*
// @license      GPL v3
// @downloadURL https://update.greasyfork.org/scripts/22130/Dospy%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/22130/Dospy%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
var findtext = function (text) {
  let body = document.body || document.getElementsByTagName('body')[0] || document.lastElementChild;
  return body.innerText.match(text);
};
if (!findtext('今日已签到')) {
  var url = './getview.php?type=signadd';
  if (this.Ajax) {
    sajax = Ajax('JSON');
    sajax.post(url + '&inajax=1&rod=' + Math.random(), 'year=0' + "&month=0", showSign);
  } else {
    fetch('./getview.php?type=signadd' + '&inajax=1&rod=' + Math.random(), 'year=0' + "&month=0", {
      method: "POST"
    });
  }
}