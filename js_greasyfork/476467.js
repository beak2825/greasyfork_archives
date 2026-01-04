// ==UserScript==
// @name        Github Easy-Logout
// @namespace   Violentmonkey Scripts
// @match       https://github.com/logout
// @grant       none
// @license     GPL-2.0-or-later
// @version     1.0
// @author      passuby
// @description Automatically skips the annoying logout dialog when signing out on github.com
// @downloadURL https://update.greasyfork.org/scripts/476467/Github%20Easy-Logout.user.js
// @updateURL https://update.greasyfork.org/scripts/476467/Github%20Easy-Logout.meta.js
// ==/UserScript==

if(window.location.toString() === 'https://github.com/logout') {
  document.querySelectorAll('input').forEach(el => {
    let parentElement = el.parentElement;

    if(parentElement.tagName === 'FORM' &&
       parentElement.action !== undefined &&
       parentElement.action.endsWith('/logout')) {

      el.click();
    }
  });
}
