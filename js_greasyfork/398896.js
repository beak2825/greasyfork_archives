// ==UserScript==

// @name                PSARips - Add IMDb & TorrentGalaxy link in Post Titles
// @description         Enhance post titles by adding links to IMDb and TorrentGalaxy
// @version             1.0

// @namespace           io.github.ni554n
// @match               https://psarips.*/movie/*
// @match               https://psarips.*/tv-show/*
// @match               https://psa.*/movie/*
// @match               https://psa.*/tv-show/*
// @match               https://x265.club/movie/*
// @match               https://x265.club/tv-show/*

// @supportURL          https://github.com/ni554n/userscripts/issues
// @license             MIT

// @author              Nissan Ahmed
// @homepageURL         https://anissan.com
// @contributionURL     https://paypal.me/ni554n

// @downloadURL https://update.greasyfork.org/scripts/470758/PSARips%20-%20Add%20IMDb%20%20TorrentGalaxy%20link%20in%20Post%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/470758/PSARips%20-%20Add%20IMDb%20%20TorrentGalaxy%20link%20in%20Post%20Titles.meta.js
// ==/UserScript==

const [postTitleH1] = /** @type {HTMLCollectionOf<HTMLElement>} */ (
  document.getElementsByClassName("post-title entry-title")
);

const postTitle = postTitleH1.innerText;

if (!postTitleH1) throw new Error("Failed to get the post title!");

/* Extracting the IMDb link from the movie release "Info" dropdown… */

const infoDiv = /** @type {HTMLElement | undefined} */ (
  document.getElementsByClassName("sp-body folded")[0]
);

if (!infoDiv) {
  throw new Error(
    "Info dropdown is not found. Check if the selector's changed.",
  );
}

const [imdbMovieLink, imdbId] =
  infoDiv.innerText.match(/https:\/\/www.imdb.com\/title\/(\w+)\//) ?? [];

const encodedTitle = encodeURIComponent(postTitle);

const imdbLink =
  imdbMovieLink ?? `https://www.imdb.com/find?s=tt&ttype=tv&q=${encodedTitle}`;

const imdbIcon = `<i class="fab fa-imdb" style="font-style: normal;"></i>`;
const imdbHtml = `<a href="${imdbLink}" target="_blank" title="Open in IMDb">${imdbIcon}</a>`;

const tgxIcon = `<i class="fa fa-magnet" style="font-style: normal;"></i>`;
const tgxHtml = `<a href="https://torrentgalaxy.to/torrents.php?search=${
  imdbId || encodedTitle
}" target="_blank" title="Open in TorrentGalaxy">${tgxIcon}</a>`;

postTitleH1.innerHTML = `${imdbHtml}&nbsp;&nbsp;${tgxHtml}<br />${postTitle}`;
