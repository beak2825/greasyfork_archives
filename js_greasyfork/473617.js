// ==UserScript==
// @name         IMDB Ratings on Actor Page
// @namespace    Bzly
// @version      0.1
// @description  Request and add your own API key
// @author       Bzly
// @match        https://www.imdb.com/name/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473617/IMDB%20Ratings%20on%20Actor%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/473617/IMDB%20Ratings%20on%20Actor%20Page.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // this should really be several functions and the querySelectors should be more sensible
  function imdbPls() {
    // https://www.omdbapi.com/apikey.aspx rate limited to 1000 reqs/day
    const apiKey = 'foo123bar'
    // get array of previous media entries, but not ones we've inserted earlier
    const l = document.querySelectorAll('.date-credits-accordion .ipc-metadata-list-summary-item__c:not(.imdb-rating-inserted)')

    l.forEach(e => {
      // try to find imdb unique title number in url
      const m = e.querySelector('a.ipc-metadata-list-summary-item__t').href.match(/tt[0-9]+/)
      if (m !== null) {
        // get information about title from OMDB API
        fetch('https://www.omdbapi.com/?i=' + m[0] + '&apikey=' + apiKey)
          .then((response) => response.json())
          .then((mediaInfo) => {
            if (mediaInfo.Response === 'True' && mediaInfo.imdbRating !== 'N/A') {
              // create element and insert
              let x = document.createElement('div')
              x.setAttribute('style', 'color:black;')
              x.textContent = '⭐ ' + mediaInfo.imdbRating
              e.lastChild.prepend(x)
              // add flag to mark this item as done
              e.classList.add('imdb-rating-inserted')
            }
          })
      }
    })
  }

  function main() {
    const observer = new MutationObserver(imdbPls);
    // watch 'previous' list for expansion ('view more')
    observer.observe(
      document.querySelector('.date-credits-accordion ul.ipc-metadata-list'), {
        childList: true,
        subtree: false
      });
    // watch whole section tag for updates from using filters (actor, producer, etc)
    observer.observe(
      document.querySelector('div[data-testid=Filmography').lastChild, {
        childList: true,
        subtree: false
      });
    imdbPls()
  }

  main()
})();