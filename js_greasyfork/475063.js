// ==UserScript==
// @name         Hacker News Single click opener
// @namespace    selfdocumentingcode
// @version      0.8
// @description  Adds an [l+c] link that opens the url and the comments page in new tabs in one click. Inspired by Reddit Enhancement Suite (/r/Enhancement).
// @author       selfdocumentingcode@github
// @match        https://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @license      MIT
// @grant        GM_openInTab
// @supportURL   https://github.com/selfdocumentingcode/my-random-scripts
// @homepageURL  https://github.com/selfdocumentingcode/my-random-scripts
// @downloadURL https://update.greasyfork.org/scripts/475063/Hacker%20News%20Single%20click%20opener.user.js
// @updateURL https://update.greasyfork.org/scripts/475063/Hacker%20News%20Single%20click%20opener.meta.js
// ==/UserScript==

(function () {
  "use strict";

  console.log(`Hacker News Single click opener script running ${new Date().toISOString()}`);

  const pageHas4Tables = document.querySelectorAll("table").length === 4;

  if (!pageHas4Tables) return;

  const pageHasTableWithLinks =
    document.querySelectorAll("table > tbody >tr.athing > td.title > span.titleline > a").length > 0;

  const pageHasTableWithCommentLinks =
    document.querySelectorAll('table > tbody > tr > td.subtext > span.subline > a[href^="item"]').length > 0;

  const isRelevantPage = pageHasTableWithLinks && pageHasTableWithCommentLinks;

  if (!isRelevantPage) return;

  const tableWithLinks = document.querySelectorAll("table")[2];

  const tableRows = tableWithLinks.querySelectorAll("tbody > tr");

  for (let i = 0; i < tableRows.length; i++) {
    const tr = tableRows[i];

    // Table rows are a mix of links, comments, spacers, etc.
    // Link rows have the class 'athing' for some reason
    if (!tr.classList.contains("athing")) continue;

    const linkUrl = tr.querySelector("td.title > span.titleline > a")?.href;

    if (!linkUrl) continue;

    // Row with link to comments follows link row
    const commentsTr = tableRows[i + 1];

    // This row and the next can now be skipped
    i += 2;

    const subtextContainer = commentsTr.querySelector("td.subtext > span.subline");

    const isJobsLink = !subtextContainer || subtextContainer.children.length === 1; // There might be a better way to test, but this fits

    // Don't want to show l+c on job posts
    if (isJobsLink) continue;

    const commentsUrl = subtextContainer.querySelector("span.age > a")?.href;

    subtextContainer.appendChild(document.createTextNode(" | "));

    const isExternalLink = linkUrl.indexOf("news.ycombinator.com") < 0;

    const lPlusCLink = document.createElement("a");
    lPlusCLink.href = "javascript:void(0)";
    lPlusCLink.text = isExternalLink ? "[l+c]" : "[l=c]";

    lPlusCLink.onclick = () => {
      // "active: false" opens the tab in the background
      // "insert: true" opens the tab next to the current active tab
      // https://violentmonkey.github.io/api/gm/#gm_openintab
      if (isExternalLink) {
        GM_openInTab(linkUrl, { active: false, insert: true });
      }

      GM_openInTab(commentsUrl, { active: false, insert: true });
    };

    subtextContainer.appendChild(lPlusCLink);
  }
})();
