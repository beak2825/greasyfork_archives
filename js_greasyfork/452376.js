// ==UserScript==
// @name           HumbleBundle - Unredeemed Game List Compiler
// @description    Compiles a list of the unredeemed games
// @version        2025.10.10.19.19
// @author         MetalTxus
// @namespace      https://github.com/jesuscc1993

// @icon           https://cdn.humblebundle.com/static/hashed/46cf2ed85a0641bfdc052121786440c70da77d75.png
// @match          https://www.humblebundle.com/home/keys
// @require        https://code.jquery.com/jquery-3.6.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/452376/HumbleBundle%20-%20Unredeemed%20Game%20List%20Compiler.user.js
// @updateURL https://update.greasyfork.org/scripts/452376/HumbleBundle%20-%20Unredeemed%20Game%20List%20Compiler.meta.js
// ==/UserScript==

/* globals jQuery */

(() => {
  'use strict';

  const CHOICE_TEXT = 'Humble Choice';
  const YEAR_PATTERN = /\b\d{4}\b/;

  let games;

  const compileGamesList = () => {
    games = [];

    jQuery('#hide-redeemed:not(:checked)').click();
    jQuery('.jump-to-page[data-index="0"]').click();

    setTimeout(processPage, 150);
  };

  const processPage = () => {
    games = games.concat(
      jQuery('.game-name h4')
        .get()
        .map((e) => e.textContent)
    );

    const nextPage = jQuery('.jump-to-page.current').next();
    if (nextPage.length) {
      jQuery('.jump-to-page.current').next().click();
      processPage();
    } else {
      outputGames();
    }
  };

  const outputGames = () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unredeemed HumbleBundle Games List</title>
          <link href="https://cdn.humblebundle.com/static/hashed/46cf2ed85a0641bfdc052121786440c70da77d75.png" rel="icon" />
          <meta name="color-scheme" content="dark" />
          <style>
            ul {
              list-style: none;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>

        <body>
          <ul>
            ${sortGames(games).map(getGameHtml).join('')}
          </ul>

          <p>
            <small>Unredeemed games count: ${games.length}</small>
          </p>
        </body>
      </html>
    `;
    downloadFile(html, 'unredeemed-humblebundle-games-list.html', 'text/plain');
  };

  const sortGames = (games) => {
    return games.sort((a, b) => {
      const aContainsChoice = a.includes(CHOICE_TEXT);
      const bContainsChoice = b.includes(CHOICE_TEXT);

      if (aContainsChoice && !bContainsChoice) {
        return -1;
      } else if (!aContainsChoice && bContainsChoice) {
        return 1;
      } else if (aContainsChoice && bContainsChoice) {
        const yearA = parseInt(a.match(YEAR_PATTERN));
        const yearB = parseInt(b.match(YEAR_PATTERN));
        if (!isNaN(yearA) && !isNaN(yearB)) {
          if (yearA !== yearB) {
            return yearB - yearA;
          } else {
            return a.localeCompare(b);
          }
        }
      }

      return a.localeCompare(b);
    });
  };

  const getGameHtml = (name) => {
    const link = name.includes(CHOICE_TEXT)
      ? name
          .toLowerCase()
          .replace(
            /(.*?)\s(.*?)\s.*/,
            `https://www.humblebundle.com/membership/$1-$2`
          )
      : `https://store.steampowered.com/search/?term=${encodeURI(
          name.replace(/\?/g, '')
        )}`;

    return `
        <li>
          <a href="${link}" target="_blank">
            ${name}
          </a>
        </li>
      `;
  };

  const downloadFile = (content, fileName, type) => {
    const file = new Blob([content], { type });
    const href = URL.createObjectURL(file);
    jQuery(`<a href="${href}" download="${fileName}">`)[0].click();
  };

  const initialize = () => {
    jQuery('head').append(`
      <style>
        .generate-list-button {
           background:#f1f3f6;
           border:1px solid #ccc;
           padding:0 12px;
        }
      </style>
    `);

    const button = jQuery(`
      <button class="generate-list-button">
        Compile unredeemed games list
      </button>
    `);
    button.click(compileGamesList);
    jQuery('.search').before(button);
  };

  setTimeout(initialize, 150);
})();
