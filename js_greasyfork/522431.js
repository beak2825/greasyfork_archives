// ==UserScript==
// @name        Add manga baka-updates links to nyaa
// @namespace   Violentmonkey Scripts
// @match       https://nyaa.si/*
// @match       https://nyaa.land/*
// @match       https://nyaa.iss.one/*
// @grant       GM.xmlHttpRequest
// @connect     api.mangaupdates.com
// @version     2.2.1
// @author      szq2
// @description Adds manga links rating and cover from mangaupdates.com to nyaa.si tracker
// @license     0BSD
// @downloadURL https://update.greasyfork.org/scripts/522431/Add%20manga%20baka-updates%20links%20to%20nyaa.user.js
// @updateURL https://update.greasyfork.org/scripts/522431/Add%20manga%20baka-updates%20links%20to%20nyaa.meta.js
// ==/UserScript==

const fetchRating = true; // Enable fetching series rating and link
const fetchRatingDelay = 2000; // ms
const target = "_blank"; // Target attribute for links, e.g., _blank for a new tab

const re = /^(?:\[.*\])?\s*([^(\[]+?) *((v(olume)?)?[\d\-+ ]+)?( +[\(\[].*)?$/i; // Regex to parse book title

// Fetch JSON helper
const fetchJSON = (url, data) => new Promise((resolve, reject) => {
  GM.xmlHttpRequest({
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
    responseType: 'json',
    anonymous: true,
    onload: response => resolve(response.response),
    onerror: err => reject(err),
    timeout: 2000,
  });
});

// Delay helper
const delay = (time) => new Promise(res => setTimeout(res, time));

// Fetch series details from MangaUpdates API
async function fetchSeriesDetails(title) {
  const apiEndpoint = 'https://api.mangaupdates.com/v1/series/search';

  // Send API request
  const data = await fetchJSON(apiEndpoint, JSON.stringify({
    search: title,
    stype: 'title',
  }));

  // Check if results are returned
  if (data.total_hits === 0 || !data.results || data.results.length === 0) {
    throw new Error(`No series found for: ${title}`);
  }

  // Extract the first result
  const firstResult = data.results[0];
  const coverPage = firstResult.record.image.url.thumb || firstResult.record.image.url.original;
  const seriesTitle = firstResult.hit_title;
  const rating = `${firstResult.record.year} ${(firstResult.record.bayesian_rating || "")}`;
  const seriesLink = firstResult.record.url;

  const fragment = document.createDocumentFragment();

  const linkImg = document.createElement("a");
  linkImg.href = seriesLink;
  linkImg.target = target;
  linkImg.title = seriesTitle;

  const img = document.createElement("img");
  img.src = coverPage;
  linkImg.appendChild(img);
  fragment.appendChild(linkImg);

  const linkRating = document.createElement("a");
  linkRating.href = seriesLink;
  linkRating.target = target;
  linkRating.title = firstResult.record.description;
  linkRating.textContent = `[${rating}] `;
  fragment.appendChild(linkRating);

  return fragment;
}

// Main function
(function () {
  'use strict';

  let book = 0;

  // Iterate through all relevant book links
  for (let a of document.querySelectorAll("tr > td:nth-child(1) > a[title*='Literature']")) {
    a = a.parentElement.nextElementSibling.lastElementChild;
    const titleMatch = a.innerText.match(re);

    if (!titleMatch) continue;
    const title = titleMatch[1];
    const url = `https://www.mangaupdates.com/series?search=${encodeURIComponent(title)}`;

    // Create [m] link
    const mangalink = document.createElement("span");

    const basicLink = document.createElement("a");
    basicLink.href = url;
    basicLink.title = title;
    basicLink.target = target;
    basicLink.textContent = "[m] ";
    mangalink.appendChild(basicLink);

    a.insertAdjacentElement("beforebegin", mangalink);

    // If ratings fetching is enabled, fetch and update
    if (fetchRating) {
      delay((book + Math.random()) * fetchRatingDelay)
        .then(() => fetchSeriesDetails(title))
        .then(fragment => {
          // Replace the basic [m] link with the detailed UI
          mangalink.textContent = ""; // Clear the placeholder
          mangalink.appendChild(fragment);
        })
        .catch(error => {
          console.error('Error fetching series details:', error);
        });
    }

    book++;
  }
})();
