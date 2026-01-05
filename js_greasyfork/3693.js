// ==UserScript==
// @name          Story Width for Fan Fiction Sites
// @namespace     https://greasyfork.org/en/scripts/3693-story-width-for-fan-fiction-sites
// @version       1.21
// @author        Azurewren (azurewren@gmail.com)
// @description	  A small, simple script that changes the CSS of a variety of fan fiction sites so that the viewing width of the story is changed to the prefered width.
// @match         *://*.fanficauthors.net/*
// @match         *://*.tthfanfic.org/*
// @match         *://*.tenhawkpresents.com/*
// @match         *://*.hpfandom.net/*
// @match         *://*.yourfanfiction.com/*
// @match         *://*.archiveofourown.org/*
// @match         *://*.ficwad.com/*
// @match         *://*.e-fic.com/*
// @match         *://*.fanfiction.net/*
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/3693/Story%20Width%20for%20Fan%20Fiction%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/3693/Story%20Width%20for%20Fan%20Fiction%20Sites.meta.js
// ==/UserScript==
(function() {
   var css = "";
   if (false || (document.domain == "fanficauthors.net" || document.domain.substring(document.domain.indexOf(".fanficauthors.net") + 1) == "fanficauthors.net"))
      css += "li.chapterDisplay { width:600px !important; display: block !important; margin-left: auto !important; margin-right: auto !important; }";
   if (false || (document.domain == "tthfanfic.org" || document.domain.substring(document.domain.indexOf(".tthfanfic.org") + 1) == "tthfanfic.org"))
      css += "div#storyinnerbody { width:600px !important; display: block !important; margin-left: auto !important; margin-right: auto !important; padding: 2em !important; }";
   if (false || (document.domain == "tenhawkpresents.com" || document.domain.substring(document.domain.indexOf(".tenhawkpresents.com") + 1) == "tenhawkpresents.com"))
      css += "div#story { width:600px !important; display: block !important; margin-left: auto !important; margin-right: auto !important; padding: 2em !important; }";
   if (false || (document.domain == "hpfandom.net" || document.domain.substring(document.domain.indexOf(".hpfandom.net") + 1) == "hpfandom.net"))
      css += "tbody { width:600px !important; display: block !important; margin-left: auto !important; margin-right: auto !important; padding: 2em !important; }";
   if (false || (document.domain == "yourfanfiction.com" || document.domain.substring(document.domain.indexOf(".yourfanfiction.com") + 1) == "yourfanfiction.com"))
      css += "div#story { width:600px !important; display: block !important; margin-left: auto !important; margin-right: auto !important; padding: 0em 2em 0em 0em !important; }";
   if (false || (document.domain == "archiveofourown.org" || document.domain.substring(document.domain.indexOf(".archiveofourown.org") + 1) == "archiveofourown.org"))
      css += "div#workskin { width:600px !important; display: block !important; margin-left: auto !important; margin-right: auto !important; }";
   if (false || (document.domain == "ficwad.com" || document.domain.substring(document.domain.indexOf(".ficwad.com") + 1) == "ficwad.com"))
      css += "div#contents { width:auto !important; }";
      css += "div#storytext { width:auto !important; }";
   if (false || (document.domain == "e-fic.com" || document.domain.substring(document.domain.indexOf(".e-fic.com") + 1) == "e-fic.com"))
      css += "div#story { width:600px !important; display: block !important; margin-left: auto !important; margin-right: auto !important; }";
   if (false || (document.domain == "fanfiction.net" || document.domain.substring(document.domain.indexOf(".fanfiction.net") + 1) == "fanfiction.net"))
      css += "div#content_wrapper { width:100% !important; }";
   if (typeof GM_addStyle != "undefined") {
      GM_addStyle(css);
   } else if (typeof PRO_addStyle != "undefined") {
      PRO_addStyle(css);
   } else if (typeof addStyle != "undefined") {
      addStyle(css);
   } else {
      var node = document.createElement("style");
      node.type = "text/css";
      node.appendChild(document.createTextNode(css));
      var heads = document.getElementsByTagName("head");
      if (heads.length > 0) {
         heads[0].appendChild(node); 
      } else {
         document.documentElement.appendChild(node);
      }
   }
})();
