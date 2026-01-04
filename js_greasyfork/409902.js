// ==UserScript==
// @name        Melvor Idle - XP/h
// @description Standalone version of SEMI's XP/h plugin
// @namespace   Visua
// @version     1.2
// @match       https://melvoridle.com/*
// @match       https://www.melvoridle.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/409902/Melvor%20Idle%20-%20XPh.user.js
// @updateURL https://update.greasyfork.org/scripts/409902/Melvor%20Idle%20-%20XPh.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

((main) => {
    var script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    'use strict';

    /**
     * Returns the current level of a skill
     * @param {SkillName} skillName
     * @param {boolean} [virtualLevel=false] Whether it should return the virtual level if it's greater than 99
    */
    const currentLevel = (skillName, virtualLevel = false) => virtualLevel ? Math.max(skillLevel[CONSTANTS.skill[skillName]], exp.xp_to_level(skillXP[CONSTANTS.skill[skillName]]) - 1) : skillLevel[CONSTANTS.skill[skillName]];

    /** @param {SkillName} skillName */
    const currentXP = (skillName) => skillXP[CONSTANTS.skill[skillName]];

    const currentSkillName = () => {
        if (currentlyCutting == 1 || currentlyCutting == 2) { return 'Woodcutting'; }
        if (isFishing) { return 'Fishing'; }
        if (isBurning) { return 'Firemaking'; }
        if (isCooking) { return 'Cooking'; }
        if (isMining) { return 'Mining'; }
        if (isSmithing) { return 'Smithing'; }
        if (isThieving) { return 'Thieving'; }
        if (isFletching) { return 'Fletching'; }
        if (isCrafting) { return 'Crafting'; }
        if (isRunecrafting) { return 'Runecrafting'; }
        if (isHerblore) { return 'Herblore'; }
        if (isInCombat) { return 'Hitpoints'; }
        return '';
    };

    const currentSkillId = () => currentSkillName() == '' ? -1 : CONSTANTS.skill[currentSkillName()];

    /** @param {string} nameOrId */
    const isCurrentSkill = (nameOrId) => typeof nameOrId === 'string' ? currentSkillName() === nameOrId : currentSkillId() === nameOrId;

    const pages = ['Woodcutting', 'Shop', 'Bank', 'Settings', 'Changelog', 'Milestones', 'Statistics', 'Fishing', 'Firemaking', 'Cooking', 'Mining', 'Smithing', 'Mastery', 'Combat', 'Thieving', 'Farming', 'Fletching', 'Crafting', 'Runecrafting', 'Herblore', 'Archaeology', 'Easter'];
    const currentPageName = () => pages[currentPage];

    /** @param {string} name */
    const changePageByName = (name) => { changePage(pages.indexOf(name)); };

    const skills = {
        'xphc-0': 'Attack',
        'xphc-1': 'Strength',
        'xphc-2': 'Defence',
        'xphc-3': 'Hitpoints',
        'xphc-4': 'Ranged',
        'xphc-5': 'Magic',
        'xphc-6': 'Prayer',
        'xphc-7': 'Slayer',
        'xphf': 'Farming',
        'xph': '',
        'xphc': ''
    };

    const el = { xph: '#xph-dialog', xphf: '#xphf-dialog', xphc: '.xphc' };

    /**
     * @type {{[key: string]: any}}
     */
    const data = {};

    Object.keys(skills).forEach((skill) => {
        data[skill] = {
            skill: skills[skill],
            el: el[skill],
            children: 0
        };
    });

    data.xphc.children = 8;

    const getNextLevel = (data, key) => {
        let nextLevel = currentLevel(data[key].skill, showVirtualLevels) + 1;
        if (!showVirtualLevels && nextLevel > 99) {
            nextLevel = 99;
        }
        return nextLevel;
    };

    /** @param {string} key */
    const resetXPHEl = (key) => {
        if (data[key].children !== 0) {
            for (let i = 0; i < data[key].children; i++) {
                resetXPHEl(`${key}-${i}`);
            }
        }
        $(`#${key}-rate`).text('...');
        $(`#${key}-lvl`).text('... hrs');
        $(`#${key}-lvl-in`).val(getNextLevel(data, key));
        $(`#${key}-time`).text('0');
    };

    const setupData = (key) => {
        const value = data[key];
        if (value.children !== 0) { for (let i = 0; i < value.children; i++) { setupData(`${key}-${i}`); } }
        value.time = Date.now();
        value.running = true;
        value.exp = currentXP(value.skill);
    };

    const formatTimeFromSeconds = (seconds) => {
        if (seconds === 0 || seconds === Infinity) {
            return '...';
        }
        const days = Math.floor(seconds / (60 * 60 * 24));
        return (days ? days + 'd ' : '') + new Date(seconds * 1000).toISOString().substr(11, 8);
    };

    /** @param {string} key */
    const updateXPHEl = (key) => {
        const { skill, xpPerHour, time, children } = data[key];
        if (children !== 0) {
            for (let i = 0; i < children; i++) {
                updateXPHEl(`${key}-${i}`);
            }
        }
        let hoursToLvl = 0;
        let nextLevel = Number($(`#${key}-lvl-in`).val());
        if (nextLevel <= currentLevel(skill, showVirtualLevels)) {
            nextLevel = getNextLevel(data, key);
            $(`#${key}-lvl-in`).val(nextLevel);
        }
        if (nextLevel > currentLevel(skill, true) && xpPerHour > 0) {
            hoursToLvl = (exp.level_to_xp(nextLevel) - currentXP(skill)) / xpPerHour;
        }
        let xpPerHourString = Math.round(xpPerHour).toString();
        const pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(xpPerHourString)) {
            xpPerHourString = xpPerHourString.replace(pattern, '$1,$2');
        }
        $(`#${key}-rate`).text(xpPerHourString);
        $(`#${key}-lvl`).text(formatTimeFromSeconds(hoursToLvl * 3600));
        $(`#${key}-time`).text(((Date.now() - time) / 1000).toFixed(0));
    };

    /** @param {string} key */
    const updateRate = (key) => {
        const { skill, exp, time, children } = data[key];
        if (children !== 0) { for (let i = 0; i < children; i++) { updateRate(`${key}-${i}`); } }
        const oldXP = exp || 0;
        const oldTime = time || Date.now();
        const timeSince = (Date.now() - oldTime) / 1000;
        const xpLeft = currentXP(skill) - oldXP;
        data[key].xpPerHour = (xpLeft / timeSince) * 3600;
    };

    const stats = ['Woodcutting', 'Fishing', 'Firemaking', 'Cooking', 'Mining', 'Smithing', 'Attack', 'Strength', 'Defence', 'Hitpoints', 'Thieving', 'Farming', 'Ranged', 'Fletching', 'Crafting', 'Runecrafting', 'Magic', 'Prayer', 'Slayer', 'Herblore'];

    /**
    * @param {XPHKey} key
    * @param {boolean} running
    */
    const runXPH = (key, running) => {
        if (data[key].running) {
            updateRate(key);
            if (!running) {
                data[key].running = false;
            } else {
                updateXPHEl(key);
            }
        } else {
            setupData(key);
            resetXPHEl(key);
        }
    };

    /** @param {XPHKey} key */
    const stopRunning = (key) => {
        $(data[key].el).addClass('d-none');
        runXPH(key, false);
        clearInterval(data[key].loop);
    };

    /** @param {XPHKey} key */
    const startRunning = (key) => {
        _startRunning[key]();
        runXPH(key, true);
        $(data[key].el).removeClass('d-none');
        const updater = () => { runXPH(key, true); };
        data[key].loop = setInterval(updater, 1000);
    };

    /** @param {XPHKey} key */
    const toggleRunning = (key) => {
        if (data[key].running) { return stopRunning(key); }
        return startRunning(key);
    };

    let XPHtoggledOff = false;

    const startXPH = () => {
        const n = currentSkillId();
        if (n === -1) { return; }
        const key = 'xph';
        let skill = (typeof n === 'string') ? n : stats[n];
        if (skill == data[key].skill && !XPHtoggledOff) {
            XPHtoggledOff = true;
            return;
        }
        XPHtoggledOff = false;
        data[key].skill = skill;
        $('#xph-skill').text(data[key].skill);
    };

    const startXPHC = () => {
        if (!isCurrentSkill('Hitpoints')) { return; } // Not in combat
        if ($('#combat-skill-progress-menu').attr('class').split(' ').includes('d-none')) { toggleCombatSkillMenu(); }
        if (currentPageName() !== 'Combat') { changePageByName('Combat'); }
    };


    const _startRunning = { xph: startXPH, xphc: startXPHC, xphf: () => { } };

    /**
     * @title XPH GUI function
     * @description One function for two buttons, one button uses n=11 for farming specific script
     * @param {number} n
     */
    const xphDisplay = (n) => {
        if (n == 11) { return toggleRunning('xphf'); }
        const currentSkill = currentSkillName();
        if (currentSkill !== '' && currentSkill !== 'Hitpoints') { return toggleRunning('xph'); }
        toggleRunning('xphc');
    };

    const COMBAT_LEVELS = 8;

    const injectXPHCGUI = () => {
        $('#combat-skill-progress-menu tr:first').append($('<th id="xphc-th" class="xphc d-none" style="width: 125px; text-align: right;">xp/h</th>'));
        $('#combat-skill-progress-menu tr:not(:first)').append($('<td class="font-w600 xphc d-none" style="text-align: right;"><small>...</small></td>'));
        for (let i = 0; i < COMBAT_LEVELS; i++) { $('.xphc:not(:first)')[i].id = 'xphc-' + i + '-rate'; }
        $('#combat-skill-progress-menu tr:first').append($('<th id="xphc-th2" class="xphc xphcl d-none" style="width: 210px; text-align: right;">Time to Level</th>'));
        $('#combat-skill-progress-menu tr:not(:first)').append($(`<td class="font-w600 xphc xphcl d-none" style="text-align: right;"><span>...</span> to <input type="number" id="xphc-lvl-in" name="xphc-lvl" min="2" style="width: 50px; margin-left: 0.25em;"></td>`)); //add level selector
        for (let i = 0; i < COMBAT_LEVELS; i++) {
            $('.xphcl:not(:first) span')[i].id = `xphc-${i}-lvl`;
            $('.xphcl:not(:first) input')[i].id = `xphc-${i}-lvl-in`;
        }
    };

    const XPHDialogText = `
    <div id="xph-dialog" class="block-content block-content-full text-center d-none">
        <h3 class="text-muted m-1"><span class="p-1 bg-info rounded" id="xph-rate">...</span> <span id="xph-skill"></span> XP per hour.</h3>
        <br>
        <h3 class="text-muted m-1"><span class="p-1 bg-info rounded" id="xph-time">0</span> seconds spent running XPH.</h3>
        <h4 class="text-muted m-1"><span id="xph-lvl">... hrs</span> to <input type="number" id="xph-lvl-in" name="xph-lvl-in" min="2" style="width: 60px;">
        <br>
    </div>`;

    const XPHFDialogText = `
    <div id="xphf-dialog" class="block-content block-content-full text-center d-none">
        <h3 class="text-muted m-1"><span class="p-1 bg-info rounded" id="xphf-rate">...</span> Farming XP per hour.</h3>
        <br>
        <h3 class="text-muted m-1"><span class="p-1 bg-info rounded" id="xphf-time">0</span> seconds spent running XPHf.</h3>
        <h4 class="text-muted m-1"><span id="xphf-lvl">... hrs</span> to <input type="number" id="xphf-lvl-in" name="xph-lvl-in" min="2" style="width: 60px;">
        <br>
    </div>`;

    const y = `
    <div class="block-content block-content-full text-center">
        <div class="text-muted m-1">
            The button below starts the XPH script for the skill you are currently idling. If you click it while it's running for the skill you're currently idling, it will toggle off.<br>
            If you're in combat, a custom XPH script will run for all combat skills simultaneously and display in the Combat Page's Skill Progress table.
        </div>
        <button id="xphBtn" class="btn btn-sm btn-dual m-1">Toggle XPH Display</button>
        <div class="text-muted m-1">NOTE: Only even remotely accurate after farming for a few hours.</div>
        <button id="xphBtnF" class="btn btn-sm btn-dual m-1">Toggle XPH for Farming</button>
    </div>`;

    //XPH GUI
    const injectXPHGUI = () => {
        const XPHGUI = `
            <div class="dropdown d-inline-block ml-2">
                <button type="button" class="btn btn-sm bg-info SEMI-gold" id="page-header-xph-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><small>XP/h</small></button>
                <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right p-0 border-0 font-size-sm" id="header-equipment-dropdown" aria-labelledby="page-header-xph-dropdown" x-placement="bottom-end" style="max-width: 90vw; position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-262px, 33px, 0px);">
                    <div class="p-2 bg-primary text-center"><h5 class="dropdown-header"><a class="text-white">Calculate XP Per Hour</a></h5></div>
                    ${y}
                    ${XPHDialogText}
                    ${XPHFDialogText}
                </div>
            </div>`;

        $('#page-header-potions-dropdown').parent().before($(XPHGUI));
        $('#xphBtn').on('click', () => xphDisplay(0));
        $('#xphBtnF').on('click', () => xphDisplay(11));
        injectXPHCGUI();
        //XPHcombat GUIxphDisplay

        //android game header space problem fix; reduces margins of header dropdown buttons to squeeze XPH in there.
        const is_android = navigator.userAgent.indexOf("Android") > -1;
        if (!is_android) { return; }
        $("#header-theme").children().eq(1).children().removeClass('ml-2');
        $("[id^='page-header-']" + "button").addClass('SEMI-android-narrow-btn');
    };

    function loadScript() {
        if (typeof confirmedLoaded !== 'undefined' && confirmedLoaded && !currentlyCatchingUp) {
            clearInterval(interval);
            console.log('Loading XP/h');
            injectXPHGUI();
        }
    }

    const interval = setInterval(loadScript, 500);
});
