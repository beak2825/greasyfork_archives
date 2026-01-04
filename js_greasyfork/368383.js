// ==UserScript==
// @name Full Circle
// @namespace Violentmonkey Scripts
// @description Styles some 4chan-related subreddits to look even more like 4chan
// @version 1.0
// @match *://*.reddit.com/r/4chan/*
// @match *://*.reddit.com/r/qasubreddit/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/368383/Full%20Circle.user.js
// @updateURL https://update.greasyfork.org/scripts/368383/Full%20Circle.meta.js
// ==/UserScript==

let is_qa = location.pathname.startsWith("/r/qasubreddit");

// Page title
if (is_qa) {
 document.title = "/qa/ - " + document.title.replace(/ : qasubreddit$/i, "") + " - 4chan"; 
} else {
 document.title = "/reddit/ - " + document.title.replace(/ : 4chan$/i, "") + " - 4chan"; 
}

// Favicon
document.head.querySelectorAll('link[rel="icon"]').forEach(function(e) {
  e.parentNode.removeChild(e);
});
let clover = document.createElement("link");
clover.setAttribute("rel", "shortcut icon");
if (is_qa || location.hostname.startsWith("yb.")) {
  // Yotsuba B ("worksafe") favicon
  clover.setAttribute("href", "//s.4cdn.org/image/favicon-ws.ico");
} else {
  clover.setAttribute("href", "//s.4cdn.org/image/favicon.ico");
}
document.head.appendChild(clover);

// Board title
let style = document.createElement("style");
document.head.appendChild(style);
if (is_qa) {
  style.textContent = "span.pagename>a{font-variant:normal}";
  document.querySelector("span.pagename > a").textContent = "/qa/ - Taking it Easy";
} else {
  style.textContent = "#ebintitle{display:block;font-family:Tahoma,sans-serif;font-size:28px;font-weight:700;letter-spacing:-2px}";
  let ebintitle = document.createElement("span");
  ebintitle.setAttribute("id", "ebintitle");
  ebintitle.textContent = "/reddit/ - New Tab";
  let anchornode = document.querySelector("ul.tabmenu");
  anchornode.parentNode.insertBefore(ebintitle, anchornode);
}