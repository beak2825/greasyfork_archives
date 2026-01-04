// ==UserScript==
// @name         DeepCo Upgrades
// @namespace    https://deepco.app/
// @version      2025-07-20
// @description  (for dev analysis only) Auto purchase DC and RC upgrades
// @author       Corns
// @match        https://deepco.app/upgrades
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepco.app
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543019/DeepCo%20Upgrades.user.js
// @updateURL https://update.greasyfork.org/scripts/543019/DeepCo%20Upgrades.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const INTERVAL_MS = 1000;

  new MutationObserver((mutation, observer) => {
    const main = document.getElementById('main-panel');
    if (main) {
      console.log("[Upgrade] Loaded");
      observer.disconnect();
      startLoop();
    }
  }).observe(document.body, { childList: true, subtree: true });

  function startLoop() {
    setInterval(() => {
      clickBestDPSUpgrade();
    }, INTERVAL_MS);
  }

  function clickBestDPSUpgrade() {
    const dcFrame = document.querySelector('#deepcoin-upgrades');
    if (!dcFrame) {
      console.log('[Upgrade] Upgrades panel not found.');
      return;
    }
    const rcFrame = document.querySelector('#recursive-upgrades');
    if (!rcFrame) {
      console.log('[Upgrade] Upgrades panel not found.');
      return;
    }

    // Get base stats
    const clockSpeedMatch = dcFrame.innerText.match(/Clock Speed:\s*([\d.]+)s/);
    const overclockMatch = dcFrame.innerText.match(/Overclocking Chance:\s*(\d+)%/);
    const forkMatch = dcFrame.innerText.match(/Thread Fork Chance:\s*(\d+)%/);
    const minMatch = dcFrame.innerText.match(/Min Processing Power:\s*(\d+)/);
    const maxMatch = dcFrame.innerText.match(/Max Processing Power:\s*(\d+)/);
    const minBonusMatch = rcFrame.innerText.match(/Min Processing Bonus:\s*(\d+)%/);
    const maxBonusMatch = rcFrame.innerText.match(/Max Processing Bonus:\s*(\d+)%/);
    const totalBonusMatch = rcFrame.innerText.match(/Total Processing Bonus:\s*(\d+)%/);
    const dcYieldMatch = rcFrame.innerText.match(/DC Yield:\s*(\d+)%/);


    if (!clockSpeedMatch || !minMatch || !maxMatch) {
      console.log('[Upgrade] Missing base stats.');
      return;
    }

    let clockSpeed = parseFloat(clockSpeedMatch[1]);
    const overclockChance = parseInt(overclockMatch?.[1] ?? '0', 10) / 100;
    const forkChance = parseInt(forkMatch?.[1] ?? '0', 10) / 100;
    let minPower = parseFloat(minMatch[1]);
    let maxPower = parseFloat(maxMatch[1]);
    const minBonus = (parseInt(minBonusMatch?.[1] ?? '0', 10) + 100) / 100;
    const maxBonus = (parseInt(maxBonusMatch?.[1] ?? '0', 10) + 100) / 100;
    const totalBonus = (parseInt(totalBonusMatch?.[1] ?? '0', 10) + 100) / 100;
    const dcYield = parseInt(dcYieldMatch?.[1] ?? '100', 10) / 100;

    const avgPower = (minPower + maxPower) / 2;
    const overclockMultiplier = 1 + overclockChance;
    const forkMultiplier = 2 / (2 - forkChance);
    const baseDPS = avgPower / clockSpeed * overclockMultiplier * forkMultiplier;

    // update recursion protocol menu
    // power changes over time so we assume maxed DC upgrades for calculations
    let bestRatio = -Infinity;
    let bestRCCost = 0;
    let bestRCbutton = null;
    const recursiveButtons = rcFrame.querySelectorAll('button');
    recursiveButtons.forEach(button => {
      if (!button.textContent.includes('Install')) return;
      const costMatch = button.textContent.match(/\+1%.*\(([\d.]+)\s*RC\)/);
      if (!costMatch) return;

      const rcCost = parseFloat(costMatch[1]);

      // Make a copy of the current bonuses
      const rawMinPower = 30; // statically set to maxed raw stat
      const rawMaxPower = 100;
      const basePower = (rawMinPower * minBonus + rawMaxPower * maxBonus) / 2 * totalBonus * dcYield;
      let newMinBonus = minBonus;
      let newMaxBonus = maxBonus;
      let newTotalBonus = totalBonus;
      let newDCYield = dcYield;

      if (button.textContent.includes('Min Processing')) {
        newMinBonus += 0.01;
      } else if (button.textContent.includes('Max Processing')) {
        newMaxBonus += 0.01;
      } else if (button.textContent.includes('Total Processing')) {
        newTotalBonus += 0.01;
      } else if (button.textContent.includes('DC Yield')) {
        newDCYield += 0.01;
      }

      const newAvgPower = (rawMinPower * newMinBonus + rawMaxPower * newMaxBonus) / 2 * newTotalBonus * newDCYield;

      const powerGain = (newAvgPower - basePower) / basePower * 100;
      const ratio = powerGain / rcCost;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestRCCost = rcCost;
        bestRCbutton = button;
      }
      // Build new label
      // Extract "Install +1% Min Processing"
      const baseLabel = button.textContent.replace(/\s*\([\d.]+\s*RC\).*$/, '').trim();
      button.textContent = `${baseLabel} (${rcCost.toFixed(2)} RC) | +${powerGain.toFixed(2)}% Power (${ratio.toFixed(4)}%/RC)`;
    });

    // attempt to upgrade RC or store RC costs
    if (bestRCbutton.disabled) {
      localStorage.setItem('pendingRCCost', bestRCCost);
    } else {
      localStorage.removeItem('pendingRCCost');
      bestRCbutton.click();
    }

    const upgradesBtn = document.querySelector('button.tab-button[data-tab-target-id="deep"]');
    if (upgradesBtn && !upgradesBtn.classList.contains('active')) {
      return;
    }

    const upgrades = [];

    // Scan all upgrades
    const groups = dcFrame.querySelectorAll('.upgrade-buttons-group');
    let cheapest = Infinity;
    groups.forEach(group => {
      const buttons = group.querySelectorAll('button.upgrade-button');
      buttons.forEach(button => {
        if (!button.textContent.includes('+1 ')) {
          return;
        }
        const label = button.parentElement.action;
        const match = button.textContent.match(/\+1.*\((\d+)\s*DC\)/);
        if (!match) return;
        const cost = parseInt(match[1], 10);
        const isDisabled = button.disabled;

        let newClockSpeed = clockSpeed;
        let newMin = minPower;
        let newMax = maxPower;
        let newOverclockChance = overclockChance;
        let newForkChance = forkChance;

        if (label.includes('/upgrades/speed')) {
          newClockSpeed = Math.max(0.5, clockSpeed - 0.1);
          if (cost < cheapest) {
            cheapest = cost;
          }
        } else if (label.includes('/upgrades/min_damage')) {
          const increase = 1 * minBonus * totalBonus;
          newMin += increase;
          if (cost < cheapest) {
            cheapest = cost;
          }
        } else if (label.includes('/upgrades/damage')) {
          const increase = 1 * maxBonus * totalBonus;
          newMax += increase;
          if (cost < cheapest) {
            cheapest = cost;
          }
        } else if (label.includes('/upgrades/crit')) {
          newOverclockChance += 0.01; // Assume +1% chance per upgrade
        } else if (label.includes('/upgrades/chain')) {
          newForkChance += 0.01; // Assume +1% chance per upgrade
        }

        const newAvgPower = (newMin + newMax) / 2;
        const newOverclockMultiplier = 1 + newOverclockChance;
        const newForkMultiplier = 2 / (2 - newForkChance);

        const newDPS = newAvgPower / newClockSpeed * newOverclockMultiplier * newForkMultiplier;

        const dpsGain = newDPS - baseDPS;
        const ratio = dpsGain / cost;

        // add label to reflect new info
        let infoText = button.parentElement.parentElement.parentElement.querySelector(`span[data-tag="${button.parentElement.action}"]`);
        if (!infoText) {
          infoText = document.createElement('span');
          infoText.dataset.tag = button.parentElement.action;
          button.parentElement.parentElement.parentElement.insertBefore(infoText, button.parentElement.parentElement);
        }
        infoText.textContent = `+${dpsGain.toFixed(2)} DPS (${ratio.toFixed(2)} DPS/DC)`;

        upgrades.push({
          button,
          label,
          cost,
          dpsGain,
          ratio,
          isDisabled
        });
      });
    });

    if (upgrades.length === 0) {
      console.log('[Upgrade] No upgrades found.');
      navigateElsewhere();
      return;
    }

    // Check Clock Speed and Overclocking special rules
    const speedUpgrades = upgrades.filter(u => u.label.includes('speed'));
    const hasClockSpeedUpgrade = speedUpgrades.length > 0;

    if (hasClockSpeedUpgrade) {
      // clock speed not maxed
      // only buy at most one point in each
      const overclockUpgrades = upgrades.filter(u => u.label.includes('label'));
      const forkUpgrades = upgrades.filter(u => u.label.includes('chain'));

      overclockUpgrades.forEach(u => {
        if ((overclockChance === 0) && u.cost <= cheapest) {
          u.ratio += 9999; // Prioritize if 0% chance and cheapest
        }
      });
      forkUpgrades.forEach(u => {
        if ((forkChance === 0) && u.cost <= cheapest) {
          u.ratio += 9999; // Prioritize if 0% chance and cheapest
        }
      });
    } else {
      // clock speed maxed
      // use normal ratios
    }

    // Pick the best ratio
    upgrades.sort((a, b) => b.ratio - a.ratio);

    localStorage.setItem('upgrades', JSON.stringify(upgrades));

    const best = upgrades[0];
    if (best.isDisabled) {
      console.log(`[Upgrade] Best upgrade (${best.label}) is disabled. Storing cost ${best.cost} and going back.`);
      localStorage.setItem('pendingUpgradeCost', best.cost);
      if (bestRCbutton.disabled) { // also make sure we're done upgrading RC
        navigateElsewhere();
      }
    } else {
      console.log(`[Upgrade] Clicking upgrade: ${best.label} | Cost ${best.cost} | DPS +${best.dpsGain.toFixed(4)}`);
      localStorage.removeItem('pendingUpgradeCost');
      best.button.click();
    }
  }

  function navigateElsewhere() {
    // navigate to achievements instead of clicking back
    const achievementsLink = Array.from(document.querySelectorAll('a.badge')).find(a =>
                                                                                   a.textContent.includes('ACHIEVEMENTS'));
    if (achievementsLink) {
      console.log('[Upgrade] Navigating to /achievements because badge is active.');
      window.location.href = achievementsLink.href || '/achievements';
      return;
    }
    window.location.href = '/';
  }
})();