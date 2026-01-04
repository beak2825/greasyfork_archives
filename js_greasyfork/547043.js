// ==UserScript==
// @name         FreeForAll - AttackButtons
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Always show Attack column for your faction; toggle all grey "Attack" labels into real links (both teams).
// @match        https://www.torn.com/factions.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547043/FreeForAll%20-%20AttackButtons.user.js
// @updateURL https://update.greasyfork.org/scripts/547043/FreeForAll%20-%20AttackButtons.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- settings ---
  const DEBUG = true;

  // toggle state: when true, convert grey Attack spans to real links; when false, revert to grey spans
  let linksEnabled = true;

  const log = (...a) => DEBUG && console.log('[AttackToggle]', ...a);

  // --- CSS: keep your-faction Attack column visible; style our links ---
  (function addStyles() {
    const css = `
      /* Force show Attack column in your-faction (header + cells) */
      .tab-menu-cont.your-faction .attack,
      .tab-menu-cont.your-faction .attack.left,
      .tab-menu-cont.your-faction .attack___wBWp2 {
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        pointer-events: auto !important;
      }

      /* Make sure header keeps space for Attack */
      .tab-menu-cont.your-faction .members-cont > .white-grad .attack {
        display: inline-block !important;
      }

      /* Our injected attack link */
      a.custom-attack-button {
        text-decoration: none !important;
        padding: 0px 2px;
        border-radius: 2px;
        cursor: pointer;
        margin-left: 4px;
        color: white !important;
        background: #0078d4 !important;
        display: inline-block;
      }
    `;
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  })();
function fixYourFactionWidth() {
    const faction = document.querySelector('.tab-menu-cont.your-faction');
    if (!faction) return;

    // Shrink the container width to leave room for the Attack column
    //faction.style.width = 'calc(50%)'; // tweak 40px as needed
    //faction.style.boxSizing = 'border-box';
    faction.querySelectorAll(`div[class*="points"]`).forEach(cell => {
            cell.style.width = '10%'; // adjust % as needed
            cell.style.minWidth = '0'; // allow shrinking
        });
    faction.querySelectorAll(`div[class*="attack"]`).forEach(cell => {
            cell.style.width = '3%'; // adjust % as needed
            cell.style.minWidth = '0'; // allow shrinking
        });
    faction.querySelectorAll(`div[class*="level"]`).forEach(cell => {
            cell.style.width = '8%'; // adjust % as needed
            cell.style.minWidth = '0'; // allow shrinking
        });
}
  // --- helpers ---
  function showElementHard(el) {
    if (!el) return;
    el.style.setProperty('display', 'inline-block', 'important');
    el.style.setProperty('visibility', 'visible', 'important');
    el.style.setProperty('opacity', '1', 'important');
    el.style.setProperty('pointer-events', 'auto', 'important');
  }

  function ensureYourFactionHeader() {
    const root = document.querySelector('.tab-menu-cont.your-faction');
    if (!root) return;

    const header = root.querySelector('.members-cont > .white-grad');
    if (!header) return;

    let attackHeader = header.querySelector('.attack');
    if (!attackHeader) {
      attackHeader = document.createElement('div');
      attackHeader.className = 'attack left attack___wBWp2 tab___UztMc';
      attackHeader.textContent = 'Attack';
      header.appendChild(attackHeader);
      log('Created Attack header for your faction');
    }
    showElementHard(attackHeader);
  }

  function ensureYourFactionCells() {
    // Make sure each teammate row has an attack cell so the column keeps shape.
    const yourRows = document.querySelectorAll('.tab-menu-cont.your-faction ul.members-list li.your');
    yourRows.forEach(li => {
      let attackCell = li.querySelector('.attack');
      if (!attackCell) {
        attackCell = document.createElement('div');
        attackCell.className = 'attack left attack___wBWp2';
        // Insert near the end like Torn usually does
        const clearEl = li.querySelector('.clear');
        li.insertBefore(attackCell, clearEl || null);
      }
      showElementHard(attackCell);
    });
  }

  function xidFromRow(li) {
    const profileLink = li.querySelector('a[href^="/profiles.php?XID="]');
    if (!profileLink) return null;
    const m = profileLink.href.match(/XID=(\d+)/);
    return m ? m[1] : null;
  }

  // Convert the attack cell for a single row according to linksEnabled
function transformAttackCellForRow(li) {
    let attackCell = li.querySelector('.attack');
    if (!attackCell) return;

    // Always keep the cell visible
    if (li.classList.contains('your')) showElementHard(attackCell);

    // Only create the link once
    let link = attackCell.querySelector('a.custom-attack-button');
    if (!link && linksEnabled) {
        const xid = xidFromRow(li);
        if (!xid) return;
        link = document.createElement('a');
        link.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${xid}`;
        link.textContent = 'Attack';
        link.className = 'custom-attack-button';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        attackCell.appendChild(link);

        // Hide the grey span if present
        attackCell.querySelectorAll('span.t-gray-9').forEach(s => s.style.display = 'none');
    }

    // Instead of removing/adding nodes, just show/hide via style
    if (link) link.style.display = linksEnabled ? 'inline-block' : 'none';
    attackCell.querySelectorAll('span.t-gray-9').forEach(span => {
        span.style.display = linksEnabled ? 'none' : 'inline-block';
    });
}

  function transformAllRows() {
    // Always keep your-faction column visible
    fixYourFactionWidth();
    ensureYourFactionHeader();
    ensureYourFactionCells();

    // Apply toggle behavior to ALL rows (both teams)
    const rows = document.querySelectorAll('ul.members-list > li');
    rows.forEach(transformAttackCellForRow);
  }

  // --- toggle button ---
  function createToggleButton() {
    const button = document.createElement('button');
    button.textContent = 'Attack Links: ON';
    button.style.position = 'fixed';
    button.style.bottom = '5%';
    button.style.right = '10px';
    button.style.zIndex = '2147483647';
    button.style.padding = '6px 10px';
    button.style.backgroundColor = '#008CBA';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';

button.addEventListener('click', () => {
    linksEnabled = !linksEnabled;
    button.textContent = `Attack Links: ${linksEnabled ? 'ON' : 'OFF'}`;
    button.style.backgroundColor = linksEnabled ? '#008CBA' : '#777';
    // This now only toggles visibility, no DOM removal
    transformAllRows();
});

    document.body.appendChild(button);
  }

  // --- observers / boot ---
  let debounce;
  const mo = new MutationObserver(() => {
    clearTimeout(debounce);
    debounce = setTimeout(transformAllRows, 200);
  });

  function start() {
    createToggleButton();
    transformAllRows();
    mo.observe(document.body, { childList: true, subtree: true });
    log('Initialized');
  }

  // Delay a touch to let Torn render
  setTimeout(start, 600);
})();