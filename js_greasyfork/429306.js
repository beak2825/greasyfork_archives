// ==UserScript==
// @name        Auto-Refresh
// @author      KS
// @version    	1.4
// @license MIT
// @description       Auto refresh page every 20 mins
// @include		https://3mcitrix.mmm.com/Citrix/3MWeb/
// @include		https://gw-mydesktop-eq1.usaa.com/Citrix/*
// @include		https://gw-mydesktop-eq2.usaa.com/Citrix/*
// @include		https://gw-mydesktop-eq3.usaa.com/Citrix/*
// @namespace https://greasyfork.org/users/63870
// @downloadURL https://update.greasyfork.org/scripts/429306/Auto-Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/429306/Auto-Refresh.meta.js
// ==/UserScript==
 
var randomnumber = 1111;
var d = new Date();
console.log(d.toLocaleTimeString() + " Auto refresh: " + randomnumber + " seconds until next refresh");
setTimeout(function(){ location.reload(); }, 1000 * randomnumber);