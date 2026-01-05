// ==UserScript==
// @name       load InstantClickjs on Rebuild.fm
// @namespace  namespace
// @version    0.2
// @description  load Instantclick on Rebuild.fm
// @match      *rebuild.fm/*
// @copyright  2014+, qa2
// @downloadURL https://update.greasyfork.org/scripts/10199/load%20InstantClickjs%20on%20Rebuildfm.user.js
// @updateURL https://update.greasyfork.org/scripts/10199/load%20InstantClickjs%20on%20Rebuildfm.meta.js
// ==/UserScript==

!function() {
  var s = document.createElement("script");
  s.setAttribute("src","https://cdnjs.cloudflare.com/ajax/libs/instantclick/3.0.1/instantclick.min.js");
  document.body.appendChild(s);
}();

 window.onload = function() {  
  var el = document.createElement("script");
  el.setAttribute("data-no-instant", "");
  el.innerHTML = "InstantClick.init();"
  document.body.appendChild(el);
}
