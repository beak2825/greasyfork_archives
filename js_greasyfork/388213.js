// ==UserScript==
// @name        FANDOM Trimmer
// @description Remove pointless widgets from FANDOM Wikia sites.
// @version     1.0.1
// @grant       none
// @namespace   luluco250.fandomTrimmer
// @include     https://*.fandom.com/*
// @downloadURL https://update.greasyfork.org/scripts/388213/FANDOM%20Trimmer.user.js
// @updateURL https://update.greasyfork.org/scripts/388213/FANDOM%20Trimmer.meta.js
// ==/UserScript==

(function() {
  function removeId(name) {
	var elem = document.getElementById(name);
    if (elem !== null)
        elem.remove();
  }
  
    function removeClass(name) {
    var elems = document.getElementsByClassName(name);
    for (var i = 0; i < elems.length; ++i)
        elems[i].remove();
}
  
    window.addEventListener("load", function() {
    // Remove the "fan feed".
    removeId("WikiaFooter");
    
    // Remove the "fan bar"(?).
    removeId("WikiaBar");
    
    // This removes the entire bottom footer, if you want to.
    // Just remove the "//" preceeding it.
    //removeClass("wds-global-footer");
    
    // This removes the top left part of the navigation bar.
    // Just remove the "//" preceeding it.
    //removeClass("wds-global-navigation__content-bar-left");
    
    // Attempt to correct the void space left by the bar.
    //const site = document.getElementById("WikiaSiteWrapper");
    //site.style.bottom = 0;
  });
})();