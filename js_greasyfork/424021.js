// ==UserScript==
// @name     Manyvids Menu
// @version  0.1
// @namespace https://www.manyvids.com
// @include https://www.manyvids.com*
// @description A Script to improve the ManyVids Menu
// @author Sophie Ladder
// @downloadURL https://update.greasyfork.org/scripts/424021/Manyvids%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/424021/Manyvids%20Menu.meta.js
// ==/UserScript==

var menu = document.getElementsByClassName("user-nav-header")[0];
var menulist = menu.nextElementSibling;
var mycontent = menulist.children[1];
var mymv = menulist.children[2];
var market = menulist.children[3];
var mycentry = mycontent.children[0];
var contentM = mymv.children[0].children[4];
mycentry.insertBefore(contentM, mycentry.children[0]);
var uplink=document.createElement('a');
var uplinkText = document.createTextNode("Upload ↥");
uplink.appendChild(uplinkText);
uplink.title = "Upload";
uplink.href='https://www.manyvids.com/Upload-vids/';
uplink.style.margin = "0 auto";
uplink.style.color = "#373a3c";
menu.appendChild(uplink);

uplink.onmouseover = function() {this.style.color = "#2196f3";}
uplink.onmouseout = function() {this.style.color = "#373a3c";}

var navup = document.createElement('a');
var navuptxt = document.createTextNode("Upload ↥");
navup.appendChild(navuptxt);
navup.title = "Upload";
navup.href='https://www.manyvids.com/Upload-vids/';
var primaryNav = document.getElementsByClassName("primary-nav")[0];
primaryNav.children[0].appendChild(navup);

navup.onmouseover = function() { 
    this.style.color = "#2196f3";
  	this.style.cursor = "pointer"; }
navup.onmouseout = function() {
    this.style.color = "#373a3c";
  	this.style.cursor = "auto"; }

var mvFlyers = mymv.children[0].children[4];
var marketItem = market.children[0].children[0];
market.children[0].insertBefore(mvFlyers, marketItem);