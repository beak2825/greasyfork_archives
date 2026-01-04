// ==UserScript==
// @name         DeepCo Dig
// @namespace    https://deepco.app/
// @version      2025-07-20v2
// @description  (for dev analysis only) Auto dig and navigate to other pages as necessary.
// @author       Corns
// @match        https://deepco.app/dig
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepco.app
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543018/DeepCo%20Dig.user.js
// @updateURL https://update.greasyfork.org/scripts/543018/DeepCo%20Dig.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const TILE_ICON_SYMBOL = '▓︎';
  const INTERVAL_MS = 1000; // How often to check (1 seconds)
  const DRAG_STEPS = 2; // How many steps for smooth drag
  const DRAG_DURATION_MS = 200; // Total drag duration (ms)

  new MutationObserver((mutationsList, observer) => {
    const deptScaling = document.querySelector('.department-scaling');
    if (deptScaling) {
      observer.disconnect();
      console.log("[Dig] Started");
      initDig();
    }
  }).observe(document.body, { childList: true, subtree: true });

  function initDig() {
    observeNextLayerButton();
    observeAchievements();
    observeUpgrades();
    startLoop();
  }

  function startLoop() {
    doLoop()
    setInterval(() => {
      doLoop()
    }, INTERVAL_MS);
  }

  function doLoop() {
    if (!window.location.pathname.includes('/dig')) {
      // probably banned
      return;
    }
    checkStuck();
    if (checkAntiBot()) return;
    tryMine();
  }

  function checkAntiBot() {
    const bodyText = document.body.innerText.toLowerCase();
    if (bodyText.includes("Acknowledge")) {
      console.log('[TM] "Anticheat detected! Saving page...');

      const htmlContent = document.documentElement.outerHTML;

      const blob = new Blob([htmlContent], {type: "text/html"});
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.download = `page_snapshot_${timestamp}.html`;
      a.click();

      URL.revokeObjectURL(url);
      return true;
    }
    return false;
  }

  function observeNextLayerButton() {
    const gridPanel = document.getElementById('grid-panel');
    if (!gridPanel) return;

    new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        for (const node of mutation.addedNodes) {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.classList.contains('layer-complete-content')
          ) {
            console.log("[Dig] Clicking 'Initiate Next Cluster'");
            observer.disconnect();
            window.location.href = '/departments';
            return;
          }
        }
      }
    }).observe(gridPanel, { childList: true });
  }

  function observeAchievements() {
    const header = document.getElementById('achievement-header');
    const achievementsLink = header.firstElementChild;
    if (!achievementsLink) return;

    if (checkAchievements(achievementsLink)) return; // check immediately on page load

    new MutationObserver((mutationsList, observer) => {
      console.log('[Dig] Achievements changed!');
      const achievementsLink = header.firstElementChild;
      if (checkAchievements(achievementsLink)) {
        // observer.disconnect();
      }
    }).observe(header, { attributes: true, childList: true });
  }

  function checkAchievements(achievementsLink) {
    if (achievementsLink.classList.contains('badge')) {
      console.log('[Dig] Navigating to /achievements because badge is active.');
      window.location.href = achievementsLink.href || '/achievements';
      return true;
    }
    return false;
  }

  function observeUpgrades() {
    const header = document.getElementById('worker_coins');
    const upgradesLink = header.firstElementChild;
    if (!upgradesLink) return;

    const infoText = document.createElement("span");
    infoText.textContent = 'DC_Goal:' + localStorage.getItem('pendingUpgradeCost');
    header.after(infoText);

    if (checkUpgrades(upgradesLink)) return; // check immediately on page load

    new MutationObserver((mutationsList, observer) => {
      const upgradesLink = header.firstElementChild;
      if (checkUpgrades(upgradesLink)) {
        // observer.disconnect();
      }
    }).observe(header, { attributes: true, childList: true, subtree: true });
  }

  function checkUpgrades(upgradesLink) {
    // Load stored pending upgrade cost
    const pendingCostText = localStorage.getItem('pendingUpgradeCost');
    if (!upgradesLink.classList.contains('badge')) return;
    const pendingCost = parseFloat(pendingCostText);

    // Parse current DC value from its text
    const match = upgradesLink.textContent.match(/\[DC\]\s*([\d,.]+)/);
    const currentDC = match ? parseFloat(match[1].replace(/,/g, '')) : 0;

    // nav if no local storage (upgrades not calculated yet) or we have enough money
    if (pendingCostText === null || currentDC >= pendingCost) {
      console.log(`[Dig] Navigating to /upgrades. DC: ${currentDC} ≥ Pending: ${pendingCost}`);
      window.location.href = upgradesLink.href || '/upgrades';
      return true;
    }
    return false;
  }

  function checkStuck() {
    // refresh page if there are 2 spinners
    // 1️⃣ Find the player colour from the player link <span>
    const playerSpan = document.querySelector('.small-link span[style*="color"]');
    if (!playerSpan) {
      console.warn('[Dig] Player colour span not found.');
      return 0;
    }

    const playerColor = playerSpan.style.color.trim().toLowerCase();
    // console.log('[Dig] Player colour:', playerColor);

    // 2️⃣ Query all .mining-spinner elements and compare their border-color
    const spinners = document.querySelectorAll('.mining-spinner');

    const matchingCount = [...spinners].filter(spinner => {
      return spinner.style.borderBottomColor.trim().toLowerCase() === playerColor;
    }).length;

    if (matchingCount >= 1 && tilesQueued() === 0
        || countAvailTiles() === 0) {
      window.location.href = '/';
    }
  }

  function countAvailTiles() {
    const wrappers = document.querySelectorAll("div[id^='tile_wrapper_']");

    const count = Array.from(wrappers).filter(wrapper => {
      const tileIcon = wrapper.querySelector(".tile-icon");
      return tileIcon && tileIcon.textContent.trim() === "▓︎";
    }).length;

    return count;
  }

  function tryMine() {
    const deptScaling = document.querySelector('.department-scaling');
    if (!deptScaling) return; // using the player counter to check if the page is loaded

    const wrappers = document.querySelectorAll("div[id^='tile_wrapper_']");

    const first = wrappers[0].querySelector('.dig-tile-wrapper');
    const last = wrappers[wrappers.length - 1].querySelector('.dig-tile-wrapper');

    const queueStatus = document.querySelector('#queue-status');
    if (first && last) {
      if (!queueStatus) {
        // no queue, do single click on tile
        setTimeout(() => {
          findAndClickNextTile();
        }, 100);
      } else if (tilesQueued() <= 1) {
        // queue exists
        simulateDrag(first, last);
      }
    } else {
      // console.log('Could not find valid tile elements.');
    }
  }

  function tilesQueued() {
    const queueStatus = document.querySelector('#queue-status');
    if (!queueStatus) return false;
    const text = queueStatus.textContent.trim();
    const match = text.match(/^(\d+)\s*\/\s*\d+\s*queued$/);
    if (match) {
      const queued = parseInt(match[1], 10);
      return queued;
    }
    return -1;
  }

  function simulateDrag(startEl, endEl) {
    const startRect = startEl.getBoundingClientRect();
    const endRect = endEl.getBoundingClientRect();
    // randomly change dragging direction to reduce chance of overlapping mining
    const [startDragEl, startX, startY, endX, endY] = randomBool()
    ? [startEl, startRect.left, startRect.top, endRect.right, endRect.bottom] // normal direction
    : [endEl, endRect.right, endRect.bottom, startRect.left, startRect.top]; // reversed


    startDragEl.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true,
      clientX: startX,
      clientY: startY
    }));

    const stepX = (endX - startX) / DRAG_STEPS;
    const stepY = (endY - startY) / DRAG_STEPS;
    const stepTime = DRAG_DURATION_MS / DRAG_STEPS;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const clientX = startX + stepX * currentStep;
      const clientY = startY + stepY * currentStep;

      document.dispatchEvent(new MouseEvent('mousemove', {
        bubbles: true,
        clientX,
        clientY
      }));

      if (currentStep >= DRAG_STEPS) {
        clearInterval(interval);
        document.dispatchEvent(new MouseEvent('mouseup', {
          bubbles: true,
          clientX: endX,
          clientY: endY
        }));
        // console.log(`[SmoothDrag] Drag finished from (${startX}, ${startY}) to (${endX}, ${endY})`);
      }
    }, stepTime);

    // console.log(`[SmoothDrag] Started drag from (${startX}, ${startY}) to (${endX}, ${endY})`);
  }

  function findAndClickNextTile(ignoreCurrent = false) {
    const grid = document.getElementById('grid-panel');

    // skip if already in progress
    if (grid.querySelector(".you-are-mining-here") !== null && !ignoreCurrent) return;

    // switch back to queue mode if teamwork achievement is done
    const queueSwitch = document.querySelector('form[action="/toggle_queue"]');
    const teamwork = localStorage.getItem('teamworkNeeded') === "false";
    /*
    if (queueSwitch && teamwork) {
      queueSwitch.submit();
      console.log('[Dig] Disabling queue');
    }
    */

    const wrappers = Array.from(grid.querySelectorAll("div[id^='tile_wrapper_']"));

    const validTiles = wrappers
    .map(wrapper => {
      const dirt = wrapper.querySelector('.dirt');
      if (!dirt) return null;

      const tile = wrapper.querySelector(".dig-tile-wrapper");
      if (!tile) return null;

      const current = wrapper.querySelector(".you-are-mining-here");
      if (current) return null;

      return { tile };
    })
    .filter(Boolean); // Remove nulls

    if (validTiles.length === 0) {
      console.log("[Dig] No valid tile found to click.");
      return;
    }

    // Randomly pick one among ties
    const chosen = validTiles[Math.floor(Math.random() * validTiles.length)];
    randomClick(chosen.tile);
  }

  function randomBool() {
    return Math.random() < 0.5;
  }

  function randomClick(element) {
    const rect = element.getBoundingClientRect();
    const clientX = rect.left + Math.random() * rect.width;
    const clientY = rect.top + Math.random() * rect.height;

    // Simulate mousedown
    element.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true,
      clientX,
      clientY
    }));

    // Small delay to simulate real press
    setTimeout(() => {
      // Simulate mouseup
      element.dispatchEvent(new MouseEvent('mouseup', {
        bubbles: true,
        clientX,
        clientY
      }));

      // Simulate click
      element.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        clientX,
        clientY
      }));
    }, 50); // 50ms between down and up
  }
})();