// ==UserScript==
// @name         OMC Problems Editor
// @namespace    none
// @version      1.0.0
// @description  OnlineMathContest problemsページの問題セルに、得点、分野、いいねしているかどうか表示します。
// @author       yuyu
// @match        https://onlinemathcontest.com/problems
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532975/OMC%20Problems%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/532975/OMC%20Problems%20Editor.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // ログインチェック
    let is_login = false;
    let username = '';
    const userNameEl = document.getElementById('nav-username');
    if (userNameEl && userNameEl.dataset.uid) {
      is_login = true;
      username = userNameEl.dataset.uid;
    }

    let allProblems = {};
    let favoritesSet = new Set();

    // API 取得
    const get_api = (t) => {
      const url = `https://onlinemathcontest.com/api/problems/list?type=${t}`;
      return fetch(url)
        .then(res => res.json())
        .then(data => {
          const result = {};
          if (data && data.contests) {
            data.contests.forEach(contest => {
              contest.tasks.forEach(task => {
                result[task.title] = {
                  point: task.point,
                  field: task.field
                };
              });
            });
          }
          return result;
        });
    };

    // favorites取得
    const fetchFavorites = (user) => {
      const url = `https://onlinemathcontest.com/users/${user}/favorites`;
      return fetch(url)
        .then(res => {
          if (!res.ok) throw new Error('Favorites fetch failed');
          return res.text();
        })
        .then(html => {
          const set = new Set();
          const re = />([A-Z0-9]+\(\w\))</g;
          let match;
          while ((match = re.exec(html)) !== null) {
            set.add(match[1].trim());
          }
          return set;
        });
    };

    const problemPromises = ['B', 'R', 'E', 'S', 'O', 'V'].map(t => get_api(t));

    const promises = [Promise.all(problemPromises).then(results => {
      // 各API呼び出しの結果を統合
      results.forEach(data => {
        allProblems = Object.assign(allProblems, data);
      });
    })];

    if (is_login) {
      promises.push(fetchFavorites(username).then(set => { favoritesSet = set; }));
    }

    // オーバーレイ適用、DOM更新を開始
    Promise.all(promises).then(() => {
      Overlay();
      setupMutation();
    });

    function Overlay() {
      document.querySelectorAll('td').forEach(td => {
        td.querySelectorAll('.omc-overlay').forEach(el => el.remove());

        const cellText = td.textContent.trim();
        const prob = allProblems[cellText];
        if (!prob) return;

        if (window.getComputedStyle(td).position === 'static') {
          td.style.position = 'relative';
        }

        if (prob.point !== undefined) {
          const change = document.createElement('span');
          change.classList.add('omc-overlay');
          change.textContent = prob.point;
          change.style.position = 'absolute';
          change.style.right = '2px';
          change.style.bottom = '2px';
          change.style.fontSize = '10px';
          change.style.color = 'gray';
          change.style.pointerEvents = 'none';
          change.style.zIndex = '0';
          td.appendChild(change);
        }

        if (prob.field !== undefined) {
          const change = document.createElement('span');
          change.classList.add('omc-overlay');
          change.textContent = prob.field;
          change.style.position = 'absolute';
          change.style.left = '2px';
          change.style.bottom = '2px';
          change.style.fontSize = '10px';
          change.style.color = 'gray';
          change.style.pointerEvents = 'none';
          change.style.zIndex = '0';
          td.appendChild(change);
        }

        if (favoritesSet.has(cellText)) {
          const change = document.createElement('span');
          change.classList.add('omc-overlay');
          change.textContent = '❤️'; // かわいいハート。らぶ。
          change.style.position = 'absolute';
          change.style.right = '2px';
          change.style.top = '2px';
          change.style.fontSize = '10px';
          change.style.pointerEvents = 'none';
          change.style.zIndex = '0';
          td.appendChild(change);
        }
      });
    }

    function applyOverlays() {
      Overlay();
    }

    function setupMutation() {
      let Timer = null;
      const delay = 500;

      const CallBack = () => {
        if (Timer) clearTimeout(Timer);
        Timer = setTimeout(() => {
          applyOverlays();
          Timer = null;
        }, delay);
      };

      const observer = new MutationObserver(CallBack);
      observer.observe(document.body, { childList: true, subtree: true });

      window.addEventListener('scroll', applyOverlays);
      window.addEventListener('resize', applyOverlays);
    }
})();
