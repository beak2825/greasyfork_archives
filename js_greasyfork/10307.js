// ==UserScript==
// @name        DMM.CookieEdit
// @namespace   Temple.Lab.Dmm.CookieEdit
// @description 스크립트 사용전 DMM에 접속한 경우 먼저 쿠키를 삭제한 뒤에 사이트에서 일본어 선택후 해당 게임으로 접속하시면 됩니다.
// @include     http://www.dmm.com/*
// @include     http://osapi.dmm.com/*
// @include     http://log-netgame.dmm.com/*
// @include     203.104.209.7/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10307/DMMCookieEdit.user.js
// @updateURL https://update.greasyfork.org/scripts/10307/DMMCookieEdit.meta.js
// ==/UserScript==

// 쿠키가 유지되는 기간(일)을 변경할 수 있습니다.
// 기본설정 : 10년(3650일)
var remain_day = 3650;

var d = new Date();
d.setTime(d.getTime()+(remain_day*24*60*60*1000));
var expires = "expires="+d.toGMTString();

document.cookie = "ckcy=1;" + expires + ";domain=osapi.dmm.com;path=/";
document.cookie = "ckcy=1;" + expires + ";domain=203.104.209.7;path=/";
document.cookie = "ckcy=1;" + expires + ";domain=www.dmm.com;path=/netgame/";
document.cookie = "ckcy=1;" + expires + ";domain=log-netgame.dmm.com;path=/";