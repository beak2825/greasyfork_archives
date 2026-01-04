// ==UserScript==
// @name        Scroll by mouse drag
// @namespace   FawayTT
// @description Scroll the page while holding chosen mouse button anywhere on the website
// @match       *://*/*
// @version     1.2
// @author      FawayTT
// @license     MIT
// @homepage    https://github.com/FawayTT/userscripts
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/486866/Scroll%20by%20mouse%20drag.user.js
// @updateURL https://update.greasyfork.org/scripts/486866/Scroll%20by%20mouse%20drag.meta.js
// ==/UserScript==

GM_registerMenuCommand('Settings', opencfg);

const configcss = `height: 40rem;
width: 35rem;
border-radius: 10px;
z-index: 9999999;
position: fixed;
`;

const defaults = {
  touchArea: `width: 100%;
height: 100%;
position: fixed;
left: 50%;
top: 0;
pointer-events: none;
transform: translateX(-50%);`,
};

let gmc = new GM_config({
  id: 'config',
  title: 'Scroll by mouse drag settings',
  fields: {
    scrollButton: {
      section: ['Behavior'],
      label: 'Scroll button',
      labelPos: 'left',
      type: 'select',
      default: 'Left', // Default value for Blue
      options: ['Left', 'Right', 'MiddleClick'],
    },
    touchArea: {
      label: 'Touchpad zone position custom CSS (by default, its invisible and centered in the middle of the page)',
      labelPos: 'left',
      type: 'textarea',
      default: defaults.touchArea,
    },
    msClick: {
      label: 'Number of ms before scroll starts',
      labelPos: 'left',
      type: 'number',
      default: 100,
    },
    textSelectable: {
      label: 'Turn off when selecting text',
      labelPos: 'right',
      type: 'checkbox',
      default: true,
    },
    scrollSpeed: {
      section: ['Speed'],
      label: 'Speed of scroll',
      labelPos: 'left',
      type: 'number',
      default: 1.5,
    },
    blacklistedSites: {
      section: ['Sites'],
      label: 'Blacklisted sites (separated by comma)',
      labelPos: 'right',
      type: 'text',
      default: '',
    },
    whitelistEnabled: {
      label: 'Whitelist enabled',
      labelPos: 'right',
      type: 'checkbox',
      default: false,
    },
    whitelistedSites: {
      label: 'Whitelisted sites (separated by comma)',
      labelPos: 'right',
      type: 'text',
      default: '',
    },
    url: {
      section: ['Support'],
      label: 'https://github.com/FawayTT/userscripts',
      type: 'button',
      click: () => {
        GM_openInTab('https://github.com/FawayTT/userscripts');
      },
    },
  },
  events: {
    save: function () {
      gmc.close();
    },
    init: onInit,
  },
});

const scrollDiv = document.createElement('div');
let animationDuration = 100;
let isMouseDown = false;
let startY = 0;
let startX = 0;
let startTimeout;
let distance = 0;
let isScrolling;
let clicks = 0;
let textSelectable;
let button;
let msClick;
let scrollSpeed = 1.5;

const animateScroll = (distance) => {
  const startTime = performance.now();
  const startScrollY = window.scrollY;
  let extraScroll = true;

  const scroll = (timestamp) => {
    const elapsedTime = timestamp - startTime;
    const progress = Math.min(elapsedTime / animationDuration, 1);
    const scrollAmount = startScrollY + distance * progress;
    if (window.scrollY < 50 && distance < 0) {
      return;
    }
    window.scrollTo(0, Math.abs(scrollAmount));

    if (progress < 1) {
      requestAnimationFrame(scroll);
    } else {
      isScrolling = false;
      if (extraScroll) {
        extraScroll = false;
        window.scrollBy({ top: distance * 0.5, behavior: 'smooth' });
      }
    }
  };

  requestAnimationFrame(scroll);
};

function onInit() {
  const whitelistEnabled = gmc.get('whitelistEnabled');
  const blacklistedSites = gmc.get('blacklistedSites');
  const whitelistedSites = gmc.get('whitelistedSites');
  button = gmc.get('scrollButton');
  textSelectable = gmc.get('textSelectable');
  msClick = gmc.get('msClick');
  scrollSpeed = gmc.get('scrollSpeed');

  switch (button) {
    case 'Left':
      button = 0;
      break;
    case 'Right':
      button = 2;
      break;
    default:
      button = 1;
      break;
  }
  if (whitelistEnabled) {
    if (whitelistedSites.length > 0) {
      const whitelistedSitesArray = whitelistedSites.split(',').map((site) => site.trim());
      const currentSite = window.location.href;
      if (whitelistedSitesArray.includes(currentSite)) init();
    }
  } else {
    if (blacklistedSites.length > 0) {
      const blacklistedSitesArray = blacklistedSites.split(',').map((site) => site.trim());
      const currentSite = window.location.href;
      if (!blacklistedSitesArray.includes(currentSite)) init();
    } else init();
  }
}

function opencfg() {
  gmc.open();
  config.style = configcss;
}

const pauseEvent = (e) => {
  if (e.stopPropagation) e.stopPropagation();
  if (e.preventDefault) e.preventDefault();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
};

const getScrollValue = (value) => {
  return value * scrollSpeed;
};

const reset = () => {
  if (isMouseDown) {
    document.body.style.cursor = null;
  }
  isMouseDown = false;
  isScrolling = false;
  clearTimeout(startTimeout);
};

const checkScroll = (e) => {
  const rect = scrollDiv.getBoundingClientRect();
  const scrollDivX = rect.left + window.scrollX;
  clearTimeout(startTimeout);
  if (e.button === button && e.pageX >= scrollDivX && e.pageX <= scrollDivX + rect.width) {
    if (button !== 0) e.preventDefault();
    startTimeout = setTimeout(() => {
      isMouseDown = true;
      startY = e.clientY;
      startX = e.clientX;
      document.body.style.setProperty('cursor', 'grabbing');
    }, msClick);
  }
};

const scroll = (e) => {
  if (isMouseDown && e.buttons & (1 === 1)) pauseEvent(e);
  if (isScrolling || !isMouseDown) return;
  if (window.getSelection().toString().length > 0 || (textSelectable && Math.abs(startX - e.clientX) > 50)) {
    reset();
    return;
  }
  distance = -(startY - e.clientY);
  isScrolling = true;
  distance = getScrollValue(distance);
  animateScroll(distance);
};

function init() {
  scrollDiv.style.cssText = gmc.get('touchArea');
  document.body.appendChild(scrollDiv);
  document.addEventListener(
    'contextmenu',
    (e) => {
      if (button === 2 && !doubleClick) e.preventDefault();
    },
    false
  );
  document.addEventListener('mousedown', checkScroll);
  document.addEventListener('mouseup', reset);
  document.addEventListener('mousemove', scroll);
}
