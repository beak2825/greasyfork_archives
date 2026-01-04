// ==UserScript==
// @name         ChatGPT: Fix Enter Key on Small Sizes
// @namespace    cvladan.com
// @version      1.1
// @description  Userscript changes the mobile interface by restoring Ctrl+Enter or Enter as Submit, even when opening small, thin windows in the desktop environment.
// @author       Vladan Colovic
// @match        *://chat.openai.com/*
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/gh/chatgptjs/chatgpt.js@bdc3e03cc0b1fbcfcc886022d5690880aa40442c/dist/chatgpt-1.7.6.min.js
// @grant        none
// @license      MIT
// @created      2023-06-03
// @updated      2023-06-03
// @downloadURL https://update.greasyfork.org/scripts/467798/ChatGPT%3A%20Fix%20Enter%20Key%20on%20Small%20Sizes.user.js
// @updateURL https://update.greasyfork.org/scripts/467798/ChatGPT%3A%20Fix%20Enter%20Key%20on%20Small%20Sizes.meta.js
// ==/UserScript==

const selSubmit = 'form > div > div > button';
const selNewChat = 'nav > div > a, div.sticky > button:last-of-type';
const enableDefaultModeOnMobile = false;

// I need to ensure that ChatGPT is fully loaded to check selector validity
//
(async () => {
    await chatgpt.isLoaded()

    btnSubmit = document.querySelector(selSubmit);
    btnNewChat = document.querySelector(selNewChat);

    inputArea = chatgpt.getTextarea();
    inputArea.addEventListener('keydown', handleKeydown, true);
})();

// Ensure that ChatGPT is fully loaded to check selector validity
//
function clickMouseOn(button) {
  rect = button?.getBoundingClientRect();
  if (!rect) {
    console.info("Nothing currently at: " + cssSelector);
    return;
  }

  var event = new MouseEvent('click', {
    view: window, bubbles: true, cancelable: true,
      clientX: rect.left + (rect.width / 2),
      clientY: rect.top + (rect.height / 2) });

  button.dispatchEvent(event);
}

// Ensure that ChatGPT is fully loaded to check selector validity
//
function skipActions(event) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  return false;
}

// Handler for all key events
//
// Attention is paid to:
// - does not interfere with possibly other Enter-key combinations
// - so that, for example Alt-Enter will still do what it does now
// - if a selector is incorrectly specified, the key is not occupied
//
function handleKeydown(event) {

  var ignoreOtherListeners = false;

  const isEnter = (event.key === 'Enter');
  const modKey = event.ctrlKey | (event.shiftKey << 1) | (event.altKey << 2) | (event.metaKey << 3);


  if (enableDefaultModeOnMobile) {

    if (isEnter && modKey === 0) { // force enter, even on mobile
      clickMouseOn(btnSubmit);
      skipActions(event);
      return false;
    }

    return true;
  }

  if (isEnter && modKey === 0) {
    ignoreOtherListeners = true;
  }

  if (btnNewChat && isEnter && modKey === 3) { // console.log('New Chat');
    clickMouseOn(btnNewChat);
    ignoreOtherListeners = true;
  }

  if (btnSubmit && isEnter && modKey === 1) { // console.log('Send');
    clickMouseOn(btnSubmit);
    ignoreOtherListeners = true;
  }

  if (ignoreOtherListeners) {
    skipActions(event);
    return false;
  }

  return true;
};
