// ==UserScript==
// @name           Mute Netflix Autoplay Trailers
// @description    Mute all autoplaying trailers when browsing Netflix
// @namespace      davidmarble.com
// @author         davidmarble
// @homepage       https://github.com/davidmarble/mute-netflix-autoplay
// @version        0.1
// @match          *://*.netflix.com/*
// @license        MIT License
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/371328/Mute%20Netflix%20Autoplay%20Trailers.user.js
// @updateURL https://update.greasyfork.org/scripts/371328/Mute%20Netflix%20Autoplay%20Trailers.meta.js
// ==/UserScript==

// Target node for observing mutations
var target = document.querySelector('.mainView');
 
// Observer instance which will mute any created video elements
var _node;
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    for (var j=0; j < mutation.addedNodes.length; j++){
      _node = mutation.addedNodes[j];
      if (_node.nodeType === 1 && _node.tagName === 'VIDEO'){
        _node.muted = "muted";
      }
    }
  });
});
 
// Config: what to listen for
var config = { 
  childList: true, 
  subtree: true
}
 
// Start observing
observer.observe(target, config);
