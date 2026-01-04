// ==UserScript==
// @name         Invert all colors
// @namespace    -
// @version      1.4
// @description  Funny, but quite annoying thing
// @author       Stew
// @match        *://nftychat.xyz/*
// @match        https://*.ziion.org/*
// @exclude      https://*.ziion.org/blog/post/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469003/Invert%20all%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/469003/Invert%20all%20colors.meta.js
// ==/UserScript==
(function () {
  const style = "html {-webkit-filter: invert(100%); -moz-filter: invert(100%); -o-filter: invert(100%); -ms-filter: invert(100%); }";
  const head = document.getElementsByTagName("head")[0];
  const styleTag = document.createElement("style");

  if (window.counter) {
    window.counter++;
    if (window.counter % 2 === 0) {
      style = "html {-webkit-filter: invert(0%); -moz-filter: invert(0%); -o-filter: invert(0%); -ms-filter: invert(0%); }";
    }
  } else {
    window.counter = 1;
  }

  styleTag.type = "text/css";
  if (styleTag.styleSheet) {
    styleTag.styleSheet.cssText = style;
  } else {
    styleTag.appendChild(document.createTextNode(style));
  }
  head.appendChild(styleTag);
}());
