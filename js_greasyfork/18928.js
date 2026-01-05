// ==UserScript==
// @author        Niqueish
// @name          Uczuciopedia fix
// @description	  Cukierberg cos ty odjebal
// @homepage      https://www.facebook.com/kamcio43924
// @version       1.1
// @namespace     facebook.com/groups/1593143367617966/
// @include       http://facebook.com/groups/1593143367617966/*
// @include       https://facebook.com/groups/1593143367617966/*
// @include       http://www.facebook.com/groups/1593143367617966/*
// @include       https://www.facebook.com/groups/1593143367617966/*
// @include       http://app.facebook.com/groups/1593143367617966/*
// @include       https://app.facebook.com/groups/1593143367617966/*
// @downloadURL https://update.greasyfork.org/scripts/18928/Uczuciopedia%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/18928/Uczuciopedia%20fix.meta.js
// ==/UserScript==
var url = /^(https?:\/\/[a-z]+)(\.facebook\.com\/.*)/.exec(location.href);
if (url) { window.location = "https://" + "m" + url[2]; }