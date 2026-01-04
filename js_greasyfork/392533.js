// ==UserScript==
// @name        Larger Previews imagefap.com
// @namespace   Violentmonkey Scripts
// @match       https://www.imagefap.com/*
// @grant       none
// @version     1.2
// @author      Karl Kemp
// @homepage    https://chilling.guru
// @description 11/17/2019, 7:54:58 AM
// @esversion
// @downloadURL https://update.greasyfork.org/scripts/392533/Larger%20Previews%20imagefapcom.user.js
// @updateURL https://update.greasyfork.org/scripts/392533/Larger%20Previews%20imagefapcom.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
Array.from(document.getElementsByClassName("gal_mini")).forEach(im => {
   im.srcset = im.src.replace("mini", "thumb") + " 20w";
   im.style = "width:144px; min-height:96px;";
   im.className = "exmin";
})
