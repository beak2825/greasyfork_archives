// ==UserScript==
// @name     Mikrotik WebFig Unfold Extend
// @homepage     https://gist.github.com/Endeer/246c9aeb2051a022830a47ed3fed0c8d
// @version      1.0
// @author       Ender Wiggin
// @description  Fix the new Mikrotik UI so that all sections are open and extended to the full width of the window as it used to be before. 
// @grant    none
// @include http://*/webfig/*
// @namespace    https://github.com/Endeer/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480775/Mikrotik%20WebFig%20Unfold%20Extend.user.js
// @updateURL https://update.greasyfork.org/scripts/480775/Mikrotik%20WebFig%20Unfold%20Extend.meta.js
// ==/UserScript==

setInterval(
  function() {
    if(document.body.className.search(/(^| )serve-formToggle( |$)/) == -1) {
    	document.getElementById("formToggle").onclick();
    }
    
    var coll = document.getElementsByTagName("thead");
    for(var i = 0; i < coll.length; i++) {
      if(coll[i].className.search(/(^| )folded( |$)/) !== -1) {
        coll[i].onclick();
      }
    }
  },
  1000
);