// ==UserScript==
// @name           The Pirate Bay porn hider
// @name:es        The Pirate Bay ocultador de porno
// @namespace      http://tampermonkey.net/
// @version        1
// @description    Hide porn torrents from The Pirate Bay search list
// @description:es Script hecho para ocultar torrents de porno de The Pirate Bay
// @author         lk-KEVIN
// @license        MIT
// @match          https://thepiratebay.org/search.php?q=*
// @icon           https://thepiratebay.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/451026/The%20Pirate%20Bay%20porn%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/451026/The%20Pirate%20Bay%20porn%20hider.meta.js
// ==/UserScript==

'use strict';

var torrents=document.querySelector("#torrents");
var children = torrents.childNodes

children.forEach(c=>{
  if(c.innerHTML&&c.innerHTML.indexOf("Porn") !== -1) {
    c.className+=" hidden"
}
});