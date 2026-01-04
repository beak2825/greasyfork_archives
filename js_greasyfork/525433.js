// ==UserScript==
// @name        dogdrip left align
// @namespace   Violentmonkey Scripts
// @match       https://www.dogdrip.net/*
// @grant       none
// @version     1.1
// @author      shiny snake
// @license     MIT
// @description 2025. 2. 1. 오전 12:45:48
// @downloadURL https://update.greasyfork.org/scripts/525433/dogdrip%20left%20align.user.js
// @updateURL https://update.greasyfork.org/scripts/525433/dogdrip%20left%20align.meta.js
// ==/UserScript==

try{
  // reset scroll
  window.scrollTo(0,0);

  if (window.innerWidth < 1600){
    document.getElementsByClassName('clayerbox-left')[0].style.width = '20px'
    document.getElementsByClassName('clayerbox-left-ad')[0].style.display = 'none'
  }
} catch{}
