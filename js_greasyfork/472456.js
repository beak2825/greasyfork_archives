// ==UserScript==
// @name         🐭️ MouseHunt - Quick Pollutinum Refined Scoreboard Search
// @version      1.0.1
// @description  Click the barrel on the hunter profile page to quickly search the scoreboard for them.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://i.mouse.rip/mouse.png
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/mousehunt-utils@1.7.3/mousehunt-utils.js
// @downloadURL https://update.greasyfork.org/scripts/472456/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Quick%20Pollutinum%20Refined%20Scoreboard%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/472456/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Quick%20Pollutinum%20Refined%20Scoreboard%20Search.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const main = () => {
    const existing = document.querySelector('.mh-quick-scoreboard-search');
    if (existing) {
      existing.remove();
    }

    const append = document.querySelector('.friendsPage-friendRow-titleBar');
    if (! append) {
      return;
    }

    const name = document.querySelector('.friendsPage-friendRow-titleBar-name');
    if (! name) {
      return;
    }

    const scoreboardSearch = makeElement('a', 'mh-quick-scoreboard-search');
    scoreboardSearch.setAttribute('href', `https://www.mousehuntgame.com/scoreboards.php?tab=main&scoreboard=QuestPollutionOutbreak::pollutinum_refined&search=${name.getAttribute('data-text')}`);
    scoreboardSearch.setAttribute('title', 'View on Pollutinum Refined Scoreboard');

    const image = makeElement('img', 'mh-quick-scoreboard-search-image');
    image.setAttribute('src', 'https://www.mousehuntgame.com/images/items/stats/transparent_thumb/fc76ba2c71538601379542e747e2e581.png?cv=2');
    scoreboardSearch.appendChild(image);

    // append to the append el as the first child
    append.prepend(scoreboardSearch);
  };

  onNavigation(main, {
    page: 'hunterprofile',
    tab: 'profile'
  });

  addStyles(`.mh-quick-scoreboard-search {
    position: absolute;
    right: 6px;
    top: -6px;
  }

  .mh-quick-scoreboard-search img {
    width: 50px;
    height: 50px;
    transition: all 0.2s ease-in-out;
  }

  .mh-quick-scoreboard-search:hover img {
    transform: scale(1.3);
  }`);

  main();
}());
