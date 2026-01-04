// ==UserScript==
// @name         Sort Adventure Time Episodes by Episode Number
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Sorts Adventure Time episodes by episode number on WatchCartoonOnline
// @author       R1o23z
// @match        https://www.watchcartoononline.com/detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538155/Sort%20Adventure%20Time%20Episodes%20by%20Episode%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/538155/Sort%20Adventure%20Time%20Episodes%20by%20Episode%20Number.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to fully load
    window.addEventListener('load', function() {
      const container = document.querySelector('.episode-column .content');
      if (!container) return;

      // Clear old content
      container.innerHTML = '';

      // function splitTitleEpisode(input) {
      //   const match = input.match(/(.*?)(Episode\s*\d+\b.*)/i);
      //     if (match) {
      //       const title = match[1].trim();   // e.g., "Adventure Time Season 10"
      //       const episode = match[2].trim(); // e.g., "Episode 2"
      //       return [title, episode];
      //     }
      //   return [input, '']; // fallback if no match
      // }

      const sortedBySeasonList = playlist.map(ep => {
        // const season = ep[2].split('/')[1].slice(-1)
        const match = ep[2].split('/')[1].trim().match(/(\d+)\s*$/);
        if(match) {
          return [...ep, match[1]]
        } else {
          return [...ep, null]
        }
      }).sort((a, b) => {
        if(!a[4] || !b[4]) {
          return +a[4] - +b[4]
        }
        //sort by season
        if(a[4] === b[4]) {
          return +a[3] - +b[3] //sort by episode
        }
        return +a[4] - +b[4]
      })

      sortedBySeasonList.forEach(ep => {
      const card = document.createElement('div');
      card.className = 'category-card';

      /*
       * ep[0]: title
       * ep[1]: banner (termid)
       * ep[2]: url
       * ep[3]: episode
       * ep[4]: season - 1
       *
       * function changeVideo('${ep.title}','${ep.termid}','${ep.url}','${ep.episode}', '${ep.season}')
       */
      card.innerHTML = `
        <div class="poster">
          <img src="/thumb.php?termid=${ep[1]}" alt="banner" style="width: 100px">
        </div>
        <div class="content">
          <a href="javascript:changeVideo('${ep[0]}','${ep[1]}','${ep[2]}','${ep[3]}', '${ep[4]+1}')"
             class="serie-title">${ep[0]}</a>
          <div class="badge-list">
            <span class="badge img-lg"><img src="/assets/img/icons/dub.png" alt=""></span>
          </div>
          <div class="info">
            <span class='s_gizle'>TV 202</span>
            <div class="rating">
            <span>
              <img src="/assets/img/star.svg" width="10" alt="star"/> 7.8/10
            </span>
              <span class="eps-count">${ep[3]}</span>
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
    });
})();
