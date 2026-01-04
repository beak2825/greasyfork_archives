// ==UserScript==
// @name         LinkedIn Job Search Result Filter
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.2
// @license      GNU AGPLv3
// @author       jcunews
// @description  Filter out LinkedIn job search result by title, company, and location. Edit filter list in the script before use, and keep a backup before updating script.
// @match        https://www.linkedin.com/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380954/LinkedIn%20Job%20Search%20Result%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/380954/LinkedIn%20Job%20Search%20Result%20Filter.meta.js
// ==/UserScript==

((titleFilter, companyFilter, locationFilter) => {

  //===== CONFIGURATION BEGIN =====

  titleFilter    = /badpost|badjob/i;
  companyFilter  = /badcompany|badcorp/i;
  locationFilter = /badcity|badcity, ch|, ch/i;

  //===== CONFIGURATION END =====

  function checkItem(ele, a) {
    if (
      ((a = ele.querySelector(".entity-result__title-text--black,.job-card-list__title")) && titleFilter.test(a.textContent)) ||
      ((a = ele.querySelector(".entity-result__primary-subtitle,.job-card-container__company-name")) && companyFilter.test(a.textContent)) ||
      ((a = ele.querySelector(".entity-result__secondary-subtitle,.job-card-container__metadata-item")) && locationFilter.test(a.textContent))
    ) ele.remove();
  }

  (new MutationObserver(rs => {
    rs.forEach(r => {
      r.addedNodes.forEach(n => {
        if (n.nodeType !== Node.ELEMENT_NODE) return;
        if (n.matches("li.reusable-search__result-container,.jobs-search-results__list-item")) {
          checkItem(n);
        } else document.querySelectorAll("li.reusable-search__result-container,.jobs-search-results__list-item").forEach(li => checkItem(li));
      });
    });
  })).observe(document.body, {childList: true, subtree: true});
})();
