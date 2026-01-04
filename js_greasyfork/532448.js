// ==UserScript==
// @name         ReadComicOnline - Fix image
// @namespace    https://github.com/Procyon-b
// @version      1
// @description  Put the image url in src attribute instead of transparent placeholder. Allows right-click save
// @author       Achernar
// @match        https://readcomiconline.li/Comic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532448/ReadComicOnline%20-%20Fix%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/532448/ReadComicOnline%20-%20Fix%20image.meta.js
// ==/UserScript==

(function() {
"use strict";

new MutationObserver(function(mutL){
  for (let mut of mutL) {
    let t,tr;
    if ( (t=mut.target) && (t.tagName=='IMG') ) {
      let src=t.style.backgroundImage.replace(/^.*"([^"]+)".*$/, "$1");
      if (src && (t.src != src) ) t.src=src;
      }
    }
  }).observe(document.body, {childList: false, subtree: true, attributes: true, attributeFilter: ['style'] });

})();