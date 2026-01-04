// ==UserScript==
// @name         TORN: Display Weapon Bonus in Auction House + Highlight
// @namespace    http://torn.city.com.dot.com.com
// @version      1.1.1
// @description  Displays weapon bonuses + stats next to weapon name in auction house
// @author       Ironhydedragon
// @match        https://www.torn.com/amarket.php*
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/481516/TORN%3A%20Display%20Weapon%20Bonus%20in%20Auction%20House%20%2B%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/481516/TORN%3A%20Display%20Weapon%20Bonus%20in%20Auction%20House%20%2B%20Highlight.meta.js
// ==/UserScript==

//////// GLOBAL VARIABLES ////////
const GLOBAL_STATE = {
  userSettings: {
    highlightWeaponColors: true, // POSSIBLE VALUES: true or false. Change value to turn on or off color highlighting
  },
};

////  Colors
const greenMossDark = '#4b5738';
const greenMossDarkTranslucent = 'rgb(75, 87, 56, 0.9)';
const greenMoss = '#57693a';
const greenMossTranslucent = 'rgb(87, 105, 58, 0.9)';
const greenApple = '#85b200';
const greenAppleTranslucent = 'rgba(134, 179, 0, 0.4)';

const yellow = '#ff0';
const yellowTranslucent = 'rgba(255, 255, 0,0.4)';
const yellowIcterine = '#fcf75e';
const yellowIcterineTranslucent = 'rgb(252, 247, 94, 0.1)';

const orangeFulvous = '#d08000';
const orangeFulvousTranslucent = 'rgba(209, 129, 0, 0.2)';
const orangeAmber = '#ffbf00';
const orangeAmberTranslucent = 'rgba(255, 191, 0, 0.4)';

const redFlame = '#e64d1a';
const redFlameTranslucent = 'rgba(230, 77, 25, 0.2)';
const redMelon = '#ffa8a8';
const redMelonTranslucent = 'rgba(255, 168, 168, 0.3)';

//////// MODEL ////////
function getGlobalState() {
  return GLOBAL_STATE;
}
function getUserSettings() {
  return getGlobalState().userSettings;
}
function isHighlightingWeapons() {
  return getUserSettings().highlightWeaponColors;
}

//////// UTIL FUNCTIONS /////////
async function requireElement(selectors, conditionsCallback) {
  try {
    await new Promise((res, rej) => {
      maxCycles = 500;
      let current = 1;
      const interval = setInterval(() => {
        if (document.querySelector(selectors)) {
          if (conditionsCallback === undefined) {
            clearInterval(interval);
            return res();
          }
          if (conditionsCallback(document.querySelector(selectors))) {
            clearInterval(interval);
            return res();
          }
        }
        if (current === maxCycles) {
          clearInterval(interval);
          rej('Timeout: Could not find element on page');
        }
        current++;
      }, 10);
    });
  } catch (err) {
    console.error(err);
  }
}

function getAuctionListItems() {
  let listItemsArr = [...document.querySelectorAll('ul.items-list li')];
  const filterOutClasses = ['last', 'clear'];
  listItemsArr = listItemsArr.filter((li) => {
    return !filterOutClasses.some((c) => li.classList.contains(c));
  });
  return listItemsArr;
}

//// Callbacks
function auctionItemsLoadedCallback(queryEl) {
  const firstListItem = queryEl.querySelector('li');
  return !firstListItem.classList.contains('last');
}

async function auctionObserverCallback(mutationList, observer) {
  for (const mutation of mutationList) {
    if (mutation.target.classList.contains('items-list') && mutation.addedNodes.length > 10) {
      observer.disconnect();
      await loadController();
    }
  }
}

//// Observers
function createAuctionMutationObserver() {
  const observer = new MutationObserver(auctionObserverCallback);
  observer.observe(document, {
    attributes: false,
    childList: true,
    subtree: true,
  });
}

//////// VIEW ////////
const stylesheet = `
  <style>
    .display-bonus--red {
      --db-bgc: ${redFlameTranslucent};
      --db-outline: ${redFlame};
    }
    .display-bonus--orange {
      --db-bgc: ${orangeFulvousTranslucent};
      --db-outline: ${orangeFulvous};
    }
    .display-bonus--yellow {
      --db-bgc: ${yellowIcterineTranslucent};
      --db-outline: ${yellow};
    }
    .dark-mode .display-bonus--yellow {
      --db-bgc: ${yellowIcterineTranslucent};
      --db-outline: ${yellowTranslucent};
    }
  

    .display-bonus {
      background: var(--db-bgc);
      outline: 1px solid var(--db-outline);
      outline-offset: -2px;
    }

    .display-bonus__container {
      display: block
    }

    p.display-bonus__bonus {
      display: inline-block;
      padding-right: 4px;
    }

    .display-bonus .item-bonuses .iconsbonuses span:nth-of-type(1) i{
      transform: scale(2) translate(-2px, 2px);
    }
    .display-bonus .item-bonuses .iconsbonuses span:nth-of-type(2) i{
      transform: scale(2) translate(-6px, 2px);
    }
  </style>
`;
function renderStylesheet() {
  document.head.insertAdjacentHTML('beforeend', stylesheet);
}

function renderWeaponBonuses(weaponEl) {
  let rawBonusTextArr = [...weaponEl.querySelectorAll('.iconsbonuses span')].map((spanEl) => spanEl.title);

  const bonusString = rawBonusTextArr.map((raw) => {
    const name = raw.match(/(?<=<b>)\w+\s*-*\w*/);
    const bonus = raw.match(/\d+%|\d+\sturns/);

    return `<b>${name}</b> ${bonus || ''}`;
  });

  const titleContainerEl = weaponEl.querySelector('span.title');
  titleContainerEl.querySelector('p').remove();

  const bonusContainerHTML = `<div class="display-bonus__container"></div>`;
  titleContainerEl.insertAdjacentHTML('beforeend', bonusContainerHTML);

  for (const bonus of bonusString) {
    const bonusHTML = `<p class="t-gray-6 display-bonus__bonus">${bonus}</p>`;
    titleContainerEl.querySelector('.display-bonus__container').insertAdjacentHTML('beforeend', bonusHTML);
  }
}

function renderColorClass(weaponEl) {
  colorType = weaponEl.outerHTML.match(/(?<=glow-)\w+/);
  weaponEl.classList.add(`display-bonus`, `display-bonus--${colorType}`);
}

//////// CONTROLLERS ////////
async function initController() {
  console.log('🗡️ Display bonus script is running!'); // TEST
  renderStylesheet();
}

async function loadController() {
  try {
    await requireElement('ul.items-list', auctionItemsLoadedCallback);
    const listItemsArr = getAuctionListItems();

    for (const item of listItemsArr) {
      renderWeaponBonuses(item);
      if (isHighlightingWeapons()) {
        renderColorClass(item);
      }
    }

    createAuctionMutationObserver();
  } catch (error) {
    console.error(error);
  }
}

//////// EXECUTION ////////
//// Promise race conditions
// necessary as PDA scripts are inject after window.onload
const PDAPromise = new Promise((res, rej) => {
  if (document.readyState === 'complete') res();
});

const browserPromise = new Promise((res, rej) => {
  window.addEventListener('load', () => res());
});

(async () => {
  try {
    await Promise.race([PDAPromise, browserPromise]);
    initController();
    await loadController();
  } catch (error) {
    console.error(error);
  }
})();
