// ==UserScript==
// @name        KarriereAt Spamfilter
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       We1rd0
// @match        https://www.karriere.at/jobs*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423895/KarriereAt%20Spamfilter.user.js
// @updateURL https://update.greasyfork.org/scripts/423895/KarriereAt%20Spamfilter.meta.js
// ==/UserScript==

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function killAds() {
  let items = Array.from(
    document.querySelector("div.m-jobsSearchList__activeJobs > ol").children
  ).filter((x) => {
    //KERN engineering
    let company = x.querySelector(".m-jobsListItem__company")?.innerText;
    if (!company) return;
    return (
      company.includes("epunkt GmbH") ||
      company.includes("KERN engineering") ||
      company.includes("TODAY Experts GmbH") ||
      company.includes("dataformers") ||
      company.includes("VACE Engineering GmbH") ||
      company.includes("IVM Technical Consultants")
    );
  });

  items.forEach((x) => x.remove());
  if (items.length > 0) console.log("Killed " + items.length + " ads");
}

function clickLoadMoreButton() {
  // Function to click the button, modified to be debounced
  const clickLoadMoreButtonDebounced = debounce(() => {
    const button = document.querySelector(".m-loadMoreJobsButton__button");
    if (button && button.offsetHeight !== 0) {
      button.click();
      console.log("Button clicked!");
    } else {
      console.log("Button not found or not visible yet.");
    }
  }, 2000); // 2000 milliseconds = 2 seconds

  // Create an observer instance to monitor DOM changes
  const observer = new MutationObserver((mutations) => {
    clickLoadMoreButtonDebounced();
  });

  // Configuration of the observer:
  const config = { attributes: true, childList: true, subtree: true };

  // Select the target node to observe
  const targetNode = document.body; // Adjust based on webpage structure

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

(function () {
  "use strict";

  killAds();
  //   console.log("killed");
  // Observe changes in the job list container
  const targetNode = document.querySelector("div.m-jobsSearchList__activeJobs > ol");
  if (targetNode) {
    const config = { childList: true, subtree: true };
    const callback = function (mutationsList, observer) {
      // Run killAds on any DOM change within the target node
      killAds();
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    clickLoadMoreButton();
  }
})();
