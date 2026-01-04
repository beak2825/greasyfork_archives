// ==UserScript==
// @name         Infinity Scroll Truncation
// @namespace primal.red
// @version      0.1
// @license MIT
// @description  Nuke unexepected infinity pools by limiting the max scroll of unknown pages
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452236/Infinity%20Scroll%20Truncation.user.js
// @updateURL https://update.greasyfork.org/scripts/452236/Infinity%20Scroll%20Truncation.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var limit = 6000;
  var skipList = ['duckduckgo.com']
  var increasedLengthPages = {
    'steepster.com': 1.6
  }
  var skip = false
  for( let site of skipList ){
    if(skip){
      break
    }else{
      skip = document.URL.match(site) != null
    }
  }
  Object.entries(increasedLengthPages).map(entry => {
    let site = entry[0];
    let factor = entry[1];
    if( document.URL.match(site) != null ){
        limit *= factor;
    }
  })

  if( !skip ){
    window.onscroll = function() {
      if(window.pageYOffset >= limit){
        window.scroll(0,limit)
      }
    }
  }
})();