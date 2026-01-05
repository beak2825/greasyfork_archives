// ==UserScript==
// @name        Discord - Open chat in popup
// @namespace   lleaff
// @supportURL  https://gist.github.com/lleaff/8514033dc8e54ce02d6adf3c2e46d8ff#comments
// @match       https://discordapp.com/channels/*
// @version     1
// @run-at      document-end
// @grant       none
// @noframes
// @description Adds a "open in popup" button to channels.
// @downloadURL https://update.greasyfork.org/scripts/24197/Discord%20-%20Open%20chat%20in%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/24197/Discord%20-%20Open%20chat%20in%20popup.meta.js
// ==/UserScript==

/* =Configuration
 *------------------------------------------------------------*/

const POPUP_WIDTH /*: pixels */ = 400;
const WAIT_FOR_LOAD_TRY_INTERVAL /*: milliseconds */ = 0.5e3;

/* =DOM Utilities
 *------------------------------------------------------------*/

const $ = (selector, el) => Array.from((el || document).querySelectorAll(selector));
 
function hideAllSiblings(el) {
  const siblings = getSiblings(el);
  siblings.forEach(el => el.style.display = 'none');
}

function getSiblings(el) {
  const all = Array.from(el.parentNode.childNodes);
  return all.filter(child => child !== el);
}

/**
 * Open and return a popup window. Ususally blocked by browser by default.
 * @param options - https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Position_and_size_features
 */
function openPopup(url, name, options) {
  const opts = Object.assign({
    menubar: false,
    location: false,
    resizable: true,
    scrollbars: false,
    status: false
  }, options);
  const convertOptVal = val => {
    switch(val) {
      case false: return 'no';
      case true: return 'yes';
      default: return val;
    }
  }
  const optionsStr = Object.keys(opts)
                       .map(key =>`${key}=${convertOptVal(opts[key])}`, '')
                       .join(',');
  return window.open(url,
                     name || `popup:${encodeURI(url)}`,
                     optionsStr);
}

/* =Main window
 *------------------------------------------------------------*/

/**
 * Main function to be executed on main page
 */
function mainBootstrap() {
  const contacts = $('.channel:not(.btn-friends)');
  if (!contacts.length) {
    return false;
  }
  
  contacts.forEach(contact => {
    addOpenPopupBtn(contact);
  });
}

/* =Popup button
 *------------------------------------------------------------*/

function addOpenPopupBtn(el) {
  const btn = createOpenPopupBtnDOM();
  btn.addEventListener('click',
                       (e) => { openChatPopup(el); e.preventDefault(); });
  const closeButton = $('.close', el)[0];
  closeButton.parentNode.insertBefore(btn, closeButton);
}

function createOpenPopupBtnDOM() {
  let btn = document.createElement('button');
  btn.className = 'close';
  btn.style.backgroundImage = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAEGSURBVCjPZZChS0NxFIW/9zZQ1Dnf3IYwu2AUu3+BYLOJgsWkWdAyMAiCYclgFy3+EYIGq6xoGiLIwoTN4dw+w5Pxe3puu+e73MNBglmxZaiRz2SA2G3bGWSIGFm0YsWqJWN37YVEnhJ7bFAA+pxxTY08oWw48N2mTesmHvuZeSF2bLlm2bIz/21FfXBWxH37gfOVZokBEZhknYnx5wHnHNAG1HsLItYdjq9PnTJ2x9cQmPPC71973k0Tc66GACaeeOehRY98tCqSBTDntJFln2xaEckDUVDLkC4QEWO6yNNjgSWaATZimTIvfKXAFVvc8Japd5GEWzpp1TUv7f6p78OGpTTVD4gGJTUFNt2qAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTEwLTIxVDA5OjQ0OjIzLTA1OjAwu1bogAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0xMC0yMVQwOTo0NDoyMy0wNTowMMoLUDwAAAAASUVORK5CYII=')";
  return btn;
}

function openChatPopup(contactDiv) {
  const linkEl = $('a', contactDiv)[0];
  if (!linkEl) { return false; }
  const url = linkEl.href;
  const popup = openPopup(url, 'popup', { width: POPUP_WIDTH });
  if (!popup) { return; }
  const script = document.createElement('script');
  script.innerHTML = `var IS_GM_POPUP = true;`;
  popup.document.head.appendChild(script);
  return popup;
}

 
/* =Popup
 *------------------------------------------------------------*/

/**
 * Main function to be executed on popup page
 */
function mainPopup() {
  if (!hideAllButChat()) {
    return false;
  }
}

function hideAllButChat() {
  const chat = $('.chat')[0];
  if (!chat) { return false; }
  hideAllSiblings(chat);
  return true;
}

/* =Script running
 *------------------------------------------------------------*/

/**
 * Try running a function until it returns something other than `null` or `false`.
 */
function tryRunFunc(fn, interval) {
    if ([null, false].includes(fn())) {
      setTimeout(() => tryRunFunc(fn, interval), interval)
    }
}

function main() {
  
  const in_popup = typeof IS_GM_POPUP !== 'undefined';
  const mainFunc = in_popup ? mainPopup : mainBootstrap;
  
  tryRunFunc(mainFunc, WAIT_FOR_LOAD_TRY_INTERVAL);
}
  
/* =Execution
 *------------------------------------------------------------*/

main();
