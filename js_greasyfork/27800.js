// ==UserScript==
// @name        JoinDota's Ignore User
// @namespace   joindotaignoreuser
// @description Brings back JD's ignore function. Beta release without user interface yet.
// @include     https://www.joindota.com/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27800/JoinDota%27s%20Ignore%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/27800/JoinDota%27s%20Ignore%20User.meta.js
// ==/UserScript==

var ele = document.getElementsByClassName('forum_post')
for (var i = ele.length - 1; i >= 0; i--) {
  if (ele[i].getElementsByTagName('a')[1].innerHTML.indexOf('430_') != -1) {
    
    ele[i].style.display = 'none'
  }
}