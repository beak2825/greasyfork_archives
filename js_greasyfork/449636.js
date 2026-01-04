// ==UserScript==
// @name            Annict Work Links
// @namespace       https://github.com/SlashNephy
// @version         0.3.3
// @author          SlashNephy
// @description     Add links to "Shoboi Calendar", "MyAnimeList" and "AniList" on Annict works page.
// @description:ja  Annict の作品ページに「しょぼいカレンダー」「MyAnimeList」「AniList」へのリンクを追加します。
// @homepage        https://scrapbox.io/slashnephy/Annict_%E3%81%AE%E4%BD%9C%E5%93%81%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E5%90%84%E7%A8%AE%E3%82%B5%E3%82%A4%E3%83%88%E3%81%B8%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B_UserScript
// @homepageURL     https://scrapbox.io/slashnephy/Annict_%E3%81%AE%E4%BD%9C%E5%93%81%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AB%E5%90%84%E7%A8%AE%E3%82%B5%E3%82%A4%E3%83%88%E3%81%B8%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B_UserScript
// @icon            https://www.google.com/s2/favicons?sz=64&domain=annict.com
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://annict.com/*
// @connect         raw.githubusercontent.com
// @grant           GM_xmlhttpRequest
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/449636/Annict%20Work%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/449636/Annict%20Work%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var lib = {};

    var hasRequiredLib;
    function requireLib() {
      if (hasRequiredLib) return lib;
      hasRequiredLib = 1;
      Object.defineProperty(lib, "__esModule", {
        value: true
      });
      lib.hasLength = hasLength;
      lib.hasMinLength = hasMinLength;
      lib.isNonEmpty = isNonEmpty;
      /**
       * Checks whether given array's length is equal to given number.
       *
       * @example
       * ```ts
       * hasLength(arr, 1) // equivalent to arr.length === 1
       * ```
       */
      function hasLength(arr, length) {
        return arr.length === length;
      }
      /**
       * Checks whether given array's length is greather than or equal to given number.
       *
       * @example
       * ```ts
       * hasMinLength(arr, 1) // equivalent to arr.length >= 1
       * ```
       */
      function hasMinLength(arr, length) {
        return arr.length >= length;
      }
      /**
       * Checks whether given array is not empty.
       *
       * @example
       * ```ts
       * isNonEmpty(arr) // equivalent to arr.length > 0
       * ```
       */
      function isNonEmpty(arr) {
        return arr.length >= 1;
      }
      return lib;
    }

    var libExports = requireLib();

    async function fetchArmEntries(branch = 'master') {
        const response = await fetch(`https://raw.githubusercontent.com/SlashNephy/arm-supplementary/${branch}/dist/arm.json`);
        return response.json();
    }

    const annictWorkPageUrlPattern = /^https:\/\/annict\.com\/works\/(\d+)/;
    const cachedEntries = [];
    const main = async () => {
        const match = annictWorkPageUrlPattern.exec(window.location.href);
        if (!match || !libExports.hasMinLength(match, 2)) {
            return;
        }
        const annictId = parseInt(match[1], 10);
        if (!annictId) {
            throw new Error('Failed to extract Annict work id');
        }
        const links = document.querySelector('div.c-work-header.pt-3 > div.container > div > div.col.mt-3.mt-sm-0 > ul.list-inline.mb-0');
        if (!links || links.childNodes.length === 0) {
            throw new Error('Failed to find target container');
        }
        if (cachedEntries.length === 0) {
            const entries = await fetchArmEntries();
            cachedEntries.push(...entries);
        }
        const entry = cachedEntries.find((x) => x.annict_id === annictId);
        if (!entry) {
            console.warn(`arm entry not found: annict_id=${annictId}`);
            return;
        }
        if (entry.syobocal_tid !== undefined && links.firstChild) {
            const link = links.firstChild.cloneNode(true);
            const aHtml = link.firstChild;
            aHtml.href = `https://cal.syoboi.jp/tid/${entry.syobocal_tid}`;
            const node = aHtml.childNodes[0];
            if (node !== undefined) {
                node.textContent = 'しょぼいカレンダー';
            }
            links.appendChild(link);
        }
        if (entry.anilist_id !== undefined && links.firstChild) {
            const link = links.firstChild.cloneNode(true);
            const aHtml = link.firstChild;
            aHtml.href = `https://anilist.co/anime/${entry.anilist_id}`;
            const node = aHtml.childNodes[0];
            if (node !== undefined) {
                node.textContent = 'AniList';
            }
            links.appendChild(link);
        }
        if (entry.mal_id !== undefined && links.firstChild) {
            const link = links.firstChild.cloneNode(true);
            const aHtml = link.firstChild;
            aHtml.href = `https://myanimelist.net/anime/${entry.mal_id}`;
            const node = aHtml.childNodes[0];
            if (node !== undefined) {
                node.textContent = 'MyAnimeList';
            }
            links.appendChild(link);
        }
    };
    document.addEventListener('turbo:load', () => {
        main().catch(console.error);
    });

})();
