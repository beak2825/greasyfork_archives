// ==UserScript==
// @name        Rutracker add links to IMDB
// @namespace   Violentmonkey Scripts
// @match       https://rutracker.org/forum/viewforum.php
// @match       https://rutracker.org/forum/tracker.php
// @version     1.0.2
// @author      szq2
// @description Add links to IMDB in rutracker thread list. Also fetches IMDB rating and poster.
// @license     MIT
// @run-at      document-idle
// @grant       GM.xmlHttpRequest
// @connect     v3.sg.media-imdb.com
// @connect     imdb.com
// @downloadURL https://update.greasyfork.org/scripts/505292/Rutracker%20add%20links%20to%20IMDB.user.js
// @updateURL https://update.greasyfork.org/scripts/505292/Rutracker%20add%20links%20to%20IMDB.meta.js
// ==/UserScript==

setTimeout(function () {
  'use strict';

  // https://violentmonkey.github.io/api/gm/#gm_xmlhttprequest
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        url: url,
        responseType: 'json',
        anonymous: true,
        onload: response => resolve(response.response),
        onerror: err => reject(err),
      });
    });
  }

  function fetchHTML(url) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        method: "GET",
        url: url,
        responseType: 'document',
        anonymous: true,
        onload: response => resolve(response.response),
        onerror: err => reject(err),
      });
    });
  }

  const randTime = 1000; // randomization time for requests to imdb, in ms

  // match all elements of a specific class (in this case topics)
  for (const topic of document.querySelectorAll(".tt-text")) {
    // find all topics that match that regex
    const regex = /^(?:[^/[\]]*\s+\/\s+)+([^()/[\]]+)\s+[[(]/; // "ABC / DEF (GHI, ...)"  --> "DEF"

    const match = topic.innerText.match(regex);
    if (!match) continue;

    // grab movie title from regex
    const title = match[1];
    if (!title) continue;
    //console.log(title);

    // create new div element and append it after the topic element
    let imdblink = document.createElement('div');
    // add imdb link
    imdblink.innerHTML = `<a href="https://www.imdb.com/find/?q=${encodeURIComponent(title)}&s=tt&exact=true" title="${title}" referrerpolicy="noreferrer" target="_blank">IMDB</a>`;
    topic.parentNode.insertBefore(imdblink, topic.nextSibling); //append after topic

    let searchrutrackerlink = document.createElement('span');
    searchrutrackerlink.innerHTML = `<a href="https://rutracker.org/forum/tracker.php?nm=${encodeURIComponent(title)}" target="_blank" title="Search for ${title} on Rutracker">🔎</a>`;
    topic.parentNode.insertBefore(searchrutrackerlink, topic.nextSibling); //append after topic

    // advanced fetching (poster then rating)
    // endpoints were extracted from https://github.com/tuhinpal/imdb-api

    setTimeout(() => {

      // try to fetch json

      //https://github.com/tuhinpal/imdb-api/blob/09464719f3ae4e7cd0e2b9af24adca1f8de267a7/src/routes/search.js#L12
      const url = `https://v3.sg.media-imdb.com/suggestion/x/${encodeURIComponent(title)}.json?includeVideos=0`;
      fetchJSON(url)
        .then(data => {
          // Handle the downloaded JSON data here
          for (const result of data.d) {
            if (["movie", "tvSeries", "tvMovie"].indexOf(result.qid) == -1)
              continue;

            const imdbUrl = `https://www.imdb.com/title/${result.id}`;
            const title = `${result.l} (${result.y})`;

            // update the link
            imdblink.innerHTML = `<details><summary><a href="${imdbUrl}" title="${title}" referrerpolicy="noreferrer" target="_blank">IMDB|${result.rank}</a></summary><img src="${result.i.imageUrl}" referrerpolicy="noreferrer" width="600" loading="lazy" /></details>`;

            setTimeout(() => {

              fetchHTML(imdbUrl)
                // https://github.com/tuhinpal/imdb-api/blob/09464719f3ae4e7cd0e2b9af24adca1f8de267a7/src/routes/title.js#L22
                .then(doc => JSON.parse(doc.querySelector('script[type="application/ld+json"]').innerText))
                .then(schema => {

                  // update the link
                  imdblink.querySelector('a').outerHTML = `<a href="${imdbUrl}"  title="${title}" referrerpolicy="noreferrer" target="_blank">☆${schema.aggregateRating.ratingValue.toFixed(1)}|${result.rank}</a>`;
                })
                .catch(error => {
                  // Handle any errors that occurred during the title download
                  console.error('Error downloading HTML:', error);
                });
            }, Math.random() * randTime);
            break;
          }
        })
        .catch(error => {
          // Handle any errors that occurred during the download
          console.error('Error:', error);
        });
    }, Math.random() * randTime);

  }
}, 500);
