// ==UserScript==
// @name         Fix eBay description width
// @namespace    https://greasyfork.org/de/users/687485-pseudonymous
// @version      2
// @description  Fixes the eBay description width.
// @author       pseudonymous
// @include      /^https:\/\/www\.ebay\.[a-z]*\/itm\/.*$/
// @icon         https://www.ebay.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437864/Fix%20eBay%20description%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/437864/Fix%20eBay%20description%20width.meta.js
// ==/UserScript==

/* jshint esversion:6 */

var elem = document.getElementById("desc_ifr");
if(typeof elem !== 'undefined' && elem !== null)
{
  if (document.getElementById("desc_ifr").style.width !== "100%")
  { document.getElementById("desc_ifr").style.width = "100%"; }
  if (document.getElementById("desc_ifr").width !== "100%")
  { document.getElementById("desc_ifr").width = "100%"; }
}
