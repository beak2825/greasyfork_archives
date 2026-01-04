// ==UserScript==
// @name        YTS - Toggle Foreign Titles
// @namespace   NooScripts
// @match       https://yts.mx/browse-movies*
// @grant       none
// @version     1.5
// @author      NooScripts
// @description Adds A Button To Toggle Between Displaying English & Foreign Movies Per Page While Browsing.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480422/YTS%20-%20Toggle%20Foreign%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/480422/YTS%20-%20Toggle%20Foreign%20Titles.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const delayBeforeStart = 1;

  function hideMovieWraps() {
    let movieWraps = document.querySelectorAll('.browse-movie-wrap');
    movieWraps.forEach(function(movieWrap) {
      let movieBottom = movieWrap.querySelector('.browse-movie-bottom');
      if (movieBottom) {
        let movieTitle = movieBottom.querySelector('.browse-movie-title');
        if (movieTitle) {
          let titleSpans = movieTitle.querySelectorAll('span');
          titleSpans.forEach(function(titleSpan) {
            let spanContent = titleSpan.innerText.trim();
            if (spanContent.includes('[') && spanContent.includes(']')) {
              movieWrap.style.display = 'none';
            }
          });
        }
      }
    });
  }

  function toggleMovieVisibility() {
    let movieWraps = document.querySelectorAll('.browse-movie-wrap');
    movieWraps.forEach(function(movieWrap) {
      movieWrap.style.display = movieWrap.style.display === 'none' ? 'block' : 'none';
    });
  }

  setTimeout(function() {
    hideMovieWraps();

    const toggleButton = document.createElement('button');
    toggleButton.textContent = '🌎🎥';
    toggleButton.id = 'movieToggleButton'; // Unique ID for the button
    toggleButton.classList.add('movieToggleButton');
    toggleButton.addEventListener('click', toggleMovieVisibility);
    document.body.appendChild(toggleButton);

    const style = document.createElement('style');
    style.textContent = `
      #movieToggleButton {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 10px;
        background-color: #000000;
        color: #fff;
        border: 1px solid #fff;
        border-radius: 5px;
        cursor: pointer;
        font-size: 18px;
      }
      #movieToggleButton:hover {
        background-color: #ffffff;
        color: #000000;
      }
    `;
    document.head.appendChild(style);
  }, delayBeforeStart);
})();
