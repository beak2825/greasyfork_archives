// ==UserScript==
// @name         Racing: CUSTOM EVENTS
// @namespace    https://greasyfork.org/en/users/1477596-jochum-rietwoud
// @version      0.3
// @description  Remembers custom event track on join, highlights in car selection, debug logging
// @match        https://www.torn.com/loader.php?sid=racing*
// @run-at       document-idle
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543361/Racing%3A%20CUSTOM%20EVENTS.user.js
// @updateURL https://update.greasyfork.org/scripts/543361/Racing%3A%20CUSTOM%20EVENTS.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ======== BRO MODE: Confirm Script Loads ========
  console.log("[Torn Custom Events Userscript] Loaded!");

  const banner = document.createElement('div');
  banner.textContent = "Torn Custom Events Userscript ACTIVE";
  banner.style = "position:fixed;top:10px;left:10px;z-index:9999;background:#333;color:#fff;padding:6px 18px;border-radius:6px;font-size:16px;";
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 2000);

  // ======== Session Storage ========
  function saveTrackShort(track) {
    if (track && track.length > 2) {
      sessionStorage.setItem('tornCustomTrack', track.slice(0, 3).toLowerCase());
      console.log('[Torn] Saved track:', track.slice(0, 3).toLowerCase());
    }
  }
  function getTrackShort() {
    return sessionStorage.getItem('tornCustomTrack');
  }
  function clearTrackShort() {
    sessionStorage.removeItem('tornCustomTrack');
    console.log('[Torn] Cleared stored track');
  }

  // ======== Find Track from Custom Events ========
  function getTrackFromJoin(joinBtn) {
    const eventLi = joinBtn.closest('li.protected, li.long-time, li.no-suitable');
    if (!eventLi) return null;
    const trackEl = eventLi.querySelector('.track');
    if (!trackEl) return null;
    return (trackEl.childNodes[0]?.textContent || '').trim();
  }

  // ======== Listen for Join Click ========
  function listenForCustomJoin() {
    const list = document.querySelector('.custom-events-wrap .events-list');
    if (!list) {
      console.log('[Torn] Custom Events list not found.');
      return;
    }
    // Prevent double-listener
    if (list._tornCustomJoinActive) return;
    list._tornCustomJoinActive = true;

    list.addEventListener('click', function (e) {
      const a = e.target.closest('li.join a, li.join-wrap a');
      if (a) {
        console.log('[Torn] Join button clicked:', a);
        const track = getTrackFromJoin(a);
        if (track) {
          console.log('[Torn] Found track:', track);
          saveTrackShort(track);
        } else {
          console.log('[Torn] Could not find track name from join button!');
        }
      }
    }, true);
    console.log('[Torn] Custom Join click listener active.');
  }

  // ======== Car Selection Highlight ========
  function handleCarSelection() {
    const track3 = getTrackShort();
    if (!track3) {
      // console.log('[Torn] No saved track.');
      return;
    }

      // Highlight car block if track name is present
    const carBlocks = document.querySelectorAll('.enlist-info-wrap, .car-choice-block, .race-car-block, .model-car-name-txt');
    let foundAny = false;
    carBlocks.forEach(block => {
      const blockText = (block.textContent || '').toLowerCase();
      if (blockText.includes(track3)) {
        foundAny = true;
        block.style.outline = "3px solid #3fb950";
        block.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Optional: Add temporary flash/highlight effect
        block.style.transition = "box-shadow 0.8s";
        block.style.boxShadow = "0 0 22px 2px #3fb950";
        setTimeout(() => { block.style.boxShadow = ""; }, 1200);
        console.log('[Torn] Highlighted block for track:', track3, block);
      }
    });
    if (!foundAny) {
      console.log('[Torn] No matching car blocks found for track:', track3);
    }

    // Clear after use (so doesn't affect unrelated car selection)
    clearTrackShort();
  }

  // ======== Main Logic ========
 function main() {
    // Only set up join handler if the list is visible
    const eventsList = document.querySelector('.custom-events-wrap .events-list');
    if (eventsList) {
        listenForCustomJoin();
    }

    // Only highlight if there's a stored track name
    if (getTrackShort()) {
        const isCarSelection =
            (location.href.includes('chooseRacingCar')) ||
            document.body.innerText.includes('Choose Your Car') ||
            document.querySelector('.car-choice-block') ||
            document.querySelector('.enlist-info-wrap');
        if (isCarSelection) {
            console.log('[Torn] Running car selection highlight...');
            handleCarSelection();
        }
    }
}

  // ======== Mutation Observer for SPA Reloads ========
  const mo = new MutationObserver(() => {
    clearTimeout(mo._t); mo._t = setTimeout(main, 300);
  });
  mo.observe(document.body, { childList: true, subtree: true });
  main();

  // ======== Debug Button ========
  const dbgBtn = document.createElement('button');
  dbgBtn.textContent = "Run Torn Custom Event Script";
  dbgBtn.style = "position:fixed;top:45px;left:10px;z-index:9999;padding:3px 8px;";
  document.body.appendChild(dbgBtn);
  dbgBtn.onclick = main;

  // ======== Style for Highlight (Optional if you want more visuals) ========
  if (typeof GM_addStyle === 'function') GM_addStyle(`
    .torn-custom-highlight {
      outline: 3px solid #3fb950 !important;
      box-shadow: 0 0 12px 2px #3fb950 !important;
      background: rgba(63,185,80,0.07) !important;
      transition: outline 0.3s, box-shadow 0.7s;
    }
  `);

})();
