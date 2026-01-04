// ==UserScript==
// @name        Hide promoted results in jobs search
// @namespace   Violentmonkey Scripts
// @match       https://www.linkedin.com/jobs/search/
// @grant       none
// @version     1.0
// @author      github.com/1player
// @description 20/09/2022, 17:29:11
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451712/Hide%20promoted%20results%20in%20jobs%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/451712/Hide%20promoted%20results%20in%20jobs%20search.meta.js
// ==/UserScript==

(function() {
  function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  const searchResultsList = document.querySelector('.jobs-search-results-list');
  if (!searchResultsList) {
    return;
  }

  const removePromotedResults = function() {
    let promotedResults = Array.from(searchResultsList.querySelectorAll('li.job-card-container__footer-item'))
      .filter(el => el.innerText == "Promoted")
      .map(el => el.closest('.job-card-container'));

    promotedResults.forEach(promotedResult => {
      promotedResult.style.display = 'none'
    });
  }

  searchResultsList.addEventListener('DOMSubtreeModified', debounce(removePromotedResults), false);
  removePromotedResults();
})();
