// ==UserScript==
// @name        FACEBOOK_NO_SIDEBAR_02_12_20
// @namespace   FACEBOOK_NO_SIDEBAR_02_12_20
// @description Hides the right sidebar
// @include     *://www.facebook.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/396353/FACEBOOK_NO_SIDEBAR_02_12_20.user.js
// @updateURL https://update.greasyfork.org/scripts/396353/FACEBOOK_NO_SIDEBAR_02_12_20.meta.js
// ==/UserScript==

var elements = document.getElementsByClassName("fbChatSidebar");
    for(var i = 0, leng = elements.length; i < leng; i++) {
          elements[i].style.display = 'none';
       } 
