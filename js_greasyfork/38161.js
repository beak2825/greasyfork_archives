// ==UserScript==
// @name       TheOldReader_full screen
// @description       TheOldReader_RSS_full screen
// @namespace https://greasyfork.org/ro/scripts/37225/
// @include     *theoldreader.com*
// @include        https://theoldreader.com/feeds/*
// @grant          GM_addStyle
// @version     1.0.0
// @downloadURL https://update.greasyfork.org/scripts/38161/TheOldReader_full%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/38161/TheOldReader_full%20screen.meta.js
// ==/UserScript==

//ascunde bara de sus
GM_addStyle ( ".navbar-fixed-top { top: -55px !important}");

//ridica zona cu continutul articolelor
GM_addStyle ( ".reader .body-fixed-top { top: 10px !important; }");   //recomandat -55px pt ascundere definitiva

GM_addStyle ( ".static .page-header { margin-bottom: 2px; }");
GM_addStyle ( ".page-header { margin-top: -2px; }");
GM_addStyle ( ".reader .floating {     background: #dcdcdc;  padding: 3px 0 5px 0; }");      //****
GM_addStyle ( ".floating {     padding-left: 10px !important; padding-right: 10px !important; }");

//ridica zona din stanga cu titlurile feed-urilor
GM_addStyle ( ".cell.sidenav-cell { top: -6px !important;  }");

//test
GM_addStyle ( ".sidebar .nano { 106% !important; }");      //****

//elimina backgroundul gri al textului articolelor
GM_addStyle ( ".well { background:none; }");      //****
//elimina niste butoane de share
GM_addStyle ( ".post .btns { display:none; }");      //****


GM_addStyle ( "XXXX { YYYY }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****

