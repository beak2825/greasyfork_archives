// ==UserScript==
// @name         IQRPG Labyrinth Companion
// @namespace    https://www.iqrpg.com/
// @version      1.1.0
// @author       Tempest
// @description  QoL enhancement for IQRPG Labyrinth
// @homepage     https://slyboots.studio/iqrpg-labyrinth-companion/
// @source       https://github.com/SlybootsStudio/iqrpg-labyrinth-companion
// @match        https://*.iqrpg.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @license      unlicense
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454607/IQRPG%20Labyrinth%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/454607/IQRPG%20Labyrinth%20Companion.meta.js
// ==/UserScript==

/* global $ */


const SHOW_ROOM_NUMBER = 1;
const SHOW_ROOM_TIER = 1;
const SHOW_ROOM_CHANCE = 1;
const SHOW_ROOM_ESTIMATE = 1;
const SHOW_ROOM_TOTAL = 1;

const MODIFY_NAVIGATION = 1; // 0 - Don't modify nav button, 1 - modify nav button (default)


const NAVITEM_LABY = 7; // Which nav item to style
const RENDER_DELAY = 200; // milliseconds after view loads to render companion
const SKILL_BOX_INDEX = 3; // Will be 2, or 3, depending on Land status.

const MAX_ACTIONS = 100; // This may change in the future if the developer allows an increase.
// If that happens, we'll want to read this from the payload data, and not hard code it.

const CACHE_LAB = "cache_lab"; // Cache for all the
const CACHE_LAB_NAV = "cache_lab_nav";

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//
// CACHE
// We are caching the daily labyrinth,
// which is updated each time to labyrinth page is visited.
// The cached data is used when the labyrinth is being run.
//
function writeCache( key, data ) {
  localStorage[key] = JSON.stringify(data);
}

function readCache( key ) {
  return JSON.parse(localStorage[key] || null) || localStorage[key];
}

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

function renderLaby(data, skills) {

    // Create 3rd column
    let wrapper = $('.two-columns');
    let col3 = $('.two-columns__column', wrapper).eq(1).clone();
    $(wrapper).append(col3);

    // Cache data
    data = JSON.parse(data);
    writeCache(CACHE_LAB, data);

    // On the Laby page, 'currentRoom' refers to the completed rooms.
    // On Laby Run, currentRoom is the target room you're TRYING to pass.
    data.currentRoom += 1;

    // Render table
    renderLabyTable(data, col3, skills);
    writeNavCache(data.turns, data.maxTurns, data.rewardObtained);
}

function renderLabyFromCache(data, skills) {

    let col = $('.labytable');

    // Check to make sure a Laby table doesn't currently exist.
    // If it does, we'll update it.
    // If it doesn't, we'll create one.
    if( !col.length ) {
      let wrapper = $('.main-game-section');
      $(wrapper).css('position', 'relative');
      col = $('.main-section__body', wrapper).clone();
      $(col).css('position', 'absolute');
      $(col).css('top', '30px');
      $(col).css('right', '0');
      $(col).addClass('labytable');
      $(wrapper).append(col);
    }

    data = JSON.parse(data);
    let cached = readCache(CACHE_LAB);

    // Use the cached data for the Laby table, but update the `currentRoom` based
    // on our most up to date information about player progress.
    cached.currentRoom = data?.data?.currentRoom || 0;
    renderLabyTable(cached, col, skills);

    writeNavCache(data.data.turns, data.data.maxTurns, false);
}

/**
 * Lookup a skill name by ID.
 *
 * Labyrinth rooms use an ID to reference which
 * skill is used.
 *
 * @param {Number} id
 *
 * @return {String}
 */
function getSkillNameById(id) {

    let name = "";

    switch(id) {
        case 1: name = "Battling"; break;
        case 2: name = "Dungeon"; break;
        case 3: name = "Mining"; break;
        case 4: name = "Wood"; break;
        case 5: name = "Quarry"; break;
        case 6: name = "Rune"; break;
        case 7: name = "Jewelry"; break;
        case 8: name = "Alchemy"; break;
    }

    return name;
}

/**
 * Lookup a skill name by ID.
 *
 * Labyrinth rooms use an ID to reference which
 * skill is used.
 *
 * @param {Number} roomId
 * @param {Number} currentRoomId
 *
 * @return {String} style
 */
function getStyleByRoomState(roomId, currentRoomId) {

    let style = "";

    if(currentRoomId == roomId ) {
        // Active  Rooms are Yellow Background
        // with Black Text
        style = "background-color: #cc0; color: #000;";
    }

    // Incomplete Rooms are Red Background
    else if(currentRoomId < roomId ) {
        style = "background-color: #600;";
    }

    // Completed Rooms are Green Background
    else if(currentRoomId > roomId ) {
     style = "background-color: #006400;";
    }

    return style;
}

/**
 * Get the percent chance you have to progress
 * through a room, based on the tier of the room
 * and skill level.
 *
 * @param {Number} tier
 * @param {Number} skill
 *
 * @return {Float} chance
 */
function getChanceBySkill(tier, skill) {

    let base = 1;

    switch(tier) {
        case 1: base = 700; break;
        case 2: base = 1000; break;
        case 3: base = 1400; break;
        case 4: base = 1900; break;
        case 5: base = 2500; break;
    }

    let chance = 1000 / base * skill;
    chance = parseFloat(chance / 10).toFixed(2);

    return chance;
}

/**
 * Render the labyrinth table.
 *
 * @param {Object} data
 * @param {domElement} ele
 * @param {Array} skills
 */
function renderLabyTable(data, ele, skills) {

    let remaining = data.maxTurns;

    const trStyle = 'border:1px solid black;';
    const tdStyle = 'padding:3px;border-top:1px solid black;';

    const showNumber = SHOW_ROOM_NUMBER === 1 ? "" : "display:none;";
    const showTier = SHOW_ROOM_TIER === 1 ? "" : "display:none;";
    const showChance = SHOW_ROOM_CHANCE === 1 ? "" : "display:none;";
    const showEstimate = SHOW_ROOM_ESTIMATE === 1 ? "" : "display:none;";
    const showTotal = SHOW_ROOM_TOTAL === 1 ? "" : "display:none;";

    let html = '';
    html += '<div style="width:100%;">'
    html += '<table style="border-spacing:0;float:right;">';
    html += `<tr style='${trStyle}'>`;
    html += `<td style='${tdStyle}'>Room</td>`;
    html += `<td style='${tdStyle}${showTotal}'>(T)Skill</td>`;
    html += `<td style='${tdStyle}${showChance}'>Chance</td>`;
    html += `<td style='${tdStyle}${showEstimate}'>Est</td>`;
    html += `<td style='${tdStyle}${showTotal}'>Total</td>`;

    data.data.map( (room, i) => {

        let skill = room[0];
        let tier = room[1];
        const style = getStyleByRoomState(i+1, data.currentRoom);
        const skillName = getSkillNameById(skill);
        const chance = getChanceBySkill(tier, skills[skill-1]);
        const estimated = Math.round(100/chance);
        remaining -= estimated;


        html += `<tr style='${style};${trStyle}'>`;
        html += `<td style='${tdStyle}'>${i+1}</td>`;
        html += `<td style='${tdStyle}${showTotal}'>(${tier})${skillName}</td>`;
        html += `<td style='${tdStyle}${showChance}'>${chance}%</td>`;
        html += `<td style='${tdStyle}${showEstimate}'>${estimated}</td>`;
        html += `<td style='${tdStyle}${showTotal}'>${100 - remaining}</td>`;

        html += `</tr>`;
    });

    html += "</table></div>";

    ele.html(html);
}

/**
 * Update the Labyrinth button in the navigation to match the state of progress.
 *
 * @param {Object} data
 * @param {domElement} ele
 * @param {Array} skills
 */
function updateNavigation() {

    // Players can disable modification entirely using this setting.
    if(!MODIFY_NAVIGATION) {
        return;
    }

    // This is the payload we should be pulling out from cache
    /*
     * data : {
     *   turns
     *   maxTurns
     *   rewardObtained
     *   date
     * }
     */
    let data = readCache(CACHE_LAB_NAV);


    // We only want to use cached data from today.
    // Set to New York Timezone, which matches server time.
    let date = new Date();
    let _date = date.toLocaleString('en-GB', { timeZone: 'America/New_York' }).split(',')[0];
    if( _date != data?.date) {
        data = undefined;
    }

    //console.log(_date, data?.date);

    let link = $('.nav a').eq(NAVITEM_LABY);

    if(!data) {
        // We lack information until the user clicks on Labyrinth
        $(link).css('font-weight', 'bold');
        $(link).css('color', 'white');
        $(link).css('background-color', 'red');
        $(link).html("Labyrinth [Need Info]");
    } else if (data.turns < data.maxTurns) {
        // User has turns remaining
        $(link).css('color', 'yellow');
        $(link).css('font-weight', 'bold');
        $(link).css('background-color', 'red');
        $(link).html("Labyrinth [Unfinished]");
    } else if(!data.rewardObtained) {
        // Labyrinth is complete, but reward unclaimed
        $(link).css('color', 'red');
        $(link).css('font-weight', 'bold');
        $(link).css('background-color', 'white');
        $(link).html("Labyrinth [CLAIM LOOT]");
    } else if(data.rewardObtained) {
        // Labyrinth is complete, Reward claimed
        $(link).css('color', '#ccc');
        $(link).css('font-weight', 'normal');
        $(link).css('background-color', '');
        $(link).html("Labyrinth [Complete]");
    }
}

function writeNavCache(turns, maxTurns, rewardObtained) {

    let date = new Date();
    const _date = date.toLocaleString('en-GB', { timeZone: 'America/New_York' }).split(',')[0];

    const payload ={
        turns : turns ?? 0,
        maxTurns : maxTurns ?? MAX_ACTIONS,
        rewardObtained : rewardObtained ?? false,
        date : _date
    }

    //console.log("Cache", payload);

    writeCache(CACHE_LAB_NAV, payload);
    updateNavigation();
}

/**
 * Parse the Skill box into an array of your skill levels
 *
 * This works whether or not the box is collapsed.
 *
 * @return {Array} skills
 */
function parseSkills() {

    // New players won't have the 'Land' main-section box,
    // which appears above 'Skills'. We need to check the text
    // To make sure we're in the right box.

    // For new players, this is skills.
    // For land players, this is land.
    let text = $('.main-section').eq(SKILL_BOX_INDEX - 1).text();

    if(!text.includes('Skills')) {
        // For new players, this is center content.
        // For land players, this is skills.
        text = $('.main-section').eq(SKILL_BOX_INDEX).text();
    }

    //
    // The html has been converted into a text string.
    // Now we parse the string into an array.
    text = text.replace('Skills', '');
    text = text.replaceAll('(', '');

    let skills = text.split(')');

    skills = skills.map( skill => {
        // "skillname (level)"
        skill = skill.trim();
        skill = skill.split(' ');
        return skill[1];
    });

    return skills;
}

let loadOnce = false;

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

let send = window.XMLHttpRequest.prototype.send;

function sendReplacement(data) {
    if(this.onreadystatechange) {
        this._onreadystatechange = this.onreadystatechange;
    }

    this.onreadystatechange = onReadyStateChangeReplacement;
    return send.apply(this, arguments);
}


function onReadyStateChangeReplacement() {

    //
    // This is called anytime there is an action complete, or a view (page) loads.
    // console.log('Response URL', this.responseURL);
    //
    setTimeout( () => {
        //
        // Player Loading the Labyrinth View
        //
        if(this.responseURL.includes("php/misc.php?mod=loadLabyrinth")) {
            // LoadOnce is tracked because this function can be triggered
            // multiple times in a single call.
            if(this.response && !loadOnce) {
              loadOnce = true;
              $('.labytable').remove(); // Remove old table
              let skills = parseSkills(); // Scans skill table
              renderLaby(this.response, skills); // Render a new table.
            }
        }
        //
        // Player is running the Labyrinth
        //  - We're still on the labyrinth page, but the actions are being executed.
        //
        else if(this.responseURL.includes("php/actions/labyrinth.php")) {
            let skills = parseSkills();
            renderLabyFromCache(this.response, skills);
        }
        //
        // Player has claimed the Labyrinth reward
        //
        else if(this.responseURL.includes("misc.php?mod=getLabyrinthRewards")) {
            writeNavCache(MAX_ACTIONS, MAX_ACTIONS, true);
        }
        //
        // We're on another page, elsewhere in IQ
        //
        else {
            // Remove The Labyrinth table.
            $('.labytable').remove();
            loadOnce = false;
        }



    }, RENDER_DELAY );

            //
        // Update the navigation to make sure we're showing the latest information.
        //
        updateNavigation();

    /* Avoid errors in console */
    if(this._onreadystatechange) {
        return this._onreadystatechange.apply(this, arguments);
    } else {
        return this._onreadystatechange;
    }
}

window.XMLHttpRequest.prototype.send = sendReplacement;
