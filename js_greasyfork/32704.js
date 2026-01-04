// ==UserScript==
// @name Hamish and Andy merch site closed bypass
// @description Bypasses closed sign. Fast and loose baby!
// @author Whitey
// @version 0.1
// @namespace https://gist.github.com/rsc-awhite/12c263dd7c6e5750f1b595b01eade36f
// @include https://merch.hamishandandy.com/*

// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/32704/Hamish%20and%20Andy%20merch%20site%20closed%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/32704/Hamish%20and%20Andy%20merch%20site%20closed%20bypass.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
      console.log("HandA script loaded fine");
// The whole this just just dropped with a div overlay and a style. If you kill the style (embedded in the body, probably copy/pasted into the footer on some cafepress style WYSIWYG editor), everything works normally
  styles = document.body.getElementsByTagName("style");
  for (x=0;x<styles.length;x++) { // Loop and search is necessary as the website varies where and when it loads different inline style tags
    if (styles[x].innerHTML.indexOf("overlay-bg.png") !== -1) {   // Value can be changed if filename changes, but this is the message displayed currently
      document.body.removeChild(document.body.getElementsByTagName("style")[x]);
    }
  }
}, false);