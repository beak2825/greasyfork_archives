// ==UserScript==
// @name         Photon Pro Ultra
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds Pro Features to Photon
// @author       nocommas
// @match        https://photon-sol.tinyastro.io/*
// @downloadURL https://update.greasyfork.org/scripts/535972/Photon%20Pro%20Ultra.user.js
// @updateURL https://update.greasyfork.org/scripts/535972/Photon%20Pro%20Ultra.meta.js
// ==/UserScript==

/*
//////////////////////////////////////////////////
//                                            //
//        Photon Pro Ultra by nocommas        //
//        Twitter: twitter.com/n0commas       //
//                                            //
//  Use the link below for PHOTON.            //
//  Access and LOWER FEES:                    //
//  https://photon-sol.tinyastro.io/@nocommas //
//                                            //
//////////////////////////////////////////////////
*/

(function() {
    'use strict';

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .card-pump {
            background: linear-gradient(135deg, rgba(147, 197, 253, 0.10), rgba(147, 197, 253, 0.05)) !important;
        }
        .card-pump:hover {
            background: linear-gradient(135deg, rgba(147, 197, 253, 0.20), rgba(147, 197, 253, 0.10)) !important;
        }
        .card-launchlab {
            background: linear-gradient(135deg, rgba(214, 45, 235, 0.10), rgba(214, 45, 235, 0.05)) !important;
        }
        .card-launchlab:hover {
            background: linear-gradient(135deg, rgba(214, 45, 235, 0.20), rgba(214, 45, 235, 0.10)) !important;
        }
        .card-meteora {
            background: linear-gradient(135deg, rgba(255, 70, 98, 0.10), rgba(255, 70, 98, 0.05)) !important;
        }
        .card-meteora:hover {
            background: linear-gradient(135deg, rgba(255, 70, 98, 0.20), rgba(255, 70, 98, 0.10)) !important;
        }
        .card-bonk {
            background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 193, 7, 0.10)) !important;
        }
        .card-bonk:hover {
            background: linear-gradient(135deg, rgba(255, 193, 7, 0.25), rgba(255, 193, 7, 0.15)) !important;
        }
        .card-boop {
            background: linear-gradient(135deg, rgba(12, 174, 228, 0.13), rgba(12, 174, 228, 0.07)) !important;
        }
        .card-boop:hover {
            background: linear-gradient(135deg, rgba(12, 174, 228, 0.20), rgba(12, 174, 228, 0.13)) !important;
        }
        .card-believe {
            background: linear-gradient(135deg, rgba(0, 216, 69, 0.15), rgba(0, 216, 69, 0.10)) !important;
        }
        .card-believe:hover {
            background: linear-gradient(135deg, rgba(0, 216, 69, 0.25), rgba(0, 216, 69, 0.15)) !important;
        }
        .custom-search-bar {
          padding: 6px 8px;
          margin-left: 10px;
          border: 1px solid #444;
          border-radius: 4px;
          background-color: #222;
          color: #fff;
          font-size: 14px;
          width: 250px;
        }
        .custom-search-bar::placeholder {
          color: #888;
        }
        @media (max-width: 1200px) {
          .custom-search-bar {
            width: 100px;
          }
        }
    `;
    document.head.appendChild(styleSheet);

    const cardTypeMap = [
        { selector: '.c-pump', type: 'card-pump' },
        { icons: ['c-icon--raydium_launchpad', 'c-icon--ray-cpmm', 'c-icon--launchpad'], type: 'card-launchlab' },
        { icons: ['c-icon--meteora_virtual_curve'], type: 'card-meteora' },
        { icons: ['c-icon--believe'], type: 'card-believe' },
        { icons: ['c-icon--bonk', 'c-icon--bonk-grad'], type: 'card-bonk' },
        { icons: ['c-icon--boop'], type: 'card-boop' }
    ];

    function removeDashboardTitles() {
        if (!window.location.href.includes('/en/memescope')) return;

        function removeTitles() {
            const titleDiv = document.querySelector('.p-dashboard__title');
            const subtitleDiv = document.querySelector('.p-dashboard__subtitle');

            if (titleDiv) {
                titleDiv.remove();
            }
            if (subtitleDiv) {
                subtitleDiv.remove();
            }
        }

        removeTitles();
    }

    function styleCardBackground(card) {
        card.classList.remove(...cardTypeMap.map(map => map.type));

        let cardType = null;

        for (const map of cardTypeMap) {
            if (map.selector && card.querySelector(map.selector)) {
                cardType = map.type;
                break;
            }
            if (map.icons) {
                const icons = card.querySelectorAll('.c-icon');
                for (const icon of icons) {
                    if (map.icons.some(iconClass => icon.classList.contains(iconClass))) {
                        cardType = map.type;
                        break;
                    }
                }
            }
            if (cardType) break;
        }

        if (cardType) {
            card.classList.add(cardType);
        }
    }

    function applyBackgrounds() {
        const cards = document.querySelectorAll('.sBVBv2HePq7qYTpGDmRM');
        cards.forEach(card => styleCardBackground(card));
    }

    function initSearchBars() {
      if (!window.location.href.includes('/en/memescope')) return;

      function startSearchObserver() {
        const parentSelector = '.IkXVawB0ALMCnMdJvOFY';
        const parentDivs = document.querySelectorAll(parentSelector);

        if (!parentDivs.length) {
          setTimeout(startSearchObserver, 100);
          return;
        }

        const processedCards = new Set();
        const searchInputs = new Map();

        parentDivs.forEach((parentDiv, index) => {
          const headerDiv = parentDiv.querySelector('.ejjKbdNh3POw8t54UlOS');
          if (!headerDiv) return;

          const rowDiv = headerDiv.querySelector('.l-row.u-align-items-center.u-position-static');
          if (!rowDiv) return;

          const searchBar = document.createElement('input');
          searchBar.type = 'text';
          searchBar.className = 'custom-search-bar';
          searchBar.placeholder = `Search`;

          const headerCol = rowDiv.querySelector('.l-col.u-d-none.u-d-flex-xl.u-align-items-center');
          const filterCol = rowDiv.querySelector('.l-col.l-col-xl-auto.u-position-static');
          if (headerCol && filterCol) {
            const searchCol = document.createElement('div');
            searchCol.className = 'l-col l-col-xl-auto u-position-static';
            searchCol.appendChild(searchBar);
            rowDiv.insertBefore(searchCol, filterCol);
          } else {
            rowDiv.appendChild(searchBar);
          }

          searchInputs.set(parentDiv, searchBar);

          searchBar.addEventListener('input', () => {
            const searchText = searchBar.value.toLowerCase();
            const cards = parentDiv.querySelectorAll('.sBVBv2HePq7qYTpGDmRM.VTmpJ0jdbJuSJQ4HKGlN');
            filterCards(cards, searchText);
          });
        });

        parentDivs.forEach(parentDiv => {
          const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
              if (mutation.type === 'childList' && mutation.addedNodes.length) {
                const cards = Array.from(mutation.addedNodes)
                  .filter(node => node.nodeType === 1 && node.classList.contains('sBVBv2HePq7qYTpGDmRM'))
                  .filter(card => !processedCards.has(card.id));

                processCards(cards, parentDiv);
              }
            });
          });

          observer.observe(parentDiv, { childList: true, subtree: true });
        });

        function processCards(cards, parent) {
          cards.forEach(card => {
            if (!card.id) {
              card.id = 'card-' + Math.random().toString(36).substr(2, 9);
            }

            if (processedCards.has(card.id)) return;

            processedCards.add(card.id);

            const searchBar = searchInputs.get(parent);
            const searchText = searchBar ? searchBar.value.toLowerCase() : '';
            filterCards([card], searchText);
          });
        }

        function filterCards(cards, searchText) {
          cards.forEach(card => {
            const tokenNameElement = card.querySelector('.U3jLlAVrk5kIsp1eeF9L');
            const tokenName = tokenNameElement?.textContent.toLowerCase() || '';

            if (searchText === '' || tokenName.includes(searchText)) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });
        }
      }

      startSearchObserver();
    }

    document.addEventListener('DOMContentLoaded', applyBackgrounds);

    const observer = new MutationObserver(applyBackgrounds);
    observer.observe(document.body, { childList: true, subtree: true });
    initSearchBars();
    removeDashboardTitles();
})();