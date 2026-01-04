// ==UserScript==
// @name Auto Click Checkin and Skip Welcome
// @namespace http://tampermonkey.net/
// @version 0.2
// @description Auto click active daily check-in and skip welcome
// @author You
// @match https://genesis.chainbase.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/523329/Auto%20Click%20Checkin%20and%20Skip%20Welcome.user.js
// @updateURL https://update.greasyfork.org/scripts/523329/Auto%20Click%20Checkin%20and%20Skip%20Welcome.meta.js
// ==/UserScript==
(function(){let w=function(){let b=document.querySelector('.css-18b0n53');b?b.click():setTimeout(w,250)},c=function(){let a=document.querySelector('.css-19t9gey');a?a.click():setTimeout(c,250)};w();setTimeout(c,1000)})();