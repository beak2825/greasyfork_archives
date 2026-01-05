// ==UserScript==
// @name       load InstantClickjs on site
// @namespace  namespace
// @version    0.1
// @description  load InstantClick.js on site 
// @match      https://greasyfork.org/*
// @match      https://www.youtube.com/*
// @match      https://www.google.com*
// @match      https://gobyexample.com/*
// @match      http://www.ascii2d.net/*
// @match      http://*hatenablog.com*
// @match      http://qiita.com/*
// @match      *rebuild.fm/*
// @copyright  2014+, qa2
// @downloadURL https://update.greasyfork.org/scripts/10985/load%20InstantClickjs%20on%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/10985/load%20InstantClickjs%20on%20site.meta.js
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
