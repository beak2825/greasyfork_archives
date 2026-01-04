// ==UserScript==
// @name        LP Messenger Hotkeys
// @namespace   Violentmonkey Scripts
// @match       https://www.messenger.com/*
// @license     MIT
// @grant       none
// @version     0.1
// @author      Sadist
// @description Various messenger.com hotkeys for pure keyboard navigation.
// @downloadURL https://update.greasyfork.org/scripts/534991/LP%20Messenger%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/534991/LP%20Messenger%20Hotkeys.meta.js
// ==/UserScript==


document.addEventListener("keydown", (event) => {
  if ( (event.key === "x") && (event.ctrlKey) ) {
    tbox = document.querySelector('[aria-label="Message"]');
    console.log('here');
    tbox.focus();
  }
})

document.addEventListener("keydown", (event) => {
  if ( !event.altKey ) {
    return;
  }
  keyList = ['1','2','3','4','5','6','7','8','9','0','l','g','i','e','t'];
  if ( !keyList.includes(event.key) ) {
    return;
  }
  if (event.key === 'l') {
    document.querySelector('[aria-label^="Send a"]').click();
    return;
  }
  if (event.key === 'g') {
    document.querySelector('[aria-label="Choose a GIF"]').click();
    document.querySelector('[aria-label="GIF Search"]').click();
    return;
  }
  if (event.key === 'i') {
    document.querySelector('[aria-label^="Attach a file"]').click();
    return;
  }
  if (event.key === 'e') {
    event.preventDefault();
    document.querySelector('[aria-label="Choose an emoji"]').click();
    document.querySelector('[aria-label="Search emoji"]').click();
    return;
  }
  if (event.key === 't') {
    event.preventDefault();
    document.querySelector('[aria-label="Choose a sticker"]').click();
    return;
  }
  groupIndex = parseInt(event.key);
  focusGroup = document.querySelectorAll('[href^="/t"],[href^="/e2ee/t"]')[groupIndex];
  focusGroup.click();
})
