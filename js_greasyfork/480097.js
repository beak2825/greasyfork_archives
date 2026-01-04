// ==UserScript==
// @name         Torn War Highlighter - offline/idle & okay
// @namespace    http://torn.city.com.dot.com.com
// @version      1.1.2
// @description  Provide customizable sexy highlighting of war enemies in green, orange and red.
// @author       Ironhydedragon
// @match        https://www.torn.com/factions*
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/480097/Torn%20War%20Highlighter%20-%20offlineidle%20%20okay.user.js
// @updateURL https://update.greasyfork.org/scripts/480097/Torn%20War%20Highlighter%20-%20offlineidle%20%20okay.meta.js
// ==/UserScript==

/*  
      - any questions hit up IronHydeDragon [2420802]
      
      Features:
        - Sexy rendering: using torn color pallette
        - Green, Orange, Red highlighing options
        - Updates every 1s

      Possible Future Features
        - Display Estimated stats, xan/can/booster count
        - Option: Auto assign highlights based on xan/can/booster
        - Option: Auto assign highlights based on elo
  */

const GLOBAL_STATE = {
  userSettings: {
    highlightSettings: {
      highlightGreenIf: {
        // DEFAULT GREEN: ALL PLAYERS WITH OKAY & OFFLINE STATUSES

        status: ['Okay'], // Possible options are: ['Okay', 'Hospital', 'Travelling', 'Jail'] ### CASE SENSITIVE ###
        onOffIdle: ['offline'], // Possible options are: ['online', 'idle', 'offline']
        levelRange: [0, 100], // first number is lower level range, second number is higher level range
        includeExceptions: [], // array of players names (not case sensitive) that are OUTSIDE the level range you wish TO highlight, if they meet the other criteria
        excludeExceptions: [], // array of players that are INSIDE the level range you wish NOT TO highlight, if they meet the other criteria
      },

      highlightOrangeIf: {
        // DEFAULT ORANGE: ALL PLAYERS WITH OKAY & IDLE STATUSES

        status: ['Okay'], // Possible options are: ['Okay', 'Hospital', 'Travelling', 'Jail'] ### CASE SENSITIVE ###
        onOffIdle: ['idle'], // Possible options are: ['online', 'idle', 'offline']
        levelRange: [0, 100], // first number is lower level range, second number is higher level range
        includeExceptions: [], // array of players that are OUTSIDE the level range you wish TO highlight, if they meet the other criteria
        excludeExceptions: [], // array of players that are INSIDE the level range you wish NOT TO highlight, if they meet the other criteria
      },

      highlightRedIf: {
        // DEFAULT RED: NO-ONE HIGHLIGHTED RED

        status: ['Okay'], // Possible options are: ['Okay', 'Hospital', 'Travelling', 'Jail'] ### CASE SENSITIVE ###
        onOffIdle: ['offline', 'idle', 'okay'], // Possible options are: ['online', 'idle', 'offline']
        levelRange: [0, 0], // first number is lower level range, second number is higher level range
        includeExceptions: [], // array of players that are OUTSIDE the level range you wish TO highlight, if they meet the other criteria
        excludeExceptions: [], // array of players that are INSIDE the level range you wish NOT TO highlight, if they meet the other criteria
      },
    },
    refreshRateMs: 1000,
  },
};

////////  VARIABLES  ////////
const greenMossDark = '#4b5738';
const greenMossDarkTranslucent = 'rgb(75, 87, 56, 0.9)';
const greenMoss = '#57693a';
const greenMossTranslucent = 'rgb(87, 105, 58, 0.9)';
const greenApple = '#85b200';
const greenAppleTranslucent = 'rgba(134, 179, 0, 0.4)';

const orangeFulvous = '#d08000';
const orangeFulvousTranslucent = 'rgba(209, 129, 0, 0.3)';
const orangeAmber = '#ffbf00';
const orangeAmberTranslucent = 'rgba(255, 191, 0, 0.4)';

const redFlame = '#e64d1a';
const redFlameTranslucent = 'rgba(230, 77, 25, 0.3)';
const redMelon = '#ffa8a8';
const redMelonTranslucent = 'rgba(255, 168, 168, 0.3)';

const stylesheetHTML = `
    <style>
    .wh-bg--green {
      --wh-bg-color: ${greenAppleTranslucent};
      --wh-outline-fb: 1px solid ${greenApple}
    }
    .dark-mode .wh-bg--green {
      --wh-bg-color: ${greenMossTranslucent};
    }
    
    .wh-bg--orange {
      --wh-bg-color: ${orangeAmberTranslucent};
      --wh-outline-fb: 1px solid ${orangeFulvous}
    }
    .dark-mode .wh-bg--orange {
      --wh-bg-color: ${orangeAmberTranslucent};
    }
    
    .wh-bg--red {
      --wh-bg-color: ${redFlameTranslucent};
      --wh-outline-fb: 1px solid ${redFlame}
    }
    .dark-mode .wh-bg--red {
      --wh-bg-color: ${redFlameTranslucent};
    }

    #body li.enemy {
      display: flex;
      margin-top: -1px;
      width: 100%;
    }
    #body li.enemy .attack {
      display: flex;
      justify-content: center;
      padding: 0 0;
      flex-grow: 1;
    }
    
    #body.warHighlighter ul.members-list li.enemy {
      z-index: 200;
      outline: var(--wh-outline, var(--wh-outline-fb, inherit));
      outline-offset: -2px;
      background: var(--wh-bg-color, #f2f2f2);
    }
    #body.dark-mode.warHighlighter ul.members-list li.enemy {
      background: var(--wh-bg-color, #222);
    }
    </style>`;

////////  MODEL  ////////
//// Getters and Setters
function getGlobalState() {
  return GLOBAL_STATE;
}

function getUserSettings() {
  return getGlobalState().userSettings;
}

function getEmemiesArr() {
  return [...document.querySelectorAll('li.enemy')];
}

////////  UTIL FUNCTIONS  ////////
function validateFilter(valuesObject, colorToValidate) {
  // debugger;
  let settings;
  const { onIdleOffValue, levelValue, statusValue, nameValue, idValue } = valuesObject;

  if (colorToValidate === 'green') {
    settings = getUserSettings().highlightSettings.highlightGreenIf;
  }
  if (colorToValidate === 'orange') {
    settings = getUserSettings().highlightSettings.highlightOrangeIf;
  }
  if (colorToValidate === 'red') {
    settings = getUserSettings().highlightSettings.highlightRedIf;
  }
  const { onOffIdle, status, levelRange, includeExceptions, excludeExceptions } = settings;

  const isIncluded = includeExceptions.includes(nameValue) || includeExceptions.includes(idValue);
  const isExcluded = excludeExceptions.includes(nameValue) || includeExceptions.includes(idValue);

  if (((!isExcluded && levelValue >= levelRange[0] && levelValue <= levelRange[1]) || isIncluded) && onOffIdle.includes(onIdleOffValue) && status.includes(statusValue)) {
    return true;
  }
  return false;
}

////////  VIEW  ////////

function renderStylesheet() {
  const headEl = document.querySelector('head');
  headEl.insertAdjacentHTML('beforeend', stylesheetHTML);
}

function renderWarHighlighterClass(el) {
  document.body.classList.add('warHighlighter');
}

function renderColorClasses(el, valuesObject) {
  const colorsArr = ['green', 'orange', 'red'];

  for (const color of colorsArr) {
    if (validateFilter(valuesObject, color)) {
      if (el.classList.contains(`wh-bg--${color}`)) return;
      const otherColorClasses = colorsArr.filter((oc) => oc !== color).map((oc) => `wh-bg--${oc}`);
      el.classList.remove(...otherColorClasses);
      el.classList.add(`wh-bg--${color}`);
      return;
    }
  }
}

////////  CONTROLLERS  ////////
function initController() {
  renderStylesheet();
  renderWarHighlighterClass();
}

function loadController() {
  setInterval(() => {
    const enemiesArr = getEmemiesArr();

    enemiesArr.forEach((el) => {
      const svgIconEl = el.querySelector('.userStatusWrap___ljSJG svg');
      const statusEl = el.querySelector('.status');
      const levelEl = el.querySelector('.level');
      const nameEl = [...el.querySelectorAll('.honor-text')][1];
      const idEl = el.querySelector('a.linkWrap___ZS6r9 ');

      const onIdleOffValue = svgIconEl.getAttribute('fill').match(/(online|offline|idle)/gi)[0];
      const statusValue = statusEl.textContent;
      const levelValue = +levelEl.textContent;
      const nameValue = nameEl.textContent;
      const idValue = idEl.href.match(/\d+$/)[0];

      renderColorClasses(el, {
        onIdleOffValue,
        statusValue,
        levelValue,
        nameValue,
        idValue,
      });
    });
  }, getUserSettings().refreshRateMs);
}

(function () {
  initController();
  loadController();
})();
