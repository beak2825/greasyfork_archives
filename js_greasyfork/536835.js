// ==UserScript==
// @name         Torn Ranked War Calculator
// @namespace    https://greasyfork.org/en/users/1431907-theeeunknown
// @version      1.3
// @description  Calculates ranked war targets, with auto-calculated desired target based on score difference, and UTC timings.
// @author       TR0LL
// @match        https://www.torn.com/factions.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536835/Torn%20Ranked%20War%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/536835/Torn%20Ranked%20War%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* CSS from v1.1/v1.2 - minor tweaks for readonly if needed */
        #warCalcContainer {
            position: fixed; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;
            border-radius: 12px; padding: 0; margin: 0; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; z-index: 999999; width: 380px;
            max-height: 90vh; display: flex; flex-direction: column; top: 100px; right: 10px;
        }
        #warCalcHeader {
            padding: 15px 20px; background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(255,255,255,0.1);
            cursor: grab; border-top-left-radius: 12px; border-top-right-radius: 12px; user-select: none;
        }
        #warCalcHeader:active { cursor: grabbing; }
        #warCalcHeader h3 { margin: 0; font-size: 18px; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.4); }
        #warCalcContent { padding: 15px 20px 20px 20px; overflow-y: auto; flex-grow: 1; }
        #warCalcContent::-webkit-scrollbar { width: 8px; }
        #warCalcContent::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; }
        #warCalcContent::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 10px; }
        #warCalcContent::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.5); }
        .war-calc-input-section { background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.1); }
        .war-calc-input-section label { display: block; font-weight: 500; margin-bottom: 8px; font-size: 13px; color: rgba(255,255,255,0.85); }
        #warAnnounceInput, .input-row input[type="text"], .input-row input[type="number"], #initialTargetScore, #desiredFinalTargetScore {
            width: 100%; padding: 10px; border: none; border-radius: 6px; background: rgba(0,0,0,0.2); color: #fff;
            font-size: 13px; box-sizing: border-box; font-family: inherit;
        }
        #warAnnounceInput { resize: vertical; min-height: 60px; margin-bottom:12px; }
        #initialTargetScore { margin-bottom: 12px; }
        #desiredFinalTargetScore { margin-bottom: 12px; }
        input[readonly] {
            background: rgba(0,0,0,0.3) !important; /* Darker for readonly */
            color: #bbb !important; /* Greyer text for readonly */
            cursor: not-allowed;
        }
        .input-row { display: flex; gap: 15px; margin-bottom: 12px; }
        .input-row > div { flex: 1; }
        #warCalcButton, #resetWarCalcButton {
            color: white; border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;
            cursor: pointer; margin-top: 10px; width: 100%; transition: all 0.2s ease-in-out;
            font-size: 14px; text-transform: uppercase;
        }
        #warCalcButton { background: linear-gradient(45deg, #28a745, #218838); }
        #warCalcButton:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 6px 15px rgba(0,0,0,0.25); background: linear-gradient(45deg, #2ebf4e, #259d40); }
        #resetWarCalcButton { background: linear-gradient(45deg, #dc3545, #c82333); margin-top: 8px; }
        #resetWarCalcButton:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 6px 15px rgba(0,0,0,0.25); background: linear-gradient(45deg, #e04b59, #d32f3f); }
        #warCalcDisplay { background: rgba(0,0,0,0.1); border-radius: 8px; padding: 10px 15px; margin-top: 15px; border: 1px solid rgba(255,255,255,0.1); }
        .faction-scores { display: flex; justify-content: space-around; align-items: center; margin-bottom: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px 10px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .faction-score { text-align: center; flex: 1; padding: 0 5px; }
        .faction-name { display: block; font-size: 12px; opacity: 0.85; margin-bottom: 5px; word-break: break-word; color: rgba(255,255,255,0.8); font-weight: 500; }
        .score { display: block; font-size: 22px; font-weight: 700; text-shadow: 1px 1px 2px rgba(0,0,0,0.4); }
        .vs { font-size: 16px; font-weight: bold; margin: 0 10px; opacity: 0.7; flex-shrink: 0; }
        .info-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 5px; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 13px; }
        .info-row:last-child { border-bottom: none; }
        .info-row span:first-child { opacity: 0.85; color: rgba(255,255,255,0.8); }
        .info-row.highlight { background: rgba(255,255,255,0.08); margin: 5px -5px; padding: 10px; border-radius: 6px; font-weight: bold; }
        .info-row.highlight .info-value { font-size: 14px; }
        .info-row.success { background: rgba(40, 167, 69, 0.2); margin: 5px -5px; padding: 10px; border-radius: 6px; color: #a0e0a0; }
        .info-row.success .info-value { font-weight: bold; color: #c0f0c0; }
        .info-value { font-weight: 600; text-align: right; word-break: break-word; color: #fff; }
        .status-badge { display: inline-block; padding: 5px 10px; border-radius: 15px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-badge.active { background: #28a745; color: white; }
        .status-badge.ended { background: #dc3545; color: white; }
        .status-badge.waiting { background: #ffc107; color: #212529; }
        .decayed { color: #ffae42 !important; }
        .error-message { color: #f8d7da; background-color: rgba(220, 53, 69, 0.3); border: 1px solid rgba(220, 53, 69, 0.5); border-radius: 6px; padding: 12px; margin-top: 15px; font-size: 13px; text-align: left; }
        .status-message { text-align: center; padding: 20px 10px; font-size: 14px; opacity: 0.7; color: rgba(255,255,255,0.7); }
    `);

    const container = document.createElement('div');
    container.id = 'warCalcContainer';

    container.innerHTML = `
        <div id="warCalcHeader">
            <h3>🎯 Ranked War Calculator</h3>
        </div>
        <div id="warCalcContent">
            <div class="war-calc-input-section">
                <label for="warAnnounceInput">War Announcement:</label>
                <textarea id="warAnnounceInput" placeholder="Paste: ... between Faction A and Faction B ... on Sat 14:00:00 - 24/05/25"></textarea>

                <label for="initialTargetScore">Initial Target Score:</label>
                <input type="number" id="initialTargetScore" placeholder="e.g., 13200">

                <label for="desiredFinalTargetScore">Desired Final Target (Auto: A Score - B Score):</label>
                <input type="number" id="desiredFinalTargetScore" placeholder="Auto-calculated" readonly> <div class="input-row">
                    <div>
                        <label for="factionAName">Faction A Name:</label>
                        <input type="text" id="factionAName" placeholder="Auto from paste" readonly> </div>
                    <div>
                        <label for="factionAScore">Faction A Score:</label>
                        <input type="number" id="factionAScore" placeholder="0">
                    </div>
                </div>

                <div class="input-row">
                    <div>
                        <label for="factionBName">Faction B Name:</label>
                        <input type="text" id="factionBName" placeholder="Auto from paste" readonly> </div>
                    <div>
                        <label for="factionBScore">Faction B Score:</label>
                        <input type="number" id="factionBScore" placeholder="0">
                    </div>
                </div>
                <button id="warCalcButton">Process & Calculate</button>
                <button id="resetWarCalcButton">Clear & Reset</button>
            </div>

            <div id="warCalcDisplay">
                <div class="status-message">Enter war announcement above to calculate.</div>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    // --- DRAGGABLE LOGIC --- (Same as before)
    const header = document.getElementById('warCalcHeader');
    let isDragging = false; let currentX_drag, currentY_drag, initialX_drag, initialY_drag;
    const savedLeft = GM_getValue('assistantPosX', null); const savedTop = GM_getValue('assistantPosY', null);
    if (savedLeft !== null && savedTop !== null) { container.style.left = savedLeft; container.style.top = savedTop; container.style.right = 'auto';}
    header.addEventListener('mousedown', (e) => { if (e.button !== 0) return; if (container.style.right !=='auto' && container.style.right !== '') { container.style.left = container.offsetLeft + 'px'; container.style.right = 'auto'; } initialX_drag = e.clientX - (parseFloat(container.style.left) || 0); initialY_drag = e.clientY - (parseFloat(container.style.top) || 0); isDragging = true; });
    document.addEventListener('mousemove', (e) => { if (isDragging) { e.preventDefault(); currentX_drag = e.clientX - initialX_drag; currentY_drag = e.clientY - initialY_drag; container.style.left = currentX_drag + "px"; container.style.top = currentY_drag + "px"; } });
    document.addEventListener('mouseup', (e) => { if (e.button !== 0 && isDragging) return; if (isDragging) { GM_setValue('assistantPosX', container.style.left); GM_setValue('assistantPosY', container.style.top); isDragging = false; } });

    // --- CORE SCRIPT LOGIC ---
    const warInfoPasteEl = document.getElementById('warAnnounceInput');
    const initialTargetScoreEl = document.getElementById('initialTargetScore');
    const desiredFinalTargetScoreEl = document.getElementById('desiredFinalTargetScore');
    const factionANameEl = document.getElementById('factionAName');
    const factionAScoreEl = document.getElementById('factionAScore');
    const factionBNameEl = document.getElementById('factionBName');
    const factionBScoreEl = document.getElementById('factionBScore');
    const calculateButton = document.getElementById('warCalcButton');
    const resetButton = document.getElementById('resetWarCalcButton');
    const displayDiv = document.getElementById('warCalcDisplay');

    // Make fields readonly
    desiredFinalTargetScoreEl.readOnly = true;
    factionANameEl.readOnly = true;
    factionBNameEl.readOnly = true;

    let warStartDate = null;
    let originalTargetScore = 0;
    // desiredTargetForDecayCalc is not needed as a separate state variable,
    // it will be read from desiredFinalTargetScoreEl.value which is updated dynamically.
    let intervalId = null;

    warInfoPasteEl.value = GM_getValue('warInfoPaste', '');
    initialTargetScoreEl.value = GM_getValue('initialTargetScore', '');
    // desiredFinalTargetScoreEl is readonly, its value will be calculated, no need to load for input.
    factionANameEl.value = GM_getValue('factionAName', '');
    factionAScoreEl.value = GM_getValue('factionAScore', '0');
    factionBNameEl.value = GM_getValue('factionBName', '');
    factionBScoreEl.value = GM_getValue('factionBScore', '0');


    function parseWarInfo(info) { /* ... (same as v1.2) ... */
        let startDate = null, factionAName = null, factionBName = null;
        const dateTimeMatch = info.match(/(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s(\d{2}:\d{2}:\d{2})\s-\s(\d{2})\/(\d{2})\/(\d{2})/);
        if (dateTimeMatch) { const time = dateTimeMatch[2]; const day = parseInt(dateTimeMatch[3],10); const month = parseInt(dateTimeMatch[4],10)-1; const year = parseInt("20"+dateTimeMatch[5],10); const [h,m,s]=time.split(':').map(Number); startDate = new Date(Date.UTC(year,month,day,h,m,s));
        } else { const dtf = info.match(/(\d{2}:\d{2}:\d{2})\s-\s(\d{2})\/(\d{2})\/(\d{2})/); if (dtf) { const t=dtf[1]; const d=parseInt(dtf[2],10); const mo=parseInt(dtf[3],10)-1; const y=parseInt("20"+dtf[4],10); const [h,m,s]=t.split(':').map(Number); startDate = new Date(Date.UTC(y,mo,d,h,m,s)); } }
        const factionMatch = info.match(/between\s(.*?)\sand\s(.*?)\swill begin/i); if (factionMatch) { factionAName = factionMatch[1].trim(); factionBName = factionMatch[2].trim(); }
        return { startDate, factionAName, factionBName };
    }
    function formatTimeDifference(ms, showSeconds = true, forNextDrop = false) { /* ... (same as v1.2) ... */
        if (ms < 0) return forNextDrop ? "Now" : (showSeconds ? "Passed" : "Active");
        let totalS = Math.floor(ms/1000); let d=Math.floor(totalS/(24*60*60)); totalS%=(24*60*60); let h=Math.floor(totalS/(60*60)); totalS%=(60*60); let m=Math.floor(totalS/60); let s=totalS%60;
        let r=[]; if(d>0)r.push(`${d}d`); if(h>0||(d>0&&(m>0||s>0||showSeconds)))r.push(`${h}h`); if(m>0||((h>0||d>0)&&(s>0||showSeconds)))r.push(`${m}m`); if(showSeconds||(d===0&&h===0&&m===0))r.push(`${s}s`);
        return r.length>0?r.join(' '):(forNextDrop?"Now":(showSeconds?"0s":"Just started"));
    }
    function toCustomUTCString(dateObj) { /* ... (same as v1.2) ... */
        if(!dateObj||!(dateObj instanceof Date)||isNaN(dateObj.getTime()))return"N/A"; const p=(n)=>String(n).padStart(2,'0'); const h=p(dateObj.getUTCHours()),m=p(dateObj.getUTCMinutes()),s=p(dateObj.getUTCSeconds()); const d=p(dateObj.getUTCDate()),M=p(dateObj.getUTCMonth()+1),y=dateObj.getUTCFullYear(); return`${h}:${m}:${s} ${d}/${M}/${y} (UTC)`;
    }

    function updateDisplay() {
        // Auto-calculate "Desired Final Target" from score difference
        const facAScore = parseInt(factionAScoreEl.value, 10) || 0;
        const facBScore = parseInt(factionBScoreEl.value, 10) || 0;
        desiredFinalTargetScoreEl.value = facAScore - facBScore; // As requested

        if (!warStartDate || isNaN(warStartDate.getTime()) || !originalTargetScore) {
            displayDiv.innerHTML = '<div class="status-message">Awaiting valid inputs or calculation.</div>';
            return;
        }

        const now = new Date(); const timeElapsedMs = now.getTime() - warStartDate.getTime();
        const totalAchievedScore = facAScore + facBScore; // This is their actual combined score

        let currentTarget = originalTargetScore; let warStatusClass = "waiting"; let statusText = "";
        let timeToDecayText = ""; let totalPercentageDecayApplied = 0;

        const twentyFourHoursMs = 24*60*60*1000; const decayStartTimestamp = warStartDate.getTime() + twentyFourHoursMs;
        const timeToDecayMs = decayStartTimestamp - now.getTime();

        if (timeElapsedMs < 0) {
            warStatusClass = "waiting"; statusText = `Starts in ${formatTimeDifference(-timeElapsedMs)}`;
            timeToDecayText = `N/A (War not started)`;
        } else {
            warStatusClass = timeElapsedMs > 123*60*60*1000 ? "ended" : "active";
            statusText = `${formatTimeDifference(timeElapsedMs, false)} elapsed`;
            if (timeToDecayMs > 0) {
                timeToDecayText = `Decay starts in ${formatTimeDifference(timeToDecayMs)} (at ${toCustomUTCString(new Date(decayStartTimestamp))})`;
            } else {
                const hoursIntoDecayPeriod = Math.floor(-timeToDecayMs/(60*60*1000));
                totalPercentageDecayApplied = Math.min(hoursIntoDecayPeriod*1, 99);
                if (hoursIntoDecayPeriod > 0) currentTarget = Math.max(0, originalTargetScore*(1-(totalPercentageDecayApplied/100)));
                const msIntoCurrentDecayHourBlock = (-timeToDecayMs)%(60*60*1000);
                const msUntilNextDrop = (60*60*1000) - msIntoCurrentDecayHourBlock;
                const timeToNextDropStr = totalPercentageDecayApplied < 99 ? formatTimeDifference(msUntilNextDrop, true, true) : "Max decay";
                timeToDecayText = `Active (Since ${toCustomUTCString(new Date(decayStartTimestamp))}). Next drop: ${timeToNextDropStr}. Total: ${totalPercentageDecayApplied}% decayed.`;
            }
        }

        const scoreNeededForCurrentTarget = currentTarget - totalAchievedScore;
        const approxWarEndTimestamp = warStartDate.getTime() + (123*60*60*1000);

        let timeToDesiredTargetText = "";
        const desiredTargetVal = parseFloat(desiredFinalTargetScoreEl.value); // This is now A_score - B_score

        if (isNaN(desiredTargetVal)) {
            timeToDesiredTargetText = "N/A (Scores not set)";
        } else if (originalTargetScore > 0 && desiredTargetVal > 0 && desiredTargetVal < originalTargetScore) {
            const targetReductionNeeded = originalTargetScore - desiredTargetVal;
            const decayAmountPerHour = originalTargetScore * 0.01;
            if (decayAmountPerHour > 0) {
                const hoursOfDecayNeeded = Math.ceil(targetReductionNeeded / decayAmountPerHour);
                const totalTimeUntilDesiredTargetMs = twentyFourHoursMs + (hoursOfDecayNeeded * 60*60*1000);
                const desiredTargetReachedTimestamp = warStartDate.getTime() + totalTimeUntilDesiredTargetMs;
                const timeFromNowToDesiredTargetMs = desiredTargetReachedTimestamp - now.getTime();
                if (timeFromNowToDesiredTargetMs < 0) {
                    timeToDesiredTargetText = `Would've decayed to ${desiredTargetVal.toLocaleString()} at ${toCustomUTCString(new Date(desiredTargetReachedTimestamp))}`;
                } else {
                    timeToDesiredTargetText = `To ${desiredTargetVal.toLocaleString()}: In ${formatTimeDifference(timeFromNowToDesiredTargetMs)} (at ${toCustomUTCString(new Date(desiredTargetReachedTimestamp))})`;
                }
            } else { timeToDesiredTargetText = "N/A (Initial target won't decay)"; }
        } else if (desiredTargetVal > 0 && desiredTargetVal >= originalTargetScore) {
            timeToDesiredTargetText = "N/A (Score diff. >= Initial Target)";
        } else { // Handles desiredTargetVal <= 0
            timeToDesiredTargetText = "N/A (Score diff. not positive or too low)";
        }

        displayDiv.innerHTML = `
            <div class="faction-scores">
                <div class="faction-score"><span class="faction-name">${factionANameEl.value||"Faction A"}</span><span class="score">${facAScore.toLocaleString()}</span></div>
                <div class="vs">VS</div>
                <div class="faction-score"><span class="faction-name">${factionBNameEl.value||"Faction B"}</span><span class="score">${facBScore.toLocaleString()}</span></div>
            </div>
            <div class="info-row"><span>War Status:</span><span class="info-value"><span class="status-badge ${warStatusClass}">${statusText}</span></span></div>
            <div class="info-row"><span>War Start (UTC):</span><span class="info-value">${toCustomUTCString(warStartDate)}</span></div>
            <div class="info-row"><span>Max End (UTC):</span><span class="info-value">${toCustomUTCString(new Date(approxWarEndTimestamp))}</span></div>
            <div class="info-row"><span>Target Decay:</span><span class="info-value">${timeToDecayText}</span></div>
            <div class="info-row"><span>Decay to Score Diff. (${desiredTargetVal.toLocaleString()}):</span><span class="info-value">${timeToDesiredTargetText}</span></div>
            <div class="info-row"><span>Initial Target:</span><span class="info-value">${originalTargetScore.toLocaleString()}</span></div>
            <div class="info-row highlight"><span>Current Target:</span><span class="info-value ${currentTarget < originalTargetScore && timeElapsedMs >= twentyFourHoursMs ? 'decayed' : ''}">${Math.round(currentTarget).toLocaleString()}</span></div>
            <div class="info-row ${scoreNeededForCurrentTarget <= 0 ? 'success' : ''}"><span>Score Needed (to current target):</span><span class="info-value">${scoreNeededForCurrentTarget <= 0 ? 'TARGET MET! 🎉' : Math.round(scoreNeededForCurrentTarget).toLocaleString()}</span></div>
        `;
    }

    function clearAndReset() {
        if (intervalId) clearInterval(intervalId); intervalId = null;
        warInfoPasteEl.value = ''; initialTargetScoreEl.value = ''; desiredFinalTargetScoreEl.value = '';
        factionANameEl.value = ''; factionAScoreEl.value = '0';
        factionBNameEl.value = ''; factionBScoreEl.value = '0';
        warStartDate = null; originalTargetScore = 0;
        const keysToClear = ['warInfoPaste', 'initialTargetScore', /*desiredFinalTargetScore is not user set*/ 'factionAName', 'factionAScore', 'factionBName', 'factionBScore'];
        keysToClear.forEach(key => GM_setValue(key, (key.includes('Score') && !key.includes('initial')) ? '0' : ''));
        GM_setValue('desiredFinalTargetScore', ''); // Clear this one specifically if it was saved before, though it's readonly now.

        displayDiv.innerHTML = '<div class="status-message">Enter war announcement above to calculate.</div>';
        console.log("War Calculator Reset.");
    }
    resetButton.addEventListener('click', clearAndReset);

    calculateButton.addEventListener('click', () => {
        if (intervalId) clearInterval(intervalId);
        const pastedInfoFull = warInfoPasteEl.value;
        const parsedInfo = parseWarInfo(pastedInfoFull);
        warStartDate = parsedInfo.startDate;
        originalTargetScore = parseFloat(initialTargetScoreEl.value);
        // desiredFinalTargetScoreEl.value is set in updateDisplay based on scores

        if (parsedInfo.factionAName && (!factionANameEl.value || factionANameEl.placeholder.includes(factionANameEl.value))) factionANameEl.value = parsedInfo.factionAName;
        if (parsedInfo.factionBName && (!factionBNameEl.value || factionBNameEl.placeholder.includes(factionBNameEl.value))) factionBNameEl.value = parsedInfo.factionBName;

        if (!warStartDate || isNaN(warStartDate.getTime())) { displayDiv.innerHTML = '<div class="error-message">Error: Could not parse war start time.</div>'; return; }
        if (isNaN(originalTargetScore) || originalTargetScore <= 0) { displayDiv.innerHTML = '<div class="error-message">Error: Initial target score must be a positive number.</div>'; return; }
        if (!factionANameEl.value || !factionBNameEl.value) { displayDiv.innerHTML = '<div class="error-message">Error: Faction names not set (try pasting announcement).</div>'; return; }

        GM_setValue('warInfoPaste', pastedInfoFull);
        GM_setValue('initialTargetScore', initialTargetScoreEl.value);
        GM_setValue('factionAName', factionANameEl.value);
        GM_setValue('factionAScore', factionAScoreEl.value);
        GM_setValue('factionBName', factionBNameEl.value);
        GM_setValue('factionBScore', factionBScoreEl.value);
        // No need to GM_setValue for desiredFinalTargetScoreEl.value as it's derived

        try { /* ... (page scraping, same as v1.2) ... */
             if (window.location.href.includes("factions.php")) {
                if (!initialTargetScoreEl.value || parseFloat(initialTargetScoreEl.value) <= 0) {
                    const leadTargetElement = Array.from(document.querySelectorAll('div, span')).find(el => el.textContent && el.textContent.includes('/') && el.offsetParent !== null && el.offsetWidth > 30 && el.offsetHeight > 10 );
                    if (leadTargetElement) { const parts = leadTargetElement.textContent.match(/[\d,]+\s*\/\s*([\d,]+)/); if (parts && parts[1]) { const targetVal = parseInt(parts[1].replace(/,/g, '').trim(), 10); if (!isNaN(targetVal) && targetVal > 0) { initialTargetScoreEl.value = targetVal; originalTargetScore = targetVal; } } }
                }
            }
        } catch (e) { console.warn("War Calculator: Auto-fill from page failed.", e); }

        updateDisplay(); intervalId = setInterval(updateDisplay, 1000);
    });

    if (GM_getValue('warInfoPaste', '') && GM_getValue('initialTargetScore', '')) {
       setTimeout(() => {
            const autoPInfo = parseWarInfo(GM_getValue('warInfoPaste', ''));
            const autoTScore = parseFloat(GM_getValue('initialTargetScore', ''));
            if (autoPInfo.startDate && !isNaN(autoPInfo.startDate.getTime()) && autoTScore > 0) {
                 calculateButton.click();
            } else { displayDiv.innerHTML = '<div class="status-message">Loaded data incomplete/invalid. Check inputs & Process.</div>'; }
       }, 250);
    }

    // Event listeners for live input changes
    [factionAScoreEl, factionBScoreEl].forEach(el => {
        el.addEventListener('input', () => {
            // Recalculate desiredFinalTargetScoreEl and update display immediately
            const facAScoreVal = parseInt(factionAScoreEl.value, 10) || 0;
            const facBScoreVal = parseInt(factionBScoreEl.value, 10) || 0;
            desiredFinalTargetScoreEl.value = facAScoreVal - facBScoreVal;

            if (warStartDate && !isNaN(warStartDate.getTime()) && originalTargetScore > 0) {
                GM_setValue(el.id === 'factionAScore' ? 'factionAScore' : 'factionBScore', el.value);
                updateDisplay();
            }
        });
    });

    // Only need to save for initial target and paste on change, others are readonly or handled by score inputs.
    [initialTargetScoreEl, warInfoPasteEl].forEach(el => {
        el.addEventListener('change', () => {
            const keyMap = {'initialTargetScore': 'initialTargetScore', 'warAnnounceInput': 'warInfoPaste'};
            if (keyMap[el.id]) GM_setValue(keyMap[el.id], el.value);
            if (warInfoPasteEl.value && initialTargetScoreEl.value && parseFloat(initialTargetScoreEl.value) > 0) {
                calculateButton.click();
            }
        });
    });
    console.log("Torn Ranked War Calculator (Inspired Design v1.3) Loaded.");
})();