// ==UserScript==
// @name        Fix width for bookshop.org
// @namespace   Violentmonkey Scripts
// @match       https://*.bookshop.org/*
// @grant       none
// @version     0.1
// @author      oh-ok
// @description 30/01/2022, 13:17:24
// @license MIT
// This script fixes the header and other elements on bookshop.org from going off the page, adding annoying little horizontal scroll on desktop -.-
// This problem still exists on the mobile version, but I can't quite determine the cause
// @downloadURL https://update.greasyfork.org/scripts/439373/Fix%20width%20for%20bookshoporg.user.js
// @updateURL https://update.greasyfork.org/scripts/439373/Fix%20width%20for%20bookshoporg.meta.js
// ==/UserScript==


//This problem occurs when some elements use vw instead of % on desktop.
//
//Get all the elements which use 100vw instead of 100% 
let e = document.getElementsByClassName("w-screen");

// Iterate through them and change their width
for (let i=0; i<e.length; i++) {
  e[i].style.width="100%";
  console.log("Fixed: " + e[i].id);
}
