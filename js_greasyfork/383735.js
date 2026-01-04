// ==UserScript==
// @name         TC Colored Chats
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/71540
// @downloadURL https://update.greasyfork.org/scripts/383735/TC%20Colored%20Chats.user.js
// @updateURL https://update.greasyfork.org/scripts/383735/TC%20Colored%20Chats.meta.js
// ==/UserScript==

GM_addStyle(`
div[class^=chat-box][class*=offline] div[class^=viewport] {
  background-color: grey;
}
div[class^=chat-box][class*=away] div[class^=viewport] {
  background-color: #ffe7b9;
}
div[class^=chat-box][class*=online] div[class^=viewport] {
  background-color: #c2ffc6;
}
`)