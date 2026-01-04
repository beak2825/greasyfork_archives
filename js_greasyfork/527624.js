// ==UserScript==
// @name         Itch.io Hide Visual Novels
// @namespace    itchiohide
// @description  Hides those pesky Visual Novels everyone's complaining about.
// @version      1.0
// @match        *://itch.io/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      public domain
// @icon         https://www.google.com/s2/favicons?domain=itch.io
// @downloadURL https://update.greasyfork.org/scripts/527624/Itchio%20Hide%20Visual%20Novels.user.js
// @updateURL https://update.greasyfork.org/scripts/527624/Itchio%20Hide%20Visual%20Novels.meta.js
// ==/UserScript==

// Inspired by greasyfork.org/scripts/464588, but remade to not use extra network traffic.

(function() {
    'use strict';
    console.log("Itch.io Visual Novel Filter script running");

    // Inject CSS to hide elements that we mark as hidden
    GM_addStyle(`
        .hidden-visual-novel {
            display: none !important;
        }
    `);

    // Optional: If you want unfiltered game thumbnails to appear blurred until processed,
    // you can enable the following CSS (set BLUR to true). 
    // However, since this is almost instant, this realistically does nothing.
    var BLUR = false;
    if(BLUR) {
      GM_addStyle(`
        .filterable .game_cell:not(.filtered) > .game_thumb {
            filter: blur(0.5em);
        }
      `);
    }

    // Optional status display: shows how many games have been hidden.
    var statview = function() {
      return `<div id="itchvnfilterstat" style="margin-bottom: 1em; color:#858585">
                Visual Novels hidden: ${document.querySelectorAll('.hidden-visual-novel').length}
              </div>`;
    };
    var stat = function() {
      var old = document.querySelector('#itchvnfilterstat');
      if(old) old.remove();
      var gridOuter = document.querySelector('.grid_outer');
      if(gridOuter) {
        gridOuter.prepend(new DOMParser().parseFromString(statview(), "text/html").body.firstElementChild);
      }
    };
    stat();

    // Filtering function modeled on the original script's loop.
    // It looks for a container holding the games and then processes each unqueued game cell.
    var filtering = function() {
      var m = document.querySelector('[id*="browse_games_"],[id*="browse_assets_"],[id*="search_"]');
      if(m) {
          document.body.classList.add('filterable');
          // Process any game_cell that hasn't yet been queued for filtering
          var cells = m.querySelectorAll('.game_cell:not(.filteringqueued)');
          cells.forEach(function(g) {
              g.classList.add('filteringqueued');
              // Instead of fetching tags, we simply check the text of .game_genre
              var genreElem = g.querySelector('.game_genre');
              if(genreElem) {
                  var genreText = genreElem.textContent.trim().toLowerCase();
                  if(genreText.includes("visual novel")) {
                      g.classList.add('hidden-visual-novel');
                  }
              }
              g.classList.add('filtered');
          });
          stat();
      }
      requestAnimationFrame(filtering);
    };

    filtering();
})();
