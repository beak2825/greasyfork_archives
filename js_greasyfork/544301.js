// ==UserScript==
// @name         Prettier Strategus
// @namespace    https://github.com/ckfaraday
// @version      1.2.0
// @description  Enhances the strategus.appspot.com site by adding colours to your life
// @author       ckfaraday
// @match        https://strategus.appspot.com/*
// @icon         https://strategus.appspot.com/icons/blackboard.png
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544301/Prettier%20Strategus.user.js
// @updateURL https://update.greasyfork.org/scripts/544301/Prettier%20Strategus.meta.js
// ==/UserScript==

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function watchHiddenContainers(selectors) {
  selectors.forEach(selector => {
    const container = document.querySelector(selector);
    if (!container) return;

    const observeContent = () => {
      const contentObserver = new MutationObserver(debounce(() => {
        applyAllColors();
      }, 5));
      contentObserver.observe(container, { childList: true, subtree: true });
      applyAllColors();
    };

    if (!container.hasAttribute('hidden')) {
      observeContent();
    } else {
      const attrObserver = new MutationObserver(() => {
        if (!container.hasAttribute('hidden')) {
          attrObserver.disconnect();
          observeContent();
        }
      });
      attrObserver.observe(container, { attributes: true, attributeFilter: ['hidden'] });
    }
  });
}

function styleNumbers() {
  const regex = /[+-]\d+(\.\d+)?/g;
  document.querySelectorAll('td').forEach(td => {
    const text = td.textContent;
    if (!regex.test(text)) return;
    td.textContent = '';
    let lastIndex = 0;
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        td.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }
      const span = document.createElement('span');
      span.textContent = match[0];
      span.style.color = span.textContent.startsWith('-') ? 'red' : 'green';
      td.appendChild(span);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      td.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
  });
}

function styleRankingNames() {
  const listing = document.querySelector('#listing');
  if (!listing) return;
  const rows = Array.from(listing.querySelectorAll('tr')).slice(0, 3);
  const colors = ['gold', 'silver', '#cd7f32'];
  rows.forEach((row, i) => {
    const nameCell = row.children[1];
    if (nameCell) {
      nameCell.style.color = colors[i];
      nameCell.style.fontWeight = 'bold';
    }
  });
}

function styleMatchResults() {
  const stylePlayer = (text) => {
    const span = document.createElement('span');
    span.textContent = text;
    if (/\[W\]/.test(text)) span.style.color = 'green';
    else if (/\[L\]/.test(text)) span.style.color = 'red';
    else if (/\[D\]/.test(text)) span.style.color = 'goldenrod';
    return span;
  };

  const matchTables = ['#results', '#recentGameList', '#activeGameList', '#setupGameList', '#groupGames', '#playoffGames', '#gameList', '#podiumResults'];

  const updateTable = (table, selector) => {
    table.querySelectorAll('tr').forEach(row => {
      const tds = Array.from(row.querySelectorAll('td'));
      if (tds.length === 0) return;

      tds.forEach(td => {
        const txt = td.textContent.trim().toLowerCase();
        if (txt === 'won' || txt === 'lost' || txt === 'draw') {
          td.textContent = '';
          const span = document.createElement('span');
          span.textContent = txt;
          if (txt === 'won') span.style.color = 'green';
          else if (txt === 'lost') span.style.color = 'red';
          else if (txt === 'draw') span.style.color = 'goldenrod';
          td.appendChild(span);
        }
      });

      if (selector === '#groupGames' || selector === '#playoffGames' || selector === '#gameList') {
        [2, 4].forEach(i => {
          const cell = row.cells[i];
          if (!cell) return;
          const text = cell.textContent.trim();
          if (!/\[W\]|\[L\]|\[D\]/.test(text)) return;
          while (cell.firstChild) cell.removeChild(cell.firstChild);
          cell.appendChild(stylePlayer(text));
        });
      } else {
        let td = selector === '#recentGameList' ? tds.find(cell => /\s+vs\.?\s+/i.test(cell.textContent)) : tds[0];
        if (!td) return;
        const text = td.textContent.trim();
        const parts = text.split(/\s+vs\.?\s+/i);
        if (parts.length !== 2) return;
        const [left, right] = parts.map(s => s.trim());
        while (td.firstChild) td.removeChild(td.firstChild);
        const leftSpan = stylePlayer(left);
        const rightSpan = stylePlayer(right);
        if (!/\[W\]|\[L\]|\[D\]/.test(text)) {
          leftSpan.style.color = '#e60000';
          rightSpan.style.color = '#0066ff';
        }
        td.appendChild(leftSpan);
        td.appendChild(document.createTextNode(' vs. '));
        td.appendChild(rightSpan);
      }
    });
  };

  matchTables.forEach(selector => {
    const table = document.querySelector(selector);
    if (table) updateTable(table, selector);
  });

  ['#groupGames', '#playoffGames', '#gameList'].forEach(selector => {
    const table = document.querySelector(selector);
    if (!table || table._observerAdded) return;
    table._observerAdded = true;
    const observer = new MutationObserver(() => {
      observer.disconnect();
      updateTable(table, selector);
      observer.observe(table, { childList: true, subtree: true, characterData: true });
    });
    observer.observe(table, { childList: true, subtree: true, characterData: true });
  });

  function observeMatchTable(id) {
    const table = document.getElementById(id);
    if (table && !table._observerAdded) {
      table._observerAdded = true;
      const observer = new MutationObserver(() => {
        observer.disconnect();
        updateTable(table, `#${id}`);
        observer.observe(table, { childList: true, subtree: true });
      });
      observer.observe(table, { childList: true, subtree: true });
    }
  }

  ['rankedResults', 'podiumResults'].forEach(observeMatchTable);

  function updateElement(el) {
    if (!el) return;
    const text = el.textContent;
    if (!text) return;
    while (el.firstChild) el.removeChild(el.firstChild);
    const pattern = /(\w+(?: \w+)*\s\[[WLD]\])/g;
    let lastIndex = 0, match;
    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        el.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
      }
      const span = document.createElement('span');
      span.textContent = match[0];
      if (/\[W\]/.test(match[0])) span.style.color = 'green';
      else if (/\[L\]/.test(match[0])) span.style.color = 'red';
      else if (/\[D\]/.test(match[0])) span.style.color = 'goldenrod';
      el.appendChild(span);
      lastIndex = pattern.lastIndex;
    }
    if (lastIndex < text.length) {
      el.appendChild(document.createTextNode(text.substring(lastIndex)));
    }
  }

  ['playerStatusA', 'playerStatusB', 'statusText'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    updateElement(el);
    if (el._observerAdded) return;
    el._observerAdded = true;
    const observer = new MutationObserver(() => {
      observer.disconnect();
      updateElement(el);
      observer.observe(el, { childList: true, characterData: true, subtree: true });
    });
    observer.observe(el, { childList: true, characterData: true, subtree: true });
  });

  const sel = document.getElementById('selGroupRound');
  if (sel && !sel._colorMatchResultsListenerAdded) {
    sel._colorMatchResultsListenerAdded = true;
    sel.addEventListener('change', () => setTimeout(styleMatchResults, 5));
  }

  const btnPrev = document.querySelector('#divGroupRoundSel input[value="<"]');
  if (btnPrev && !btnPrev._colorMatchResultsListenerAdded) {
    btnPrev._colorMatchResultsListenerAdded = true;
    btnPrev.addEventListener('click', () => setTimeout(styleMatchResults, 5));
  }

  const btnNext = document.querySelector('#divGroupRoundSel input[value=">"]');
  if (btnNext && !btnNext._colorMatchResultsListenerAdded) {
    btnNext._colorMatchResultsListenerAdded = true;
    btnNext.addEventListener('click', () => setTimeout(styleMatchResults, 5));
  }
}

function styleAwards() {
  const colors = ['gold', 'silver', '#cd7f32'];
  document.querySelectorAll('td').forEach(td => {
    const imgs = td.querySelectorAll('img[src*="podium"]');
    imgs.forEach((img, i) => {
      const span = img.parentElement;
      if (!span) return;
      Array.from(span.childNodes).forEach(node => {
        if (node.nodeType === 3 && node.textContent.trim()) {
          const nameSpan = document.createElement('span');
          nameSpan.textContent = node.textContent.trim();
          nameSpan.style.color = colors[i] || 'black';
          nameSpan.style.fontWeight = 'bold';
          span.replaceChild(nameSpan, node);
        }
        if (node.nodeType === 1 && node.tagName === 'SPAN') {
          node.style.color = colors[i];
          node.style.fontWeight = 'bold';
        }
      });

      let node = span.nextSibling;
      while (node) {
        if (node.nodeType === 3 && node.textContent.trim()) {
          const parent = node.parentNode;
          const parts = node.textContent.split(',');
          const fragments = parts.flatMap((part, index) => {
            const text = part.trim();
            const nameSpan = document.createElement('span');
            nameSpan.textContent = text;
            nameSpan.style.color = colors[i];
            nameSpan.style.fontWeight = 'bold';
            return index > 0 ? [document.createTextNode(', '), nameSpan] : [nameSpan];
          });
          fragments.forEach(f => parent.insertBefore(f, node));
          parent.removeChild(node);
          break;
        }
        node = node.nextSibling;
      }
    });
  });

  const awards = document.querySelector('#divAwards');
  if (awards) {
    const imgs = awards.querySelectorAll('img[src*="podium"]');
    imgs.forEach((img, i) => {
      let node = img.nextSibling;
      while (node && (node.nodeType !== 3 || !node.textContent.trim())) {
        node = node.nextSibling;
      }
      if (node && node.nodeType === 3) {
        const nameSpan = document.createElement('span');
        nameSpan.textContent = node.textContent.trim();
        nameSpan.style.color = colors[i];
        nameSpan.style.fontWeight = 'bold';
        awards.insertBefore(nameSpan, node);
        awards.removeChild(node);
      }
    });
  }
}

function highlightWinner() {
  const bracket = document.querySelector('#divBrackets');
  if (!bracket || !bracket.classList.contains('visible')) return;
  bracket.querySelectorAll('.winner-highlight').forEach(el => {
    el.classList.remove('winner-highlight');
    el.style.border = '';
    el.style.color = '';
    el.style.fontWeight = '';
    el.style.borderRadius = '';
    el.style.padding = '';
  });

  const final = bracket.querySelector('article.round[data-round-id="2"]');
  if (!final) return;

  const match = final.querySelector('.match[data-match-status="4"]');
  if (!match) return;

  let winner = null;
  let best = -Infinity;

  match.querySelectorAll('.participant').forEach(p => {
    const score = parseFloat(p.querySelector('.result')?.textContent || '');
    if (!isNaN(score) && score > best) {
      best = score;
      winner = p.getAttribute('title');
    }
  });

  if (!winner) return;

  bracket.querySelectorAll('.participant').forEach(p => {
    if (p.getAttribute('title') === winner) {
      p.classList.add('winner-highlight');
      p.style.color = 'gold';
      p.style.fontWeight = 'bold';
      p.style.border = '2px solid gold';
      p.style.borderRadius = '4px';
      p.style.padding = '2px 4px';
    }
  });
}

function styleTop3Standings() {
  const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];

  const applyToTable = (table, index = 2) => {
    if (!table?.rows.length) return;

    Array.from(table.rows).forEach(row => {
      const cell = row.cells[index];
      if (cell) {
        cell.style.color = '';
        cell.style.fontWeight = '';
      }
    });

    for (let i = 0; i < Math.min(3, table.rows.length); i++) {
      const cell = table.rows[i].cells[index];
      if (cell) {
        cell.style.color = colors[i];
        cell.style.fontWeight = 'bold';
      }
    }
  };

  applyToTable(document.getElementById('groupStandings'));
  applyToTable(document.getElementById('standings'));
  applyToTable(document.querySelector('#tableRankingTeams tbody'), 1);
}

function applyAllColors() {
  styleNumbers();
  styleRankingNames();
  styleMatchResults();
  styleAwards();
  highlightWinner();
  styleTop3Standings();

  [
    '#gameList',
    '#listing',
    '#results',
    '#recentGameList',
    '#divAwards',
    '#divBrackets',
    '#groupStandings'
  ].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.style.visibility = 'visible';
  });
}

function setupObservers() {
  const config = { childList: true, subtree: true };
  const targets = [
    '#recentGameList',
    '#listing',
    '#results',
    '#divAwards',
    '#divBrackets',
    '#rankedResults',
    '#divGameStatus',
    '#statusText'
  ];
  targets.forEach(selector => {
    const target = document.querySelector(selector);
    if (!target) return;
    const observer = new MutationObserver(debounce(() => applyAllColors(), 5));
    observer.observe(target, config);
  });

  const groupParent = document.querySelector('#groupStandings')?.parentElement;
  if (groupParent) {
    const observer = new MutationObserver(debounce(() => applyAllColors(), 5));
    observer.observe(groupParent, config);
  }

  const gameListParent = document.querySelector('#gameList')?.parentElement;
  if (gameListParent) {
    const observer = new MutationObserver(debounce(() => applyAllColors(), 5));
    observer.observe(gameListParent, config);
  }
}

function watchBracketButton() {
  const btn = document.querySelector('#btnBrackets2');
  if (btn) {
    btn.addEventListener('click', () => {
      setTimeout(highlightWinner, 5);
    });
  }
}

function init() {
  applyAllColors();
  setupObservers();
  watchBracketButton();
  watchHiddenContainers([
    '#divResults',
    '#divPerOpponent',
    '#divRankingTeams'
  ]);
}

window.addEventListener('load', () => setTimeout(init, 5));
