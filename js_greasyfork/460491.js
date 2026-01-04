// ==UserScript==
// @name        Sorry, datacamp.com
// @namespace   Datacamp
// @match       https://campus.datacamp.com/courses/*
// @grant       GM_addStyle
// @version     1.0
// @description 22/02/2023, 6:01:31 pm
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460491/Sorry%2C%20datacampcom.user.js
// @updateURL https://update.greasyfork.org/scripts/460491/Sorry%2C%20datacampcom.meta.js
// ==/UserScript==

GM_addStyle(
  `
  .ReactModalPortal { display: none !important; }
  `
);
