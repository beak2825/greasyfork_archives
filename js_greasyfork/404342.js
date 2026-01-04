// ==UserScript==
// @name        New script - harvestapp.com
// @namespace   Violentmonkey Scripts
// @include       https://*.harvestapp.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 5/1/2020, 11:55:29 AM
// @downloadURL https://update.greasyfork.org/scripts/404342/New%20script%20-%20harvestappcom.user.js
// @updateURL https://update.greasyfork.org/scripts/404342/New%20script%20-%20harvestappcom.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(e){
  
  if( e.keyCode == '39' ){
    document.querySelector('a.hui-button.hui-button-icon-only.js-navigate-by-url.test-next').click()
  }
  
  if( e.keyCode == '37' ){
    document.querySelector('a.hui-button.hui-button-icon-only.js-navigate-by-url.test-previous').click()
  }
  
  if( e.keyCode == '109' ){
    document.querySelector('button.hui-button.hui-button-small.hui-button-icon-only.js-edit-entry').click()
  }
  
  if( e.keyCode == '106' ){
    navigator.clipboard.writeText(document.querySelector('.day-view-entry .notes').innerText)
  }
  
  if( e.keyCode == '107' ){
    document.querySelector('textarea.hui-input.entry-notes.js-notes.has-value').select()
    document.execCommand('paste');
  }
  
}, false);