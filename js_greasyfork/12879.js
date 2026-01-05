// ==UserScript==
// @name          test_alert
// @description   test
// @author         Sasha Vas
// @include       *://localhost/*
// @include       *://usrinfo.irc.gov.ua/*
// @version 0.0.1.20151005151524
// @namespace https://greasyfork.org/users/17234
// @downloadURL https://update.greasyfork.org/scripts/12879/test_alert.user.js
// @updateURL https://update.greasyfork.org/scripts/12879/test_alert.meta.js
// ==/UserScript==

 var btn = document.createElement("BUTTON");
var t = document.createTextNode("qwe");
btn.appendChild(t);
btn.id = 'test';
document.body.appendChild(btn);

document.getElementById('test').onclick=function(){
t = document.getElementById("irc_iframe").contentDocument.body.innerHTML;
alert(t);
}