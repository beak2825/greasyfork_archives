// ==UserScript==
// @name         [BitChute] Remember Last Active Tab
// @match        https://old.bitchute.com/*
// @noframes
// @run-at       document-start
// @inject-into  content
// @grant        none
// @namespace    Violentmonkey Scripts
// @author       SedapnyaTidur
// @version      1.0.0
// @license      MIT
// @revision     8/16/2025, 1:27:24 PM
// @description  For 'old.bitchute.com' only. Return to the previous clicked tab in homepage or category page and in trending tab when clicking the BitChute logo or returning to homepage or category page.
// @downloadURL https://update.greasyfork.org/scripts/543723/%5BBitChute%5D%20Remember%20Last%20Active%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/543723/%5BBitChute%5D%20Remember%20Last%20Active%20Tab.meta.js
// ==/UserScript==

'use strict';

// To debug the script, change [line #6] "inject-to  content" to "inject-into  page"
// and [line #21] "debugging = false" to "debugging = true".

const alias = 'RLAT', debugging = false;
const preferedTabIndex = -1; // -1 = default setting (log-in or not), 0 = POPULAR, 1 = SUBSCRIBED, 2 = TRENDING, 3 = ALL. You can set it to one of values that you like.
const preferedTrendingTabIndex = 0; // 0 = DAY, 1 = WEEK, 2 = MONTH.
const waitTimeout = 10000; // You may want to set it to 30000 (30 secs) or even 60000 (60 secs) if you have a weak internet connection.

// In case layout changes happened, we would have to fix the following 4 lines and perhaps switch to METHOD_1 for switchTab().
const LOADER_QUERY = ':scope > div#wrapper > #loader-container'; // Loading screen with a "style=display: none;" attribute.
const LOGO_QUERY = ':scope > #nav-menu > #nav-top-menu > :first-child > .logo > a'; // Parent of BITCHUTE img (top left).
const TABS_QUERY = ':scope > div#wrapper > #main-content > div.container-fluid > #page-detail > * > .tab-scroll-outer > :first-child > ul'; // Parent of 4 "li > a"s.
const TRENDING_TABS_QUERY = ':scope > div#wrapper > #main-content > div.container-fluid > #page-detail > * > #listing-tabs > #listing-trending > * > :first-child > ul'; //Parent of 4 "li > a"s.

let activeTabIndex = preferedTabIndex, activeTrendingTabIndex = preferedTrendingTabIndex;
let clearConsole = false, failed = 0, fromPage, logo, retries = 1, running, tabsObservers = [], trendTabsObservers = [], urlObserver;
let checkCategory = 0, checkHome = 0, checkOther = 0;
let homeActiveTabIndex, homeActiveTrendingTabIndex; // HOME => CATEGORY => HOME.
let categoryActiveTabIndex, categoryActiveTrendingTabIndex; // CATEGORY => HOME => CATEGORY.
let searchLogoInterval = 0, searchLogoTimeout = 0;
let searchTabsInterval = 0, searchTabsTimeout = 0;
let searchTrendingTabsInterval = 0, searchTrendingTabsTimeout = 0;
let switchTabInterval = 0, switchTabTimeout = 0;
let switchTrendingTabInterval = 0, switchTrendingTabTimeout = 0;
const errorNotReady = new Error(`[${alias}]: parentNode is not ready yet.`);
const timeFormat = { hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' };
const location = window.location;

const Log = {
  error: (text) => { if(!debugging) return; console.log(`❌%c[%c${alias}%c][%c${new Date().toLocaleTimeString('en-US', timeFormat)}%c]: %c${text}`, 'color:#7FFF00', 'color:#40E0D0', 'color:#7FFF00', 'color:#40E0D0', 'color:#7FFF00', 'color:#FF0000') },
  debug: (text) => { if(!debugging) return; console.log(`💡%c[%c${alias}%c][%c${new Date().toLocaleTimeString('en-US', timeFormat)}%c]: %c${text}`, 'color:#7FFF00', 'color:#40E0D0', 'color:#7FFF00', 'color:#40E0D0', 'color:#7FFF00', 'color:#1E90FF') },
  info:  (text) => { if(!debugging) return; console.log(`ℹ️%c[%c${alias}%c][%c${new Date().toLocaleTimeString('en-US', timeFormat)}%c]: %c${text}`, 'color:#7FFF00', 'color:#40E0D0', 'color:#7FFF00', 'color:#40E0D0', 'color:#7FFF00', 'color:#A9A9A9') },
  warn:  (text) => { if(!debugging) return; console.log(`⚠️%c[%c${alias}%c][%c${new Date().toLocaleTimeString('en-US', timeFormat)}%c]: %c${text}`, 'color:#7FFF00', 'color:#40E0D0', 'color:#7FFF00', 'color:#40E0D0', 'color:#7FFF00', 'color:#FFA500') },
};

function getChildElements(parentNode) {
  if(!parentNode) throw errorNotReady;
  const array = [];
  for(const child of parentNode.childNodes) {
    if(child.nodeType === Node.ELEMENT_NODE) array.push(child);
  }
  return array;
}

function reset() {
  clearInterval(searchLogoInterval);
  clearTimeout(searchLogoTimeout);
  clearInterval(searchTabsInterval);
  clearTimeout(searchTabsTimeout);
  clearInterval(switchTabInterval);
  clearTimeout(switchTabTimeout);
  clearInterval(searchTrendingTabsInterval);
  clearTimeout(searchTrendingTabsTimeout);
  clearInterval(switchTrendingTabInterval);
  clearTimeout(switchTrendingTabTimeout);
  if(logo) logo.removeEventListener('click', clickLogo);
  for(let i=0; i<4; ++i) {
    if(tabsObservers[i]) tabsObservers[i].disconnect();
    tabsObservers[i] = undefined;
  }
  for(let i=0; i<3; ++i) {
    if(trendTabsObservers[i]) trendTabsObservers[i].disconnect();
    trendTabsObservers[i] = undefined;
  }
  checkOther = 0;
  logo = undefined;
  running = false;
  searchLogoInterval = 0;
  searchLogoTimeout = 0;
  searchTabsInterval = 0;
  searchTabsTimeout = 0;
  searchTrendingTabsInterval = 0;
  searchTrendingTabsTimeout = 0;
  switchTabInterval = 0;
  switchTabTimeout = 0;
  switchTrendingTabInterval = 0;
  switchTrendingTabTimeout = 0;
}

function resetSearchTrendingTabs() {
  clearInterval(searchTrendingTabsInterval);
  clearTimeout(searchTrendingTabsTimeout);
  for(let i=0; i<3; ++i) {
    if(trendTabsObservers[i]) trendTabsObservers[i].disconnect();
    trendTabsObservers[i] = undefined;
  }
  searchTrendingTabsInterval = 0;
  searchTrendingTabsTimeout = 0;
}

// tag = HOST or TRENDING.
function switchTab(tag, parentNode, targetTabIndex) {
  Log.info(`switchTab() for ${tag} -- retries: ${retries}, failed: ${failed}`);
  const children = getChildElements(parentNode);
  if(children.length === 0) return;
  children[0].click();
  if(parentNode.classList.contains('active')) {
    if(tag === 'HOST') {
      clearInterval(switchTabInterval);
      clearTimeout(switchTabTimeout);
      if(targetTabIndex === 2 && activeTrendingTabIndex !== 0) return;
    } else {
      clearInterval(switchTrendingTabInterval);
      clearTimeout(switchTrendingTabTimeout);
    }
    failed = 0;
    retries = 0; // Ignore multiple calls of MutationObserver (urlObserver).
    running = false;
  }
}

// Check which tab is currently selected/active.
// tag = HOST or TRENDING.
function checkActiveTab(tag, targetNode, targetTabIndex) {
  if(targetNode.classList.contains('active')) {
    if(tag === 'HOST') {
      Log.info(`checkActiveTab() for HOST -- activeTabIndex: ${targetTabIndex}`);
      resetSearchTrendingTabs(); // 3 less MutationObservers and each one is heavy.
      activeTabIndex = targetTabIndex;
      // searchTrendingTabs.
      if(targetTabIndex === 2) { // TRENDING.
        searchTrendingTabsTimeout = setTimeout(() => {
          clearInterval(searchTrendingTabsInterval);
          reset();
          shouldRetry();
        }, waitTimeout);
        searchTrendingTabsInterval = setInterval(searchTrendingTabs, 10);
      }
    } else {
      Log.info(`checkActiveTab() for TRENDING -- activeTrendingTabIndex: ${targetTabIndex}`);
      activeTrendingTabIndex = targetTabIndex;
    }
  }
}

function searchTrendingTabs() {
  Log.info(`searchTrendingTabs() -- retries: ${retries}, failed: ${failed}`);
  const tabs = document.body.querySelector(TRENDING_TABS_QUERY);
  if(!tabs || tabs.childElementCount < 3) return;
  clearInterval(searchTrendingTabsInterval);
  clearTimeout(searchTrendingTabsTimeout);

  const children = getChildElements(tabs);
  const prevTabIndex = activeTrendingTabIndex;
  for(let i=0; i<3; ++i) {
    checkActiveTab('TRENDING', children[i], i);
    trendTabsObservers[i] = new MutationObserver(() => checkActiveTab('TRENDING', children[i], i));
    trendTabsObservers[i].observe(children[i], { attributes: true });
  }
  // switch tab.
  Log.debug(`prevTabIndex: ${prevTabIndex}, activeTrendingTabIndex: ${activeTrendingTabIndex}`);
  if(prevTabIndex !== 0 && activeTrendingTabIndex !== prevTabIndex) {
    // Method_1 - non-blocking.
    /*
    switchTrendingTabTimeout = setTimeout(() => {
      clearInterval(switchTrendingTabInterval);
      reset();
      shouldRetry();
    }, 10000);
    switchTrendingTabInterval = setInterval(switchTab, 10, 'TRENDING', children[prevTabIndex], prevTabIndex);
    */
    // Method_2 - blocking.
    switchTab('TRENDING', children[prevTabIndex], prevTabIndex);
  } else {
    running = false;
  }
}

function searchTabs() {
  Log.info(`searchTabs() -- retries: ${retries}, failed: ${failed}`);
  const tabs = document.body.querySelector(TABS_QUERY);
  if(!tabs || tabs.childElementCount < 4) return;
  clearInterval(searchTabsInterval);
  clearTimeout(searchTabsTimeout);

  const children = getChildElements(tabs);
  const prevTabIndex = activeTabIndex;
  for(let i=0; i<4; ++i) {
    checkActiveTab('HOST', children[i], i);
    tabsObservers[i] = new MutationObserver(() => checkActiveTab('HOST', children[i], i));
    tabsObservers[i].observe(children[i], { attributes: true });
  }
  // switch tab.
  Log.debug(`prevTabIndex: ${prevTabIndex}, activeTabIndex: ${activeTabIndex}`);
  if(prevTabIndex !== -1 && activeTabIndex !== prevTabIndex) {
    // There may be some noticable lag between "searchLogo() and searchTabs()", and between "searchTabs() and switchTab()". Blame on BitChute programmers.
    // Method_1 - non-blocking.
    /*
    switchTabTimeout = setTimeout(() => {
      clearInterval(switchTabInterval);
      reset();
      shouldRetry();
    }, 10000);
    switchTabInterval = setInterval(switchTab, 10, 'HOST', children[prevTabIndex], prevTabIndex);
    */
    // Method_2 - blocking.
    switchTab('HOST', children[prevTabIndex], prevTabIndex); // It worked and works best for now even though Method_1 is safer.
  } else {
    running = false;
  }
}

function clickLogo() {
  Log.info(`clickLogo() -- retries: ${retries}, failed: ${failed}`);
  if(debugging) {
    clearConsole = false;
    console.clear();
  }
  // A must. 1 is not enough (false-positive). Debug the script for a better understanding.
  // 2 is enough for most of the time.
  // 3 is needed sometimes.
  retries = 3;
  onCreate();
}

function searchLogo() {
  Log.info(`searchLogo() -- retries: ${retries}, failed: ${failed}`);
  logo = document.body.querySelector(LOGO_QUERY);
  if(!logo) return;
  clearInterval(searchLogoInterval);
  clearTimeout(searchLogoTimeout);
  logo.addEventListener('click', clickLogo);
  // searchTabs.
  searchTabsTimeout = setTimeout(() => {
    clearInterval(searchTabsInterval);
    reset();
    shouldRetry();
  }, waitTimeout);
  searchTabsInterval = setInterval(searchTabs, 100);
}

function shouldRetry() {
  // Still loading? Blocking? Lag? Slow network???
  const loader = document.body.querySelector(LOADER_QUERY);
  if(loader && loader.style.display !== 'none') {
    Log.warn('Search for target node has timed out and the page is still loading.');
    retries = 1;
  } else {
    Log.error('Cannot find the target node!. Layout has changed? 🤔');
    ++failed; // Layout changed?
    if(failed > 3) {
      urlObserver.disconnect();
      urlObserver = undefined;
    }
  }
}

// Yes, duplicates. Less checks. Blame on that crappy navigation listener.
function onCreate() {
  if(location.href === 'https://old.bitchute.com/') {
    if(checkHome === 0 && fromPage === 'CATEGORY') {
      ++checkHome; // Runs once. Is document.body ready?
      retries = 2;
      clearConsole = true;
      checkCategory = 0;
      // Save category's active tabs.
      categoryActiveTabIndex = activeTabIndex;
      categoryActiveTrendingTabIndex = activeTrendingTabIndex;
      // Restore the previous active tabs.
      if(homeActiveTabIndex !== undefined && homeActiveTrendingTabIndex !== undefined) {
        activeTabIndex = homeActiveTabIndex;
        activeTrendingTabIndex = homeActiveTrendingTabIndex;
      } else {
        activeTabIndex = preferedTabIndex;
        activeTrendingTabIndex = preferedTrendingTabIndex;
      }
    }
    if(retries < 1 || running || !document.body) return;
    if(debugging && clearConsole) {
      clearConsole = false;
      console.clear();
    }
    Log.debug(`onCreate() <<HOME>> -- fromPage: ${fromPage}, retries: ${retries}, failed: ${failed}, activeTabIndex: ${activeTabIndex}, activeTrendingTabIndex: ${activeTrendingTabIndex}`);
    reset();
    --retries;
    running = true;
    fromPage = 'HOME';
    // searchLogo.
    searchLogoTimeout = setTimeout(() => {
      clearInterval(searchLogoInterval);
      reset();
      shouldRetry();
    }, waitTimeout);
    searchLogoInterval = setInterval(searchLogo, 10);

  } else if(location.pathname.startsWith('/category/')) {
    if(checkCategory === 0 && fromPage === 'HOME') {
      ++checkCategory; // Runs once.
      retries = 2;
      clearConsole = true;
      checkHome = 0;
      // Save homepage's active tabs.
      homeActiveTabIndex = activeTabIndex;
      homeActiveTrendingTabIndex = activeTrendingTabIndex;
      if(categoryActiveTabIndex !== undefined && categoryActiveTrendingTabIndex !== undefined) {
        activeTabIndex = categoryActiveTabIndex;
        activeTrendingTabIndex = categoryActiveTrendingTabIndex;
      } else {
        activeTabIndex = preferedTabIndex;
        activeTrendingTabIndex = preferedTrendingTabIndex;
      }
    }
    if(retries < 1 || running || !document.body) return;
    if(debugging && clearConsole) {
      clearConsole = false;
      console.clear();
    }
    Log.debug(`onCreate() <<CATEGORY>> -- fromPage: ${fromPage}, retries: ${retries}, failed: ${failed}, activeTabIndex: ${activeTabIndex}, activeTrendingTabIndex: ${activeTrendingTabIndex}`);
    reset();
    --retries;
    running = true;
    fromPage = 'CATEGORY';
    // searchLogo.
    searchLogoTimeout = setTimeout(() => {
      clearInterval(searchLogoInterval);
      reset();
      shouldRetry();
    }, waitTimeout);
    searchLogoInterval = setInterval(searchLogo, 10);

  } else if(checkOther === 0) {
    // clickLogo() loses its listener but it is fine either it does or doesn't.
    reset();
    ++checkOther;
    retries = 2; // 1 is enough but just in case of layout changes.
    clearConsole = true;
    checkCategory = 0;
    checkHome = 0;
  }
}

// Everything starts here. 170+ calls on average.
urlObserver = new MutationObserver(onCreate);
urlObserver.observe(document, { childList: true, subtree: true });
