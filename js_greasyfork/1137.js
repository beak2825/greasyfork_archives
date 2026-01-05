// ==UserScript==
// @name         Let Confirm Go Away
// @description  去除qq群共享qq旋风弹窗
// @author       陌百百<feng_zilong@163.com>
// @include      http://qun.qzone.qq.com/*
// @version      2.0
// @namespace https://greasyfork.org/users/1438
// @downloadURL https://update.greasyfork.org/scripts/1137/Let%20Confirm%20Go%20Away.user.js
// @updateURL https://update.greasyfork.org/scripts/1137/Let%20Confirm%20Go%20Away.meta.js
// ==/UserScript==
unsafeWindow.confirm = function(msg){return false;};
unsafeWindow.downloadFileByIframe = function(a,d){window.open (a.url + "/" + d.filename); };