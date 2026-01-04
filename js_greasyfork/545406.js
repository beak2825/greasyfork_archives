// ==UserScript==
// @name         Old Reddit Over18 Auto
// @description  Auto-set over18 cookie and auto-click continue button
// @author       C89sd
// @namespace    https://greasyfork.org/users/1376767
// @version      0.1
// @match        https://old.reddit.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/545406/Old%20Reddit%20Over18%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/545406/Old%20Reddit%20Over18%20Auto.meta.js
// ==/UserScript==

document.cookie = 'over18=1;domain=.reddit.com;path=/;Max-Age=315360000';

if(location.href.startsWith('https://old.reddit.com/over18?'))
  document.querySelector('.c-btn-primary[type="submit"][name="over18"][value="yes"]')?.click();