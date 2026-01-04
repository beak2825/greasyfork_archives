// ==UserScript==
// @name        Redirect all to update.facebook.com (Old layout Facebook w.o UserAgent change)
// @description This script automatic remote all traffic from facebook.com to upload.facebook.com (this is old layout sub domain)
// @include     https://www.facebook.com*
// @exclude     https://www.facebook.com/messages/*
// @version     1
// @run-at      document-start
// @namespace https://greasyfork.org/users/152841
// @downloadURL https://update.greasyfork.org/scripts/412731/Redirect%20all%20to%20updatefacebookcom%20%28Old%20layout%20Facebook%20wo%20UserAgent%20change%29.user.js
// @updateURL https://update.greasyfork.org/scripts/412731/Redirect%20all%20to%20updatefacebookcom%20%28Old%20layout%20Facebook%20wo%20UserAgent%20change%29.meta.js
// ==/UserScript==

var currentUrl = window.location.toString();
if (currentUrl.indexOf('www.facebook.com') !== - 1)window.location = currentUrl.replace('www.facebook.com', 'upload.facebook.com');
