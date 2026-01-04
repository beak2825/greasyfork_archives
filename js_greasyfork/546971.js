// ==UserScript==
// @name         Torn City All Effects Display
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display all item effects with color coding based on value ranges in the item market
// @author       JoJoFoxx
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546971/Torn%20City%20All%20Effects%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/546971/Torn%20City%20All%20Effects%20Display.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration
    let displayEnabled = localStorage.getItem('allEffectsDisplayEnabled') !== 'false';
    // Effect value ranges and color coding (from game data)
    const effectRanges = {
  'blindfire':   { min: 15, max: 20, excellent: 19, good: 18, decent: 17 },
  burn:        { min: 30, max: 50, excellent: 45, good: 40, decent: 35 },
  demoralized: { min: 20, max: 23, excellent: 23, good: 22, decent: 21 },
  emasculate:  { min: 15, max: 16, excellent: 16, good: 15 },
  freeze:      { min: 20, max: 26, excellent: 25, good: 23, decent: 22 },
  hazardous:   { min: 20, max: 31, excellent: 30, good: 25, decent: 22 },
  laceration:  { min: 35, max: 45, excellent: 43, good: 40, decent: 38 },
  "severe burning": { min: 100, max: 100, excellent: 100, good: 100, decent: 100 },
  smash:       { min: 100, max: 100} ,
  spray:       { min: 20, max: 24, excellent: 23, good: 22, decent: 21 },
  storage:     { min: 2, max: 2, excellent: 2 },
  toxin:       { min: 30, max: 44, excellent: 42, good: 38, decent: 35 },
  shock:       { min: 75, max: 100, excellent: 88, good: 85, decent: 83 },
  poison:      { min: 85, max: 100, excellent: 98, good: 93, decent: 90 },
  // Extended list
  achilles:    { min: 50, max: 149, excellent: 125, good: 100, decent: 75 },
  assassinate: { min: 50, max: 148, excellent: 125, good: 80, decent: 60 },
  backstab:    { min: 30, max: 96, excellent: 80, good: 44, decent: 35 },
  berserk:     { min: 20, max: 87,excellent: 82, good: 42,decent: 25 },
  bleed:       { min: 20, max: 67, excellent: 60, good: 50, decent: 40 },
  blindside:   { min: 25, max: 96, excellent: 90, good: 75, decent: 55 },
  bloodlust:   { min: 10, max: 17, excellent: 16, good: 14.5, decent: 13 },
  comeback:    { min: 50, max: 127, excellent: 110, good: 95, decent: 75 },
  conserve:    { min: 25, max: 49, excellent: 44, good: 40, decent: 34 },
  cripple:     { min: 20, max: 58, excellent: 52, good: 45, decent: 35 },
  crusher:     { min: 50, max: 133, excellent: 120, good: 100, decent: 80 },
  cupid:       { min: 50, max: 157, excellent: 140, good: 120, decent: 95 },
  deadeye:     { min: 25, max: 123, excellent: 110, good: 90, decent: 70 },
  deadly:      { min:  2, max: 10, excellent: 9, good: 7, decent: 5 },
  disarm:      { min:  3, max: 15, excellent: 13, good: 10, decent: 7 }, // turns, not %
  "double-edged": { min: 10, max: 32, excellent: 28, good: 24, decent: 18 },
  "double tap":   { min: 15, max: 54, excellent: 48, good: 40, decent: 30 },
  empower:     { min: 50, max: 206, excellent: 180, good: 150, decent: 120 },
  eviscerate:  { min: 15, max: 34, excellent: 30, good: 26, decent: 21 },
  execute:     { min: 15, max: 29, excellent: 26, good: 23, decent: 20 },
  expose:      { min:  7, max: 21, excellent: 19, good: 16, decent: 13 },
  finale:      { min: 10, max: 17, excellent: 16, good: 14, decent: 12 },
  focus:       { min: 15, max: 32, excellent: 28, good: 24, decent: 20 },
  frenzy:      { min:  5, max: 14, excellent: 13, good: 11, decent: 9 },
  fury:        { min: 10, max: 34, excellent: 30, good: 26, decent: 22 },
  grace:       { min: 20, max: 66, excellent: 60, good: 50, decent: 40 },
  "home run":  { min: 50, max: 93, excellent: 85, good: 75, decent: 65 },
  irradiate:   { min: 100, max: 100, excellent: 100, good: 100, decent: 100 },
  motivation:  { min: 15, max: 35, excellent: 26, good: 21, decent: 15 },
  paralyze:    { min:  5, max: 18, excellent: 16, good: 13, decent: 10 },
  parry:       { min: 50, max: 92, excellent: 85, good: 75, decent: 65 },
  penetrate:   { min: 25, max: 49, excellent: 44, good: 40, decent: 34 },
  plunder:     { min: 20, max: 49, excellent: 44, good: 38, decent: 32 },
  powerful:    { min: 15, max: 49, excellent: 44, good: 36, decent: 28 },
  proficience: { min: 20, max: 59, excellent: 52, good: 45, decent: 35 },
  puncture:    { min: 20, max: 57, excellent: 50, good: 43, decent: 33 },
  quicken:     { min: 50, max: 219, excellent: 190, good: 160, decent: 130 },
  rage:        { min:  4, max: 18, excellent: 13, good: 7, decent: 5 },
  revitalize:  { min: 10, max: 24, excellent: 21, good: 18, decent: 15 },
  roshambo:    { min: 50, max: 132, excellent: 118, good: 100, decent: 80 },
  slow:        { min: 20, max: 64, excellent: 58, good: 50, decent: 40 },
  smurf:       { min:  1, max:  4, excellent: 4, good: 3, decent: 2},
  specialist:  { min: 20, max: 59, excellent: 52, good: 45, decent: 35 },
  stricken:    { min: 30, max: 96, excellent: 90, good: 80, decent: 60 },
  stun:        { min: 10, max: 40, excellent: 36, good: 30, decent: 24 },
  suppress:    { min: 25, max: 49, excellent: 44, good: 40, decent: 34 },
  "sure shot": { min:  3, max: 11, excellent: 10, good: 8, decent: 6 },
  throttle:    { min: 50, max: 170, excellent: 150, good: 120, decent: 90 },
  warlord:     { min: 15, max: 38, excellent: 34, good: 30, decent: 24 },
  weaken:      { min: 20, max: 63, excellent: 58, good: 50, decent: 40 },
  "wind-up":   { min:125, max: 221, excellent: 200, good: 180, decent: 160 },
  wither:      { min: 20, max: 63, excellent: 58, good: 50, decent: 40 }
};


     // Get color based on effect value and type using actual ranges
    function getEffectColor(effectName, value) {
        const aliases = {
            "poisoned": "poison",
            "paralyzed": "paralyze",
            "severe burning": "severe burning", // explicit, just in case
            "home-run": "home run",
            "double edged": "double-edged",
            "doubletap": "double tap",
            "wind up": "wind-up"
        };
        const key = (aliases[effectName.toLowerCase()] || effectName.toLowerCase());
        const range = effectRanges[key];

        if (!range) {
            // Fallback for unknown effects
            if (value >= 18) return { color: '#22c55e', quality: 'excellent' };
            if (value >= 16) return { color: '#eab308', quality: 'good' };
            if (value >= 14) return { color: '#f97316', quality: 'decent' };
            if (value >= effectRanges.excellent) return { color: '#e737ed', quality: 'God-tier'};
            return { color: '#ef4444', quality: 'poor' };
        }

        if (value >= range.excellent) {
            return { color: '#e737ed', quality: 'excellent' }; // Green
        } else if (value >= range.good) {
            return { color: '#22c55e', quality: 'good' }; // Yellow
        } else if (value >= range.decent) {
            return { color: '#eab308', quality: 'decent' }; // Orange
        } else if (value > 0) {
            return { color: '#f97316', quality: 'poor' }; // Red
        } else {
            return { color: '#9ca3af', quality: 'unknown' }; // Gray
        }
    }

    // Parse effect description to extract value
    function parseEffectValue(description) {
        if (!description) return 0;

        // Look for percentage values first (most common)
        const percentMatch = description.match(/(\d+)%/);
        if (percentMatch) {
            return parseInt(percentMatch[1]);
        }

        // Look for other numeric values (like +5, 3.2, etc.)
        const numberMatch = description.match(/[+]?(\d+(?:\.\d+)?)/);
        if (numberMatch) {
            return parseFloat(numberMatch[1]);
        }

        return 0;
    }

    // Create effect display element
    function createEffectDisplay(effectElement) {
        const title = effectElement.getAttribute('data-bonus-attachment-title') || '';
        const description = effectElement.getAttribute('data-bonus-attachment-description') || '';

        const value = parseEffectValue(description);
        const colorData = getEffectColor(title, value);

        const display = document.createElement('span');
        display.className = 'effect-bonus-display';
        display.style.fontSize = '10px';
        display.style.fontWeight = 'bold';
        display.style.marginLeft = '3px';
        display.style.textShadow = '0 1px 2px rgba(0,0,0,0.8)';
        display.style.whiteSpace = 'nowrap';
        display.style.color = colorData.color;
        display.style.display = 'inline-block';
        display.style.lineHeight = '1.2';

        // Format display text - just name and value
        let displayText = title;
        if (value > 0) {
            // Show percentage if original description contains %, otherwise show raw value
            const isPercentage = description.includes('%');
            displayText += ` ${isPercentage ? `${value}%` : `${value}`}`;
        }

        display.textContent = displayText;
        display.title = `${title}: ${description}`;

        return display;
    }

    // Position multiple effects in a container
    function createEffectsContainer(effectElements, parentElement) {
        const container = document.createElement('div');
        container.className = 'effects-container';
        container.style.display = 'inline-block';
        container.style.marginLeft = '4px';
        container.style.verticalAlign = 'middle';
        container.style.lineHeight = '1';

        effectElements.forEach((effectElement, index) => {
            const display = createEffectDisplay(effectElement);
            container.appendChild(display);

            // Add line break between effects if there are multiple
            if (index < effectElements.length - 1) {
                const br = document.createElement('br');
                container.appendChild(br);
            }
        });

        return container;
    }

    // Position the display inline with effect elements
    function positionEffectsDisplay(container, firstEffectElement) {
        // Insert the container right after the last effect element
        const parent = firstEffectElement.parentNode;

        // Find all effect elements that are siblings
        const allEffects = Array.from(parent.querySelectorAll('[class*="bonus-attachment"]'));
        const lastEffect = allEffects[allEffects.length - 1];

        parent.insertBefore(container, lastEffect.nextSibling);
    }

    // Monitor for all effect elements
    function monitorAllEffects() {
        if (!displayEnabled) return;

        // Group effect elements by their parent container
        const processedContainers = new Set();

        const effectElements = document.querySelectorAll('[class*="bonus-attachment"]:not([data-effect-processed])');

        // Group effects by their parent container
        const effectsByContainer = new Map();

        effectElements.forEach(effectElement => {
            const parent = effectElement.parentElement;
            if (!effectsByContainer.has(parent)) {
                effectsByContainer.set(parent, []);
            }
            effectsByContainer.get(parent).push(effectElement);
        });

        // Process each container
        effectsByContainer.forEach((effects, parent) => {
            if (processedContainers.has(parent)) return;
            processedContainers.add(parent);

            // Mark all effects as processed
            effects.forEach(effect => {
                effect.setAttribute('data-effect-processed', 'true');
            });

            // Create and position effects container
            const container = createEffectsContainer(effects, parent);
            positionEffectsDisplay(container, effects[0]);

            // Add hover effects to all effect elements
            effects.forEach(effectElement => {
                effectElement.addEventListener('mouseenter', () => {
                    container.style.textShadow = '0 0 4px rgba(255,255,255,0.8)';
                    container.style.transform = 'scale(1.1)';
                });

                effectElement.addEventListener('mouseleave', () => {
                    container.style.textShadow = '0 1px 2px rgba(0,0,0,0.8)';
                    container.style.transform = 'scale(1)';
                });
            });
        });
    }

    // Remove all effect displays
    function removeAllEffectDisplays() {
        document.querySelectorAll('.effects-container').forEach(el => el.remove());
        document.querySelectorAll('[data-effect-processed]').forEach(el => {
            el.removeAttribute('data-effect-processed');
        });
    }

    // Create minimal toggle (optional - can be removed if you don't want any UI)
    function createToggle() {
        const toggle = document.createElement('div');
        toggle.style.position = 'fixed';
        toggle.style.top = '10px';
        toggle.style.left = '10px';
        toggle.style.zIndex = '10000';
        toggle.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toggle.style.padding = '4px 8px';
        toggle.style.borderRadius = '4px';
        toggle.style.fontSize = '11px';
        toggle.style.color = displayEnabled ? '#22c55e' : '#ef4444';
        toggle.style.cursor = 'pointer';
        toggle.style.userSelect = 'none';
        toggle.textContent = displayEnabled ? '✨ Effects ON' : '✨ Effects OFF';

        toggle.addEventListener('click', () => {
            displayEnabled = !displayEnabled;
            localStorage.setItem('allEffectsDisplayEnabled', displayEnabled);
            toggle.style.color = displayEnabled ? '#22c55e' : '#ef4444';
            toggle.textContent = displayEnabled ? '✨ Effects ON' : '✨ Effects OFF';

            if (!displayEnabled) {
                removeAllEffectDisplays();
            }
        });

        document.body.appendChild(toggle);
    }

    // Initialize
    function init() {
        // Only run on certain sections
        const allowedPaths = [
            "/page.php" // item market
        ];
        if (!allowedPaths.some(path => window.location.pathname.startsWith(path))) {
            return; // Do nothing on other pages
        }

        createToggle(); // Remove this line if you don't want the toggle

        // Run monitoring every 2 seconds
        setInterval(monitorAllEffects, 2000);

        // Also run on DOM changes
        const observer = new MutationObserver(() => {
            setTimeout(monitorAllEffects, 100);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial run
        setTimeout(monitorAllEffects, 1000);
    }

    // Start when page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        removeAllEffectDisplays();
    });

})();