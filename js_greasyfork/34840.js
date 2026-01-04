// ==UserScript==
// @name        Fallen Sanctum - Event list enhancements
// @namespace   https://www.fallen-sanctum.com/
// @match       https://www.fallen-sanctum.com/manual.php?p=events
// @author      dang
// @homepage    https://github.com/dang-nabbit/fs-event-enhancements
// @description Enhancements for Fallen Sanctum event list page
// @version     0.5
// @icon        https://www.google.com/s2/favicons?domain=https://www.fallen-sanctum.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34840/Fallen%20Sanctum%20-%20Event%20list%20enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/34840/Fallen%20Sanctum%20-%20Event%20list%20enhancements.meta.js
// ==/UserScript==
var settings = {};
settings.separator = '|';
settings.skillLevelsString = 'Woodcutting: 37 (1,907,510 XP)|Construction: 35 (1,594,344 XP)|Digging: 26 (464,599 XP)|Gathering: 23 (292,504 XP)|Mining: 22 (271,793 XP)|Speed: 19 (152,567 XP)|Lockpicking: 18 (120,748 XP)|Fishing: 18 (107,317 XP)|Smithing: 17 (85,837 XP)|Crafting: 15 (62,232 XP)|Cooking: 10 (12,786 XP)|Strength: 9 (8,261 XP)|Fletching: 9 (8,227 XP)|Hunting: 8 (5,620 XP)|Defense: 7 (2,471 XP)|Stamina: 6 (1,821 XP)|Agility: 6 (1,521 XP)|Attack: 4 (281 XP)';
settings.skillLevels = getSkillLevels();
settings.colors = {
    highExp: '#0C0',
    lowExp: '#0CC',
    nextLevel: '#CC0',
    error: '#C00'
};
settings.skills = [
    {
        name: 'Baking',
        verbs: ['Bake']
    }, {
        name: 'Construction',
        verbs: ['Saw', 'Build']
    }, {
        name: 'Cooking',
        verbs: ['Churn', 'Cook']
    }, {
        name: 'Crafting',
        verbs: ['Carve', 'Craft']
    }, {
        name: 'Digging',
        verbs: ['Dig']
    }, {
        name: 'Farming',
        verbs: ['Harvest']
    }, {
        name: 'Fishing',
        verbs: ['Fish']
    }, {
        name: 'Fletching',
        verbs: ['Fletch']
    }, {
        name: 'Gathering',
        verbs: ['Gather', 'Milk', 'Pick', 'Search']
    }, {
        name: 'Herblore',
        verbs: ['Crush', 'Fill', 'Mix']
    }, {
        name: 'Hunting',
        verbs: ['Hunt']
    }, {
        name: 'Lockpicking',
        verbs: ['Smash', 'Unlock']
    }, {
        name: 'Mining',
        verbs: ['Mine']
    }, {
        name: 'Smithing',
        verbs: ['Smelt', 'Smith', 'Stitch']
    }, {
        name: 'Tailoring',
        verbs: ['Cure', 'Spin']
    }, {
        name: 'Woodcutting',
        verbs: ['Chop']
    }
];
settings.skillURLPrefix = 'https://www.fallen-sanctum.com/manual.php?skills=';

function getSkillLevels() {
    var skillLevelsArr = settings.skillLevelsString.split(settings.separator);
    var skillLevelsLen = skillLevelsArr.length;

    var skillString;
    var skillRegEx = /(.*?): (\d+)/;
    var skillMatch;
    var skillLevels = {};
    for (var i = 0; i < skillLevelsLen; i++) {
        skillString = skillLevelsArr[i];
        skillMatch = skillRegEx.exec(skillString);
        skillLevels[skillMatch[1]] = parseInt(skillMatch[2]);
    }

    return skillLevels;
}

function getEventSkill(verb) {
    var skills = settings.skills;
    var skillsLen = skills.length;
    var skill;

    for (var i = 0; i < skillsLen; i++) {
        skill = skills[i];

        if (skill.verbs.indexOf(verb) > -1) {
            return skill.name;
        }
    }
}

function getEventData(eventEl) {
    var eventData = {};

    var eventSkillString = eventEl.children.item(0).innerHTML;
    eventData.skillName = getEventSkill(eventSkillString.substr(0, eventSkillString.indexOf(' ')));
    eventData.level = parseInt(eventEl.children.item(1).innerHTML.match(/\d+/)[0]);

    return eventData;
}

function getHighlightColor(eventData, mySkillLevel) {
    var colors = settings.colors;

    if (!eventData.skillName) {
        return colors.error;
    } else if (eventData.level >= mySkillLevel - 5 && eventData.level <= mySkillLevel) {
        return colors.highExp;
    } else if (eventData.level < mySkillLevel) {
        return colors.lowExp;
    } else if (mySkillLevel === eventData.level + 1) {
        return colors.nextLevel;
    } else {
        return '';
    }
}

function removeMySkillLinks() {
    document.querySelectorAll('.mySkillLevel').forEach(e => e.parentNode.removeChild(e));
}

function getMySkillSpan(skillName, mySkillLevel) {
    var span = document.createElement('span');
    span.className = 'mySkillLevel';
    span.style.fontSize = '13px';

    span.appendChild(document.createTextNode(' -- [ '));

    if (skillName) {
        var anchor = document.createElement('a');
        anchor.href = settings.skillURLPrefix + skillName.toLowerCase();
        anchor.target = '_blank';
        anchor.innerHTML = skillName;
        span.appendChild(anchor);
        span.appendChild(document.createTextNode(': ' + mySkillLevel));
    } else {
        span.appendChild(document.createTextNode('Error: skill not found'));
    }

    span.appendChild(document.createTextNode(' ]'));

    return span;
}

function enhanceEvent(eventEl) {
    var eventData = getEventData(eventEl);
    var mySkillLevel = settings.skillLevels[eventData.skillName] || 1;

    eventEl.style.color = getHighlightColor(eventData, mySkillLevel);
    eventEl.appendChild(getMySkillSpan(eventData.skillName, mySkillLevel));
}

function enhanceEvents() {
    removeMySkillLinks();
    document.querySelectorAll('#farm_stats > span').forEach(enhanceEvent);
}

enhanceEvents();
