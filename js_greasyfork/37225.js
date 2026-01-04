// ==UserScript==
// @name       TheOldReader - improved interface
// @description       Improve TheOldReader RSS feed reader interface
// @namespace https://greasyfork.org/ro/scripts/37225/
// @include     *theoldreader.com*
// @include        https://theoldreader.com/feeds/*
// @grant          GM_addStyle
// @version     1.0.2
// @downloadURL https://update.greasyfork.org/scripts/37225/TheOldReader%20-%20improved%20interface.user.js
// @updateURL https://update.greasyfork.org/scripts/37225/TheOldReader%20-%20improved%20interface.meta.js
// ==/UserScript==

// Font panou din stanga
GM_addStyle ( ".nav-list li a, .nav-list li {font-weight:bold !important; color: #226290 ! important}");           //tot textul din panoul din stanga
GM_addStyle ( ".nav-list strong {font-weight:bold !important; color: #226290 ! important; font-size: 12px}");       //titlu feed-uri individuale
GM_addStyle ( ".nav-list li.nav-header span {font-weight:bolder !important; color: #226290; text-decoration: underline}");       //titlu foldere feed-uri si numar articole necitite
GM_addStyle ( ".nav-list .badge { color: white !important; background-color: #226290 ! important; text-decoration: not underline !important}");      //numar articole necitite (atat din feed-uri cat si din foldere de feed-uri

// butoane star, share, send etc
GM_addStyle ( ".post .btns {display:none}");      //numar articole necitite (atat din feed-uri cat si din foldere de feed-uri

//elimina panoul de sus
//GM_addStyle ( ".navbar-default { margin-top: -16px !important; }");      //****
//GM_addStyle ( ".reader .body-fixed-top { }");      //****
//GM_addStyle ( ".main-container { padding-top:10px }");      //****
//GM_addStyle ( ".reader .body-fixed-top { margin-top:-40px !important }");      //****
//GM_addStyle ( ".reader .body-fixed-top .slide {  margin-top:-40px !important }");      //****
//GM_addStyle ( ".reader .body-fixed-top .slide { top:unset !important }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****


//modifica culoarea articolelor
GM_addStyle ( ".well  { background: white; border: 2px }");      //****
//GM_addStyle ( ".post h3 a { color: #226290 ! important }");      //****  //titlul articolului (din panoul de citire a feed-urilor)
//GM_addStyle ( ".post.listview .header .list-header.no-left-label { color:#cccccc }");      //****

GM_addStyle ( "XXXX { YYYY }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****

