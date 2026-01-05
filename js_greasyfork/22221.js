// ==UserScript==
// @description    Formats fractions in Canvas from Brainhoney (split from main math filter)
// @name           Canvas Special (Fractions) Filter
// @version        1.2.2
// @include        https://comprehend.instructure.com/courses/*
// @namespace https://greasyfork.org/users/10310
// @downloadURL https://update.greasyfork.org/scripts/22221/Canvas%20Special%20%28Fractions%29%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/22221/Canvas%20Special%20%28Fractions%29%20Filter.meta.js
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

       // Format fractions
       // Notes: - Must update iMacros scripts to wait longer: SET !TIMEOUT_STEP 15
       //        - Breaks image addresses
       // Complex (old) - matches (-#.#)/(-#.#) and x/y (single char)
       //var reFrac1 = /(\(\-?\d+\.?\d*\)|\-?\d+\.?\d*|\(?-?\w\)?)\/(\(\-?\d+\.?\d*\)|\-?\d+\.?\d*|\(?-?\w\)?$)/gi;
       // Simple (old)
       //var reFrac1 = /\(?\-?\d+\.?\d*\)?\/\(?\-?\d+\.?\d*\)?/gi;
       // Complex simplified (1,003.57/-happy "times")
       //var reFrac1 = /\(?\-?([\d\.\,]+|[\w\s\"]+|text\([\w\s]+\))\)?\/\(?\-?([\d\.\,]+|[\w\s\"]+|text\([\w\s]+\))\)?/gi;
       // More complex (1+2- text(hello world)/-text(km))
       //var reFrac1 = /(\(?\-)?([\d\.\+]+( ?text\([\w\s]+\))*| ?text\([\w\s]+\)|\b(pi|\w)|\((\w+|[\d\.\*]+)\))\)?\/(\(?\-)?([\d\.\+]+( ?text\([\w\s]+\))*| ?text\([\w\s]+\)|\b(pi|\w$)|\((\w+|[\d\.\*]+)\))\)?/gi;
       // New
       var reFrac1 = /-?(([\w,._^]+(\\\w+\^?(({.+})*| )| ?text\([\w ]+\))*)|\(.+\))\/-?(([\w,._^]+(\\\w+\^?(({.+})*| )| ?text\([\w ]+\))*)|\(.+\))/gi;

       // matches a single term of a fraction (matches above)
       var reTerm1 = /[^\/]+/gi;
       //var reTerm1 = (/-?(([\w,._^]+(\\\w+\^?(({.+})*| )| ?text\([\w ]+\))*)|\(.+\))/gi);
       //var reTerm1 = (/\-?([\d\.\+]+( ?text\([\w\s]+\))*| ?text\([\w\s]+\)|\b(pi|\w)|\((\w+|[\d\.\*]+)\))/gi);
       //var reTerm1 = (/(\(\-?\d+\.?\d*\)|\-?\d+\.?\d*|\(?-?\w\)?)/gi);

       s = s.replace(reFrac1, function(match) {

           // Get/match all terms into an array
           var terms1 = match.match(reTerm1);
           // Remove first and last parentheses if present.
           if (terms1[0].charAt(0)=="(")
               terms1[0]=terms1[0].slice(1,terms1[0].length-1);
           if (terms1[1].charAt(0)=="(")
               terms1[1]=terms1[1].slice(1,terms1[1].length-1);
           // Return formatting with clean numbers
           //return term[0] + "\\over{" + term[1] + "}";
           return "\\frac{" + terms1[0] + "}{" + terms1[1] + "}";

       });


       // BLANKS
//       s = s.replace(//gi, "");
//       s = s.replace(//gi, "");
//       s = s.replace(//gi, "");
//       s = s.replace(//gi, "");


       node.data = s;
   }

//}, false); // end of redundant/overkill
alert('The Fractions script is running!');