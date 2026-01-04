// ==UserScript==
// @name        RYM: Catalog Discography Ratings Shortcut
// @match       https://rateyourmusic.com/release/*
// @version     1.0
// @namespace   https://github.com/fauu
// @author      fau
// @description Quickly see how users rated other releases from the same artist. Adds links for searching users' collections for the current artist at the bottom of the music release page where user ratings are displayed.
// @license     MIT
// @grant       GM.addStyle
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/530529/RYM%3A%20Catalog%20Discography%20Ratings%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/530529/RYM%3A%20Catalog%20Discography%20Ratings%20Shortcut.meta.js
// ==/UserScript==
"use strict"

const cssPrefix = "cdrs";
const linkClass = `${cssPrefix}_link`;

// https://rateyourmusic.com/rymzilla/view?id=6255
const workingArtistCodeSearchMinLength = 10; // "[Artist10]".length;

const css = `
.${linkClass} {
  float: right;
  margin-left: 3px;
  font-size: .9em;
  color: var(--mono-6);
}
`.trim();

function makeHref(username, searchTerm) {
  return `https://rateyourmusic.com/collection/${username}/strm_a,ss.rd/${encodeURIComponent(searchTerm)}`;
}

function makeLinkEl(username, searchTerm) {
  const el = document.createElement("a");
  el.classList.add(linkClass);
  el.href = makeHref(username, searchTerm);
  el.textContent = "[A]";
  return el;
}

function addLinks(catalogEl, searchTerms) {
  catalogEl.querySelectorAll(".catalog_header").forEach(el => {
    const adjacentEl = el.querySelector(".catalog_ownership").nextSibling;
    if (!adjacentEl) return;
    const userHref = el.querySelector(".catalog_user > .user").href;
    const username = userHref.substring(userHref.lastIndexOf("/") + 2); // Skip "/~" prefix
    searchTerms.forEach(term => adjacentEl.after(makeLinkEl(username, term)));
  });
}

function getSearchTerms() {
  return Array.from(document.querySelectorAll(".album_info .artist")).map(el => {
    const artistCode = el.title;
    if (artistCode.length >= workingArtistCodeSearchMinLength) {
      return artistCode;
    } else {
      const artistName = el.childNodes[0].textContent.trim();
      if (!artistName) return;
      return `"${artistName}"`;
    }
  });
}

function main() {
  const catalogEl = document.getElementById("catalog_list");
  if (!catalogEl) return;
  const searchTerms = getSearchTerms();
  if (searchTerms.length === 0) return;

  GM.addStyle(css);

  const process = () => addLinks(catalogEl, searchTerms);
  process();
  new MutationObserver(process).observe(catalogEl, { childList: true });
}

main();