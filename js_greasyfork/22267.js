// ==UserScript==
// @name        Wowhead
// @namespace   lander_scripts
// @description Clicks the hide ads in wowhead window and properly resizes site for removed ads.
// @include     *wowhead.com/*
// @version     1.17
// @grant       none
// @icon        http://www.userlogos.org/files/logos/dartraiden/wowhead.png
// @downloadURL https://update.greasyfork.org/scripts/22267/Wowhead.user.js
// @updateURL https://update.greasyfork.org/scripts/22267/Wowhead.meta.js
// ==/UserScript==

document.querySelector('.header-expand-site-tab').click();
//document.getElementById('page-content').style.paddingRight = "0px";
//document.getElementById('sidebar').style.padding= "0px";

//var element = document.getElementById("sidebar-wrapper");
//element.parentNode.removeChild(element);

console.info('No Ads Script Loaded');