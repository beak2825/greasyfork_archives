// ==UserScript==
// @name         Gallery Scroll Navigator
// @namespace    https://github.com/YukiteruDev
// @version      1.35
// @description  Automatically navigate pages for image sites based on user's scroll behavior.
// @author       Yukiteru
// @match        https://hitomi.la/*
// @match        https://www.pixiv.net/*
// @match        https://nhentai.net/*
// @match        https://exhentai.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @require      https://greasyfork.org/scripts/470224-tampermonkey-config/code/Tampermonkey%20Config.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507902/Gallery%20Scroll%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/507902/Gallery%20Scroll%20Navigator.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function printLog(message) {
    console.log(`[Scroll Pager]: ${message}`);
  }

  // Initialize the configuration
  const config_desc = {
    scrolls: {
      name: "Number of Scrolls to Next Page",
      processor: "int_range-1-10",
      value: 3, // Default value
    }
  };
  const config = new GM_config(config_desc);

  let scrollCounter = 0;
  let progressBarBottom;
  let progressBarTop;
  let disablePaging = false;

  // Function to create the progress bar element
  function createProgressBar(position = 'bottom') {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position: fixed;
      left: 0;
      right: 0;
      height: 3px;
      background-color: red;
      z-index: 9999;
      transform-origin: center;
      transform: scaleX(0);
      transition: transform 0.3s ease;
      ${position === 'top' ? 'top' : 'bottom'}: 0;
    `;
    document.body.appendChild(bar);
    return bar;
  }

  const siteDict = {
    hitomi: {
      host: 'hitomi.la',
      getPageButton(direction) {
        try {
          const pageContainer = [...document.querySelectorAll('.page-container li')];
          const currentPage = pageContainer.filter(i => i.textContent !== '...').find(i => i.children.length === 0);
          const targetLi = direction === 'next' ? currentPage.nextElementSibling : currentPage.previousElementSibling;
          return targetLi ? targetLi.querySelector('a') : null;
        } catch(e) {
          return null;
        }
      }
    },
    pixiv: {
      host: 'www.pixiv.net',
      getPageButton(direction) {
        const selector = `nav:has(button) > a:${direction === 'next' ? 'last' : 'first'}-child`
        const pageButton = document.querySelector(selector);
        return pageButton && !pageButton.hasAttribute('hidden') ? pageButton : null;
      }
    },
    nhentai: {
      host: 'nhentai.net',
      getPageButton(direction) {
        const selector = direction === 'next' ? '.next' : '.previous'
        const pageButton = document.querySelector(selector);
        return pageButton || null;
      }
    },
    exhentai: {
      host: 'exhentai.org',
      getPageButton(direction) {
        const selector = direction === 'next' ? 'a#dnext' : 'a#dprev'
        const pageButton = document.querySelector(selector);
        return pageButton || null;
      }
    },
  };

  function getCurrentSite() {
    return Object.values(siteDict).find(site => location.host === site.host);
  }

  function getCurrentPosition() {
    return window.innerHeight + window.scrollY;
  }

  function loadNextPage() {
    printLog('Loading next page...');
    const site = getCurrentSite();
    const pageButton = site?.getPageButton('next');
    if (pageButton) pageButton.click();
  }

  function loadPrevPage() {
    printLog('Loading previous page...');
    const site = getCurrentSite();
    const pageButton = site?.getPageButton('prev');
    if (pageButton) pageButton.click();
  }

  function checkIsScrollingDown(event) {
    if (event.wheelDelta) {
      return event.wheelDelta < 0;
    }
    return event.deltaY > 0;
  }

  function updateProgressBar(progress, bar) {
    const maxScrolls = config.get('scrolls');
    const scale = Math.min(progress / maxScrolls, 1);
    bar.style.transform = `scaleX(${scale})`;
  }

  progressBarBottom = createProgressBar('bottom');
  progressBarTop = createProgressBar('top');

  function resetScrollProgress() {
    scrollCounter = 0;
    updateProgressBar(0, progressBarBottom);
    updateProgressBar(0, progressBarTop);
  }

  function checkIsBottom() {
    return (window.innerHeight + window.scrollY).toFixed() >= document.body.scrollHeight;
  }

  function checkIsTop() {
    return window.scrollY === 0;
  }

  function setWheelEvent() {
    document.addEventListener("wheel", event => {
      if (disablePaging) return;

      const isBottom = checkIsBottom();
      const isTop = checkIsTop();
      const isScrollingDown = checkIsScrollingDown(event);

      const site = getCurrentSite();

      const isPagingTop = isTop && !isScrollingDown && site.getPageButton('prev');
      const isPagingBottom = isBottom && isScrollingDown && site.getPageButton('next');

      if (isPagingTop || isPagingBottom) {
        scrollCounter++;
        const progressBar = isPagingTop ? progressBarTop : progressBarBottom;
        const loadPage = isPagingTop ? loadPrevPage : loadNextPage;

        updateProgressBar(scrollCounter, progressBar);
        printLog(`Scrolls at ${isPagingTop ? 'top' : 'bottom'}: ${scrollCounter}`);

        const maxScrolls = config.get('scrolls');
        if (scrollCounter >= maxScrolls) {
          disablePaging = true;
          resetScrollProgress();
          loadPage();
        }
        return;
      }

      resetScrollProgress();
    });
  }

  function checkPagination() {
    const site = getCurrentSite();
    if (!site) return;

    const pager = site.getPageButton('next') || site.getPageButton('prev');
    if (!pager) return;

    printLog('Pager detected');
    observer.disconnect();
    setWheelEvent();
  }

  const observer = new MutationObserver(() => checkPagination());
  observer.observe(document.body, { childList: true, subtree: true });

  window.navigation.addEventListener("navigate", () => disablePaging = false); // for ajax-paging sites
})();
