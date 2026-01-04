// ==UserScript==
// @name        Auto-Refresh
// @author      AC
// @version    	1.0
// @description       Auto refresh page
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @include		http://hi5.com/friend/games/MouseHunt*
// @include		http://mousehunt.hi5.hitgrab.com/*
// @namespace https://greasyfork.org/users/166324
// @downloadURL https://update.greasyfork.org/scripts/423553/Auto-Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/423553/Auto-Refresh.meta.js
// ==/UserScript==

var randomnumber = Math.floor(Math.random() * 900) + 450;
var d = new Date();
console.log(d.toLocaleTimeString() + " Auto refresh: " + randomnumber + " seconds until next refresh");
setTimeout(function(){ location.reload(); }, 1000 * randomnumber);
