/* eslint-disable max-len */
// ==UserScript==
// @name        Remove User ID from Stack Overflow Share URLs
// @namespace   https://kevinlocke.name/userscripts
// @description Removes the User ID from the URL displayed by the "Share" button for questions and answers on Stack Overflow and related sites.  For a description of why the User ID was added, see https://meta.stackoverflow.com/q/277769
// @match       https://*.askubuntu.com/*
// @match       https://*.mathoverflow.net/*
// @match       https://*.serverfault.com/*
// @match       https://*.stackapps.com/*
// @match       https://*.stackexchange.com/*
// @match       https://*.stackoverflow.com/*
// @match       https://*.superuser.com/*
// @version     1.0.1
// @license     MIT
// @grant       none
// @supportURL https://github.com/kevinoid/stackoverflow-share-remove-user-id
// @downloadURL https://update.greasyfork.org/scripts/372054/Remove%20User%20ID%20from%20Stack%20Overflow%20Share%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/372054/Remove%20User%20ID%20from%20Stack%20Overflow%20Share%20URLs.meta.js
// ==/UserScript==
/* eslint-enable max-len */

// Note: Domain list from https://stackexchange.com/sites?view=list

'use strict';

// Amount of information to log to the console.  Lower = more.
const logLevel = 3;

// Simple logging framework
function notLogged() {}
const log = {
  /* eslint-disable no-console */
  error: logLevel < 5 ? console.error : notLogged,
  warn: logLevel < 4 ? console.warn : notLogged,
  info: logLevel < 3 ? console.info : notLogged,
  log: logLevel < 2 ? console.log : notLogged,
  debug: logLevel < 1 ? (console.debug || console.log) : notLogged
  /* eslint-enable no-console */
};

function forEach(arrayLike, callback, thisArg) {
  Array.prototype.forEach.call(arrayLike, callback, thisArg);
}

/** Removes the User ID from the URL displayed in response to clicking a
 * "Share" link.
 */
function removeUserIDOnClick(evt) {
  const {classList} = evt.target;
  if (!classList.contains('js-share-link')
      && !classList.contains('short-link')) {
    // click was not on "Share" link
    log.debug('Ignoring click not on .js-share-link or .short-link.');
    return;
  }

  const inputs = evt.target.parentNode.getElementsByTagName('input');
  if (inputs.length === 0) {
    log.warn('Could not find "Share" URL input element.');
    return;
  }

  forEach(inputs, (input) => {
    // Only change URLs with known formats to avoid breaking other URL formats
    const oldUrl = input.value;
    const newUrl
      = oldUrl.replace(/^(https?:\/\/[^/]*\/[aq]\/[0-9]+)\/[0-9]+$/, '$1');
    if (newUrl === oldUrl) {
      if (/^https?:\/\/[^/]*\/[aq]\/[0-9]+$/.test(oldUrl)) {
        log.debug(`Ignoring "Share" URL without User ID: ${oldUrl}`);
      } else {
        log.warn(`Ignoring unrecognized "Share" URL: ${oldUrl}`);
      }

      return;
    }

    log.debug(`Changed "Share" URL from ${oldUrl} to ${newUrl}`);
    input.value = newUrl;

    // Changing the value clears the selection.  Select the URL text.
    input.setSelectionRange(0, newUrl.length);
  });
}

// Wait until load event to register click event listener so that it is
// registered (and therefore runs) after the Stack Overflow click listener.
window.addEventListener(
  'load',
  () => document.addEventListener('click', removeUserIDOnClick, false),
  false
);
