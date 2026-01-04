// ==UserScript==
// @name Happy New Year Drawaria 2024!
// @namespace http://tampermonkey.net/
// @version 2024
// @description 🌞 ENJOY NEW YEARK 2024 WITH DRAWARIA 🌞!.
// @author YouTubeDrawaria
// @grant GM_addStyle
// @run-at document-start
// @include https://drawaria.online*
// @license MIT
// @icon    https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/483624/Happy%20New%20Year%20Drawaria%202024%21.user.js
// @updateURL https://update.greasyfork.org/scripts/483624/Happy%20New%20Year%20Drawaria%202024%21.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://drawaria.online")) {
  css += `

 .playerlist-name-loggedin a {
      color: #6f42c1 !important;
  }

  .playerlist-name a {
      color: #20c997;
  }

  .playerlist-name-self a {
      color: #ffc107 !important;
  }
`;
  //  '<-----Colors list:----->'
  //  '--blue: #007bff;'
  //  '--indigo: #6610f2;'
  //  '--purple: #6f42c1;'
  //  '--pink: #e83e8c;'
  //  '--red: #dc3545;'
  //  '--orange: #fd7e14;'
  //  '--yellow: #ffc107;'
  //  '--green: #28a745;'
  //  '--teal: #20c997;'
  //  '--cyan: #17a2b8;'
  //  '--white: #fff;'
  //  '--gray: #6c757d;'
  //  '--gray-dark: #343a40;'
  //  '--primary: #007bff;'
  //  '--green light: #28a745;'
  //  '--dark: #343a40;'
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();