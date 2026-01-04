// ==UserScript==
// @name         Optimnem.co.uk - Fix Audio Links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fix Audio Links for optimnem.co.uk 
// @author       James McGuigan <james.mcguigan@gmail.com>
// @match        http://www.optimnem.co.uk/*
// @grant        MIT
// @downloadURL https://update.greasyfork.org/scripts/418306/Optimnemcouk%20-%20Fix%20Audio%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/418306/Optimnemcouk%20-%20Fix%20Audio%20Links.meta.js
// ==/UserScript==
(function() {
  if( document.getElementById('textArea').innerHTML.match('French') ) { 
    document.querySelectorAll('img.headphoneIcon').forEach(function(node) {
      node.outerHTML = "<audio src='/tutorial/french/samples/" +
                       node.outerHTML.match("\\w+\.mp3")[0] + 
                       "' controls='' style='display:block; padding: 1em'></audio>"
    })
  }
  if( document.getElementById('textArea').innerHTML.match('Spanish') ) { 
    document.querySelectorAll('img.headphoneIcon').forEach(function(node) {
      node.outerHTML = "<audio src='/tutorial/spanish/samples/" +
                       node.outerHTML.match("\\w+\.mp3")[0] + 
                       "' controls='' style='display:block; padding: 1em'></audio>"
    })
  }
})();