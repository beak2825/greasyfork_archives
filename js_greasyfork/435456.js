// ==UserScript==
// @name         Wanikani: Levels completed per SRS
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Displays how many levels have been completed to a given SRS level. A re-implementation of https://community.wanikani.com/t/userscript-levels-by-srs/37711 using modern js
// @author       KaHLK
// @match        https://www.wanikani.com/dashboard
// @match        https://www.wanikani.com
// @include      *preview.wanikani.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435456/Wanikani%3A%20Levels%20completed%20per%20SRS.user.js
// @updateURL https://update.greasyfork.org/scripts/435456/Wanikani%3A%20Levels%20completed%20per%20SRS.meta.js
// ==/UserScript==
// @ts-ignore
const SCRIPT_ID = "srs_levels";
const SRS_LEVELS_STYLE = `
.srs-progress li{
    position: relative;
    overflow: hidden;
}
.${SCRIPT_ID}.levels_cleared{
    display: flex;
    justify-content: center;
    align-items: center;
    background: #222;
    color: #fafafa;
    height: 2em;
    width: 100%;

    position: absolute;
    bottom: 0;
    left: 0;
}
`;
(function () {
    let wkof;
    if (!window.wkof) {
        let response = confirm("\"WaniKani: Total Progress\" script requires WaniKani Open Framework.\n Click \"OK\" to be forwarded to installation instructions.");
        if (response) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }
    else {
        wkof = window.wkof;
    }
    let settings;
    let data;
    // Create a template element that will be the base for the output of this script.
    // This is done because it is faster to clone than it is to create a new element each time.
    // NOTE: This small performance gain is not important in this case, but the small complexity increase
    // is not enough of a drawback in this case to not use it.
    const template = document.createElement("div");
    template.classList.add(SCRIPT_ID, "levels_cleared");
    let stage_divs = [];
    // Append a clone of the template element to each element in 'stage_dom_items'
    for (let item of document.querySelectorAll(".srs-progress li")) {
        // Increase the bottom padding, to make room for the element
        const padding_bottom = Number(window.getComputedStyle(item).paddingBottom.slice(0, -2));
        item.style.setProperty("padding-bottom", `${padding_bottom + 28}px`);
        // Clone the template and append it to the list element
        const node = template.cloneNode();
        item.append(node);
        // Push the element to a list to be able to use it later
        stage_divs.push(node);
    }
    setup();
    /**
     * Load the necessary plugins from wkof, create the settings menu and add a link to the menu.
     * Fetch all assignments from wanikani from the levels up to and including the current and
     * only save the total number of items per level and the stage of each them.
     * Each item is also counted towards all previous stages they've cleared.
     *
     * NOTE: Should only be called once, on script start-up.
    */
    async function setup() {
        wkof.include("Menu,Settings,ItemData");
        await wkof.ready("Menu,Settings,ItemData");
        // Setup the settings menu
        settings = prepare_srs_levels_settings_dialog(update);
        await settings.load({ threshold: 90 });
        wkof.Menu.insert_script_link({
            name: `${SCRIPT_ID}_settings`,
            submenu: "Settings",
            title: "Levels by SRS",
            on_click: settings.open,
        });
        // Get the assignments starting from level one and up to the current level.
        const items = await wkof.ItemData.get_items({
            wk_items: {
                options: { assignments: true },
                filters: { level: "1..+0" },
            },
        });
        const item_by_level = [];
        // Sort the items into the level they are from and save only the total number of items
        // as well as the amount per stage
        for (let i of items) {
            let level = i.data.level;
            let stage = srs_map(i.assignments.srs_stage);
            // If the entry for the current level is undefined, create a new one and fill the 'per_stage' arary with 0's.
            if (item_by_level[level] === undefined) {
                item_by_level[level] = { level: level, total_items: 0, per_stage: Array(stage_divs.length) };
                item_by_level[level].per_stage.fill(0);
            }
            item_by_level[level].total_items++;
            if (stage === SRSCombinedStage.OTHER) {
                continue;
            }
            // Increment the value for all stages less than or equal to the current.
            // Ex: if the stage is 'Master' also increment 'Guru' and 'Apprentice'.
            for (let idx = stage; idx >= 0; idx--) {
                item_by_level[level].per_stage[idx]++;
            }
        }
        // Reverse the array, so that the last level is first (This step allows to skip a lot of computation later).
        data = item_by_level.reverse();
        // Remove the empty 0th element that is now at the end. This prevents a undefined check later.
        data.pop();
        update();
    }
    /**
     * Calculate the highest level cleared for each stage and display it in the output divs ('stage_divs' array).
     *
     * NOTE: Should be called once, on script start-up, and every time the settings are saved.
     */
    async function update() {
        const settings = wkof.settings[SCRIPT_ID];
        let threshold = settings.threshold;
        const max_level_on_stage = Array(stage_divs.length).fill(0);
        // For every item, check if they (given the threshold) have cleared the stage.
        for (let level of data) {
            // Count how many stages where skipped (already set by a later level).
            let continued = 0;
            for (let i = 0; i < max_level_on_stage.length; i++) {
                // Skip this stage if the current level is lower than the one already set
                if (max_level_on_stage[i] > level.level) {
                    continued++;
                    continue;
                }
                // Check if the level has cleared the stage.
                if (level.per_stage[i] / level.total_items * 100 >= threshold) {
                    max_level_on_stage[i] = level.level;
                }
            }
            // If all of the stages are already set to a level higher than this,
            // break out of the loop, as the order of the levels are descending,
            // none of the remaining levels will be needed to be checked.
            // Ex: Current level = 5. max_level_on_stage = [10, 9, 9, 7, 6].
            if (continued >= max_level_on_stage.length) {
                break;
            }
        }
        // Output the highest level cleared for each stage
        max_level_on_stage.forEach((val, i) => {
            stage_divs[i].innerText = `Level: ${val}`;
        });
    }
    const style = document.createElement("style");
    style.id = `${SCRIPT_ID}_style`;
    style.innerHTML = SRS_LEVELS_STYLE;
    document.head.append(style);
})();
/**
 * Create the settings dialog.
 *
 * NOTE: This function should only be called once and the result be saved.
 * @param update The function to call when the "Save"-button is pressed
 * @returns The created WKOFDialog
 */
function prepare_srs_levels_settings_dialog(update) {
    return new window.wkof.Settings({
        script_id: SCRIPT_ID,
        title: "Levels by srs",
        on_save: update,
        content: {
            threshold: {
                type: "number",
                label: "Threshold",
                hover_tip: "Percentage of level needed completed before SRS stage is considered completed.",
                default: 90
            }
        }
    });
}
var SRSIndividualStage;
(function (SRSIndividualStage) {
    SRSIndividualStage[SRSIndividualStage["LOCKED"] = -1] = "LOCKED";
    SRSIndividualStage[SRSIndividualStage["LESSON"] = 0] = "LESSON";
    SRSIndividualStage[SRSIndividualStage["APPRENTICE_1"] = 1] = "APPRENTICE_1";
    SRSIndividualStage[SRSIndividualStage["APPRENTICE_2"] = 2] = "APPRENTICE_2";
    SRSIndividualStage[SRSIndividualStage["APPRENTICE_3"] = 3] = "APPRENTICE_3";
    SRSIndividualStage[SRSIndividualStage["APPRENTICE_4"] = 4] = "APPRENTICE_4";
    SRSIndividualStage[SRSIndividualStage["GURU_1"] = 5] = "GURU_1";
    SRSIndividualStage[SRSIndividualStage["GURU_2"] = 6] = "GURU_2";
    SRSIndividualStage[SRSIndividualStage["MASTER"] = 7] = "MASTER";
    SRSIndividualStage[SRSIndividualStage["ENLIGHTENED"] = 8] = "ENLIGHTENED";
    SRSIndividualStage[SRSIndividualStage["BURN"] = 9] = "BURN";
})(SRSIndividualStage || (SRSIndividualStage = {}));
var SRSCombinedStage;
(function (SRSCombinedStage) {
    SRSCombinedStage[SRSCombinedStage["APPRENTICE"] = 0] = "APPRENTICE";
    SRSCombinedStage[SRSCombinedStage["GURU"] = 1] = "GURU";
    SRSCombinedStage[SRSCombinedStage["MASTER"] = 2] = "MASTER";
    SRSCombinedStage[SRSCombinedStage["ENLIGHTENED"] = 3] = "ENLIGHTENED";
    SRSCombinedStage[SRSCombinedStage["BURN"] = 4] = "BURN";
    SRSCombinedStage[SRSCombinedStage["OTHER"] = 5] = "OTHER";
})(SRSCombinedStage || (SRSCombinedStage = {}));
/**
 * Maps an individual stage to a combined stage.
 * Ex: Apprentice 2 -> Apprentice
 *
 * @param srs The individual stage to map
 * @returns The combined stage that the 'srs' individual stage belongs to
 */
function srs_map(srs) {
    switch (srs) {
        case SRSIndividualStage.APPRENTICE_1:
        case SRSIndividualStage.APPRENTICE_2:
        case SRSIndividualStage.APPRENTICE_3:
        case SRSIndividualStage.APPRENTICE_4:
            return SRSCombinedStage.APPRENTICE;
        case SRSIndividualStage.GURU_1:
        case SRSIndividualStage.GURU_2:
            return SRSCombinedStage.GURU;
        case SRSIndividualStage.MASTER:
            return SRSCombinedStage.MASTER;
        case SRSIndividualStage.ENLIGHTENED:
            return SRSCombinedStage.ENLIGHTENED;
        case SRSIndividualStage.BURN:
            return SRSCombinedStage.BURN;
        case SRSIndividualStage.LOCKED:
        case SRSIndividualStage.LESSON:
            return SRSCombinedStage.OTHER;
    }
}
