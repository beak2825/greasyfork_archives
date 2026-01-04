// ==UserScript==
// @name        Wanikani Sailor Power
// @namespace   wksapo
// @description Adds an ancient wig known to have great powers to the already great crabigator
// @include     http://www.wanikani.com/*
// @include     https://www.wanikani.com/*
// @version     1.0
// @author      Fier
// @grant    GM_addStyle
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/372775/Wanikani%20Sailor%20Power.user.js
// @updateURL https://update.greasyfork.org/scripts/372775/Wanikani%20Sailor%20Power.meta.js
// ==/UserScript==

GM_addStyle ( `
html#main .navbar .nav>li.title>a>span:first-child,html#public-profile .navbar .nav>li.title>a>span:first-child {
 background-image:url("https://i.postimg.cc/HWhjt1X7/sorry.png") !important;
}
` );