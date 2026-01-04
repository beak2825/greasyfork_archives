// ==UserScript==
// @name     [Leetcode]Don't show region banner
// @author   wenoptk
// @description     Auto-close anoying leetcode banner
// @include  http://leetcode.com/*
// @include  https://leetcode.com/*
// @version  1
// @grant    none
// @namespace https://greasyfork.org/users/178464
// @downloadURL https://update.greasyfork.org/scripts/40347/%5BLeetcode%5DDon%27t%20show%20region%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/40347/%5BLeetcode%5DDon%27t%20show%20region%20banner.meta.js
// ==/UserScript==

(function () {
  
  var cfg = {
  }
  
  var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
      if( MutationObserver ){
        // define a new observer
        var obs = new MutationObserver(function(mutations, observer){
          if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
            callback();
        });
        // have the observer observe foo for changes in children
        obs.observe( obj, { childList:true, subtree:true });
      }
      else if( eventListenerSupported ){
        obj.addEventListener('DOMNodeInserted', callback, false);
        obj.addEventListener('DOMNodeRemoved', callback, false);
      }
    };
  })();
  
 
  var rs = document.getElementById("region_switcher");
  if(rs) {
    console.log("Detect region_switcher:" + rs);
  	unsafeWindow.closeRegion();
    console.log("region_switcher closed");
  }

 
}());