// ==UserScript==
// @name         던담 커스텀 패널
// @namespace    http://tampermonkey.net/
// @version      14.1.3 // 다중 입력 기능 추가
// @description  던담 딜표에 커스텀패널을 추가함
// @author       ww99w & Gemini
// @match        https://dundam.xyz/character*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537372/%EB%8D%98%EB%8B%B4%20%EC%BB%A4%EC%8A%A4%ED%85%80%20%ED%8C%A8%EB%84%90.user.js
// @updateURL https://update.greasyfork.org/scripts/537372/%EB%8D%98%EB%8B%B4%20%EC%BB%A4%EC%8A%A4%ED%85%80%20%ED%8C%A8%EB%84%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[던담 시뮬] 스크립트 시작 (v14.1.3)');

    // 전역 스킬 정보 캐시
    let dundamSkillInfoCache = null;

    // --- 스타일 정의 (v14.1.2와 거의 동일, input type text 너비 조정) ---
    GM_addStyle(`
        .cc-part .sk.tr:has(.skcount) { cursor: pointer; transition: all 0.2s ease-in-out; }
        .sk.tr.sim-skill-modified { border: 1.5px solid #4CAF50 !important; box-shadow: 0 0 10px rgba(76, 175, 80, 0.3); }
        .sim-control-panel-row { width: 100%; box-sizing: border-box; padding-left: 54px; padding-right: 16px; margin-top: -4px; margin-bottom: 12px; }
        .sim-control-panel-container { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; padding: 12px 16px; box-sizing: border-box; background-color: #2c2e34; border-radius: 6px; border: 1px solid rgba(0, 0, 0, 0.4); box-shadow: 0 2px 6px rgba(0,0,0,0.35); }
        .sim-input-group { display: flex; align-items: center; gap: 6px; margin-right: 15px; }
        .sim-input-group .sim-label { color: #c0c0c0; font-size: 14px; font-weight: 500; }
        .sim-input-group input[type="number"], .sim-input-group input[type="text"] { /* type="text" 추가 */
            width: 100px; /* 여러 값 입력을 위해 너비 증가 */
            height: 32px; border: 1px solid #181818; background-color: #202225; color: #e0e0e0; border-radius: 4px;
            text-align: center; font-size: 14px; padding: 0 5px;
        }
        .sim-control-panel-container button { height: 32px; padding: 0 14px; border: 1px solid #505050; background-image: linear-gradient(to bottom, #525252, #454545); color: #e0e0e0; cursor: pointer; border-radius: 4px; font-size: 13px; font-weight: 500; transition: background-image 0.2s ease; }
        .sim-control-panel-container button:hover { background-image: linear-gradient(to bottom, #5e5e5e, #505050); }
        .sim-control-panel-container button.sim-apply-all-btn { margin-left: auto; }
        .sim-control-panel-container button.sim-reset-btn { border-color: #704040; background-image: linear-gradient(to bottom, #704040, #603030); }
        .sim-control-panel-container button.sim-reset-btn:hover { background-image: linear-gradient(to bottom, #804a4a, #704040); }
        .sim-input-group input[type="text"]::-webkit-outer-spin-button,
        .sim-input-group input[type="text"]::-webkit-inner-spin-button {
            -webkit-appearance: none; margin: 0;
        }
        .sim-input-group input[type="text"] { -moz-appearance: textfield; }
        .sim-skill-sub-info-container { display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; width: auto !important; height: 100% !important; }
        .sim-skill-sub-info-wrapper { display: flex; justify-content: center; align-items: center; gap: 8px; font-size: 11px; margin-top: 2px; line-height: 1.2; width: 100%; }
        .sim-cast-change-indicator, .sim-cooldown-indicator { white-space: nowrap; }
        .sim-cooldown-indicator { color: #999; }
        .sim-cast-change-indicator { font-weight: bold; }
        .sim-cast-change-indicator.positive { color: #77b67a; } .sim-cast-change-indicator.negative { color: #d96c6c; }
        .sim-skill-damage-change-indicator { font-weight: bold; margin-left: 6px; font-size: 12px; white-space: nowrap; }
        .sim-skill-damage-change-indicator.positive { color: #81c784; } .sim-skill-damage-change-indicator.negative { color: #e57373; }
        .sim-total-damage-change-indicator { font-size: 1.1rem; font-weight: bold; margin-left: 10px; }
        .sim-total-damage-change-indicator.positive { color: #81c784; } .sim-total-damage-change-indicator.negative { color: #e57373; }
    `);

    const parseDamageString = (text) => parseInt(String(text).replace(/,/g, ''), 10);
    const formatDamageNumber = (num) => Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    function getBaseCooldownData(forceRefresh = false) {
        if (!forceRefresh && dundamSkillInfoCache && Object.keys(dundamSkillInfoCache).length > 0) {
            return dundamSkillInfoCache;
        }
        const skillInfoTab = document.querySelector('.tab__content[name="스킬정보"]');
        if (!skillInfoTab) { console.warn('[던담 시뮬] getBaseCooldownData: "스킬정보" 탭 없음.'); return null; }
        const skillRows = skillInfoTab.querySelectorAll('.skinfo .sk.tr');
        if (skillRows.length === 0) { console.warn('[던담 시뮬] getBaseCooldownData: "스킬정보" 탭 내 스킬 행 없음.'); return null; }

        const parsedData = {};
        skillRows.forEach(row => {
            const nameEl = row.querySelector('.skn span');
            const cooldownEl = row.querySelector('.skc ul li.skt span.val');
            if (nameEl && cooldownEl) {
                const name = nameEl.textContent.trim();
                const cooldown = parseFloat(cooldownEl.textContent);
                if (name && !isNaN(cooldown)) parsedData[name] = { baseCooldown: cooldown };
            }
        });
        if (Object.keys(parsedData).length > 0) {
            dundamSkillInfoCache = parsedData;
            return dundamSkillInfoCache;
        }
        return null;
    }

    function toggleModifiedIndicator(skillRow) {
        const damageEl = skillRow.querySelector('.skl .val'), countEl = skillRow.querySelector('.skc-count-p > span');
        if (!damageEl || !countEl || !skillRow.dataset.originalDamage || !skillRow.dataset.originalReportedCasts) return;
        const currentDamage = parseDamageString(damageEl.textContent), currentCount = parseInt(countEl.textContent.replace('회', ''), 10);
        if (currentDamage !== parseInt(skillRow.dataset.originalDamage, 10) || currentCount !== parseInt(skillRow.dataset.originalReportedCasts, 10)) {
            skillRow.classList.add('sim-skill-modified');
        } else {
            skillRow.classList.remove('sim-skill-modified');
        }
    }

    function updateAllDisplayMetrics(currentDealTable) {
        const skillRows = currentDealTable.querySelectorAll('.cc-part .sk.tr');
        const mainTotalDamageDisplayEl = currentDealTable.querySelector('.hd-part .dval');
        if (!mainTotalDamageDisplayEl) return;
        let newTotalDamage = 0;
        skillRows.forEach(row => { if (row.querySelector('.skcount')) { const damageEl = row.querySelector('.skl .val'); if (damageEl) newTotalDamage += parseDamageString(damageEl.textContent); } });
        mainTotalDamageDisplayEl.textContent = formatDamageNumber(newTotalDamage);
        const totalSumRow = Array.from(skillRows).find(row => row.querySelector('.skn span')?.textContent === '총 합');
        if (totalSumRow) {
            const totalSumDamageEl = totalSumRow.querySelector('.skl .val');
            if (totalSumDamageEl) totalSumDamageEl.textContent = formatDamageNumber(newTotalDamage);
            const originalTotalDamage = parseFloat(currentDealTable.dataset.originalTotalDamage);
            const totalChangeIndicatorEl = totalSumRow.querySelector('.sim-total-damage-change-indicator');
            if (totalChangeIndicatorEl && originalTotalDamage > 0) {
                const totalChange = (newTotalDamage / originalTotalDamage - 1) * 100;
                if (Math.abs(totalChange) > 0.001) { totalChangeIndicatorEl.textContent = `(${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)}%)`; totalChangeIndicatorEl.className = `sim-total-damage-change-indicator ${totalChange >= 0 ? 'positive' : 'negative'}`; } else { totalChangeIndicatorEl.textContent = ''; }
            }
        }
        skillRows.forEach(row => {
            if (row.querySelector('.skcount')) {
                const damageEl = row.querySelector('.skl .val'), percentEl = row.querySelector('.ser-percent.share'), skillDamageChangeEl = row.querySelector('.sim-skill-damage-change-indicator');
                if (!damageEl || !percentEl || !skillDamageChangeEl) return;
                const currentSkillDamage = parseDamageString(damageEl.textContent), newPercent = newTotalDamage > 0 ? (currentSkillDamage / newTotalDamage * 100) : 0;
                percentEl.textContent = `${newPercent.toFixed(2)}%`;
                const originalSkillDamage = parseFloat(row.dataset.originalDamage);
                if (originalSkillDamage > 0) {
                    const damageChangePercent = (currentSkillDamage / originalSkillDamage - 1) * 100;
                    if (Math.abs(damageChangePercent) > 0.001) { skillDamageChangeEl.textContent = `(${damageChangePercent >= 0 ? '+' : ''}${damageChangePercent.toFixed(1)}%)`; skillDamageChangeEl.className = `sim-skill-damage-change-indicator ${damageChangePercent >= 0 ? 'positive' : 'negative'}`; } else { skillDamageChangeEl.textContent = ''; }
                } else { skillDamageChangeEl.textContent = ''; }
            }
        });
    }

    /**
     * 여러 퍼센트 값을 파싱하여 누적 배율을 계산하는 헬퍼 함수
     */
    function parseCumulativeMultiplier(inputText, isReduction = false) {
        let totalMultiplier = 1.0;
        if (inputText && inputText.trim() !== "") {
            const values = inputText.trim().split(/\s+/);
            values.forEach(valStr => {
                const percent = parseFloat(valStr);
                if (!isNaN(percent)) {
                    totalMultiplier *= (1 + (isReduction ? -percent : percent) / 100);
                }
            });
        }
        return totalMultiplier;
    }

    function createControlPanelElement(skillRow) {
        const currentSkillName = skillRow.querySelector('.skn span')?.textContent.trim();
        let allSkillInfo = getBaseCooldownData(true);
        let baseCDForThisSkill = skillRow.dataset.originalCooldown || "0";
        if (allSkillInfo && allSkillInfo[currentSkillName] && allSkillInfo[currentSkillName].baseCooldown > 0) {
            const newBaseCD = allSkillInfo[currentSkillName].baseCooldown.toString();
            if (skillRow.dataset.originalCooldown !== newBaseCD || !skillRow.dataset.originalCooldown) {
                skillRow.dataset.originalCooldown = newBaseCD;
                baseCDForThisSkill = newBaseCD;
                const subInfoContainer = skillRow.querySelector('.sim-skill-sub-info-wrapper');
                if (subInfoContainer) { const cdDisplayEl = subInfoContainer.querySelector('.sim-cooldown-indicator'); if (cdDisplayEl) cdDisplayEl.textContent = `[쿨: ${parseFloat(baseCDForThisSkill).toFixed(1)}초]`; }
            }
        } else if (currentSkillName && allSkillInfo && !allSkillInfo[currentSkillName]){ skillRow.dataset.originalCooldown = "0"; baseCDForThisSkill = "0"; }

        const panelContainer = document.createElement('div'); panelContainer.className = 'sim-control-panel-container'; panelContainer.addEventListener('click', e => e.stopPropagation());

        const createInputGroup = (labelText, inputPlaceholder, datasetKey, isMultiValue = false) => {
            const group = document.createElement('div'); group.className = 'sim-input-group';
            const label = document.createElement('span'); label.className = 'sim-label'; label.textContent = labelText;
            const input = document.createElement('input');
            input.type = isMultiValue ? 'text' : 'number'; // 딜, 쿨감은 text로 변경
            input.placeholder = inputPlaceholder;
            if (skillRow.dataset[datasetKey]) { input.value = skillRow.dataset[datasetKey]; }
            group.append(label, input);
            return { group, input };
        };

        const dmgElements = createInputGroup('스증(%)', '예: 20 10 -5', 'simDmgPercentMulti', true);
        const countElements = createInputGroup('횟수+', '0', 'simAdditionalCasts'); // 횟수는 단일 값 유지
        const cdElements = createInputGroup('쿨감(%)', '예: 10 5', 'simCooldownReductionMulti', true);

        if (!baseCDForThisSkill || baseCDForThisSkill === "0") { cdElements.input.disabled = true; cdElements.input.title = "스킬정보 탭에서 쿨타임 정보를 찾을 수 없거나 쿨타임이 0초입니다."; }
        else { cdElements.input.disabled = false; cdElements.input.title = "";}

        const applyAllBtn = document.createElement('button'); applyAllBtn.className = 'sim-apply-all-btn'; applyAllBtn.textContent = '모두 적용';
        const resetBtn = document.createElement('button'); resetBtn.className = 'sim-reset-btn'; resetBtn.textContent = '초기화';

        applyAllBtn.onclick = () => {
            const parentDealTable = skillRow.closest('.deal');
            const originalDamage = parseInt(skillRow.dataset.originalDamage, 10);
            const originalReportedCasts = parseInt(skillRow.dataset.originalReportedCasts, 10);
            const currentOriginalCooldown = parseFloat(skillRow.dataset.originalCooldown || "0");

            skillRow.dataset.simDmgPercentMulti = dmgElements.input.value; // 문자열 그대로 저장
            skillRow.dataset.simAdditionalCasts = countElements.input.value;
            skillRow.dataset.simCooldownReductionMulti = cdElements.input.value; // 문자열 그대로 저장

            const cumulativeDmgMultiplier = parseCumulativeMultiplier(dmgElements.input.value, false);
            const cumulativeCdMultiplier = parseCumulativeMultiplier(cdElements.input.value, true);
            const additionalCasts = parseInt(countElements.input.value, 10) || 0;

            let simulatedCasts = originalReportedCasts;
            let currentCooldown = currentOriginalCooldown;

            if (currentOriginalCooldown > 0) { // 0으로 나누기 방지
                currentCooldown = currentOriginalCooldown * cumulativeCdMultiplier;
                currentCooldown = Math.max(0.1, currentCooldown);
                simulatedCasts = 1 + Math.floor(40 / currentCooldown);
            }
            simulatedCasts += additionalCasts;
            simulatedCasts = Math.max(0, simulatedCasts);

            const damagePerOriginalCast = originalReportedCasts > 0 ? originalDamage / originalReportedCasts : 0;
            const newTotalSkillDamage = damagePerOriginalCast * simulatedCasts * cumulativeDmgMultiplier;

            skillRow.querySelector('.skc-count-p > span').textContent = `${simulatedCasts}회`;
            skillRow.querySelector('.skl .val').textContent = formatDamageNumber(newTotalSkillDamage);

            const subInfoContainer = skillRow.querySelector('.sim-skill-sub-info-wrapper');
            if (subInfoContainer) {
                const castChangeEl = subInfoContainer.querySelector('.sim-cast-change-indicator');
                const castDiff = simulatedCasts - originalReportedCasts;
                if (castChangeEl) { if (castDiff !== 0) { castChangeEl.textContent = `(${castDiff > 0 ? '+' : ''}${castDiff}회)`; castChangeEl.className = `sim-cast-change-indicator ${castDiff > 0 ? 'positive' : 'negative'}`; } else { castChangeEl.textContent = ''; } }
                const cdDisplayEl = subInfoContainer.querySelector('.sim-cooldown-indicator');
                if (cdDisplayEl && currentOriginalCooldown > 0) { const cdDiff = currentCooldown - currentOriginalCooldown; cdDisplayEl.textContent = `[쿨: ${currentCooldown.toFixed(1)}초 ${cdDiff !== 0 && Math.abs(cdDiff) > 0.01 ? (cdDiff < 0 ? '▼' : '▲') + Math.abs(cdDiff).toFixed(1) : ''}]`; }
                else if (cdDisplayEl) { cdDisplayEl.textContent = '';}
            }
            updateAllDisplayMetrics(parentDealTable);
            toggleModifiedIndicator(skillRow);
        };

        resetBtn.onclick = () => {
            const parentDealTable = skillRow.closest('.deal');
            skillRow.querySelector('.skl .val').textContent = formatDamageNumber(skillRow.dataset.originalDamage);
            skillRow.querySelector('.skc-count-p > span').textContent = `${skillRow.dataset.originalReportedCasts}회`;
            dmgElements.input.value = ''; countElements.input.value = ''; cdElements.input.value = '';
            delete skillRow.dataset.simDmgPercentMulti; delete skillRow.dataset.simAdditionalCasts; delete skillRow.dataset.simCooldownReductionMulti;
            const subInfoContainer = skillRow.querySelector('.sim-skill-sub-info-wrapper');
            if (subInfoContainer) {
                const castChangeEl = subInfoContainer.querySelector('.sim-cast-change-indicator'); if (castChangeEl) castChangeEl.textContent = '';
                const cdDisplayEl = subInfoContainer.querySelector('.sim-cooldown-indicator');
                if (cdDisplayEl && skillRow.dataset.originalCooldown && skillRow.dataset.originalCooldown !== "0") {
                    cdDisplayEl.textContent = `[쿨: ${parseFloat(skillRow.dataset.originalCooldown).toFixed(1)}초]`;
                } else if (cdDisplayEl) { cdDisplayEl.textContent = ''; }
            }
            updateAllDisplayMetrics(parentDealTable);
            toggleModifiedIndicator(skillRow);
        };

        panelContainer.append(dmgElements.group, countElements.group, cdElements.group, applyAllBtn, resetBtn);
        const controlPanelRow = document.createElement('div'); controlPanelRow.className = 'sim-control-panel-row'; controlPanelRow.appendChild(panelContainer); return controlPanelRow;
    }

    function setupSkillRowInteractions(skillRow, allSkillBaseInfo) {
        if (!skillRow.querySelector('.skcount') || skillRow.dataset.simLogicAssigned === 'true') return;
        skillRow.dataset.simLogicAssigned = 'true';
        const skillNameElement = skillRow.querySelector('.skn span'), skillName = skillNameElement ? skillNameElement.textContent.trim() : null;
        if (!skillName) { console.warn("[던담 시뮬] setupSkillRowInteractions: 스킬명 없음", skillRow); return; }
        const damageEl = skillRow.querySelector('.skl .val'), countDisplayContainer = skillRow.querySelector('.skc-count-p'), shareEl = skillRow.querySelector('.ser-percent.share');
        if (damageEl && countDisplayContainer && shareEl) {
             skillRow.dataset.originalDamage = parseDamageString(damageEl.textContent);
             const countDisplaySpan = countDisplayContainer.querySelector('span');
             if (countDisplaySpan) skillRow.dataset.originalReportedCasts = parseInt(countDisplaySpan.textContent.replace('회', ''), 10);
             const countParentContainer = countDisplayContainer.parentElement;
             let subInfoWrapper = countParentContainer.querySelector('.sim-skill-sub-info-wrapper');
             if (!subInfoWrapper) { subInfoWrapper = document.createElement('div'); subInfoWrapper.className = 'sim-skill-sub-info-wrapper'; countDisplayContainer.insertAdjacentElement('afterend', subInfoWrapper); }
             let castChangeEl = subInfoWrapper.querySelector('.sim-cast-change-indicator');
             if (!castChangeEl) { castChangeEl = document.createElement('span'); castChangeEl.className = 'sim-cast-change-indicator'; subInfoWrapper.appendChild(castChangeEl); }
             let cdDisplayEl = subInfoWrapper.querySelector('.sim-cooldown-indicator');
             if (!cdDisplayEl) { cdDisplayEl = document.createElement('span'); cdDisplayEl.className = 'sim-cooldown-indicator'; subInfoWrapper.appendChild(cdDisplayEl); }
             if (allSkillBaseInfo && allSkillBaseInfo[skillName] && allSkillBaseInfo[skillName].baseCooldown > 0) {
                 const baseCD = allSkillBaseInfo[skillName].baseCooldown;
                 skillRow.dataset.originalCooldown = baseCD;
                 cdDisplayEl.textContent = `[쿨: ${baseCD.toFixed(1)}초]`;
             } else { skillRow.dataset.originalCooldown = "0"; cdDisplayEl.textContent = ''; }
        }
        if (shareEl && (!shareEl.nextElementSibling || !shareEl.nextElementSibling.classList.contains('sim-skill-damage-change-indicator'))) {
            const skillDamageChangeEl = document.createElement('span'); skillDamageChangeEl.className = 'sim-skill-damage-change-indicator'; shareEl.insertAdjacentElement('afterend', skillDamageChangeEl);
        }
        skillRow.addEventListener('click', () => {
            const nextRow = skillRow.nextElementSibling;
            if (nextRow && nextRow.classList.contains('sim-control-panel-row')) { nextRow.remove(); }
            else { const panel = createControlPanelElement(skillRow); skillRow.insertAdjacentElement('afterend', panel); }
        });
    }

    function initializeTableFeatures(dealTable) {
        if (!dealTable.querySelector('.cc-part .sk.tr .skn span')) { return; }
        if (dealTable.dataset.simSetupDone === 'true' && dundamSkillInfoCache && Object.keys(dundamSkillInfoCache).length > 0) { return; }

        const mainTotalDamageDisplayEl = dealTable.querySelector('.hd-part .dval');
        if (mainTotalDamageDisplayEl && !dealTable.dataset.originalTotalDamage) {
            dealTable.dataset.originalTotalDamage = parseDamageString(mainTotalDamageDisplayEl.textContent);
        }

        const totalSumRow = Array.from(dealTable.querySelectorAll('.cc-part .sk.tr')).find(row => row.querySelector('.skn span')?.textContent === '총 합');
        if (totalSumRow) {
            const totalSumDamageValueEl = totalSumRow.querySelector('.skl .val');
            if (totalSumDamageValueEl && (!totalSumDamageValueEl.nextElementSibling || !totalSumDamageValueEl.nextElementSibling.classList.contains('sim-total-damage-change-indicator'))) {
                const totalChangeIndicatorEl = document.createElement('span');
                totalChangeIndicatorEl.className = 'sim-total-damage-change-indicator';
                totalSumDamageValueEl.insertAdjacentElement('afterend', totalChangeIndicatorEl);
            }
        }

        const allSkillBaseInfo = getBaseCooldownData();

        dealTable.querySelectorAll('.cc-part .sk.tr').forEach(row => {
            setupSkillRowInteractions(row, allSkillBaseInfo);
        });

        if (allSkillBaseInfo && Object.keys(allSkillBaseInfo).length > 0) {
            dealTable.dataset.simSetupDone = 'true';
            updateAllDisplayMetrics(dealTable);
        }
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                let newDealContentReady = false;
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        if ((addedNode.matches('.deal') || addedNode.querySelector('.deal')) && addedNode.querySelector('.cc-part .sk.tr .skn span')) {
                            newDealContentReady = true; break;
                        }
                        if (addedNode.matches('.sk.tr') && addedNode.querySelector('.skn span') && addedNode.closest('.deal .cc-part')) {
                             newDealContentReady = true; break;
                        }
                    }
                }
                if (newDealContentReady) {
                    document.querySelectorAll('.deal').forEach(initializeTableFeatures);
                    break;
                }
            }
        }
    });

    console.log('[던담 시뮬] 초기 테이블 설정 시도');
    document.querySelectorAll('.deal').forEach(initializeTableFeatures);

    observer.observe(document.body, { childList: true, subtree: true });
    console.log('[던담 시뮬] 스크립트 초기화 및 관찰 시작');

})();