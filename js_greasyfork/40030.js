// ==UserScript==
// @name Derpibooru Download Fix
// @namespace Violentmonkey Scripts
// @match *://derpibooru.org/*
// @description  Restores Derpibooru download button
// @author       novacrazy
// @version      0.0.1
// @license      MIT
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/40030/Derpibooru%20Download%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/40030/Derpibooru%20Download%20Fix.meta.js
// ==/UserScript==

(function() {
  
  for(let e of document.getElementsByClassName("image-metabar")) {
    e.style.setProperty("width", "100%", "important");
    e.style.setProperty("max-width", "100%", "important");
  }
  
  for(let e of document.getElementsByClassName("flex--spaced-out")) {
    e.style.setProperty("justify-content", "normal", "important");
  }
 
  for(let dropdown of document.getElementsByClassName("dropdown block__header__dropdown-tab")) {
    let short = dropdown.children[0];

    // Filter out Galleries dropdown
    if(!short.href.endsWith('#')) {
      if(short.title.includes("Download")) {
        let long = dropdown.children[1].children[0];
        
        dropdown.innerHTML = `</i><div><a href=${long.href}><i class="fa fa-download"> Download</a></div>`;
      }
    }
  }
})();