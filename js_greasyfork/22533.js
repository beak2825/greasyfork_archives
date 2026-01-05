// ==UserScript==
// @description    Replaces text in Canvas from Brainhoney such as Format quoted text for formulas.
// @name           Canvas Special (Math Text) Filter
// @version        1.0
// @include        https://comprehend.instructure.com/courses/*
// @namespace https://greasyfork.org/users/10310
// @downloadURL https://update.greasyfork.org/scripts/22533/Canvas%20Special%20%28Math%20Text%29%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/22533/Canvas%20Special%20%28Math%20Text%29%20Filter.meta.js
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

       // Format quoted text for formulas.
       // WARNING: This will mess up non-math quotations
       var reUnit = /\"[\w\s]+"/gi;
       s = s.replace(reUnit, function(match) {
           // return match with formatting
           return "\\text{ " + match.match(/[\w\s,]+/gi)[0] + " }"; });

       
//       s = s.replace(//gi, "");
//       s = s.replace(//gi, "");
//       s = s.replace(//gi, "");

      node.data = s;
   }

//}, false); // end of redundant/overkill
alert('Script X is running!');