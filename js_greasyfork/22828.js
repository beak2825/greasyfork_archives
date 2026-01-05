// ==UserScript==
// @name        Block Opener on Targeted Links
// @namespace   JeffersonScher
// @description Add rel attribute values on mouseup to block window.opener in the linked site, also blocks referer (2016-09-01)
// @author      Jefferson "jscher2000" Scher
// @copyright   Copyright 2016 Jefferson Scher
// @license     BSD 3-clause
// @include     *
// @version     0.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22828/Block%20Opener%20on%20Targeted%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/22828/Block%20Opener%20on%20Targeted%20Links.meta.js
// ==/UserScript==

// Check what was clicked and rel it up if needed
function BOoTL_relfix(evt){
  // is it always a link? are there other cases?
  var tgt = evt.target;
  if (tgt.nodeName != "A") return;
  // did we already hack it?
  if (tgt.hasAttribute("bootl")) return;
  // is it different origin?
  if (tgt.hostname == location.hostname) return;
  // does it have a target not replacing the page?
  var tgtatt = tgt.getAttribute("target") || "_self";
  if ("_self|_parent|_top".indexOf(tgtatt) > -1) return;
  // OKAY THEN add rel values + mark as modified
  var oldrel = tgt.getAttribute("rel") || "";
  tgt.setAttribute("rel", "noopener noreferrer "+oldrel);
  tgt.setAttribute("bootl", tgt.getAttribute("rel"));
}
// Add click event listener to the body
document.body.addEventListener("mouseup", BOoTL_relfix, false);