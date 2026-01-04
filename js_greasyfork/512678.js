// ==UserScript==
// @name        Pickpocket J.A.R.V.I.S.
// @namespace   http://tampermonkey.net/
// @version     1.52
// @description color pick-pocket targets based on difficulty
// @author      Terekhov+Tenren
// @match       https://www.torn.com/loader.php?sid=crimes*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/512678/Pickpocket%20JARVIS.user.js
// @updateURL https://update.greasyfork.org/scripts/512678/Pickpocket%20JARVIS.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const colors = {
    ideal: '#40AB24',
    easy: '#82C370',
    tooEasy: '#A4D497',
    tooHard: '#fa8e8e',
    uncategorized: '#DA85FF'
  };
  const ALL_MARK_TYPES = ['Businessman', 'Businesswoman', 'Classy lady', 'Cyclist', 'Drunk man', 'Drunk woman', 'Elderly man', 'Elderly woman', 'Gang member', 'Homeless person', 'Jogger', 'Junkie', 'Laborer', 'Mobster', 'Police officer', 'Postal worker', 'Rich kid', 'Sex worker', 'Student', 'Thug', 'Young man', 'Young woman'];
  const MARK_CS_LEVELS_MAP = {
    'Drunk man': '100',
    'Drunk woman': '100',
    'Elderly man': '100',
    'Elderly woman': '100',
    'Homeless person': '100',
    Junkie: '100',
    'Classy lady': '150',
    Laborer: '150',
    'Postal worker': '150',
    'Young man': '150',
    'Young woman': '150',
    Student: '150',
    'Rich kid': '200',
    'Sex worker': '200',
    Thug: '200',
    Businessman: '250',
    Businesswoman: '250',
    Jogger: '250',
    'Gang member': '250',
    Mobster: '250',
    Cyclist: '300',
    'Police officer': '350'
  };

//
// Based on guide here https://www.torn.com/forums.php#/p=threads&f=61&t=16358739&b=0&a=0
// Thanks Emforus [2535044]!
//
// This script is triggered down at the bottom; see formatCurrentCrimesContainer and startListeningToFormatNewCrimes
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Global functions - these are not specific to Torn, but provide utilities for us
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function addGlobalStyle(css) {
//   var head, style;
//   head = document.getElementsByTagName('head')[0];
//   if (!head) { return; }
//   style = document.createElement('style');
//   style.type = 'text/css';
//   style.innerHTML = css;
//   head.appendChild(style);
// }

  const minLsKey = 'pickpocketMinDisplay';
  const maxLsKey = 'pickpocketMaxDisplay';
  const pickpocketLimitsDivId = 'pickpocketLimitsDiv';
  let levelLimitsAdded = false;
  function addAndListenToLevelLimits() {
    var _localStorage$getItem, _localStorage$getItem2;
    if (levelLimitsAdded) {
      return;
    } else {
      removeLimitsDiv();
      levelLimitsAdded = true;
    }
    const minLsLevelToSet = (_localStorage$getItem = localStorage.getItem(minLsKey)) != null ? _localStorage$getItem : 100;
    const maxLsLevelToSet = (_localStorage$getItem2 = localStorage.getItem(maxLsKey)) != null ? _localStorage$getItem2 : 300;
    const titleContainer = document.querySelectorAll('[class^="appHeader"]')[0];
    const limitsDiv = document.createElement('div');
    limitsDiv.id = pickpocketLimitsDivId;
    limitsDiv.innerHTML = `
  <label for="minlvl">Min Lvl:</label>
  <input type="number" id="terek_minlvl" name="minlvl" min="100" max="250" step="50" value="${minLsLevelToSet}" />
  <label for="maxlvl">Max Lvl:</label>
  <input type="number" id="terek_maxlvl" name="maxlvl" min="150" max="300" step="50" value="${maxLsLevelToSet}" />
  `;
    titleContainer.appendChild(limitsDiv);
    document.querySelector('#terek_minlvl').addEventListener('input', e => {
      const minLvlElement = e.target;
      localStorage.setItem(minLsKey, minLvlElement.value);
      formatCurrentCrimesContainer();
    });
    document.querySelector('#terek_maxlvl').addEventListener('input', e => {
      const maxLvlElement = e.target;
      localStorage.setItem(maxLsKey, maxLvlElement.value);
      formatCurrentCrimesContainer();
    });
  }
  function removeLimitsDiv() {
    const limitsDiv = document.getElementById(pickpocketLimitsDivId);
    if (limitsDiv) {
      limitsDiv.remove();
    }
  }

// Need to wait for page to initialize, before we know this. Assume 1, until then
  let currentSkillLevel = 1;
  function findChildByClassStartingWith(name, parentEle) {
    for (const child of parentEle.children) {
      for (const childClass of child.classList) {
        if (!!childClass && childClass.startsWith(name)) {
          return child;
        }
      }
      if (child.children) {
        const innerResult = findChildByClassStartingWith(name, child);
        if (innerResult) {
          return innerResult;
        }
      }
    }
    return null;
  }

  /**
   *
   * @return {
   *    csSemantic: "tooHard", // Police officer when you're lvl 1
   *    activitySemantic: "ideal",    // Businesswoman "on phone"
   *    buildSemantic: "tooHard"     // Skinny businessman,
   *    finalSemantic: "tooHard"
   * }
   */
  function setColorsForCrimeTarget(crimeChild) {
    var _localStorage$getItem3, _localStorage$getItem4;
    const crimesDivAkaSections = findChildByClassStartingWith('sections', crimeChild);
    const mainSection = findChildByClassStartingWith('mainSection', crimesDivAkaSections);
    const targetTypeEle = findChildByClassStartingWith('titleAndProps', mainSection).children[0];
    let targetType;
    for (const type of ALL_MARK_TYPES) {
      if (targetTypeEle.textContent.startsWith(type)) {
        // Handle mobile view e.g. "Police officer 5m 10s"
        targetType = type;
      }
    }
    const minLsLevel = (_localStorage$getItem3 = localStorage.getItem(minLsKey)) != null ? _localStorage$getItem3 : 100;
    const maxLsLevel = (_localStorage$getItem4 = localStorage.getItem(maxLsKey)) != null ? _localStorage$getItem4 : 300;
    if (MARK_CS_LEVELS_MAP[targetType] < minLsLevel || MARK_CS_LEVELS_MAP[targetType] > maxLsLevel) {
      crimeChild.style.display = 'none';
    } else if (crimeChild.style.display === 'none') {
      crimeChild.style.display = 'block';
    }

    // e.g. Average 5'0" 158 lbs
    const physicalPropsEle = findChildByClassStartingWith('titleAndProps', mainSection).children[1];
    const physicalProps = physicalPropsEle.textContent;

    // Average
    const build = physicalProps.substring(0, physicalProps.indexOf(' '));

    // e.g. Begging0s
    const activityEle = findChildByClassStartingWith('activity', mainSection);
    const activity = activityEle.textContent;

    // e.g. Begging
    // The ternary handles mobile - in mobile we don't get the status like "Begging" so we can't do optimize there.
    const activityName = activity.match(/^\D+/) ? activity.match(/^\D+/)[0] : '';

    // e.g. 0s
    // const activityTime = activity.substring(activityName.length);

    //
    // type DifficultySemantic = 'ideal' | 'easy' | 'tooEasy' | 'tooHard' | 'uncategorized'
    // interface Difficulties: { [key]: DifficultySemantic } = {
    //   csSemantic: 'tooHard',       // Police officer when you're lvl 1
    //   activitySemantic: 'ideal',    // Businesswoman 'on phone'
    //   buildSemantic: 'tooHard'     // Skinny businessman
    //   finalSemantic: 'tooHard',    // Based on all the above
    // }
    //
    const difficulties = getDifficulties(targetType, build, activityName);

    //
    // Now Set all the colors
    //
    if (difficulties.buildSemantic) {
      physicalPropsEle.style.color = colors[difficulties.buildSemantic];
    }
    if (difficulties.activitySemantic) {
      activityEle.style.color = colors[difficulties.activitySemantic];
    }
    for (const type of ALL_MARK_TYPES) {
      if (targetTypeEle.textContent.startsWith(type)) {
        // Handle mobile view e.g. "Police officer 5m 10s"
        if (targetTypeEle.textContent.indexOf('%)') === -1) {
          targetTypeEle.textContent = targetTypeEle.textContent + ` (${MARK_CS_LEVELS_MAP[type]}%)`;
        }
        targetTypeEle.style.color = colors[difficulties.csSemantic];
      }
    }

    // Set 'Pickpocket' button color
    const divContainingButton = findChildByClassStartingWith('commitButtonSection', crimesDivAkaSections);
    divContainingButton.style.backgroundColor = colors[difficulties.finalSemantic];
  }
  const skillCats = ['Safe', 'Moderately Unsafe', 'Unsafe', 'Risky', 'Dangerous', 'Very Dangerous'];
  const skillStarts = [1, 10, 35, 65, 90, 100];
  function getMaxSkillIndex() {
    let idx = 0;
    skillStarts.forEach((ele, currentIdx) => {
      if (Math.floor(currentSkillLevel) >= ele) {
        idx = currentIdx;
      }
    });
    return idx;
  }
  function getAllSafeSkillCats() {
    const maxIndex = getMaxSkillIndex();
    if (maxIndex >= skillCats.length) {
      return skillCats.slice();
    } else {
      return skillCats.slice(0, maxIndex + 1);
    }
  }
  const markGroups = {
    // CS 1-20
    Safe: ['Drunk man', 'Drunk woman', 'Homeless person', 'Junkie', 'Elderly man', 'Elderly woman'],
    // CS 10-70
    'Moderately Unsafe': ['Laborer', 'Postal worker', 'Young man', 'Young woman', 'Student', 'Classy lady'],
    // CS 35-90
    Unsafe: ['Rich kid', 'Sex worker', 'Thug'],
    // CS 65+
    Risky: ['Jogger', 'Businessman', 'Businesswoman', 'Gang member'],
    // CS 85+
    Dangerous: ['Cyclist'],
    // ???
    'Very Dangerous': ['Mobster', 'Police officer']
  };

  /**
   * @param mark e.g. 'Rich Kid'
   *
   * @return 'ideal' | 'easy' | 'tooEasy' | 'tooHard' | 'uncategorized'
   */
  function getMarkIdealityBasedOnCS(mark) {
    // type colorSemantic = 'ideal' | 'easy' | 'tooEasy' | 'tooHard' | 'uncategorized'
    const safeSkillCats = getAllSafeSkillCats();
    for (let idx = 0; idx < safeSkillCats.length; idx++) {
      const safeSkillCat = safeSkillCats[idx];
      if (markGroups[safeSkillCat].includes(mark)) {
        if (idx === safeSkillCats.length - 1) {
          return 'ideal';
        } else if (idx === safeSkillCats.length - 2) {
          return 'easy';
        } else {
          return 'tooEasy';
        }
      }
    }
    return 'tooHard';
  }

  /**
   *
   * @param markType  Elderly woman
   * @param build     Average
   * @param status    Begging
   *
   * @return {
   *    csSemantic: "tooHard", // Police officer when you're lvl 1
   *    activitySemantic: "ideal",    // Businesswoman "on phone"
   *    buildSemantic: "tooHard"     // Skinny businessman,
   *    finalSemantic: "tooHard"
   * }
   */
  function getDifficulties(markType, build, status) {
    // TODO builds and statuses to favor. Too much for now
    const buildsToAvoid = {
      'Drunk man': ['Muscular', 'Heavyset'],
      'Elderly man': ['Muscular'],
      'Elderly woman': ['Muscular'],
      'Homeless person': ['Heavyset'],
      Junkie: ['Average'],
      Student: ['Athletic'],
      'Classy lady': ['Skinny', 'Average'],
      'Rich kid': ['Skinny', 'Average', 'Heavyset'],
      'Sex worker': ['Athletic', 'Muscular'],
      Thug: ['Muscular'],
      Businessman: ['Skinny'],
      Businesswoman: ['Heavyset'],
      'Gang member': ['Skinny', 'Muscular'],
      Jogger: ['Skinny', 'Athletic'],
      Mobster: ['Average', 'Muscular', 'Heavyset']
    };
    const statusesToAvoid = {
      'Drunk man': ['Distracted'],
      'Drunk woman': ['Distracted'],
      'Homeless person': ['Loitering'],
      Junkie: ['Loitering'],
      'Young man': ['Walking'],
      'Young woman': ['Walking', 'Distracted', 'Listening to music'],
      Student: ['Walking'],
      Laborer: ['Walking', 'Distracted'],
      'Sex worker': ['Distracted', 'Soliciting'],
      Thug: ['Loitering', 'Walking'],
      Businessman: ['Walking'],
      Businesswoman: ['Walking'],
      // Jogger: ['Jogging'],
      'Police officer': ['Walking']
    };
    const difficulties = {
      csSemantic: 'uncategorized',
      activitySemantic: undefined,
      buildSemantic: undefined,
      finalSemantic: 'uncategorized'
    };

    // type colorSemantic = 'ideal' | 'easy' | 'tooEasy' | 'tooHard' | 'uncategorized'
    difficulties.csSemantic = getMarkIdealityBasedOnCS(markType);

    // We use csSemantic as baseline; activity and build can override.
    difficulties.finalSemantic = difficulties.csSemantic;
    if (buildsToAvoid[markType] && buildsToAvoid[markType].includes(build)) {
      difficulties.finalSemantic = 'tooHard';
      difficulties.buildSemantic = 'tooHard';
    }
    if (statusesToAvoid[markType] && statusesToAvoid[markType].includes(status)) {
      difficulties.finalSemantic = 'tooHard';
      difficulties.activitySemantic = 'tooHard';
    }
    return difficulties;
  }
  function getCrimesContainer() {
    const crimesContainerName = document.querySelectorAll('[class^="crimeOptionGroup"]')[0].classList[0];
    return document.getElementsByClassName(crimesContainerName)[0];
  }
  function setSkillLevel() {
    currentSkillLevel = document.getElementsByClassName('slick-slide')[0].children[0].children[0].children[0].children[1].textContent;
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// The part of the script that starts listening to the page is below
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// If we land directly on pickpocket page, these handle it correctly.
  if (window.location.href.includes('#/pickpocketing')) {
    setTimeout(startListeningToFormatNewCrimes, 650);
  }

//
// GreaseMonkey can't listen for Pickpocket page directly, so we run this on all crimes pages.
// however if we navigate away from Pickpocket, we stop listening with our observer
//
  function handleCrimesHeaderMutation(mutations) {
    const headerText = mutations[0].target.textContent;
    if (headerText === 'Pickpocketing') {
      setTimeout(startListeningToFormatNewCrimes, 650);
    } else if (observer) {
      removeLimitsDiv();
      observer.disconnect();
      observer = undefined;
    }
  }

  let crimesHeaderTarget = document.querySelector('.crimes-app h4[class^="heading"');
  let crimesHeaderObserver = new MutationObserver(handleCrimesHeaderMutation);
  crimesHeaderObserver.observe(crimesHeaderTarget, { characterData: true, attributes: false, childList: false, subtree: true});

  function formatCurrentCrimesContainer() {
    setSkillLevel();
    addAndListenToLevelLimits();
    for (const node of getCrimesContainer().children) {
      setColorsForCrimeTarget(node);
    }
  }

  let observer;
  function startListeningToFormatNewCrimes() {
    if (observer) {
      return;
    }

    formatCurrentCrimesContainer();
    setSkillLevel();
    addAndListenToLevelLimits();

    // Select the node that will be observed for mutations
    const targetNode = getCrimesContainer();

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: false };

    // Callback function to execute when mutations are observed
    const callback = mutationList => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of targetNode.children) {
            setColorsForCrimeTarget(node);
          }
        }
      }
    };

    // Create an observer instance linked to the callback function
    observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  }

})();
