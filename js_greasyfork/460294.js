// ==UserScript==
// @name          Merge issues and PR tabs
// @description   Merge the issues and PRs tabs of the repositories in a single one
// @author        Deuchnord
// @version       1.0.2
// @namespace     https://deuchnord.fr/userscipts#github.com/merge-prs-issues-tabs
// @match         https://github.com/*/*
// @icon          https://github.githubassets.com/favicons/favicon.svg
// @license       AGPL-3.0
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/460294/Merge%20issues%20and%20PR%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/460294/Merge%20issues%20and%20PR%20tabs.meta.js
// ==/UserScript==

(function () {

  function parseMultiplier(nAsStr) {
    switch (true) {
      case nAsStr.endsWith("k"):
        return Number(nAsStr.slice(0, -1)) * 1000;

      case nAsStr.endsWith("M"):
        return Number(nAsStr.slice(0, -1)) * 1000000;

      case nAsStr.endsWith("G"):
        return Number(nAsStr.slice(0, -1)) * 1000000000;
    }

    return Number(nAsStr);
  }

  let sumIssPrs = null;

  setInterval(function () {

    let issuesTab = document.getElementById("issues-tab");
    let prsTab = document.getElementById("pull-requests-tab");

    let nIssues = parseMultiplier(issuesTab.children[2].innerText);
    let nPrs = parseMultiplier(prsTab.children[2].innerText);

    console.log(nIssues, nPrs);

    if (sumIssPrs == nIssues) {
      return;
    }

    sumIssPrs = nIssues + nPrs;
    let multiplier = 1;

    let displayedNum = sumIssPrs;

    while (displayedNum >= 1000) {
      displayedNum /= 1000;
      multiplier *= 1000;
    }

    switch (multiplier) {
      case 1:
        multiplier = "";
        break;
      case 1000:
        multiplier = "k";
        break;
      case 1000000:
        multiplier = "M";
        break;
      case 1000000000:
        multiplier = "G";
        break;
    }

    let href = new URL(issuesTab.href);

    issuesTab.href = `${href.pathname}?q=is:open`;
    issuesTab.children[1].innerText = "Issues & pull requests";
    issuesTab.children[2].innerText = nIssues + nPrs;

    prsTab.style.display = "none";

    issuesTab.children[2].innerText = `${displayedNum}${multiplier}`;

  }, 250);

})();
  