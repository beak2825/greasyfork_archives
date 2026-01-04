


// ==UserScript==
// @name        BVLA load all variations
// @namespace   BVLA load all variations
// @description Automatically load all BVLA variations
// @license     MIT
// @author      joeltron
// @version     0.07
// @grant       none
// @include     *://*bvla.*
// @match       *://*.bvla.com/collections/*
 
// @downloadURL https://update.greasyfork.org/scripts/493221/BVLA%20load%20all%20variations.user.js
// @updateURL https://update.greasyfork.org/scripts/493221/BVLA%20load%20all%20variations.meta.js
// ==/UserScript==
 
// Fix links
function bvlaClickMore() {
  var load=document.getElementById('btn_load_more_variations');
  load.click();
    console.log("bvlaClickMore complete");
}
 
// Observe function
var observeDOM = (function(){
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
 
  return function( obj, callback ){
    if( !obj || obj.nodeType !== 1 ) return; 
 
    if( MutationObserver ){
      // define a new observer
      var mutationObserver = new MutationObserver(callback)
 
      // have the observer observe for changes in children
      mutationObserver.observe( obj, { childList:true, subtree:false })
      return mutationObserver
    }
  }
})()
 
// Observe DOM element:
var listElm = document.getElementById('variations');
observeDOM( listElm, function(m){ bvlaClickMore(); } );
 
// Page loaded
setTimeout(bvlaClickMore, 1000)