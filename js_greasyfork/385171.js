// ==UserScript==
// @name nocarousel for pyimagesearch.com (Opera/Chrome) | Jason
// @description Turns off the annoying sidebar carousel. Sorry Adrian. The script finds a <div> with the ID of "pyimg_gurus_carousel" and assigns it a new ID of "nocarousel", thus preventing the carousel function. Script adds innerHTML as a positive visual indication that it's working. ( and it's my first userscript! - hence, more meta than meat! )
// @namespace https://greasyfork.org/
// @version 1.0
// @match https://www.pyimagesearch.com/*
// @license MIT
// @supportURL https://gist.github.com/JCBrown602/35733862f9b949614a69f42e2ef813f1
// @compatible opera
// @compatible chrome
// @author Jason | jetcanlabs.com
// @encoding utf-8
// @grant none
// @icon https://gist.githubusercontent.com/JCBrown602/35733862f9b949614a69f42e2ef813f1/raw/cat.ico
// @homepage https://gist.github.com/JCBrown602/35733862f9b949614a69f42e2ef813f1/
// @downloadURL https://update.greasyfork.org/scripts/385171/nocarousel%20for%20pyimagesearchcom%20%28OperaChrome%29%20%7C%20Jason.user.js
// @updateURL https://update.greasyfork.org/scripts/385171/nocarousel%20for%20pyimagesearchcom%20%28OperaChrome%29%20%7C%20Jason.meta.js
// ==/UserScript==

// Browser developer tools "inspect element" gives ID of offending <div>
  var query = "pyimg_gurus_carousel";
  var element = document.getElementById(query);

  document.getElementById(query).id = "nocarousel";
  document.getElementById("nocarousel").innerHTML = "nocarousel: carousel stopped by monkeys.";