// ==UserScript==
// @name        fb-right-sidebar-hider
// @namespace   fb-right-sidebar-hider
// @description Removes the right sidebar from Facebook
// @include     *://www.facebook.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27021/fb-right-sidebar-hider.user.js
// @updateURL https://update.greasyfork.org/scripts/27021/fb-right-sidebar-hider.meta.js
// ==/UserScript==

var elements = document.getElementsByClassName("fbChatSidebar");
    for(var i = 0, leng = elements.length; i < leng; i++) {
          elements[i].style.display = 'none';
       } 

var elements = document.getElementsByClassName("uiToggle");
    for(var i = 0, leng = elements.length; i < leng; i++) {
          elements[i].style.display = 'none';
       }