// ==UserScript==
// @name         StyleShift
// @namespace    http://roblox.com/*
// @version      0.1
// @description  W Description
// @author       You
// @license MIT
// @match        https://www.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462432/StyleShift.user.js
// @updateURL https://update.greasyfork.org/scripts/462432/StyleShift.meta.js
// ==/UserScript==

(function() {
    'use strict';

var sheet = document.createElement("style")
document.body.appendChild(sheet)
sheet.innerHTML = `
thumbnail-2d,.avatar-card-image{
  background: linear-gradient(white, white) padding-box,
              linear-gradient(to top, black, white) border-box !important;
  border-radius: 10px !important;
  border: 3px solid transparent !important;
}
.icon-online {
  background: linear-gradient(#d4d4d4, gray) padding-box,
              linear-gradient(to top, rgba(100,100,255,1), rgba(100,100,255,0.5)) border-box !important;
  border-radius: 100% !important;
  border: 4px solid transparent !important;
}
.icon-game {
  background: linear-gradient(#d4d4d4, gray) padding-box,
              linear-gradient(to top, rgba(100,255,100,1), rgba(100,255,100,0.5)) border-box !important;
  border-radius: 100% !important;
  border: 4px solid transparent !important;
}
.thumbnail-2d-container{
border-radius:0px;
}
`
})();