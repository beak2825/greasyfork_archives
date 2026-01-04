// ==UserScript==
// @name        Make Current Run Button stick to top - gamesdonequick.com
// @namespace   Violentmonkey Scripts
// @match       https://gamesdonequick.com/schedule/43
// @grant       none
// @version     1.0
// @author      aJourneyman
// @description 28/05/2023, 20:06:05
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467342/Make%20Current%20Run%20Button%20stick%20to%20top%20-%20gamesdonequickcom.user.js
// @updateURL https://update.greasyfork.org/scripts/467342/Make%20Current%20Run%20Button%20stick%20to%20top%20-%20gamesdonequickcom.meta.js
// ==/UserScript==

function addCss(cssString) {
    var head = document.getElementsByTagName('head')[0];
    var newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
}

addCss("p.text-center {position: -webkit-sticky; position: sticky; top: 0; } ");

