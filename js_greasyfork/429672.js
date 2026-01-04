// ==UserScript==
// @name        Empornium Tag Sorter
// @description Sorts tags below titles on Browse Torrents, Top 10, Requests, Collages, Request Details pages.
// @namespace   Empornium Scripts
// @version     2.4.0
// @author      vandenium
// @grant       none
// @include /^https://www\.empornium\.(me|sx|is)\/torrents.php/
// @include /^https://www\.empornium\.(me|sx|is)\/top10.php/
// @include /^https://www\.empornium\.(me|sx|is)\/requests.php/
// @include /^https://www\.empornium\.(me|sx|is)\/collage/
// @include /^https://www\.empornium\.(me|sx|is)\/bookmarks.php/
// @include /^https://www\.empornium\.(me|sx|is)\/user.php/
// @include /^https://www\.empornium\.(me|sx|is)\/userhistory.php/
// @downloadURL https://update.greasyfork.org/scripts/429672/Empornium%20Tag%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/429672/Empornium%20Tag%20Sorter.meta.js
// ==/UserScript==

// Changelog:
// Version 2.4.0
// - Include collage notification page
// Version 2.3.0
// - Include request details page
// Version 2.2.1
// - Update for the collage page change
// Version 2.2.0
//  - Enable on user pages.
// Version 2.1.0
//  - Enable on bookmarks page.
// Version 2.0.0
//  - Sort tags below title names in torrents, top10, requests, collages.

const getAllTitles = () => {
  // torrents, top10, requests
  const titles = document.querySelectorAll(
    ".torrent, #torrent_table tr.rowa, #torrent_table tr.rowb, #request_table tr.rowa, #request_table tr.rowb"
  );

  // collages
  const allTitles =
    titles.length > 0
      ? titles
      : document.querySelectorAll("table tr.rowa, table tr.rowb");
  return Array.from(allTitles);
};

const sortTags = (tagList) =>
  tagList.sort((el1, el2) => {
    if (el1.innerText > el2.innerText) return 1;
    if (el2.innerText > el1.innerText) return -1;
    return 0;
  });

const isRequestDetailsPage =
  document.location.pathname.includes("requests") &&
  document.location.search.length > 0;

const renderSortedTags = (tagsParent, tags) => {
  tagsParent.innerHTML = "";
  sortTags(tags).forEach((tag) => {
    tagsParent.appendChild(tag);
    if (!isRequestDetailsPage) {
      const space = document.createElement("text");
      space.innerText = " ";
      tagsParent.appendChild(space);
    }
  });
};

if (isRequestDetailsPage) {
  const tagsParent = document.querySelector("#torrent_tags");
  const tags = Array.from(tagsParent.querySelectorAll("li"));
  renderSortedTags(tagsParent, tags);
}

getAllTitles().forEach((title) => {
  const tagsParent = title.querySelector(".tags");
  const tags = Array.from(tagsParent.children);
  renderSortedTags(tagsParent, tags);
});
