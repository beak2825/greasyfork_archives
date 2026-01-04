// ==UserScript==
// @name        Remove spacing - mangareader.to
// @namespace   Violentmonkey Scripts
// @match       https://mangareader.to/read/*
// @grant       none
// @version     1.0
// @author      Lag
// @description Removes the space between pages
// @downloadURL https://update.greasyfork.org/scripts/432620/Remove%20spacing%20-%20mangareaderto.user.js
// @updateURL https://update.greasyfork.org/scripts/432620/Remove%20spacing%20-%20mangareaderto.meta.js
// ==/UserScript==




// Your CSS as text
var styles = `
    body.page-readerr {
      background: none !important;
    }
    .container-reader-chapter .iv-card {
      margin: 0 auto -5px !important;
    }
    .container {
      padding: 0px !important;
    }
`

var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)