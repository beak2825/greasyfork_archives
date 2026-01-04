// ==UserScript==
// @name         Wanikani Wrap-up Button Enhancement (Tofurky fork)
// @namespace    https://www.wanikani.com
// @version      1.0.3
// @description  Allows custom wrap-up queue length (this fork: working backspace; enter/return to start wrap-up)
// @author       yndajas (built on Inserio, Mempo)
// @license      MIT
// @match        https://www.wanikani.com/review/session
// @match        http://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435324/Wanikani%20Wrap-up%20Button%20Enhancement%20%28Tofurky%20fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435324/Wanikani%20Wrap-up%20Button%20Enhancement%20%28Tofurky%20fork%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const defaultLength = 10;

  // add styles

  const addStyle = (css) => {
    const head = document.getElementsByTagName('head')[0];
    if (head) {
      const style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = css;
      head.appendChild(style);
    }
  }

  const css =
    '#additional-content ul li.WKWBE {' +
    '    width: 8.25% !important' +
    '} ' +
    '#additional-content ul li#option-wrap-up-length span:hover::before {content: none;} ' +
    'input#wrap-up-length {' +
    '  position: relative;' +
    '  margin-right: 10px;' +
    '  size: "";' +
    '  width: 100%;' +
    '  min-width: 10px;' +
    '  outline: none' +
    '  text-decoration: none;' +
    '  text-align: center;' +
    '  border: none' +
    '};';

  addStyle(css);

  // get wrap up button and add class; add wrap up length li and get placed input

  const wrapUpButton = document.getElementById("option-wrap-up");
  wrapUpButton.classList.add("WKWBE");

  const unplacedLi = `<li class="WKWBE" id="option-wrap-up-length"><span><input type="text" value="${defaultLength}" id="wrap-up-length"></input></span></li>`;
  $('#option-wrap-up').after(unplacedLi);

  const lengthInput = document.getElementById("wrap-up-length");

  // add on click functionality to wrap up button (set wrap up length)

  const setWrapUpLength = () => {
    let i = 0;
    let poplist;
    let pushlist;
    let reviewpop;

    let length = parseInt($('#wrap-up-length').val());

    if (isNaN(length) || length < 1) {
      length = defaultLength;
      lengthInput.value = length;
    }

    const currentActiveLength = $.jStorage.get("activeQueue").length;

    if (length > currentActiveLength) {
      poplist = $.jStorage.get("reviewQueue");
      pushlist = $.jStorage.get("activeQueue");
      reviewpop = 1;
    } else {
      poplist = $.jStorage.get("activeQueue");
      pushlist = $.jStorage.get("reviewQueue");
      reviewpop = 0;
    }

    let iterCount = (-(reviewpop - 1)) * (currentActiveLength - length) + reviewpop * (length - currentActiveLength);

    for (i = 0; i < iterCount; i++) {
      pushlist.push(poplist.pop());
    }

    $.jStorage.set("activeQueue", reviewpop ? pushlist : poplist);
    $.jStorage.set("reviewQueue", reviewpop ? poplist : pushlist);
  }

  wrapUpButton.addEventListener("click", setWrapUpLength);

  // add keydown handlers for input

  const acceptedKeys = [35, 36, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]; // left, right, home, end, delete, 0-9

  const handleBackspaceKey = (event) => {
    const selectionStart = event.target.selectionStart;
    if (selectionStart > 0) {
      const currentValue = event.target.value;
      const newValue = currentValue.slice(0, selectionStart - 1) + currentValue.slice(selectionStart, currentValue.length + 1);
      event.target.value = newValue;
      event.target.setSelectionRange(selectionStart - 1, selectionStart - 1);
    }
  }

  const handleEnterKey = (event) => {
    wrapUpButton.click();
    if (![...wrapUpButton.classList].includes("wrap-up-selected")) {
      wrapUpButton.click();
    }
  }

  const handleUpKey = (event) => {
    event.preventDefault();
    event.target.value = parseInt(event.target.value) + 1;
    event.target.setSelectionRange(event.target.value.length, event.target.value.length);
  }

  const handleDownKey = (event) => {
    if (event.target.value > 1) {
      event.target.value = parseInt(event.target.value) - 1;
    }
  }

  const handleKeyDown = (event) => {
    if (acceptedKeys.includes(event.keyCode)) { // keys to let function as usual
      return true;
    } else {
      switch (event.keyCode) {
        case 8: // backspace
          handleBackspaceKey(event);
          break;
        case 13: // enter/return
          handleEnterKey(event);
          break;
        case 38: // up
          handleUpKey(event);
          break;
        case 40: // down
          handleDownKey(event);
          break;
      }
      return false;
    }
  }

  lengthInput.addEventListener("keydown", handleKeyDown);
})();

// Hook into App Store
try {
  $('.app-store-menu-item').remove();
  $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")'));
  window.appStoreRegistry = window.appStoreRegistry || {};
  window.appStoreRegistry[GM_info.script.uuid] = GM_info;
  localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry);
} catch (e) {}