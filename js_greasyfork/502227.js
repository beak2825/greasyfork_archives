// ==UserScript==
// @name         LinkedIn search results
// @namespace    http://sam.haslers.info/
// @version      2024-06-07
// @license      MIT
// @description  Colour LinkedIn job search results that have already been seen
// @author       Sam Hasler
// @match        https://www.linkedin.com/jobs/collections/*
// @match        https://www.linkedin.com/jobs/collections/similar-jobs/*
// @match        https://www.linkedin.com/jobs/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/502227/LinkedIn%20search%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/502227/LinkedIn%20search%20results.meta.js
// ==/UserScript==


(function() {
  'use strict';
  const OBSERVER_OPTIONS = {
    childList:true,
    subtree: true,
    attributes: true, // 2024-03-06 added to pick up youtube element reuse
    characterData: true, // 2024-03-06 added to pick up youtube element reuse
  };
  const debouncedObserver = (updateDomFn, debounceMs = 10_000) => {
    let isUpdating = false, updateSceduled;

    const observer = new MutationObserver(function(mutationArray, observer) {
      mutationArray.forEach(mutation => {
        // @TODO configure what triggers re-run
        if (!updateSceduled){ // && mutation.addedNodes){
          isUpdating = true;
          //console.log("%cupdateSceduled", `background-color:magenta;`);
          updateSceduled = setTimeout(() => {
            //console.log("%cupdating", `background-color:magenta;`);
            updateDomFn();
            updateSceduled = void 0;
            isUpdating = false;
            //console.log("%cupdate done", `background-color:magenta;`);
          }, debounceMs);
          //  } else if (isUpdating){
          //the setTimeout will run updateDomFn AFTER other DOMNodeInserted events, so this shouldn't happen:
          //    console.warn("DOM Modified during update", e.target);
        }
      });
    });
    observer.observe(document.firstElementChild, OBSERVER_OPTIONS);
    return observer;
  }

  GM_addStyle(`
.job-card-container:has([data-state="viewed" ])                                             { background-color: beige;     }
.job-card-container:has([data-state="viewed" ]).jobs-search-results-list__list-item--active { background-color: yellow;    }
.job-card-container:has([data-state="saved"  ])                                             { background-color: lightblue; }
.job-card-container:has([data-state="saved"  ]).jobs-search-results-list__list-item--active { background-color: blue;      }
.job-card-container:has([data-state="applied"])                                             { background-color: lightgreen;}
.job-card-container:has([data-state="applied"]).jobs-search-results-list__list-item--active { background-color: green;     }
`)
  const colorResults = () => {
    document
      .querySelectorAll('.job-card-container__footer-job-state')
      .forEach(s => s.setAttribute('data-state', s.innerText.toLowerCase()));
  }

  colorResults();
  debouncedObserver(colorResults,250);
})();