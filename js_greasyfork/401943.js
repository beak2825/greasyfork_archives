// ==UserScript==
// @name            javbus去广告
// @description     去广告
// @match           *://www.seedmm.zone/*
// @version         0.0.2
// @grant           GM_addStyle
// @namespace https://greasyfork.org/users/541261
// @downloadURL https://update.greasyfork.org/scripts/401943/javbus%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/401943/javbus%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
var tags=document.getElementsByClassName("ad-table");
for(var i=0;i<tags.length;i++){
tags[i].style.display="none"
}