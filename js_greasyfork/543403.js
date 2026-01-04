// ==UserScript==
// @name         WritingTeam Highlight Improper Titles
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  A script that highlights improper titles using the Title Capitalization API (https://titlecaseconverter.com/api/)
// @author       Player1041
// @match        https://retroachievements.org/game/*
// @icon         https://static.retroachievements.org/assets/images/favicon.webp
// @grant        GM_xmlhttpRequest
// @connect      title-case-converter.p.rapidapi.com
// @downloadURL https://update.greasyfork.org/scripts/543403/WritingTeam%20Highlight%20Improper%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/543403/WritingTeam%20Highlight%20Improper%20Titles.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const API_URL = `https://title-case-converter.p.rapidapi.com/v1/BulkTitleCase`;
  const API_HEADERS = {
    'content-type': 'application/json',
    'x-rapidapi-key': '72da640fd5msh763282f1000abc2p1d0129jsn27cc703d4b14',
    'x-rapidapi-host': 'title-case-converter.p.rapidapi.com'
  };

  // Normalize text by replacing fancy punctuation
  function normalizeText(text) {
    return text
      .replace(/…/g, '...') // Replace ellipsis
      .replace(/–/g, '-'); // Replace em dash
  }

  // Highlight full words that changed, preserving spacing
  function highlightWordDifferences(original, modified) {
    if (original === modified) return modified;

    const originalWords = original.split(/(\s+)/); // Preserve spacing
    const modifiedWords = modified.split(/(\s+)/);

    let result = '';

    for (let i = 0; i < modifiedWords.length; i++) {
      const orig = originalWords[i] || '';
      const mod = modifiedWords[i] || '';

      if (orig === mod || /\s+/.test(mod)) {
        result += mod;
      } else {
        result += `<mark class="highlight" title="${orig}">${mod}</mark>`;
      }
    }

    return result;
  }

  function processTitles() {
    const achievementLinks = Array.from(document.querySelectorAll('a.inline.mr-1'));
    const originalTitles = achievementLinks.map(link => normalizeText(link.outerText.trim()));

    if (originalTitles.length === 0) return;

    const payload = JSON.stringify({
      titles: originalTitles,
      style: 'CMOS',
      preserveAllCaps: 1,
      tagSpeciesNames: 0,
      useStraightQuotes: 1
    });

    GM_xmlhttpRequest({
      method: 'POST',
      url: API_URL,
      headers: API_HEADERS,
      data: payload,
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);
          const convertedTitles = data?.results;

          if (!convertedTitles || convertedTitles.length !== originalTitles.length) {
            console.warn('Mismatch or missing convertedTitles:', data);
            return;
          }

          achievementLinks.forEach((link, idx) => {
            const original = originalTitles[idx];
            const modified = normalizeText(convertedTitles[idx]);

            if (original !== modified) {
              console.log(`[Title Changed]`, {
                original,
                converted: modified
              });
            }

            link.innerHTML = highlightWordDifferences(original, modified);
            link.setAttribute('title', original);
          });

        } catch (err) {
          console.error('Failed to parse API response:', err);
        }
      },
      onerror: function (err) {
        console.error('API request failed:', err);
      }
    });
  }

  // Inject CSS
  const style = document.createElement('style');
  style.innerHTML = `
    mark.highlight {
      background-color: yellow;
      color: black;
      padding: 0 1px;
      border-radius: 2px;
      cursor: help;
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('load', () => {
    setTimeout(processTitles, 3000);
  });
})();
