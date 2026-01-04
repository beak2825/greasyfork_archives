// ==UserScript==
// @name         [GC] - Scarab 21 Deck Tracker + Keyboard Controls
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Tracks cards, adds keyboard shortcuts and logs scores for Scarab 21
// @author       Heda
// @match        https://www.grundos.cafe/games/scarab21/
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/537460/%5BGC%5D%20-%20Scarab%2021%20Deck%20Tracker%20%2B%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/537460/%5BGC%5D%20-%20Scarab%2021%20Deck%20Tracker%20%2B%20Keyboard%20Controls.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const VALUES = [...Array(13)].map((_, i) => i + 2),
        SUITS = ['spades', 'hearts', 'diamonds', 'clubs'],
        SUIT_SYMBOLS = { spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' },
        SUIT_NAMES = { spades: 'Spades', hearts: 'Hearts', diamonds: 'Diamonds', clubs: 'Clubs' },
        FACE_NAMES = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' },
        BASE = 'https://grundoscafe.b-cdn.net/games/cards',
        TEN_VALS = [10,11,12,13],
        keyList = [...'1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-=+[]{};:\",.<>/?`~\\|'];

  let groupBySuit = true,
      defaultKeys = ['1','2','3','4','5'],
      keyBindings = GM_getValue('scarab21_keys', defaultKeys),
      seenCards = new Set(),
      canLogScore = true,
      scale = parseFloat(GM_getValue('ui_scale', 1)).toFixed(2),
      manualMode = false;

  const displayValue = v => FACE_NAMES[v] || v;

  const createRecentGamesFieldset = () => {
    const games = GM_getValue('recentGames', []);
    return `
    <fieldset id="recentGamesBox" style="border:2px solid #fa0;padding:10px;margin:10px;border-radius:6px;min-width:160px;max-height:calc(100% - 20px);overflow:auto;">
      <legend style="color:#fa0;font-weight:bold;">Score Log (Last 50)</legend>
      <div id="recentGamesList" style="font-size:14px;">
        ${games.map(s => `<div>${s}</div>`).join('')}
      </div>
    </fieldset>`;
  };

  function addRecentScore(score) {
    let games = GM_getValue('recentGames', []);
    games.push(score);
    if (games.length > 50) games = [];
    GM_setValue('recentGames', games);
    const list = document.getElementById('recentGamesList');
    if (list) list.innerHTML = games.map(s => `<div>${s}</div>`).join('');
  }

  const win = document.createElement('div');
  win.id = 'scarabUI';
  win.style.cssText = `
    position:fixed;top:50px;left:50px;max-height:95vh;
    background:#2a3439;border:2px solid #fff;border-radius:8px;
    overflow:hidden;z-index:9999;color:#eee;font-family:sans-serif;
    display:flex;flex-direction:column;transform:scale(${scale});transform-origin:top left;
  `;

  win.innerHTML = `

    <div id="drag_header" style="width:100%;cursor:move;background:#fff;color:#000;padding:4px 8px;font-weight:bold;border-radius:6px 6px 0 0;">Scarab 21 Deck Tracker</div>
    <div style="padding:5px 10px;background:#333;color:#fff;font-size:14px;">
      Scale: <input type="range" id="scaleSlider" min="0.6" max="1.6" step="0.05" value="${scale}" style="width:150px;vertical-align:middle;">
      <span id="scaleVal">${scale}</span>
      <label style="margin-left:20px;"><input type="checkbox" id="anchorToggle"> Anchor Below Board</label>
      <label style="margin-left:20px;"><input type="checkbox" id="manualToggle"> Manually Add Seen Cards</label>
    </div>
    <div style="display:flex;flex:1;overflow:hidden;">
      <div style="flex-grow:1;min-width:700px;overflow:auto;">
        <fieldset style="border:2px solid #33c4ff;padding:10px;margin:10px;border-radius:6px;">
          <legend style="color:#33c4ff;font-weight:bold;">Keyboard Controls</legend>
          <div style="display:flex;justify-content:space-between;gap:8px;">
            ${[0,1,2,3,4].map(i => `
              <label style="display:flex;flex-direction:column;font-size:14px;">
                Col ${i+1}:
                <select id="keyCol${i}" style="padding:4px;min-width:60px;">
                  ${keyList.map(k => `<option value="${k}"${keyBindings[i]===k?' selected':''}>${k}</option>`).join('')}
                </select>
              </label>`).join('')}
          </div>
          <div style="margin-top:10px;text-align:center;">
            <button id="saveKeys" style="padding:8px 16px;background:#007bff;color:#fff;border:none;border-radius:4px;width:100%;font-weight:bold;">Save Keys</button>
          </div>
        </fieldset>
        <fieldset style="border:2px solid #fff;padding:10px 14px;margin:10px;border-radius:6px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;">
            <div><strong>Total in Deck:</strong> <span id="deckCount">52</span></div>
            <div><strong>10-Value Cards:</strong> <span id="tenCardInfo">--</span></div>
            <label style="margin-top:6px;font-size:14px;">
              <input type="checkbox" id="toggleView"${groupBySuit?' checked':''}> Group by Suit
            </label>
          </div>
        </fieldset>
        <div id="cardContainer" style="padding-bottom:10px;"></div>
      </div>
      ${createRecentGamesFieldset()}
    </div>
  `;

  const savedPos = GM_getValue('windowPosition');
  if (savedPos?.top && savedPos?.left) {
    win.style.top = `${savedPos.top}px`;
    win.style.left = `${savedPos.left}px`;
  }
  document.body.appendChild(win);

  document.getElementById('scaleSlider').addEventListener('input', e => {
    const val = parseFloat(e.target.value).toFixed(2);
    document.getElementById('scarabUI').style.transform = `scale(${val})`;
    document.getElementById('scaleVal').textContent = val;
    GM_setValue('ui_scale', val);
  });

  document.getElementById('manualToggle').addEventListener('change', e => {
    manualMode = e.target.checked;
  });

  document.getElementById('toggleView').addEventListener('change', e => {
    groupBySuit = e.target.checked;
    updateUI();
  });
let isAnchored = GM_getValue('scarab21_anchor', false);
      document.getElementById('anchorToggle').checked = isAnchored;
const anchorToggle = document.getElementById('anchorToggle');
anchorToggle.addEventListener('change', () => {
  isAnchored = anchorToggle.checked;
  GM_setValue('scarab21_anchor', isAnchored);
  if (isAnchored) {
    anchorWindow();
  } else {
    win.style.position = 'fixed';
  }
});

function anchorWindow() {
  const outerTable = document.querySelector('table.board');
  if (!outerTable) return;

  const rect = outerTable.getBoundingClientRect();
  win.style.position = 'absolute';
  win.style.left = `${rect.left + window.scrollX}px`;
  win.style.top = `${rect.bottom + window.scrollY + 10}px`;
}

window.addEventListener('scroll', () => isAnchored && anchorWindow());
window.addEventListener('resize', () => isAnchored && anchorWindow());

  document.getElementById('saveKeys').addEventListener('click', () => {
    keyBindings = [0,1,2,3,4].map(i => document.getElementById(`keyCol${i}`).value);
    GM_setValue('scarab21_keys', keyBindings);
    alert('Key bindings saved!');
  });

  document.addEventListener('keydown', e => {
    const i = keyBindings.indexOf(e.key);
    if (i !== -1) document.querySelector(`a[onclick="play_card(${i})"]`)?.click();
  });

  const header = document.getElementById('drag_header');
  let isDragging = false, startX, startY;
 header.addEventListener('mousedown', e => {
  if (isAnchored) return;
  isDragging = true;
  startX = e.clientX - win.offsetLeft;
  startY = e.clientY - win.offsetTop;
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
});

 const drag = e => {
  if (!isDragging || isAnchored) return;
  win.style.left = `${e.clientX - startX}px`;
  win.style.top = `${e.clientY - startY}px`;
};

  const stopDrag = () => {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    GM_setValue('windowPosition', { top: win.offsetTop, left: win.offsetLeft });
  };

  function updateUI() {
    const remaining = Object.fromEntries(SUITS.flatMap(s => VALUES.map(v => [`${v}_${s}`, 1])));
    seenCards.forEach(k => { if (remaining[k]) remaining[k] = 0; });

    let total = 0, tenCount = 0;
    const suitCounts = Object.fromEntries(SUITS.map(s => [s, 0])), valueCounts = Object.fromEntries(VALUES.map(v => [v, 0]));

    for (let k in remaining) {
      if (remaining[k]) {
        total++;
        const [val, suit] = k.split('_');
        suitCounts[suit]++;
        valueCounts[val]++;
        if (TEN_VALS.includes(+val)) tenCount++;
      }
    }

    document.getElementById('deckCount').textContent = total;
    document.getElementById('tenCardInfo').textContent = `${tenCount} cards (${total ? ((tenCount/total)*100).toFixed(1) : '0.0'}%)`;

    const container = document.getElementById('cardContainer');
    container.innerHTML = '';

    const appendCard = (k, gray) => {
      const div = document.createElement('div');
      div.style = `width:60px;text-align:center;margin:4px;cursor:${manualMode ? 'pointer' : 'default'};`;
      div.onclick = () => {
        if (manualMode && !seenCards.has(k)) {
          seenCards.add(k);
          updateUI();
        }
      };
      div.innerHTML = `<div style="width:48px;height:70px;padding:0;margin:0;border:${gray ? '3px solid red' : 'none'};box-sizing:border-box;">
        <img src="${BASE}/${k}.gif" style="width:100%;height:100%;display:block;${gray ? 'filter:grayscale(100%) opacity(0.5);' : 'filter:none;opacity:1;'}">
      </div>`;
      return div;
    };

    if (groupBySuit) {
      SUITS.forEach(s => {
        const count = suitCounts[s], pct = total ? ((count/total)*100).toFixed(1) : '0.0';
        const field = document.createElement('fieldset');
        field.style = 'border:2px solid #888;padding:6px 10px;margin:6px 10px;border-radius:6px;';
        field.innerHTML = `<legend style="color:#fff;font-weight:bold;">${SUIT_SYMBOLS[s]} ${SUIT_NAMES[s]} [${count} cards, ${pct}%]</legend>`;
        const wrap = document.createElement('div');
        wrap.style = 'display:grid;grid-template-columns:repeat(auto-fill, 60px);gap:6px;';
        VALUES.forEach(v => {
          const k = `${v}_${s}`;
          wrap.appendChild(appendCard(k, !remaining[k]));
        });
        field.appendChild(wrap);
        container.appendChild(field);
      });
    } else {
      const grid = document.createElement('div');
      grid.style = 'display:grid;grid-template-columns:1fr 1fr;gap:10px;';
      VALUES.forEach(v => {
        const count = valueCounts[v], pct = total ? ((count/total)*100).toFixed(1) : '0.0';
        const field = document.createElement('fieldset');
        field.style = 'border:2px solid #888;padding:6px 10px;border-radius:6px;';
        field.innerHTML = `<legend style="color:#fff;font-weight:bold;">${displayValue(v)} [${count} cards, ${pct}%]</legend>`;
        const wrap = document.createElement('div');
        wrap.style = 'display:flex;flex-wrap:wrap;';
        SUITS.forEach(s => {
          const k = `${v}_${s}`;
          wrap.appendChild(appendCard(k, !remaining[k]));
        });
        field.appendChild(wrap);
        grid.appendChild(field);
      });
      container.appendChild(grid);
    }
  }

  const cache = document.createElement('div');
  cache.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden;';
  for (let v of VALUES) {
    for (let s of SUITS) {
      const img = new Image();
      img.src = `${BASE}/${v}_${s}.gif`;
      cache.appendChild(img);
    }
  }
  document.body.appendChild(cache);

  const originalPlayCard = unsafeWindow.play_card;
  unsafeWindow.play_card = function (n) {
    setTimeout(() => {
      const card = document.querySelector('td[align="center"] > img.card');
      const key = card?.src.match(/\/(\d+)_([a-z]+)\.gif/i);
      if (key) {
        seenCards.add(`${key[1]}_${key[2]}`);
        updateUI();
      }
    }, 100);
    return originalPlayCard(n);
  };

setInterval(() => {
  const html = document.body.innerHTML;
  if (html.includes('onclick="collect_winnings()"')) canLogScore = true;

  if (canLogScore && html.includes("Congratulations!!!")) {
    const match = html.match(/<p>You have scored <strong>(\d+)<\/strong>/i);
    if (match) {
      addRecentScore(Number(match[1]));
      seenCards.clear();
      updateUI();
      canLogScore = false;
    }
  }

if (html.includes("Deck Cleared!")) {
  const boardCards = document.querySelectorAll("div.cards img.card");
  const currentBoard = [];
  seenCards.clear(); // Clear first
  boardCards.forEach(img => {
    const match = img.src.match(/\/(\d+)_([a-z]+)\.gif/i);
    if (match) {
      const cardKey = `${match[1]}_${match[2]}`;
      seenCards.add(cardKey);
      currentBoard.push(cardKey);
    }
  });
  updateUI();
}
  }, 150);
    if (isAnchored) {
  anchorWindow();
}
  updateUI();
})();
