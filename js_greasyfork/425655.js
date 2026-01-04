// ==UserScript==
// @name         Duolingo LevelJumper
// @namespace    esh
// @version      3.0.1
// @description  Provides an menu to easy jump to the first lesson of a skill level (e.g. 3 crowns) and to the last learned level.
// @match        https://*.duolingo.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duolingo.com
// @downloadURL https://update.greasyfork.org/scripts/425655/Duolingo%20LevelJumper.user.js
// @updateURL https://update.greasyfork.org/scripts/425655/Duolingo%20LevelJumper.meta.js
// ==/UserScript==

const VERSION = '3.0.1';
const LOG_STRING = 'DuolingoLevelJumper ' + VERSION;
const SKILL_QS = '[data-test="skill"]';
const FLOATING_BUTTONS = '._1Hxe4';
const config = {};
config.init = false;
config.ignoreLegendaray = true;
config.autoScroll = 'off';

// Print nice debug statements
function debug(s) {
  let name = (debug.caller !== null) ? debug.caller.name : '';
  if (typeof (s) === 'object') {
    console.debug(LOG_STRING + ' ' + name + '(): ');
    console.debug(s);
  } else {
    console.debug(LOG_STRING + ' ' + name + '(): ' + s);
  }
}

(function () {
  'use strict';
  new MutationObserver(start).observe(document.body, {
    childList: true,
    subtree: true
  });
  debug('MutationOberserver running');
})();

window.addEventListener('load', function () {
  autoScroll();
});

// entry point for mutation observer
function start() {
  // only run, when we are in the learning tree page
  if (window.location.pathname.includes('/learn')) {
    init();
  } else {
    // reset config to allow reindexing when we come back to the learning tree page
    config.init = false;
  }
}

// init the one time run functions
function init() {
  const skills = document.querySelectorAll(SKILL_QS);
  if (skills.length > 0 && !config.init) {
    config.init = true;
    getConfig();
    prepareJumpTargets(skills);
    addJumpMenu();
  }
}
// gets stored config data
function getConfig() {
  const duoState = JSON.parse(localStorage.getItem('duo.state'));
  config.lLang = duoState.user.learningLanguage;
  config.fLang = duoState.user.fromLanguage;
  config.langConfig = config.lLang + '_' + config.fLang;
  config.autoJump = GM_getValue('DuolingoLevelJumper-autoJump-' + config.langConfig, '0');
  config.level0 = GM_getValue('DuolingoLevelJumper-level0-' + config.langConfig, '0');
  config.level1 = GM_getValue('DuolingoLevelJumper-level1-' + config.langConfig, '0');
  config.level2 = GM_getValue('DuolingoLevelJumper-level2-' + config.langConfig, '0');
  config.level3 = GM_getValue('DuolingoLevelJumper-level3-' + config.langConfig, '0');
  config.level4 = GM_getValue('DuolingoLevelJumper-level4-' + config.langConfig, '0');
  config.level5 = GM_getValue('DuolingoLevelJumper-level5-' + config.langConfig, '0');
  config.levelCrown = GM_getValue('DuolingoLevelJumper-levelCrown-' + config.langConfig, '0');
  config.levelBroken = GM_getValue('DuolingoLevelJumper-levelBroken-' + config.langConfig, '0');
  config.tree = GM_getValue('DuolingoLevelJumper-tree-' + config.langConfig, '');
  config.lastLevel = GM_getValue('DuolingoLevelJumper-lastLevel-' + config.langConfig, 'DuolingoLevelJumper_0');

  buildIndex(duoState.skills);

  debug('loading config');
}

// stores config data
function setConfig() {
  GM_setValue('DuolingoLevelJumper-lastLevel-' + config.langConfig, config.lastLevel);
}

// build a sorted skills list
function buildIndex(skillList) {
  const index = {};
  const rows = {};
  const skillElements = {};
  index[0] = [];
  index[1] = [];
  index[2] = [];
  index[3] = [];
  index[4] = [];
  index[5] = [];
  index['finalLevel'] = [];
  index['decayed'] = [];
  index['crown'] = [];
  index['lastLevel'] = [];
  let i = 0;
  for (element in skillList) {
    const skill = skillList[element];
    skill.id = 'DuolingoLevelJumper_' + i;
    rows[skill.row] = skill.id;
    skillElements[skill.id] = skill;
    if (skill.accessible) {
      if (skill.id === config.lastLevel) {
        index['lastLevel'] = [skill];
      }
      if (skill.finishedLevels === skill.levels) {
        index['crown'].push(skill);
      } else if (skill.decayed) {
        index['decayed'].push(skill);
      } else {
        if (config.ignoreLegendaray && skill.finishedLevels === skill.levels - 1) {
          index['finalLevel'].push(skill);
        } else {
          index[skill.finishedLevels].push(skill);
        }
      }
      i++;
    }
  }
  config.skillElements = skillElements;
  config.skillRows = rows;
  config.skills = index;
}

// set target ids to all skills
function prepareJumpTargets(skills) {
  skills.forEach(function (element, index) {
    element.id = 'DuolingoLevelJumper_' + index;
    element.addEventListener('click', function () {
      config.skills['lastLevel'] = config.skillElements[element.id];
      config.lastLevel = element.id;
      setConfig();
      document.querySelector('#jumpMenu_lastLevel').children[1].innerText = index;
      document.querySelector('#jumpMenu_lastLevel').href = getJumpTarget(config.skillElements[element.id]);
      // TODO: prevent setting it for unaccessible skills
    })
  });
  debug('setting all jump targets');
}


// adds the jump menu underneath the floating plus button
function addJumpMenu() {
  let insertElement = document.querySelector(FLOATING_BUTTONS);
  let jumpMenu = document.createElement('div');
  jumpMenu.innerHTML = '<button class="_2qIaj _2kfEr _1nlVc _2fOC9 UCrz7 t5wFJ _3tP0w">';
  jumpMenu.innerHTML += prepareJumpMenuEntry('decayed');
  // does it make any sense displaying crowns?
  // jumpMenu.innerHTML += prepareJumpMenuEntry('crown');
  jumpMenu.innerHTML += prepareJumpMenuEntry('finalLevel');
  jumpMenu.innerHTML += prepareJumpMenuEntry('5');
  jumpMenu.innerHTML += prepareJumpMenuEntry('4');
  jumpMenu.innerHTML += prepareJumpMenuEntry('3');
  jumpMenu.innerHTML += prepareJumpMenuEntry('2');
  jumpMenu.innerHTML += prepareJumpMenuEntry('1');
  jumpMenu.innerHTML += prepareJumpMenuEntry('0');
  jumpMenu.innerHTML += prepareJumpMenuEntry('lastLevel');
  jumpMenu.innerHTML += '</button>';
  insertElement.insertAdjacentElement('beforeend', jumpMenu);
  debug('adding jump menu');
}

// One entry with right crown image and number
function prepareJumpMenuEntry(skill) {
  const listLength = config.skills[skill].length;
  if (listLength === 0) return '';
  let target = getJumpTarget(config.skills[skill][0]);
  let crownImage;
  let crownClass;
  let crownNumber = skill;
  if (skill === '0') {
    // grey crown
    crownImage = '//d35aaqx5ub95lt.cloudfront.net/images/fafe27c9c1efa486f49f87a3d691a66e.svg';
    crownNumber = '';
    // } else if (skill === 'finalLevel') {
    // legendary crown
    //crownImage = '//d35aaqx5ub95lt.cloudfront.net/images/crowns/dc4851466463c85bbfcaaaaae18e1925.svg'
  } else {
    // golden crown
    crownImage = '//d35aaqx5ub95lt.cloudfront.net/images/b3ede3d53c932ee30d981064671c8032.svg';
  }
  const normalSkills = ['0', '1', '2', '3', '4', '5', 'finalLevel', 'lastLevel'];
  if (normalSkills.includes(skill)) {
    crownClass = "GkDDe";
  } else {
    crownClass = "GkDDe _1m7gz";
    crownNumber = '';
  }
  if (skill === 'finalLevel') crownNumber = '';
  if (skill === 'lastLevel') crownNumber = ((config.skills[skill][0].id).split('_'))[1];
  return `<div class="_2-dXY" style="font-size: 14.84px;">
  <a id="jumpMenu_${skill}" href="${target}">
    <img alt="crown" class="_18sNN" style="width:32px; height:26px;" src="${crownImage}">
    <div class="${crownClass}" style="top:40%;" data-test="level-crown">${crownNumber}</div>
  </a>
</div>`;
}

// get jump target (one row before) given element
function getJumpTarget(element) {
  let target = config.skillRows[element.row - 1];
  target = (target === undefined) ? 'javascript:scroll(0,0);' : '#' + target;
  return target;
}

// triggers autoScrolling
function autoScroll() {
  if (config.autoScroll !== 'off') {
    document.getElementById('jumpMenu_' + config.autoScroll).click();
    debug(config.autoScroll);
  }
}
