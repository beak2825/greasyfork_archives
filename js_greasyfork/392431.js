/* eslint-disable */
// ==UserScript==
// @name         WeTransfer Default to link
// @description  Picking email leaves you without a link on the upload page. You have to actually check your email.
// @version      0.1.2
// @namespace    https://greasyfork.org/users/40601
// @homepage     https://greasyfork.org/scripts/392431
// @supportURL   https://greasyfork.org/scripts/392431/feedback
// @author       Leeroy
// @icon         https://cdn.browsercam.com/com.wetransfer.app.live-logo.png
// @match        *://wetransfer.com/*
// @match        *://we.tl/*
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/392431/WeTransfer%20Default%20to%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/392431/WeTransfer%20Default%20to%20link.meta.js
// ==/UserScript==
/* eslint-enable */

'use strict';

function waitForSelector(selector) {
  return new Promise((resolve, _reject) => {
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el instanceof HTMLElement) {
        clearInterval(interval);
        resolve(el);
      }
    }, 100);
  });
}

const dots = '.transfer__toggle-options';
const link = '#transfer__type-link';

waitForSelector(dots)
  .then(dotsElement => {
    dotsElement.click();
    document.querySelector(link).click();
    dotsElement.click();
  })
  .catch(console.error);
