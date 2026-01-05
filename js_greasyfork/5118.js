// ==UserScript==
// @name        replacegmaillogohtml
// @namespace   gmailhtml
// @description replace the google image with another one in gmail in the html-only version
// @include     https://mail.google.com/mail/u/0/h/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5118/replacegmaillogohtml.user.js
// @updateURL https://update.greasyfork.org/scripts/5118/replacegmaillogohtml.meta.js
// ==/UserScript==
var url="http://www.phdcomics.com/comics/archive/phd051208s.gif";
var table=document.children[0].children[1].children[14];
var link=table.children[0].children[0].children[0].children[0].children[0];
var image= link.children[0];
image.src=url;
image.height=120;
image.width=210;