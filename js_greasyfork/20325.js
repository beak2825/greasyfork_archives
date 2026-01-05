// ==UserScript==
// @name        Block internal images hardcoded in IMG tag
// @description Remove about: chrome: and resource: URIs from the src attribute of <img> tags.
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @copyright   Copyright 2016 Jefferson Scher
// @license     BSD 3-clause
// @include     http*://*
// @version     0.5.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20325/Block%20internal%20images%20hardcoded%20in%20IMG%20tag.user.js
// @updateURL https://update.greasyfork.org/scripts/20325/Block%20internal%20images%20hardcoded%20in%20IMG%20tag.meta.js
// ==/UserScript==

// Inspiration -- also deals with <script> tags: http://userscripts-mirror.org/scripts/review/5899

// Check <img> tags for about: chrome: resource: URLs
var problemimgs = document.querySelectorAll('img[src^="about:"], img[src^="chrome:"], img[src^="resource:"]');
for(var i = 0; i < problemimgs.length; i++){
  if (problemimgs[i].hasAttribute("onload")) problemimgs[i].removeAttribute("onload");
  if (problemimgs[i].hasAttribute("onerror")) problemimgs[i].removeAttribute("onerror");
  problemimgs[i].setAttribute("alt", "BLOCKED: "+problemimgs[i].getAttribute("src"));
  problemimgs[i].removeAttribute("src");
  problemimgs[i].setAttribute("style", "border:3px double red; color:red; font-weight:bold; font-style:italic; padding: 1px 4px;");
}