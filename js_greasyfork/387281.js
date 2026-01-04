// ==UserScript==
// @name         replace logo
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  shows how to use babel compiler
// @author       You
// @match        https://10.20.30.100/*
// @resource http://47.92.126.243:8080/light2/img/logo-new.png
// @run-at document-start
// @grant GM_addStyle
// @require https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387281/replace%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/387281/replace%20logo.meta.js
// ==/UserScript==
var lightBaseURL = 'http://light.shandonghfzl.com'
// var lightBaseURL = 'http://127.0.0.1:8080'
var lightNoPassword = lightBaseURL + '/light2/login_nopassword.html'

GM_addStyle("body {display: none}");

GM_addStyle(".login-logo { background-image: url(http://light.shandonghfzl.com/light2/img/logo-new.png) !important; text-indent: 45px;}");
GM_addStyle(".header div.left>b { background: url(http://light.shandonghfzl.com/light2/img/logo-new.png) no-repeat; text-indent: 45px; width: 40px}");
GM_addStyle(".logo>b { background: url(http://light.shandonghfzl.com/light2/img/logo-new.png) no-repeat !important; text-indent: 45px; width: 40px !important}");
GM_addStyle("#navbar h1.login-logo { background-size: 15% !important;text-indent: 60px}");

setTimeout(() => {
  GM_addStyle("body {display: block}");
}, 100)

// js操作
// 替换路灯平台链接
if (window.location.href.match(/.*index\.php/) !== null) {
  $('.list-inline.text-center.white .light a')
    .attr('href', lightNoPassword)
    .attr('target', '_blank')
}