// ==UserScript==
// @author      tm1
// @name        Uncheck Stay signed in checkbox (Remember PersistentCookie) at GMail login page
// @namespace   nothing
// @description Disable google's automatic "Stay signed in" checkbox at GMail login page
// @include     http://accounts.google.tld/*
// @include     http://accounts.google.com/*
// @include     https://accounts.google.tld/*
// @include     https://accounts.google.com/*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27444/Uncheck%20Stay%20signed%20in%20checkbox%20%28Remember%20PersistentCookie%29%20at%20GMail%20login%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/27444/Uncheck%20Stay%20signed%20in%20checkbox%20%28Remember%20PersistentCookie%29%20at%20GMail%20login%20page.meta.js
// ==/UserScript==

var chkbox = document.getElementById('PersistentCookie');
chkbox.removeAttribute('checked');