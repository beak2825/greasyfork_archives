// ==UserScript==
// @name         Milky Party Finder Filters
// @name:zh-CN   Milky 组队过滤器
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds filters to the Find Party page in Milky Way Idle. Matches MWITools language detection.
// @description:zh-CN 在 Milky Way Idle 的组队页面添加过滤器。自动匹配游戏语言设置。
// @author       Opzon - Localized by User Request
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/541080/Milky%20Party%20Finder%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/541080/Milky%20Party%20Finder%20Filters.meta.js
// ==/UserScript==

(() => {
    "use strict";

    // --- Localization Logic (Matches MWITools) ---
    const isZH = localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith("zh");

    const TEXT = {
        combatLvSatisfied: isZH ? "战斗等级达标" : "Combat Lv. Satisfied",
        partyOwnerReady: isZH ? "队长已准备" : "Party Owner Ready",
        everyoneReady: isZH ? "全员已准备" : "Everyone Ready",
    };

    // --- CSS for filter UI ---
    GM_addStyle(`
        .mwi-party-filters-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid var(--color-neutral-300);
            border-radius: 5px;
            align-items: center;
        }

        .mwi-filter-checkbox-group {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .mwi-filter-checkbox-group input[type="checkbox"] {
            width: 16px;
            height: 16px;
            cursor: pointer;
            -webkit-appearance: checkbox;
            -moz-appearance: checkbox;
            appearance: checkbox;
            margin: 0;
            padding: 0;
        }

        .mwi-filter-checkbox-group label {
            color: var(--color-text-200);
            font-size: 0.9em;
            cursor: pointer;
            user-select: none;
        }
    `);

    const STORAGE_PREFIX = 'mwi_party_filter_';

    const defaultFilterSettings = {
        hideIfNotCombatLvSatisfied: false,
        hideIfNotPartyOwnerReady: false,
        hideIfNotEveryoneReady: false,
    };

    let currentFilterSettings = GM_getValue(STORAGE_PREFIX + 'settings', defaultFilterSettings);
    let userCombatLevel = 0;

    let partyListObserver = null;
    let combatLevelObserver = null;
    let appObserver = null;

    const SELECTOR_PREFIXES = {
        optionsContainer: 'FindParty_optionsContainer__',
        partyList: 'FindParty_partyList__',
        combatLevelContainer: 'NavigationBar_textContainer__',
        combatLevelLabel: 'NavigationBar_label__',
        combatLevelSpan: 'NavigationBar_level__',
        partyDiv: 'FindParty_party__',
        levelRequirement: 'FindParty_levelReq__',
        partySlot: 'FindParty_partySlot__',
        emptySlot: 'FindParty_empty__', // Added to identify empty slots
        readySlot: 'FindParty_ready__',
        notReadySlot: 'FindParty_notReady__',
        characterName: 'CharacterName_characterName__',
        button: 'Button_button__',
        ownerFlag: 'svg use[href*="#flag"]',
        partyName: 'FindParty_name__',
    };

    function getDynamicClassSelector(prefix) {
        return `[class^="${prefix}"]`;
    }

    function hasDynamicClass(element, prefix) {
        if (!element || !element.classList) return false;
        for (const cls of element.classList) {
            if (cls.startsWith(prefix)) {
                return true;
            }
        }
        return false;
    }

    function getUserCombatLevel() {
        const combatTextContainer = Array.from(document.querySelectorAll(getDynamicClassSelector(SELECTOR_PREFIXES.combatLevelContainer)))
            .find(container => {
                const label = container.querySelector(getDynamicClassSelector(SELECTOR_PREFIXES.combatLevelLabel));
                return label && (label.textContent.trim() === 'Combat' || label.textContent.trim() === '战斗');
            });

        if (combatTextContainer) {
            const combatLevelElement = combatTextContainer.querySelector(getDynamicClassSelector(SELECTOR_PREFIXES.combatLevelSpan));
            if (combatLevelElement && combatLevelElement.textContent) {
                const level = parseInt(combatLevelElement.textContent.trim(), 10);
                return isNaN(level) ? 0 : level;
            }
        }
        return 0;
    }

    function updateUserCombatLevelAndApplyFilters() {
        const newCombatLevel = getUserCombatLevel();
        if (newCombatLevel !== userCombatLevel) {
            userCombatLevel = newCombatLevel;
            applyFiltersToAllParties();
        }
    }

    /**
     * Checks if the user fits into ANY of the empty slots in the party.
     * Parses formats like "Lv.123-143" or "Lv.123+"
     */
    function canUserJoinParty(partyElement) {
        const slots = partyElement.querySelectorAll(getDynamicClassSelector(SELECTOR_PREFIXES.partySlot));
        let hasJoinableSlot = false;

        for (const slot of slots) {
            // Only check empty slots
            if (hasDynamicClass(slot, SELECTOR_PREFIXES.emptySlot)) {
                const levelReqElement = slot.querySelector(getDynamicClassSelector(SELECTOR_PREFIXES.levelRequirement));

                // If there is no level requirement element, assume it's open
                if (!levelReqElement) {
                    hasJoinableSlot = true;
                    break;
                }

                const text = levelReqElement.textContent.trim();
                const match = text.match(/(\d+)(?:-(\d+))?/);

                if (match) {
                    const min = parseInt(match[1], 10);
                    let max = Infinity;

                    if (match[2]) {
                        max = parseInt(match[2], 10);
                    }

                    if (!isNaN(min)) {
                        if (userCombatLevel >= min && userCombatLevel <= max) {
                            hasJoinableSlot = true;
                            break; // Found a valid slot, satisfied
                        }
                    }
                } else if (!text) {
                     // Empty text inside the element? Assume open.
                     hasJoinableSlot = true;
                     break;
                }
            }
        }
        return hasJoinableSlot;
    }

    function isPartyOwnerReady(partyElement) {
        const ownerSlotFlag = partyElement.querySelector(`${getDynamicClassSelector(SELECTOR_PREFIXES.partySlot)} ${SELECTOR_PREFIXES.ownerFlag}`);
        if (ownerSlotFlag) {
            const partySlotDiv = ownerSlotFlag.closest(getDynamicClassSelector(SELECTOR_PREFIXES.partySlot));
            return partySlotDiv && hasDynamicClass(partySlotDiv, SELECTOR_PREFIXES.readySlot);
        }
        return false;
    }

    function isEveryoneReady(partyElement) {
        const allSlots = partyElement.querySelectorAll(getDynamicClassSelector(SELECTOR_PREFIXES.partySlot));
        for (const slot of allSlots) {
            const characterNameDiv = slot.querySelector(getDynamicClassSelector(SELECTOR_PREFIXES.characterName));
            if (characterNameDiv) {
                if (hasDynamicClass(slot, SELECTOR_PREFIXES.notReadySlot)) {
                    return false;
                }
            }
        }
        return true;
    }

    function applyFilterToParty(partyElement) {
        let hideParty = false;

        if (currentFilterSettings.hideIfNotCombatLvSatisfied) {
            // New Logic: Check if at least one empty slot accepts our level
            if (!canUserJoinParty(partyElement)) {
                hideParty = true;
            }
        }

        if (!hideParty && currentFilterSettings.hideIfNotPartyOwnerReady) {
            if (!isPartyOwnerReady(partyElement)) {
                hideParty = true;
            }
        }

        if (!hideParty && currentFilterSettings.hideIfNotEveryoneReady) {
            if (!isEveryoneReady(partyElement)) {
                hideParty = true;
            }
        }

        partyElement.style.display = hideParty ? 'none' : '';
    }

    function applyFiltersToAllParties() {
        const partyList = document.querySelector(getDynamicClassSelector(SELECTOR_PREFIXES.partyList));
        if (partyList) {
            const parties = partyList.querySelectorAll(getDynamicClassSelector(SELECTOR_PREFIXES.partyDiv));
            parties.forEach(applyFilterToParty);
        }
    }

    function createFilterUI() {
        const optionsContainer = document.querySelector(getDynamicClassSelector(SELECTOR_PREFIXES.optionsContainer));
        if (!optionsContainer || optionsContainer.querySelector('.mwi-party-filters-container')) {
            return;
        }

        const filterContainer = document.createElement('div');
        filterContainer.className = 'mwi-party-filters-container';
        filterContainer.innerHTML = `
            <div class="mwi-filter-checkbox-group">
                <input type="checkbox" id="${STORAGE_PREFIX}hideIfNotCombatLvSatisfied">
                <label for="${STORAGE_PREFIX}hideIfNotCombatLvSatisfied">${TEXT.combatLvSatisfied}</label>
            </div>
            <div class="mwi-filter-checkbox-group">
                <input type="checkbox" id="${STORAGE_PREFIX}hideIfNotPartyOwnerReady">
                <label for="${STORAGE_PREFIX}hideIfNotPartyOwnerReady">${TEXT.partyOwnerReady}</label>
            </div>
            <div class="mwi-filter-checkbox-group">
                <input type="checkbox" id="${STORAGE_PREFIX}hideIfNotEveryoneReady">
                <label for="${STORAGE_PREFIX}hideIfNotEveryoneReady">${TEXT.everyoneReady}</label>
            </div>
        `;

        optionsContainer.appendChild(filterContainer);

        for (const key in currentFilterSettings) {
            if (Object.prototype.hasOwnProperty.call(currentFilterSettings, key)) {
                const checkbox = document.getElementById(STORAGE_PREFIX + key);
                if (checkbox) {
                    checkbox.checked = currentFilterSettings[key];
                    checkbox.addEventListener('change', (event) => {
                        currentFilterSettings[key] = event.target.checked;
                        GM_setValue(STORAGE_PREFIX + 'settings', currentFilterSettings);
                        applyFiltersToAllParties();
                    });
                }
            }
        }
    }

    function initialize() {
        createFilterUI();

        const maxRetries = 30;
        let currentRetries = 0;
        const checkUserLevelWithRetry = () => {
            updateUserCombatLevelAndApplyFilters();
            if (userCombatLevel === 0 && currentRetries < maxRetries) {
                currentRetries++;
                setTimeout(checkUserLevelWithRetry, 100);
            }
        };
        checkUserLevelWithRetry();

        const partyList = document.querySelector(getDynamicClassSelector(SELECTOR_PREFIXES.partyList));
        if (partyList) {
            if (partyListObserver) partyListObserver.disconnect();
            partyListObserver = new MutationObserver((mutationsList) => {
                let needToReapplyAll = false;
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1 && hasDynamicClass(node, SELECTOR_PREFIXES.partyDiv)) {
                                applyFilterToParty(node);
                            }
                        });
                        if (mutation.removedNodes.length > 0) {
                             needToReapplyAll = true;
                        }
                    }
                }
                if (needToReapplyAll) applyFiltersToAllParties();
            });
            partyListObserver.observe(partyList, { childList: true });

            const optionsContainerElement = document.querySelector(getDynamicClassSelector(SELECTOR_PREFIXES.optionsContainer));
            if (optionsContainerElement) {
                const refreshButton = optionsContainerElement.querySelector(`button${getDynamicClassSelector(SELECTOR_PREFIXES.button)}`);
                if (refreshButton) {
                    refreshButton.removeEventListener('click', refreshButtonClickHandler);
                    refreshButton.addEventListener('click', refreshButtonClickHandler);
                }
            }
        }

        const combatLevelContainer = document.querySelector(getDynamicClassSelector(SELECTOR_PREFIXES.combatLevelContainer));
        if (combatLevelContainer) {
            if (combatLevelObserver) combatLevelObserver.disconnect();
            combatLevelObserver = new MutationObserver(() => {
                updateUserCombatLevelAndApplyFilters();
            });
            combatLevelObserver.observe(combatLevelContainer, { childList: true, subtree: true, characterData: true });
        }

        applyFiltersToAllParties();
    }

    function refreshButtonClickHandler() {
        setTimeout(() => {
            updateUserCombatLevelAndApplyFilters();
            applyFiltersToAllParties();
        }, 750);
    }

    const appContainer = document.getElementById('root');
    if (appContainer) {
        if (!appObserver) {
            appObserver = new MutationObserver(() => {
                const foundOptionsContainer = document.querySelector(getDynamicClassSelector(SELECTOR_PREFIXES.optionsContainer));
                if (foundOptionsContainer) {
                    initialize();
                }
            });
            appObserver.observe(appContainer, { childList: true, subtree: true });
        }
    }
})();