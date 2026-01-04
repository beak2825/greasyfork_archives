// ==UserScript==
// @name         imarket buy to right
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/imarket.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/387308/imarket%20buy%20to%20right.user.js
// @updateURL https://update.greasyfork.org/scripts/387308/imarket%20buy%20to%20right.meta.js
// ==/UserScript==

GM_addStyle(`
a.yes-buy {
  position: absolute;
  right: 10px;
}
span.close-icon {
  position: absolute;
  right: 25px;
  margin: 12px;
}
`)