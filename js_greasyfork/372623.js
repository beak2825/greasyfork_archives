// ==UserScript==
// @name        MTurk iframe enlarger
// @icon        https://turkerhub.com/data/avatars/l/1/1637.jpg?1513481491
// @author      LLL
// @namespace   https://greasyfork.org/en/users/155391-lll
// @include     https://worker.mturk.com/projects*
// @version     1.0.0
// @grant       none
// @description Resizes the HIT's iframe to 1800 and resets the focus.
// @downloadURL https://update.greasyfork.org/scripts/372623/MTurk%20iframe%20enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/372623/MTurk%20iframe%20enlarger.meta.js
// ==/UserScript==


let a = document.getElementsByTagName("IFRAME");
for (let i=0, len=a.length; i<len; i++) {
  a[i].height="1800";
  a[i].focus();
  }