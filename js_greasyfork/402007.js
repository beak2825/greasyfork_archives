// ==UserScript==
// @name        PubMed Go To Publisher
// @version     0.2.0
// @author      sincostandx
// @description Automatically redirect to PMC free PDF or publisher website for full text when you click on the title in the PubMed search result list
// @namespace   https://greasyfork.org/users/171198
// @include     https://pubmed.ncbi.nlm.nih.gov/*
// @downloadURL https://update.greasyfork.org/scripts/402007/PubMed%20Go%20To%20Publisher.user.js
// @updateURL https://update.greasyfork.org/scripts/402007/PubMed%20Go%20To%20Publisher.meta.js
// ==/UserScript==

const pmc_link = document.querySelector('a.pmc');
if (pmc_link === null) {
  const doi_link = document.querySelector('a[data-ga-action="DOI"]');
  location.replace(doi_link.href);
} else {
  location.replace(pmc_link.href + "/pdf/main.pdf");
}