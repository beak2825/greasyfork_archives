// ==UserScript==
// @name        Youtube - Copy short URL to clipboard
// @namespace   lleaff
// @supportURL  https://gist.github.com/lleaff/48db35c180ab1b684a0f2c7d9c493244
// @match       https://www.youtube.com/*
// @version     2
// @run-at      document-end
// @grant       GM_setClipboard
// @noframes
// @description Copy short URL to clipboard on video title click
// @downloadURL https://update.greasyfork.org/scripts/24196/Youtube%20-%20Copy%20short%20URL%20to%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/24196/Youtube%20-%20Copy%20short%20URL%20to%20clipboard.meta.js
// ==/UserScript==

const TEXT = {
    CLICK_TO_COPY_VID_URL_TO_CLIPBOARD: 'Click to copy short URL',
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
async function waitForSelector(selector, { intervalMs, root=document }) {
  while(true) {
    const element = root.querySelector(selector)
    if (element) {
      return element;
    }
    await sleep(intervalMs)
  }
}
async function waitForSelectorAll(selector, { intervalMs, root=document }) {
  while(true) {
    const element = root.querySelectorAll(selector)
    if (element.length > 0) {
      return [...element];
    }
    await sleep(intervalMs)
  }
}

function getResetable({ callbackIn, callbackOut, timeout }) {
    let timeoutId;
    return () => {
      callbackIn();
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callbackOut();
        timeoutId = null;
      }, timeout);
    };
}

function setupYTTooltip({ element, text }) {
  element.setAttribute('title', text)
}

const extractYoutubeVidId = url => {
  const match = url.match(/v=([^&]+)/);
  return match && match[1];
};
const getShortVidUrl = (url) => `https://youtu.be/${extractYoutubeVidId(url.search || url)}`;

function setupClickToPushToClipboardElement({ element: el, text }) {
  const color = {
        initial: el.style.color || null,
        active:  '#aaa'
  };
  const opacity = {
        initial: el.style.opacity || null,
        active:  '0.9'
  };

  function setActiveStyle() {
      el.style.color = color.active;
      el.style.opacity = opacity.active;
  }
  function setInactiveStyle() {
      el.style.color = color.initial;
      el.style.opacity = opacity.initial;
  }

  const animate = getResetable({ callbackIn:  setActiveStyle,
                                 callbackOut: setInactiveStyle,
                                 timeout:     0.5e3
                               });
  
  el.addEventListener('click', ev => {
    console.log('Clicked video title 🖱️')
    GM_setClipboard(text);
    animate();
    ev.preventDefault();
  });

  setupYTTooltip({ element: el,
                   text: TEXT.CLICK_TO_COPY_VID_URL_TO_CLIPBOARD });

  return el;
}

/**
 * Click on video title to copy short url to clipboard
 */
async function setupClickToCopyVidTitle(url) {
const innerTitleEl = await waitForSelector('h1.title:not([hidden]', { intervalMs: 50, });
  if (innerTitleEl) {
    setupClickToPushToClipboardElement({ element: innerTitleEl,
                                         text:    getShortVidUrl(url),
                                       });
  }
}

/**
 * Executed on every new page load
 */
async function main() {
  /* Watching video */
  if (location.href.match(/\/watch\?/)) {
    await setupClickToCopyVidTitle(location);
  }
}


main();
/* Structured Page Fragment api, Youtube's lib to avoid full-page refreshes*/
document.addEventListener("spfdone", main);