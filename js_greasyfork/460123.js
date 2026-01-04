// ==UserScript==
// @name HS 設定
// @description HS設定
// @license MIT
// @version  0.0.1
// @include *://3scasino.com/*
// @grant none
// @namespace https://greasyfork.org/users/1028078
// @downloadURL https://update.greasyfork.org/scripts/460123/HS%20%E8%A8%AD%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/460123/HS%20%E8%A8%AD%E5%AE%9A.meta.js
// ==/UserScript==

var host = "http://3scasino.com"
var username = "帳號"
var password = "密碼"
const room = "房號"


if (unsafeWindow.host == undefined) {
   unsafeWindow.host = host;
}
if (unsafeWindow.username == undefined) {
   unsafeWindow.username = username;
}
if (unsafeWindow.password == undefined) {
   unsafeWindow.password = password;
}
if (unsafeWindow.room == undefined) {
   unsafeWindow.room = room;
}

