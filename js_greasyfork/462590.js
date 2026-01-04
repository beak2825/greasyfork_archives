// ==UserScript==
// @name        FixFontAndSpacing
// @namespace   A crappy CSS userscript
// @match       https://beta.character.ai/*
// @grant       none 
// @license MIT
// @version     1.0
// @author      Hochi
// @description Sigh
// @downloadURL https://update.greasyfork.org/scripts/462590/FixFontAndSpacing.user.js
// @updateURL https://update.greasyfork.org/scripts/462590/FixFontAndSpacing.meta.js
// ==/UserScript==
(function () {
  let css = `
    body {
        font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif !important;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
        .msg {
        white-space: normal;
    }
   `;

  var head = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.setAttribute("type", 'text/css');
  style.innerHTML = css;
  head.appendChild(style);
})();