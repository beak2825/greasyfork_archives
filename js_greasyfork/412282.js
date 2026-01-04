// ==UserScript==
// @name        Remove social media fact checks
// @namespace   Violentmonkey Scripts
// @match       *://twitter.com/*
// @match       *://youtube.com/*
// @match       *://*.youtube.com/*
// @grant       none
// @version     1.4
// @author      qsniyg
// @description Removes Twitter and YouTube's fact checking info links on political content
// @downloadURL https://update.greasyfork.org/scripts/412282/Remove%20social%20media%20fact%20checks.user.js
// @updateURL https://update.greasyfork.org/scripts/412282/Remove%20social%20media%20fact%20checks.meta.js
// ==/UserScript==

(function() {
  var remove_editorial_svgs = function() {
    var svgs = document.querySelectorAll("article a > div > svg");
    for (var i = 0; i < svgs.length; i++) {
      var svg = svgs[i];
      
      var parent = svg.parentElement;
      
      if (parent.children.length !== 2)
        continue;
      
      if (parent.children[0] !== svg)
        continue;
      
      if (parent.children[1].tagName !== "SPAN")
        continue;
      
      var dparent = parent.parentElement;
      
      if (!/\/i\/+events\/+[0-9]{10,}(?:[?#].*)?$/.test(dparent.href) && !/:\/\/help\.twitter\.com\/(?:[^/]+\/+)?rules-and-policies\//.test(dparent.href))
        continue;
      
      dparent.style.setProperty("display", "none", "important");
    }
  };
  
  var remove_youtube_clarification = function() {
    var els = document.querySelectorAll("ytd-clarification-renderer, #clarify-box");
    for (var i = 0; i < els.length; i++) {
      if (els[i].parentElement)
        els[i].parentElement.removeChild(els[i]);
    }
  }
  
  var host = window.location.hostname;
  if (host.indexOf("twitter.com") >= 0) {
    // 0.2% of script time, according to chrome's profiler on my computer
    setInterval(remove_editorial_svgs, 100);
  } else if (host.indexOf("youtube.com") >= 0) {
    setInterval(remove_youtube_clarification, 100);
  }
})();