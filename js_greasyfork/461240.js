// ==UserScript==
// @name     CL 多台設定
// @description CL 多台的設定
// @license MIT
// @version  0.0.5
// @include *://www.cali999.net/*
// @include *://www.cali888.net/*
// @include *://www.cali777.net/*
// @include *://www.cali666.net/*
// @include *://www.cali555.net/*
// @include *://www.cali333.net/*
// @include *://www.cali1122.net/*
// @include *://www.cali2233.net/*
// @include *://www.calibet8.net/*
// @include *://www.calibet9.net/*
// @include *://www.cali1356a.net/*
// @include *://www.cali1356b.net/*
// @grant    none
// @namespace https://greasyfork.org/users/1028078
// @downloadURL https://update.greasyfork.org/scripts/461240/CL%20%E5%A4%9A%E5%8F%B0%E8%A8%AD%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/461240/CL%20%E5%A4%9A%E5%8F%B0%E8%A8%AD%E5%AE%9A.meta.js
// ==/UserScript==
//----------------------------------
var host = "https://www.cali888.net/"
var username = "帳號"
var password = "密碼"
var room = [' Q001', ' Q002', ' Q003', ' Q004', ' Q005', ' B031', ' B001', ' B002', ' B018', ' B019', ' B301', ' B302', ' B303', ' B304', ' B305'];
var bet = 100;
var chipCode1 = [2];
var chipCode2 = 176;
//------------------------------

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
if (unsafeWindow.bet == undefined) {
   unsafeWindow.bet = bet;
}
if (unsafeWindow.chipCode1 == undefined) {
   unsafeWindow.chipCode1 = chipCode1;
}
if (unsafeWindow.chipCode2 == undefined) {
   unsafeWindow.chipCode2 = chipCode2;
}

