// ==UserScript==
// @description    Replaces some math text in Canvas from Brainhoney
// @name           Canvas Master Filter
// @version        1.6.9
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @run-at document-idle
// @include        https://comprehend.instructure.com/courses/*
// @namespace https://greasyfork.org/users/10310
// @downloadURL https://update.greasyfork.org/scripts/22610/Canvas%20Master%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/22610/Canvas%20Master%20Filter.meta.js
// ==/UserScript==

/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/


var buttonAnchor1 = $("#show_question_details");
//-- Add our button.
buttonAnchor1.parent().after(
    '<br><a href="#" id="HTMLscript"><font size=3><strong>[Click to run HTML (&amp;amp;&amp;nbsp;&amp;#233;&amp;#232;) script]</strong></font></a>' );
//-- Activate the button.
$("#HTMLscript").click(function(){
    var textnodes, node, s;
    textnodes = document.evaluate("//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textnodes.snapshotLength; i++){

       node = textnodes.snapshotItem(i);
       s = node.data;

       // TAGS
/*
       s = s.replace(/(<br ?\/?> *)+/gi, "\r\n");  // Replace <br /> <br /> with a newline
       s = s.replace(/<p ?\/?>/gi, "\r\n");  // Replace <p /> with a newline
       s = s.replace(/<\/p ?\/?> ?/gi, "");  // Removes </p>  */// Sadly, newlines aren't being inserted properly.

       // Punctuation
       s = s.replace(/&#32;/g, " ");
       s = s.replace(/&nbsp;/gi, " ");
       //s = s.replace(/&#33;/g, "!");
       //s = s.replace(/&#34;/g, "\"");
       s = s.replace(/&quot;/gi, "\"");
       //s = s.replace(/&#35;/g, "#");
       s = s.replace(/&#36;/g, "$");
       //s = s.replace(/&#37;/g, "%");
       s = s.replace(/&#38;/g, "&");
       s = s.replace(/&amp;/gi, "&");
       s = s.replace(/&#39;/g, "'");
       //s = s.replace(/&#40;/g, "(");
       //s = s.replace(/&#41;/g, ")");
       //s = s.replace(/&#42;/g, "*");
       //s = s.replace(/&#43;/g, "+");
       //s = s.replace(/&#44;/g, ",");
       //s = s.replace(/&#45;/g, "-");
       //s = s.replace(/&#46;/g, ".");
       //s = s.replace(/&#47;/g, "/");
       s = s.replace(/&#160;/g, " ");
       s = s.replace(/&#162;/g, "¢");
       
       s = s.replace(/&#8211;/g, "–");
       s = s.replace(/&#8212;/g, "—");
       s = s.replace(/&#8216;/g, "‘");
       s = s.replace(/&#8217;/g, "’");
       s = s.replace(/&#8218;/g, "‚");
       s = s.replace(/&#8220;/g, "“");
       s = s.replace(/&#8221;/g, "”");
       s = s.replace(/&#8222;/g, "„");
       s = s.replace(/&#8224;/g, "†");
       s = s.replace(/&#8225;/g, "‡");
       s = s.replace(/&#8226;/g, "•");
       s = s.replace(/&#8230;/g, "…");
       s = s.replace(/&#8240;/g, "‰"); //*/
       s = s.replace(/&#8364;/g, "€");
       s = s.replace(/&#8482;/g, "™");
       //s = s.replace(/&#;/g, "");
       
       // Accents
       s = s.replace(/&#192;/g, "À");
       s = s.replace(/&#193;/g, "Á");
       s = s.replace(/&#194;/g, "Â");
       s = s.replace(/&#195;/g, "Ã");
       s = s.replace(/&#196;/g, "Ä");
       s = s.replace(/&#197;/g, "Å");
       s = s.replace(/&#198;/g, "Æ");
       s = s.replace(/&#199;/g, "Ç");
       s = s.replace(/&#200;/g, "È");
       s = s.replace(/&#201;/g, "É");
       s = s.replace(/&#202;/g, "Ê");
       s = s.replace(/&#203;/g, "Ë");
       s = s.replace(/&#204;/g, "Ì");
       s = s.replace(/&#205;/g, "Í");
       s = s.replace(/&#206;/g, "Î");
       s = s.replace(/&#207;/g, "Ï");
       s = s.replace(/&#208;/g, "Ð");
       s = s.replace(/&#209;/g, "Ñ");
       s = s.replace(/&#210;/g, "Ò");
       s = s.replace(/&#211;/g, "Ó");
       s = s.replace(/&#212;/g, "Ô");
       s = s.replace(/&#213;/g, "Õ");
       s = s.replace(/&#214;/g, "Ö");
       s = s.replace(/&#215;/g, "×");
       s = s.replace(/&#216;/g, "Ø");
       s = s.replace(/&#217;/g, "Ù");
       s = s.replace(/&#218;/g, "Ú");
       s = s.replace(/&#219;/g, "Û");
 	   s = s.replace(/&#220;/g, "Ü");
       s = s.replace(/&#221;/g, "Ý");
       s = s.replace(/&#222;/g, "Þ");
       s = s.replace(/&#223;/g, "ß");
       s = s.replace(/&#224;/g, "à");
       s = s.replace(/&#225;/g, "á");
       s = s.replace(/&#226;/g, "â");
       s = s.replace(/&#227;/g, "ã");
       s = s.replace(/&#228;/g, "ä");
       s = s.replace(/&#229;/g, "å");
 	   s = s.replace(/&#230;/g, "æ");
       s = s.replace(/&#231;/g, "ç"); //*/
       s = s.replace(/&#232;/g, "è");
       s = s.replace(/&#233;/g, "é"); //
       s = s.replace(/&#234;/g, "ê");
       s = s.replace(/&#235;/g, "ë");
       s = s.replace(/&#236;/g, "ì");
       s = s.replace(/&#237;/g, "í");
       s = s.replace(/&#238;/g, "î");
       s = s.replace(/&#239;/g, "ï");
       s = s.replace(/&#240;/g, "ð");
       s = s.replace(/&#241;/g, "ñ");
       s = s.replace(/&#242;/g, "ò");
       s = s.replace(/&#243;/g, "ó");
       s = s.replace(/&#244;/g, "ô");
       s = s.replace(/&#245;/g, "õ");
       s = s.replace(/&#246;/g, "ö");
       s = s.replace(/&#247;/g, "÷");
       s = s.replace(/&#248;/g, "ø");
       s = s.replace(/&#249;/g, "ù");
       s = s.replace(/&#250;/g, "ú");
       s = s.replace(/&#251;/g, "û");
       s = s.replace(/&#252;/g, "ü");
       s = s.replace(/&#253;/g, "ý");
       s = s.replace(/&#254;/g, "þ");
       s = s.replace(/&#255;/g, "ÿ");
       s = s.replace(/&#338;/g, "Œ");
       s = s.replace(/&#339;/g, "œ");
       s = s.replace(/&#352;/g, "Š");
       s = s.replace(/&#353;/g, "š");
       s = s.replace(/&#376;/g, "Ÿ");
       s = s.replace(/&#402;/g, "ƒ");
       //*/
       
       /*
       s = s.replace(/&#201;/g, "");
       s = s.replace(/&#202;/g, "");
       s = s.replace(/&#203;/g, "");
       s = s.replace(/&#204;/g, "");
       s = s.replace(/&#205;/g, "");
       s = s.replace(/&#206;/g, "");
       s = s.replace(/&#207;/g, "");
       s = s.replace(/&#208;/g, "");
       s = s.replace(/&#209;/g, "");
 	   */
       
       /* BLANKS
       s = s.replace(//g, "");
       s = s.replace(//g, "");
       s = s.replace(//g, "");
       s = s.replace(//g, "");
       */

       node.data = s;
   }} );  // end of button



var unansweredBtn = $("#show_question_details");
//-- Add our button.
unansweredBtn.parent().after (
    '<br><a href="#" id="mathScript"><font size=3><strong>[Click to run Main Math (`sigma^(-1)`) script]</strong></font></a>' );
//-- Activate the button.
$("#mathScript").click ( function () {

    var textnodes, node, s;
    textnodes = document.evaluate( "//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textnodes.snapshotLength; i++) {
       node = textnodes.snapshotItem(i);
       s = node.data;

//GM_log("Nodes data = " + s);




// TEMPORARY MATH FILTERS
       s = s.replace(/-----?-?>/g, "\\longrightarrow");


// PRIORITY MATH FILTERS
       s = s.replace(/<\/?a?\:? ?math>/g, "");  // Remove various <math> tags
       s = s.replace(/`/g, "");  // Remove stray `s
       s = s.replace(/(\{\:\:\})?/g, "");  // Remove placeholder {::}s
       s = s.replace(/xx/g, "\\times ");
//       s = s.replace(/xx/g, " × ");
       s = s.replace(/∞/g, "\\infty ");
       s = s.replace(/\/\_/g, "\\angle ");  // Format angles (conflicts if not run before fraction filter)
       s = s.replace(/\(\:/g, "\\langle ");
       s = s.replace(/\:\)/g, "\\rangle ");
       s = s.replace(/^Delta/g, "\\Delta ");  // Format Delta if at the beginning of a text node
       s = s.replace(/[^\\]Delta/g, function(match) { 
           // return formatting with boundary character
           return match.charAt(0) + "\\Delta "; });
       s = s.replace(/^theta/g, "\\theta ");
       s = s.replace(/[^\\]theta/g, function(match) { 
           // return formatting with boundary character
           return match.charAt(0) + "\\theta "; });
       s = s.replace(/Sigma/g, "\\sum ");  // BH "Sigma" = Cnv "\sum" & BH "sigma" = Cnv "\sigma"
       s = s.replace(/^sigma/g, "\\sigma ");
       s = s.replace(/[^\\]sigma/g, function(match) { 
           // return formatting with boundary character
           return match.charAt(0) + "\\sigma "; });
       s = s.replace(/[^\\]vdots/g, function(match) { 
           // return formatting with boundary character
           return match.charAt(0) + "\\vdots "; });
       s = s.replace(/\-\>/g, "\\rightarrow ");
       s = s.replace(/\|\_\_/g, "\\lfloor ");
       s = s.replace(/\_\_\|/g, "\\rfloor ");
       s = s.replace(/\@/g, "\\circ ");
//       s = s.replace(/&#176;|&deg;/gi, "°");
       s = s.replace(/&#176;|&deg;|°/g, "^\\circ ");
       s = s.replace(/^>=/g, "\\ge ");
       s = s.replace(/[\d \)\]\}]>=/g, function(match) {
           return match.charAt(0) + "\\ge "; });
       s = s.replace(/bb\"\w\"/g, function(match) {
           return "\\boldsymbol{" + match.slice(3,match.length-1) + "}"; });
       s = s.replace(/π/g, "\\pi ");

// EXPRESSIONS
/*       ///////////////////////////
       // Format units of measurement
       // DISABLED while the Math Text filter catches a broader range of items.
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
       var reBar = /bar[\d\.\,]+|bar[\(\"]([\d\.\,]+|[\w\s]+)[\)\"]|stackrel_[\d\.\,]+|stackrel_[\(\"]([\d\.\,]+|[\w\s]+)[\)\"]/g;
       s = s.replace(reBar, function(match) {
           // return formatting with the number
           return "\\overline{" + match.match(reInnerEx1)[0] + "}";
       });

       ///////////////////////////
       // Format stackrel harr(#B ##)
       var reStH = /stackrel ?harr[\d\.\,]+|stackrel ?harr[\(\"]([\d\.\,]+|[\w\s]+)[\)\"]/g;
       s = s.replace(reStH, function(match) {
           // return formatting with the number
           return "\\overleftrightarrow{" + match.match(reInnerEx1)[0] + "}";
       });

       ///////////////////////////
       // Format vec(#B ##A C)
       var reVec = /vec[\d\.\,]+|vec[\(\"]([\d\.\,]+|[\w\s]+)[\)\"]\)/g;
       s = s.replace(reVec, function(match) {
           // return formatting with the number
           return "\\overrightarrow{" + match.match(reInnerEx1)[0] + "}"; });

       ///////////////////////////
       // Format vec(#B ##A C) and remove parntheses
       var reVec2 = /stackrel ?rarr[\(\"]([\d\.\,]+|[\w\s]+)[\)\"]/g;
       s = s.replace(reVec2, function(match) {
           // return formatting with the number
           return "\\overrightarrow{" + match.match(reInnerEx1)[0].replace(/[\(\)]/g, "") + "}"; });

       ///////////////////////////
       // Format in-equation text(xyzq rstlne)
       var reTxt = /\btext\([\w\s]+\)/g;
       s = s.replace(reTxt, function(match) {
           // return formatting with parenthetical text minus parentheses
           return "\\text{" + match.match(/\((\w|\s)+/gi)[0].replace(/\(/, "") + "}"; });

       ///////////////////////////
       // Format square roots at the beginning of a text node
       // Notes: 
       s = s.replace(/^sqrt ?\(?[\w\-\+\.\*]+\)?/g, function(match) {
       //s = s.replace(/^sqrt ?[\(\{]?-?(\w+([._^\+\-]{?\w+}?)*|(\\\w+[\^\_]?(\[[^\=\n\r]*\])?(\{[^\=\n\r\|]+\})? ?)+|( ?text\([\w ]+\))+|\([^\=\n\r\(\)]*(\([^\=\n\r\(\)]+\))*[^\=\n\r\(\)]*\)([\_\^]\w)?)[\)\}]?/g, function(match) {
           return "\\sqrt{" + match.slice(4,match.length) + "}"; });
       // Format square roots with a preceeding boundary character
       //s = s.replace(/[^\\a-zA-Z](sqrt|root)[\(\{]?[\w\-\+\.\,\*]*[\)\}]?/g, function(match) {  //avoids xyzroot()
       s = s.replace(/[^\\]sqrt ?\(?[\w\-\+\.\*]+\)?/g, function(match) {  // Misses nested parentheses 
           return match.charAt(0) + "\\sqrt{" + match.slice(5,match.length) + "}"; });
       //s = s.replace(/[^\\]sqrt ?-?(\w+([._^\+\-]{?\w+}?)*|(\\\w+[\^\_]?(\[[^\=\n\r]*\])?(\{[^\=\n\r\|]+\})? ?)+|( ?text\([\w ]+\))+|\([^\=\n\r\(\)]*(\([^\=\n\r\(\)]+\))*[^\=\n\r\(\)]*\)([\_\^]\w)?)/g, function(match) {
       //    return match.charAt(0) + "\\sqrt{" + match.slice(5,match.length).match(/-?(\w+([._^\+\-]{?\w+}?)*|(\\\w+[\^\_]?(\[[^\=\n\r]*\])?(\{[^\=\n\r\|]+\})? ?)+|( ?text\([\w ]+\))+|\([^\=\n\r\(\)]*(\([^\=\n\r\(\)]+\))*[^\=\n\r\(\)]*\)([\_\^]\w)?)/)[0] + "}"; });

       ///////////////////////////
       // Format x-roots 
       // Notes: Misses nested parentheses
       s = s.replace(/root\([\w\-\+\.\*\^]*\)\([\w\-\+\.\,\*\^]+\)/g, function(match) {
           var xrterms1 = match.match(/\([^\(\)]*\)/gi);
           return "\\sqrt[" + xrterms1[0].slice(1,xrterms1[0].length-1) + "]{" + xrterms1[1].slice(1,xrterms1[1].length-1) + "}"; });
/*       // Format x-roots with a preceeding boundary character
       //s = s.replace(/[^\\a-zA-Z](sqrt|root)[\(\{]?[\w\-\+\.\*]*[\)\}]?/g, function(match) {  //avoids xyzroot()
       s = s.replace(/[^\\]root\([\w\-\+\.\,\*^]*\)\([\w\-\+\.\*^]+\)/g, function(match) {
           var xrbound = match.charAt(0);
           var xrterms2 = match.match(/\([^\(\)]*\)/g);
           return xrbound + "\\sqrt[" + xrterms2[0].slice(1,xrterms2[0].length-1) + "]" + "{" + xrterms2[1].slice(1,xrterms2[1].length-1) + "}"; });  *///


       ///////////////////////////
       // Format exponents w/ no preceeding digit (as in \sigma ^2)
       s = s.replace(/[\b\s]\^\([^\=\n\r\(\)]+\)/g, function(match) {
           return "^{" + match.slice(3,match.length-1) + "}"; });
       // For exponents with a preceeding boundary character
       //var rePwr = /[\w\)]\^\([\w\-\+\.\,\*]+\)/g;
       var rePwr = /[\w\)]\^\([^\=\n\r\(\)]+\)/g;  // Captures boundary character
       s = s.replace(rePwr, function(match) {
           return match.charAt(0) + "^{" + match.slice(3,match.length-1) + "}"; });  // return formatting with boundary character

       ///////////////////////////
       // Format subs w/ no preceeding digit
       s = s.replace(/\b\_\([^\=\n\r\(\)]+\)/g, function(match) {
           return "_{" + match.slice(3,match.length-1) + "}"; });
       // For subs with a preceeding boundary digit
       var reSub = /[\w]\_\([^\=\n\r\(\)]+\)/g;
       s = s.replace(reSub, function(match) {
           // return formatting with boundary character
           return match.charAt(0) + "_{" + match.slice(3,match.length-1) + "}"; });  // return formatting with boundary character

       ///////////////////////////
       // Format Limits functions
       s = s.replace(/^lim_/g, "\\lim_");
       s = s.replace(/[^\\]lim_/g, function(match){
           // return formatting with boundary character
           return match.match(/[^\\]/g)[0] + "\\lim_"; });

       ///////////////////////////

// ALGEBRA SYMBOLS
       s = s.replace(/\*/g, "\\cdot ");
//       s = s.replace(/\*/g, " ⋅ ");
//       s = s.replace(/\^-/g, "^{-");  // Obsolete - Format negative exponent filter
//       s = s.replace(/\!=/g, "≠");
       s = s.replace(/\!=/g, "\\ne ");
//       s = s.replace(/>=/g, "≥");
       s = s.replace(/<=/g, "\\le ");
//       s = s.replace(/<=/g, "≤");
       s = s.replace(/-:/g, "\\div ");
//       s = s.replace(/-:/g, "÷");
       s = s.replace(/~~/g, "\\approx ");
//       s = s.replace(/&#402;/g, "ƒ");
       s = s.replace(/&#247;/g, "÷");
       s = s.replace(/&lt;/gi, "\<");
       s = s.replace(/&gt;/gi, "\>");
       s = s.replace(/\+\-/g, "\\pm ");
//       s = s.replace(/&#177;/g, "±");
       s = s.replace(/&#177;|±/g, "\\pm ");
       s = s.replace(/larr/g, "\\leftarrow ");


// GEOMETRY SYMBOLS
        // need to add \overset{\frown{}}
       s = s.replace(/≯/g, "\\ngtr "); // Replaces unformatted ≯
       s = s.replace(/∠/g, "\\angle ");
       s = s.replace(/~=/g, "\\cong ");
       s = s.replace(/≅/g, "\\cong ");
       s = s.replace(/\^\@/g, "^\\circ ");  // Format degree symbol

// BLANK
//       s = s.replace(//g, "");
//       s = s.replace(//g, "");
//       s = s.replace(//g, "");
//       s = s.replace(//g, "");
//       s = s.replace(//g, "");
//       s = s.replace(//gi, "");

      
      node.data = s;
   } } );  // end of button



var buttonAnchor1   = $("#show_question_details");  //FRACTION FILTER
//-- Add our button.
buttonAnchor1.parent ().after (
    '<br><a href="#" id="scriptButton1"><font size=2><strong>[Click to run Fractions (1/1) script]</strong></font></a> ' );
//-- Activate the button.
$("#scriptButton1").click ( function () {
    var textnodes, node, s;
    textnodes = document.evaluate( "//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textnodes.snapshotLength; i++) {
       node = textnodes.snapshotItem(i);
       s = node.data;

       // Check for and mask URLs and other false positives
       // Look for href and src followed by =".../equa
       var URLs = s.match(/(href|src)\=\"[^\"\n\r]+"/gi);
       if (URLs !== null) {
           for(j=0; j < URLs.length; j++){
               s = s.replace(URLs[j], URLs[j].replace(/\//g, "~noFilterBackslash~"));
           }}
       s = s.replace(/True\/False/g, "True~noFilterBackslash~False");

       // Format fractions
       //var reFrac1 = /-?(([\w,._^]+(\\\w+\^?(({.+})*| )| ?text\([\w ]+\))*)|\(.+\))\/-?(([\w,._^]+(\\\w+\^?(({.+})*| )| ?text\([\w ]+\))*)|\(.+\))/gi;
       //var reFrac1 = /-?(\w+([,._^{}]+\w+)*|(\\\w+[\^\_]?(\[[^\=\n\r]*\])?(\{[^\=\n\r]+\})? ?)+|( ?text\([\w ]+\))+|\([^\=\n\r]+\))\/-?(\w+([,._^{}]+\w+)*|(\\\w+[\^\_]?(\[[^\=\n\r]*\])?(\{[^\=\n\r]+\})? ?)+|( ?text\([\w ]+\))+|\([^\=\n\r]+\))/g;
       //var reFrac1 = /-?(\w+([._^\+\-]{?\w+}?)*|(\\\w+[\^\_]?(\[[^\=\n\r]*\])?(\{[^\=\n\r\|]+\})? ?)+|( ?text\([\w ]+\))+|\([^\=\n\r\(\)]*(\([^\=\n\r]+\))*[^\=\n\r\(\)]\))\/-?(\w+([._^\+\-]{?\w+}?)*|(\\\w+[\^\_]?(\[[^\=\n\r]*\])?(\{[^\=\n\r\|]+\})? ?)+|( ?text\([\w ]+\))+|\([^\=\n\r\(\)]*(\([^\=\n\r]+\))*[^\=\n\r\(\)]*\))/g;
       var reFrac1 = /(-?(\d+|[a-zA-Z])([._^]{?\w+}?)?|(\\\w+[\^\_]?(\[[^\=\n\r]*\])?(\{[^\=\n\r\|]+\})? ?)+|( ?text\([\w ]+\))+|\([^\=\n\r\(\)]*(\([^\=\n\r\(\)]+\))*[^\=\n\r\(\)]*\)([\_\^]\w)?)\/(-?(\d+|[a-zA-Z])([._^]{?\w+}?)?|(\\\w+[\^\_]?(\[[^\=\n\r]*\])?(\{[^\=\n\r\|]+\})? ?)+|( ?text\([\w ]+\))+|\([^\=\n\r\(\)]*(\([^\=\n\r\(\)]+\))*[^\=\n\r\(\)]*\)([\_\^]\w)?)/g;

       // matches a single term of a fraction (matches above)
       var reTerm1 = /[^\/]+/g;

       s = s.replace(reFrac1, function(match) {

           // Get/match all terms into an array
           var terms1 = match.match(reTerm1);
           // Remove first and last parentheses if present.
           if (terms1[0].charAt(0)=="(" && terms1[0].charAt(terms1[0].length)==")")
               terms1[0]=terms1[0].slice(1,terms1[0].length-1);
           if (terms1[1].charAt(0)=="(" && terms1[1].charAt(terms1[1].length)==")")
               terms1[1]=terms1[1].slice(1,terms1[1].length-1);
           // Return formatting with clean numbers
           //return term[0] + "\\over{" + term[1] + "}";
           return "\\frac{" + terms1[0] + "}{" + terms1[1] + "}";

       });

       // Repair false positives if any were masked
       s = s.replace(/\~noFilterBackslash\~/g, "\/");


       node.data = s;
    }} );  // end of button



var buttonAnchor1 = $("#show_question_details");  // PI FILTER
//-- Add our button.
buttonAnchor1.parent().after(
    '<br><a href="#" id="scriptButton2"><font size=2><strong>[Click to run Pi (pix) script]</strong></font></a> ' );
//-- Activate the button.
$("#scriptButton2").click(function(){
    var textnodes, node, s;
    textnodes = document.evaluate( "//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textnodes.snapshotLength; i++){

       node = textnodes.snapshotItem(i);
       s = node.data;

       // PI
       s = s.replace(/^pi/g, "\\pi ");
       s = s.replace(/[^\\a-zA-Z]pi/g, function(match) {
           // return formatting with boundary character
           return match.match(/[^\\]/g)[0] + "\\pi "; });

       node.data = s;
   }} );  // end of button



var buttonAnchor1 = $("#show_question_details");  // SUM FILTER
//-- Add our button.
buttonAnchor1.parent().after(
    '<br><a href="#" id="scriptButton3"><font size=2><strong>[Click to run Sum (sumt) script]</strong></font></a> ' );
//-- Activate the button.
$("#scriptButton3").click(function(){
    var textnodes, node, s;
    textnodes = document.evaluate("//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textnodes.snapshotLength; i++){

       node = textnodes.snapshotItem(i);
       s = node.data;

       // SUM
       s = s.replace(/^sum/g, "\\sum ");
       s = s.replace(/[^\\a-zA-Z]sum/g, function(match){
           // return formatting with boundary character
           return match.match(/[^\\]/g)[0] + "\\sum "; });

        node.data = s;
   }} );  // end of button



var buttonAnchor1 = $("#show_question_details");  // MATH TEXT FILTER
//-- Add our button.
buttonAnchor1.parent ().after (
    '<br><a href="#" id="scriptButton4"><font size=2><strong>[Click to run Math Text ("meters") script]</strong></font></a> ' );
//-- Activate the button.
$("#scriptButton4").click(function(){
    var textnodes, node, s;
    textnodes = document.evaluate( "//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textnodes.snapshotLength; i++){

       node = textnodes.snapshotItem(i);
       s = node.data;

       // Format quoted text for formulas.
       // WARNING: This will mess up non-math quotations
       var reUnit = /\"[\w\s]+"/gi;
       s = s.replace(reUnit, function(match) {
           // return match with formatting
           return "\\text{ " + match.match(/[\w\s,]+/gi)[0] + " }"; });

       node.data = s;
   }} );  // end of button



var buttonAnchor1 = $("#show_question_details");  // TRIG FUNCTIONS FILTER
//-- Add our button.
buttonAnchor1.parent ().after (
    '<br><a href="#" id="scriptButton5"><font size=2><strong>[Click to run Trig Functions (3xcscy+tanz) script]</strong></font></a> ' );
//-- Activate the button.
$("#scriptButton5").click(function(){
    var textnodes, node, s;
    textnodes = document.evaluate( "//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textnodes.snapshotLength; i++){

       node = textnodes.snapshotItem(i);
       s = node.data;

       // Format sin, cos, tan, sec, csc, cot
       s = s.replace(/^sin/g, "\\sin ");
       s = s.replace(/[^\\]sin/g, function(match){
           // return formatting with boundary character
           return match.match(/[^\\]/g)[0] + "\\sin "; });
       s = s.replace(/^cos/g, "\\cos ");
       s = s.replace(/[^\\]cos/g, function(match){
           // return formatting with boundary character
           return match.match(/[^\\]/g)[0] + "\\cos "; });
       s = s.replace(/^tan/g, "\\tan ");
       s = s.replace(/[^\\]tan/g, function(match){
           // return formatting with boundary character
           return match.match(/[^\\]/g)[0] + "\\tan "; });
       s = s.replace(/^cot/g, "\\cot ");
       s = s.replace(/[^\\]cot/g, function(match){
           // return formatting with boundary character
           return match.match(/[^\\]/g)[0] + "\\cot "; });
       s = s.replace(/^sec/g, "\\sec ");
       s = s.replace(/[^\\]sec/g, function(match){
           // return formatting with boundary character
           return match.match(/[^\\]/g)[0] + "\\sec "; });
       s = s.replace(/^csc/g, "\\csc ");
       s = s.replace(/[^\\]csc/g, function(match){
           // return formatting with boundary character
           return match.match(/[^\\]/g)[0] + "\\csc "; });

       // Fix false positives
       s = s.replace(/\\sin g/g, "sing");
       s = s.replace(/\\sin e\b/g, "sine");
       s = s.replace(/\\tan g/g, "tang");
       s = s.replace(/\\sec ond/g, "second");


        node.data = s;
   }} );  // end of button



/*
var buttonAnchor1 = $("#show_question_details");
//-- Add our button.
buttonAnchor1.parent ().after (
    '<br><a href="#" id="scriptButton#"><font size=2><strong>[Click to run script]</strong></font></a> ' );
//-- Activate the button.
$("#scriptButton#").click(function(){
    var textnodes, node, s;
    textnodes = document.evaluate( "//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textnodes.snapshotLength; i++){

       node = textnodes.snapshotItem(i);
       s = node.data;


       node.data = s;
   }} );  // end of button
*/



/*
var buttonAnchor1 = $("#show_question_details");
//-- Add our button.
buttonAnchor1.parent ().after (
    '<br><a href="#" id="scriptButton#"><font size=2><strong>[Click to run script]</strong></font></a> ' );
//-- Activate the button.
$("#scriptButton#").click(function(){
    var textnodes, node, s;
    textnodes = document.evaluate( "//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textnodes.snapshotLength; i++){

       node = textnodes.snapshotItem(i);
       s = node.data;


       node.data = s;
   }} );  // end of button
*/




//GM_log("The Master script is running!");
//alert("The Master script is running!");