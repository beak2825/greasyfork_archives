// ==UserScript==
// @description    Replaces some math text in Canvas from Brainhoney
// @name           Canvas Math Filter
// @version        1.2.2
// @grant GM_log
// @noframes
// @include        https://comprehend.instructure.com/courses/*
// @namespace https://greasyfork.org/users/10310
// @downloadURL https://update.greasyfork.org/scripts/21757/Canvas%20Math%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/21757/Canvas%20Math%20Filter.meta.js
// ==/UserScript==

/*
document.addEventListener("DOMNodeInserted",
function(event) {
//    var element = event.target;
    // run function on element (treat it like a DOM node)
*/

    var textnodes, node, s; 
    textnodes = document.evaluate( "//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null); 

    for (var i = 0; i < textnodes.snapshotLength; i++) { 
       node = textnodes.snapshotItem(i); 
       s = node.data;

//GM_log("Nodes data = " + s);

// PRIORITY FILTERS
       s = s.replace(/<\/?a?\:? ?math>/gi, "");  // Remove various <math> tags
       s = s.replace(/(\{\:\:\})?/gi, "");  // Remove placeholder {::}s
       s = s.replace(/xx/gi, "\\times ");
//       s = s.replace(/xx/gi, " × ");
       s = s.replace(/`/gi, "");  // Remove stray `s
       s = s.replace(/\/\_/gi, "\\angle ");  // Format angles (conflicts if not run before fraction filter)
       s = s.replace(/\(\:/gi, "\\langle ");
       s = s.replace(/\:\)/gi, "\\rangle ");
       s = s.replace(/^Delta/gi, "\\Delta ");  // Format Delta if at the beginning of a text node
       s = s.replace(/[^\\]Delta/gi, function(match) { 
           // return formatting with boundary character
           return match.match(/[^\\]/gi)[0] + "\\Delta "; });
       s = s.replace(/^sigma/gi, "\\sigma ");
       s = s.replace(/[^\\]sigma/gi, function(match) { 
           // return formatting with boundary character
           return match.match(/[^\\]/gi)[0] + "\\sigma "; });
       s = s.replace(/\-\>/gi, "\\rightarrow ");

// EXPRESSIONS
/*       ///////////////////////////
       // Format units of measurement
       // DISABLED while the separate Math Text filter catches a broader range of items.
       var reUnit = /\" ?(f(ee)?t|in(ch(es)?)?|m(eters?)?|c(entimeters?|m)|miles?|millimeters?|mm|F|C|L|N)(\/[smh])?,? ?\"/gi;
       s = s.replace(reUnit, function(match) {
           // return match with formatting
           return "\\text{ " + match.match(/[\w,]+/gi)[0] + " }"; });
*/

       ///////////////////////////
       // Matches the inner expression of bar, stackrel harr, vec, and maybe sqrt
       var reInnerEx1 = /[\d\-\+\.\,\*]+|\(([\w\-\+\.\,\*]+|[a-zA-Z\s]+)\)/gi;

       ///////////////////////////
       // Format bar"A B#" and stackrel_(#,#.#)
       // Notes: Might need to include &quot; fixing
       var reBar = /bar[\d\.\,]+|bar[\(\"]([\d\.\,]+|[\w\s]+)[\)\"]|stackrel_[\d\.\,]+|stackrel_[\(\"]([\d\.\,]+|[\w\s]+)[\)\"]/gi;
       s = s.replace(reBar, function(match) {
           // return formatting with the number
           return "\\overline{" + match.match(reInnerEx1)[0] + "}";
       });

       ///////////////////////////
       // Format stackrel harr(#B ##)
       var reStH = /stackrel ?harr[\d\.\,]+|stackrel ?harr[\(\"]([\d\.\,]+|[\w\s]+)[\)\"]/gi;
       s = s.replace(reStH, function(match) {
           // return formatting with the number
           return "\\overleftrightarrow{" + match.match(reInnerEx1)[0] + "}";
       });

       ///////////////////////////
       // Format vec(#B ##A C)
       var reVec = /vec[\d\.\,]+|vec[\(\"]([\d\.\,]+|[\w\s]+)[\)\"]\)/gi;
       s = s.replace(reVec, function(match) {
           // return formatting with the number
           return "\\overrightarrow{" + match.match(reInnerEx1)[0] + "}"; });

       ///////////////////////////
       // Format vec(#B ##A C) and remove parntheses
       var reVec2 = /stackrel ?rarr[\(\"]([\d\.\,]+|[\w\s]+)[\)\"]/gi;
       s = s.replace(reVec2, function(match) {
           // return formatting with the number
           return "\\overrightarrow{" + match.match(reInnerEx1)[0].replace(/[\(\)]/gi, "") + "}"; });

       ///////////////////////////
       // Format in-equation text(xyzq rstlne)
       var reTxt = /\btext\([\w\s]+\)/gi;
       s = s.replace(reTxt, function(match) {
           // return formatting with parenthetical text minus parentheses
           return "\\text{" + match.match(/\((\w|\s)+/gi)[0].replace(/\(/, "") + "}"; });

       ///////////////////////////
       // Format roots at the beginning of a text node
       // Notes: Misses nested parentheses
       s = s.replace(/^(sqrt|root)[\(\{]?[\w\-\+\.\,\*]+[\)\}]?/gi, function(match) {
           return "\\sqrt{" + match.slice(4,match.length).replace(/\(/gi, "{").replace(/\)/gi, "}") + "}"; });
       // Format roots with a preceeding boundary character
       s = s.replace(/[^\\a-zA-Z](sqrt|root)[\(\{]?[\w\-\+\.\,\*]+[\)\}]?/gi, function(match) {
           return match.charAt(0) + "\\sqrt{" + match.slice(5,match.length).replace(/\(/gi, "{").replace(/\)/gi, "}") + "}"; });

       ///////////////////////////
       // Format exponents w/ no preceeding digit (disabled b/c unlikely)
       //s = s.replace(/\b\^\([\d\w\-\+\.\,\*]+\)/gi, function(match) {
       //    return "^{" + match.match(/\([\d\w\-\+\.\,\*]+\)/gi)[0].replace(/[\(\)]/gi, "") + "}"; });
       // For exponents with a preceeding boundary digit
       var rePwr = /[\w]\^\([\w\-\+\.\,\*]+\)/gi;
       s = s.replace(rePwr, function(match) {
           // return formatting with boundary character
           return match.match(/[\w]/gi)[0] + "^{" + match.match(/\([\w\-\+\.\,\*]+\)+/gi)[0].replace(/[\(\)]/gi, "") + "}"; });

       ///////////////////////////
       // Format subs w/ no preceeding digit
       s = s.replace(/\b\_\([\w\-\+\.\,\*]+\)/gi, function(match) {
           return "_{" + match.match(/\([\w\-\+\.\,\*]+\)/gi)[0].replace(/[\(\)]/gi, "") + "}"; });
       // For subs with a preceeding boundary digit
       var reSub = /[\w]\_\([\w\-\+\.\,\*]+\)/gi;
       s = s.replace(reSub, function(match) {
           // return formatting with boundary character
           return match.match(/[\w]/gi)[0] + "_{" + match.match(/\([\w\-\+\.\,\*]+\)+/gi)[0].replace(/[\(\)]/gi, "") + "}"; });

       ///////////////////////////

// ALGEBRA SYMBOLS
       s = s.replace(/\*/gi, "\\cdot ");
//       s = s.replace(/\*/gi, " ⋅ ");
//       s = s.replace(/\^-/gi, "^{-");  // Obsolete - Format negative exponent filter
//       s = s.replace(/\!=/gi, "≠");
       s = s.replace(/\!=/gi, "\\ne ");
//       s = s.replace(/>=/gi, "≥");
       s = s.replace(/<=/gi, "\\le ");
       s = s.replace(/>=/gi, "\\ge ");
//       s = s.replace(/<=/gi, "≤");
       s = s.replace(/-:/gi, "\\div ");
//       s = s.replace(/-:/gi, "÷");
       s = s.replace(/~~/gi, "\\approx ");
//       s = s.replace(/&#402;/gi, "ƒ");
       s = s.replace(/&#247;/gi, "÷");
       s = s.replace(/&lt;/gi, "\<");
       s = s.replace(/&gt;/gi, "\>");
       s = s.replace(/\+\-/gi, "\\pm");


// GEOMETRY SYMBOLS
        // need to add \overset{\frown{}}
       s = s.replace(/&#176;|&deg;/gi, "°");
       s = s.replace(/≯/gi, "\\ngtr "); // Replaces unformatted ≯
       s = s.replace(/∠/gi, "\\angle ");
       s = s.replace(/~=/gi, "\\cong ");
       s = s.replace(/≅/gi, "\\cong ");
       s = s.replace(/\^\@/gi, "^\\circ ");  // Format degree symbol

// BLANK
//       s = s.replace(//gi, "");
//       s = s.replace(//gi, "");
//       s = s.replace(//gi, "");

      
      node.data = s;
   } 

//}, false); // end of redundant/overkill

////////////////////////////////////////////////
// OBSOLETE

       //s = s.replace(/\" f(ee)?t\"/gi, "ft");
       //s = s.replace(/\" in(ch(es)?)?\"/gi, "in");
       //s = s.replace(/\" m(eter(s?))?\"/gi, "meters");
       //s = s.replace(/\" c(entimeters?|m)\"/gi, "cm");

/* Pi filter split into its own filter for safety and accuracy.
       s = s.replace(/^pi/gi, "\\pi ");  // Format Pi if at the beginning of a text node
       s = s.replace(/[^\\\w]pi|[\d]pi/gi, function(match) {
           // return formatting with boundary character
           return match.match(/[^\\]/gi)[0] + "\\pi "; });
*/

/* Disabled or separated into its own filter to prevent conflict
       ///////////////////////////
       // Format fractions
       // Notes: - Must update iMacros scripts to wait longer: SET !TIMEOUT_STEP 15
       //        - Breaks image addresses
       // Complex (old) - matches (-#.#)/(-#.#) and x/y (single char)
       //var reFrac = /(\(\-?\d+\.?\d*\)|\-?\d+\.?\d*|\(?-?\w\)?)\/(\(\-?\d+\.?\d*\)|\-?\d+\.?\d*|\(?-?\w\)?$)/gi;
       // Simple (old)
       //var reFrac = /\(?\-?\d+\.?\d*\)?\/\(?\-?\d+\.?\d*\)?/gi;
       // Complex simplified (1,003.57/-happy "times") 
       //var reFrac = /\(?\-?([\d\.\,]+|[\w\s\"]+|text\([\w\s]+\))\)?\/\(?\-?([\d\.\,]+|[\w\s\"]+|text\([\w\s]+\))\)?/gi;
       // More complex (1+2- text(hello world)/-text(km))
       var reFrac = /\(?\-?([\d\.\,\+]+( ?text\([\w\s]+\))*| ?text\([\w\s]+\)|\b(pi|\w)|\((\w+|[\d\.\,\*]+)\))\)?\/\(?\-?([\d\.\,\+]+( ?text\([\w\s]+\))*| ?text\([\w\s]+\)|\b(pi|\w)|\((\w+|[\d\.\,\*]+)\))\)?/gi;


       // matches a single term of a fraction (matches above)
       var reTerm = (/\-?([\d\.\,\+]+( ?text\([\w\s]+\))*| ?text\([\w\s]+\)|\b(pi|\w)|\((\w+|[\d\.\,\*]+)\))/gi);
       //var reTerm = (/(\(\-?\d+\.?\d*\)|\-?\d+\.?\d*|\(?-?\w\)?)/gi);

       s = s.replace(reFrac, function(match) {

           // get/match all terms into an array
           var term = match.match(reTerm);
           // return formatting with clean numbers
           //return term[0] + "\\over{" + term[1] + "}";
           return "\\frac{" + term[0] + "}{" + term[1] + "}";

       });
*/

       ///////////////////////////
/* OBSOLETE
       // matches "ABC" or "X" with quotes that should be changed to braces
       var reQuote = (/\"\w{1,3}\"/);
       s = s.replace(reQuote, function(match) {
           // return {ABC} with braces and no quotes
           return "{" + match.match(/\w+/gi)[0] + "}"; });
       // stackrelharr/bar/vec"AB" has quotes replaced with braces above.
       s = s.replace(/\bstackrel ?harr{/gi, "\\overleftrightarrow{");
       s = s.replace(/^bar{/gi, "\\overline{"); // for "overline{AB}" (line segments) not "bar#" (repeating decimals)
*/

       ///////////////////////////
/* Should be OBSOLETE
       s = s.replace(/\bstackrel ?harr{/gi, "\\overleftrightarrow{");
       s = s.replace(/^bar{/gi, "\\overline{"); // 
       s = s.replace(/[^\\\w]bar{|\dbar{/gi, function(match) {
           // return formatting with boundary character
           return match.match(/[^\\]/gi)[0] + "\\overline{"; });
       s = s.replace(/^vec{/gi, "\\\overrightarrow{");
       s = s.replace(/[^\\\w]vec{|[\d]vec{/gi, function(match) {
           // return formatting with boundary character
           return match.match(/[^\\]/gi)[0] + "\\overrightarrow{"; });
*/

       // Format roots with function at bottom
//       s = s.replace(/^(sqrt|root)\(?[\w\-\+\.\,\*]+\)?|[^\\a-zA-Z](sqrt|root)\(?[\w\-\+\.\,\*]+\)?/gi, Sqrt(s));
//           return match.match(/\(?[\w\-\+\.\,\*]+\)?/gi)[0].replace(/[\(\)]/gi, "").replace(/sqrt|root/gi, "\\sqrt{") + "}"; });
       // Format roots at the beginning of a text node and no parentheses
//       s = s.replace(/^(sqrt|root)[\w\-\+\.\,\*]+/gi, function(match) {
//           return "\\sqrt{" + match.match(/sqrt[\d\,\.\-\+\*]+/gi)[0].replace(/sqrt/gi, "") + "}"; });
       // Format roots with a preceeding boundary character but no parentheses
//       s = s.replace(/[^\\a-zA-Z](sqrt|root)[\w\-\+\.\,\*]+/gi, function(match) {
//           return match.match(/[^\\]/gi)[0] + "\\sqrt{" + match.match(/(sqrt|root)[\d\,\.\-\+\*]+/gi)[0].replace(/sqrt|root/gi, "") + "}"; });
//           return match.match(/[^\\]/gi)[0] + match.match(/\([\w\-\+\.\,\*]+\)/gi)[0].replace(/[\(\)]/gi, "").replace(/sqrt|root/gi, "\\sqrt{") + "}"; });
//           return match.match(/[^\\]/gi)[0] + "\\sqrt{" + match.match(/\([\w\,\.\-\+\*]+\)/gi)[0].replace(/\(\)/gi, "") + "}"; });
           // return boundary character + sqrt{ + subsequent digit/variable sequence + }
//           return match.match(/\d/gi)[0] + "\\sqrt{" + match.match(/\(([\d\,\.\-\+\*]+|[a-zA-Z\-\+\*]+)\)|\d+/gi)[0].replace(/[\(\)]/gi, "") + "}"; });
           // get the boundary digit and inner expression into an array and return them with formatting
//           var expr = match.match(/[\w\,\.\-\+\*]+/gi);
//           return expr[0] + "\\sqrt{" + expr[1] + "}"; });

/*
function Sqrt(square) {
    // Format roots at the beginning of a text node
    square = square.replace(/^(sqrt|root)\(?[\w\-\+\.\,\*]+\)?/gi, function(match) {
        return match.match(/\(?[\w\-\+\.\,\*]+\)?/gi)[0].replace(/[\(\)]/gi, "").replace(/sqrt|root/gi, "\\sqrt{") + "}"; });

    // Format roots with a preceeding boundary character
    square = square.replace(/[^\\a-zA-Z](sqrt|root)\([\w\-\+\.\,\*]+\)/gi, function(match) {
        return match.match(/[^\\]/gi)[0] + match.match(/\(?[\w\-\+\.\,\*]+\)?/gi)[0].replace(/[\(\)]/gi, "").replace(/sqrt|root/gi, "\\sqrt{") + "}"; });

    return square;}
*/
//GM_log("The Math script is running!");
alert("The Math script is running!");