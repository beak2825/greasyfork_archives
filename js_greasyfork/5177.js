// ==UserScript==
// @name        Uncheck Google Stay Signed In
// @namespace   ugssi
// @description Disable google's automatic sign-in, yes, as simple as that
// @include     http://accounts.google.tld/*
// @include     https://accounts.google.tld/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5177/Uncheck%20Google%20Stay%20Signed%20In.user.js
// @updateURL https://update.greasyfork.org/scripts/5177/Uncheck%20Google%20Stay%20Signed%20In.meta.js
// ==/UserScript==
var chkbox = document.getElementById('PersistentCookie');
chkbox.removeAttribute('checked');
