// ==UserScript==
// @name        Remove controlslist=nodownload
// @namespace   remove-controlslist-nodownload
// @version     7
// @description Removes the attribute controlslist=nodownload of video tag.
// @author      Shawphy
// @grant       none
// @include *
// @downloadURL https://update.greasyfork.org/scripts/401205/Remove%20controlslist%3Dnodownload.user.js
// @updateURL https://update.greasyfork.org/scripts/401205/Remove%20controlslist%3Dnodownload.meta.js
// ==/UserScript==

(function() {
var target = document.querySelector('body'); 
var observer = new MutationObserver(function(mutations) {  
  mutations.forEach(function(mutation) { 
    Array.prototype.forEach.call(document.querySelectorAll('video[controlslist~=nodownload]'), function(el){
      el.controlsList.remove("nodownload");
    });
  }); 
}); 

var config = { childList: true, subtree: true } 
observer.observe(target, config); 
})();