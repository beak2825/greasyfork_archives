// ==UserScript==
// @description    Replaces text in Canvas from Brainhoney such as "vec(AB)" --> "/overrightarrow{AB}"
// @name           Canvas Special Filter X
// @version        1.0.2
// @include        https://comprehend.instructure.com/courses/*
// @namespace https://greasyfork.org/users/10310
// @downloadURL https://update.greasyfork.org/scripts/22188/Canvas%20Special%20Filter%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/22188/Canvas%20Special%20Filter%20X.meta.js
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

       // Matches the inner expression of bar, stackrel harr, vec, and maybe sqrt
       var reInnerEx1 = /[\d\-\+\.\,\*]+|\(([\w\-\+\.\,\*]+|[a-zA-Z\s]+)\)/gi;
       // Format vec(#B ##A C) and remove parntheses
       var reVec2 = /stackrel ?rarr[\(\"]([\d\.\,]+|[\w\s]+)[\)\"]/gi;
       s = s.replace(reVec2, function(match) {
           // return formatting with the number
           return "\\overrightarrow{" + match.match(reInnerEx1)[0].replace(/[\(\)]/gi, "") + "}"; });

//       s = s.replace(//gi, "");
//       s = s.replace(//gi, "");
//       s = s.replace(//gi, "");

      node.data = s;
   }

//}, false); // end of redundant/overkill
alert('Script X is running!');