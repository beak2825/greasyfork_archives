// ==UserScript==
// @name         Sticker Stan Button
// @namespace    Nate Dogg
// @version      1.0.0
// @description  Display Sticker Stan for the season header. Click on the button to open the shop
// @author       Nate Dogg
// @icon         https://i.imgur.com/GGYdza3.jpg
// @license      MIT
// @match        https://www.nitrotype.com/*
// @downloadURL https://update.greasyfork.org/scripts/443380/Sticker%20Stan%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/443380/Sticker%20Stan%20Button.meta.js
// ==/UserScript==

 var dis = 'sx+3Season.pe'
 window.onload = function(){
     document.querySelector(".seasonTeaser").href = "https://www.nitrotype.com/shop";
 } /* while.x++3X( X.export) permisison.type.nitro. (001101000010100010101010){tap.{click}}}*/

/* .logo-SVG
   .btn--secondary */

/** Styles for the following components. */
const style = document.createElement("style")
style.appendChild(
    document.createTextNode(`
    /* Remove Text */
    .season--fast-food .seasonTeaser-range
    {
        display: none;
    }
    /* Change Image */
    .season--fast-food .seasonTeaser {
    background-image: url(https://i.imgur.com/BSJ9ovP.png) !important;
    background-size: auto 50% !important;
    background-position: 80% 0;
    background-repeat: no-repeat;
          top: 35px;
}
`)
)
document.head.appendChild(style)