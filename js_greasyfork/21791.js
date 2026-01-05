// ==UserScript==
// @description    Replaces some text in Canvas from Brainhoney
// @name           Canvas HTML Filter
// @version        1.1
// @include        https://comprehend.instructure.com/courses/*
// @namespace https://greasyfork.org/users/10310
// @downloadURL https://update.greasyfork.org/scripts/21791/Canvas%20HTML%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/21791/Canvas%20HTML%20Filter.meta.js
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

       /*
       ///////////////////////////
       // matches (-#)/(-#) and x/y
       // complex
       //var regex = /\b\(?\-?((\w?\d+\w?)+|(\d*\w{1}\d*))\)?\/\(?\-?((\w?\d+\w?)+|(\d*\w{1}\d*))\)?/gi;
       // simple
       var regex = /\(?\-?\d+\)?\/\(?\-?\d+\)?/gi;

       // matches a single parenthetical (#)
       // complex
       //var reNum = /\(?\-?((\w?\d+\w?)+|(\d*\w{1}\d*))\)?/gi;
       // simple
       var reNum = (/\(?\-?\d+\)?/gi);
       //var regex = /LCD/gi;

       s = s.replace(regex, function(match) {

           // get the (#)s into an array
           var num = match.match(reNum);
               // strip parentheses
               num[0].replace(/\(/gi, "").replace(/\)/gi, "");
               num[1].replace(/\(/gi, "").replace(/\)/gi, "");
           // return formatting with clean numbers
           return "\\frac{" + num[0] + "}{" + num[1] + "}";

       });
       ///////////////////////////
       */
       
       // punctuation
       s = s.replace(/&#32;/gi, " ");
       //s = s.replace(/&#33;/gi, "!");
       //s = s.replace(/&#34;/gi, "\"");
       s = s.replace(/&quot;/gi, "\"");
       //s = s.replace(/&#35;/gi, "#");
       //s = s.replace(/&#36;/gi, "$");
       //s = s.replace(/&#37;/gi, "%");
       s = s.replace(/&#38;/gi, "&");
       s = s.replace(/&amp;/gi, "&");
       s = s.replace(/&#39;/gi, "'");
       //s = s.replace(/&#40;/gi, "(");
       //s = s.replace(/&#41;/gi, ")");
       //s = s.replace(/&#42;/gi, "*");
       //s = s.replace(/&#43;/gi, "+");
       //s = s.replace(/&#44;/gi, ",");
       //s = s.replace(/&#45;/gi, "-");
       //s = s.replace(/&#46;/gi, ".");
       //s = s.replace(/&#47;/gi, "/");
       s = s.replace(/&#160;/gi, " ");
       
       s = s.replace(/&#8211;/gi, "–");
       s = s.replace(/&#8212;/gi, "—");
       s = s.replace(/&#8216;/gi, "‘");
       s = s.replace(/&#8217;/gi, "’");
       s = s.replace(/&#8218;/gi, "‚");
       s = s.replace(/&#8220;/gi, "“");
       s = s.replace(/&#8221;/gi, "”");
       s = s.replace(/&#8222;/gi, "„");
       s = s.replace(/&#8224;/gi, "†");
       s = s.replace(/&#8225;/gi, "‡");
       s = s.replace(/&#8226;/gi, "•");
       s = s.replace(/&#8230;/gi, "…");
       s = s.replace(/&#8240;/gi, "‰"); //*/
       s = s.replace(/&#8364;/gi, "€");
       s = s.replace(/&#8482;/gi, "™");
       s = s.replace(/&#;/gi, "");
       
       // accents
       s = s.replace(/&#192;/gi, "À");
       s = s.replace(/&#193;/gi, "Á");
       s = s.replace(/&#194;/gi, "Â");
       s = s.replace(/&#195;/gi, "Ã");
       s = s.replace(/&#196;/gi, "Ä");
       s = s.replace(/&#197;/gi, "Å");
       s = s.replace(/&#198;/gi, "Æ");
       s = s.replace(/&#199;/gi, "Ç");
       s = s.replace(/&#200;/gi, "È");
       s = s.replace(/&#201;/gi, "É");
       s = s.replace(/&#202;/gi, "Ê");
       s = s.replace(/&#203;/gi, "Ë");
       s = s.replace(/&#204;/gi, "Ì");
       s = s.replace(/&#205;/gi, "Í");
       s = s.replace(/&#206;/gi, "Î");
       s = s.replace(/&#207;/gi, "Ï");
       s = s.replace(/&#208;/gi, "Ð");
       s = s.replace(/&#209;/gi, "Ñ");
       s = s.replace(/&#210;/gi, "Ò");
       s = s.replace(/&#211;/gi, "Ó");
       s = s.replace(/&#212;/gi, "Ô");
       s = s.replace(/&#213;/gi, "Õ");
       s = s.replace(/&#214;/gi, "Ö");
       s = s.replace(/&#215;/gi, "×");
       s = s.replace(/&#216;/gi, "Ø");
       s = s.replace(/&#217;/gi, "Ù");
       s = s.replace(/&#218;/gi, "Ú");
       s = s.replace(/&#219;/gi, "Û");
 	   s = s.replace(/&#220;/gi, "Ü");
       s = s.replace(/&#221;/gi, "Ý");
       s = s.replace(/&#222;/gi, "Þ");
       s = s.replace(/&#223;/gi, "ß");
       s = s.replace(/&#224;/gi, "à");
       s = s.replace(/&#225;/gi, "á");
       s = s.replace(/&#226;/gi, "â");
       s = s.replace(/&#227;/gi, "ã");
       s = s.replace(/&#228;/gi, "ä");
       s = s.replace(/&#229;/gi, "å");
 	   s = s.replace(/&#230;/gi, "æ");
       s = s.replace(/&#231;/gi, "ç"); //*/
       s = s.replace(/&#232;/gi, "è");
       s = s.replace(/&#233;/gi, "é"); //
       s = s.replace(/&#234;/gi, "ê");
       s = s.replace(/&#235;/gi, "ë");
       s = s.replace(/&#236;/gi, "ì");
       s = s.replace(/&#237;/gi, "í");
       s = s.replace(/&#238;/gi, "î");
       s = s.replace(/&#239;/gi, "ï");
       s = s.replace(/&#240;/gi, "ð");
       s = s.replace(/&#241;/gi, "ñ");
       s = s.replace(/&#242;/gi, "ò");
       s = s.replace(/&#243;/gi, "ó");
       s = s.replace(/&#244;/gi, "ô");
       s = s.replace(/&#245;/gi, "õ");
       s = s.replace(/&#246;/gi, "ö");
       s = s.replace(/&#247;/gi, "÷");
       s = s.replace(/&#248;/gi, "ø");
       s = s.replace(/&#249;/gi, "ù");
       s = s.replace(/&#250;/gi, "ú");
       s = s.replace(/&#251;/gi, "û");
       s = s.replace(/&#252;/gi, "ü");
       s = s.replace(/&#253;/gi, "ý");
       s = s.replace(/&#254;/gi, "þ");
       s = s.replace(/&#255;/gi, "ÿ");
       s = s.replace(/&#338;/gi, "Œ");
       s = s.replace(/&#339;/gi, "œ");
       s = s.replace(/&#352;/gi, "Š");
       s = s.replace(/&#353;/gi, "š");
       s = s.replace(/&#376;/gi, "Ÿ");
       s = s.replace(/&#402;/gi, "ƒ");
       //*/
       
       /*
       s = s.replace(/&#200;/gi, "");
       s = s.replace(/&#201;/gi, "");
       s = s.replace(/&#202;/gi, "");
       s = s.replace(/&#203;/gi, "");
       s = s.replace(/&#204;/gi, "");
       s = s.replace(/&#205;/gi, "");
       s = s.replace(/&#206;/gi, "");
       s = s.replace(/&#207;/gi, "");
       s = s.replace(/&#208;/gi, "");
       s = s.replace(/&#209;/gi, "");
 	   */
       
       node.data = s;
   }

//}, false); // end of redundant/overkill
alert('The HTML script is running!');