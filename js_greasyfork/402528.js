// ==UserScript==
// @name         Reading Mode for Online Papers
// @namespace    https://github.com/LadderOperator/Reading-Mode-for-Online-Papers
// @version      0.2.1
// @description  Simplify websites of some journals for better reading experience
// @author       LadderOperator
// @include       *://*.sciencemag.org/content/*
// @include       *://journals.aps.org/*/abstract/*
// @include       *://www.nature.com/articles/*
// @include       *://pubs.acs.org/doi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402528/Reading%20Mode%20for%20Online%20Papers.user.js
// @updateURL https://update.greasyfork.org/scripts/402528/Reading%20Mode%20for%20Online%20Papers.meta.js
// ==/UserScript==

(function() {
   'use strict';
   var currentPage = window.location.host

   if (currentPage.indexOf("sciencemag.org") > -1)
      currentPage = "sciencemag.org"

   switch(currentPage) {
    case "sciencemag.org":
          document.querySelector(".tertiary").remove()
          document.querySelector(".secondary").remove()
          document.querySelector(".section.ref-list").setAttribute("style","text-align:left;")
          document.querySelector("article").setAttribute("style","padding-left:30px;margin-left:30px;text-align:justify;")
       break;
    case "journals.aps.org":
          document.querySelector("#article-sidebar").remove()
          document.querySelector(".nav-toggle").remove()
          document.querySelector("#article-content").setAttribute("style","width:100%;text-align:justify;")
          document.querySelectorAll(".fulltext-media > div > div").forEach(function(img){img.setAttribute("style","text-align:center;")})

       break;
    case "www.nature.com":
          document.querySelector("#content div.c-article-extras.u-hide-print").remove()
          document.querySelector("#content .c-article-main-column.u-float-left.js-main-column").setAttribute("style","width:100%;text-align:justify;margin-right:0;")
       break;
     case "pubs.acs.org":
          document.querySelector(".article_content-table").setAttribute("style","text-align:justify!important;")
           document.querySelector(".articleBody_abstractText").setAttribute("style","text-align:justify!important;")
          document.querySelector("#article_content-right").remove()
     break;
   }

})();