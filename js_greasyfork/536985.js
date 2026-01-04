// ==UserScript==
// @name         OMC Standings Search
// @namespace    https://onlinemathcontest.com/
// @version      1.0
// @description  OMCでユーザー名を検索できます
// @match        https://onlinemathcontest.com/contests/*/standings*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536985/OMC%20Standings%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/536985/OMC%20Standings%20Search.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (!/\/contests\/[^/]+\/standings/.test(location.href)) return;

  const contestMatch = location.href.match(/contests\/([^/]+)\/standings/);
  if (!contestMatch) return;

  const contestId = contestMatch[1];
  const standingsApi = `/api/contests/${contestId}/standings`;

  fetch(`${standingsApi}?rated=0`)
    .then(res => res.json())
    .then(data => {
      const standingsEl = document.getElementById('standings');
      if (!standingsEl) return;

      const { isPast, is_point_visible } = data;
      if (!(isPast && is_point_visible)) return;

      const container = document.querySelector('div.container');
      const form = container?.querySelector('form');

      if (form) {
        form.insertAdjacentHTML('afterend', `
          <div class="form-inline my-2" style="margin-bottom:1em;">
            <input type="text" id="userSearchInput" placeholder="ユーザー名を入力" class="form-control mr-2">
            <button id="userSearchBtn" class="btn btn-primary">Search</button>
            <span id="userSearchStatus" style="margin-left:1em;color:#666;"></span>
          </div>
        `);
      }

      const inputEl = document.getElementById('userSearchInput');
      const searchBtn = document.getElementById('userSearchBtn');
      const statusEl = document.getElementById('userSearchStatus');

      const isRatedChecked = () => document.getElementById('ratedCheckbox')?.checked ? 1 : 0;

      async function searchUser(giveup) {
        const targetName = inputEl.value.trim().toLowerCase();
        if (!targetName) return;

        searchBtn.disabled = true;
        statusEl.textContent = '';

        try {
          const res = await fetch(`${standingsApi}?rated=${isRatedChecked()}`, { credentials: 'same-origin' });
          const { standings } = await res.json();

          const userIndex = standings.findIndex(s => s.user.id.toLowerCase() === targetName);
          if (userIndex === -1) {
            searchBtn.disabled = false;
            return;
          }

          const targetPage = Math.floor(userIndex / 20) + 1;

          const navigateToPage = () => {
            for (let trying=0; trying<10;trying++){
                const currentPage = parseInt(document.querySelector('.page-item.active .page-link')?.textContent.trim(), 10);

                if (currentPage === targetPage) {
                    setTimeout(() => {
                        const rows = document.querySelectorAll('tbody tr');
                        let found = false;

                        rows.forEach(row => {
                            const link = row.querySelector('a.user-link');
                            const rank = parseInt(row.children[0].textContent, 10);

                            if (link?.textContent.trim().toLowerCase() === targetName && rank === standings[userIndex].rank) {
                                found = true;
                                Array.from(row.children).forEach(cell => {
                                    if (!cell.classList.contains('table-danger')) {
                                        cell.style.backgroundColor = '#f4f6d8';
                                    }
                                });
                                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            } else {
                                Array.from(row.children).forEach(cell => {
                                    if (window.getComputedStyle(cell, null).getPropertyValue('background-color')==='rgb(244, 246, 216)') {
                                        cell.style.backgroundColor = '#ffffff';
                                    }
                                });
                            }
                        });
                        searchBtn.disabled = false
                        if (!found && !giveup){
                            retrySearch();
                        }
                    }, 10);
                    return;
                }

                const pageItems = [...document.querySelectorAll('ul.pagination .page-item')];
                const closest = pageItems.reduce((best, item) => {
                    const pageNum = parseInt(item.querySelector('.page-link')?.textContent.trim(), 10);
                    const diff = Math.abs(pageNum - targetPage);
                    return (!isNaN(pageNum) && diff < best.diff) ? { item, diff } : best;
                }, { item: null, diff: Infinity });

                if (closest.item) {
                    closest.item.querySelector('.page-link').click();
                    //setTimeout(navigateToPage, 50);
                } else {
                    searchBtn.disabled = false;
                }
            }
            retrySearch();
          };

          navigateToPage();
        } catch (e) {
          console.error(e);
          searchBtn.disabled = false;
        }
      }

      function retrySearch() {
        const nextBtn = document.querySelector('.btn.btn-outline-secondary');
        if (!nextBtn) return;

        nextBtn.click();

        const waitUntilReady = () => {
          if (nextBtn.disabled) {
            searchUser(true);
          } else {
            setTimeout(waitUntilReady, 50);
          }
        };

        waitUntilReady();
      }

      searchBtn.addEventListener('click', searchUser);
      inputEl.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          searchUser(false);
        }
      });
    })
    .catch(err => console.error('Standings fetch error:', err));
})();
