/*

Original Fix Copyright (c) 2010-2014, don't steal or i rephoat yu
Released under the GPL license
http://www.gnu.org/copyleft/gpl.html

*/
// ==UserScript==
// @name          Facepunch Logout Button
// @namespace     http://www.facepunch.com/*
// @description   The only true and aesthetically pleasing log out button for FP
// @include       http://facepunch.com/*
// @include       http://www.facepunch.com/*
// @include       http://*.facepunch.com/*
// @include	  http://www.facepunch.com/login.php?do=logout
// @include       https://facepunch.com/*
// @include       https://www.facepunch.com/*
// @include       https://*.facepunch.com/*
// @include	  https://www.facepunch.com/login.php?do=logout

// @version 0.0.1.20180309222324
// @downloadURL https://update.greasyfork.org/scripts/23440/Facepunch%20Logout%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/23440/Facepunch%20Logout%20Button.meta.js
// ==/UserScript==

//logout
if (document.URL.match(/.*facepunch\.com\/login\.php\?do=logout/))
    document.location = document.getElementsByClassName("blockrow restore")[0].getElementsByTagName("a")[0].href;

var allNav, thread, indicator, ogout;
allNav = document.getElementsByClassName('navbarlink');
nav = allNav[allNav.length - 1];
logoutText = '<a href="http://www.facepunch.com/login.php?do=logout"><img src="http://www.facepunch.com/fp/navbar/register.png" alt="Log Out"> Log Out</a>';
logout = document.createElement("div");
var logout = document.createElement("a");
logout.setAttribute("class","navbarlink floatright");
logout.innerHTML = logoutText;
nav.parentNode.insertBefore(logout, nav.nextSibling);