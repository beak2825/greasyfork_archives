// ==UserScript==
// @description    Replaces special text in Canvas from Brainhoney such as "pi" --> "/pi " that could create errors (eg. "\pi cture"). Use carefully.
// @name           Canvas Special (Pi) Filter
// @version        1.0
// @include        https://comprehend.instructure.com/courses/*
// @namespace https://greasyfork.org/users/10310
// @downloadURL https://update.greasyfork.org/scripts/21965/Canvas%20Special%20%28Pi%29%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/21965/Canvas%20Special%20%28Pi%29%20Filter.meta.js
// ==/UserScript==

/* Redundant/overkill
document.addEventListener("DOMNodeInserted", 
function(event) {
    var element = event.target;
    // run function on element (treat it like a DOM node)
*/
 
   var textnodes, node, s; 
   textnodes = document.evaluate( "//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null); 

   for (var i = 0; i < textnodes.snapshotLength; i++) { 
      node = textnodes.snapshotItem(i); 
      s = node.data;
       
// SPECIAL FILTERS
       // PI
       s = s.replace(/^pi/gi, "\\pi ");
       s = s.replace(/[^\\a-zA-Z]pi/gi, function(match) {
           // return formatting with boundary character
           return match.match(/[^\\]/gi)[0] + "\\pi "; });
       
//       s = s.replace(//gi, "");
//       s = s.replace(//gi, "");
//       s = s.replace(//gi, "");
      
      node.data = s;
   } 

//}, false); // end of redundant/overkill
alert('The Pi script is running!');