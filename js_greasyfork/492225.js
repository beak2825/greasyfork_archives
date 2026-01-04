// ==UserScript==
// @name        Gartic chat with avatars
// @namespace   Violentmonkey Scripts
// @description Adds avatars to the chat.
// @icon        https://gartic.io/favicon.ico
// @match       *://gartic.io/*
// @license     Mit
// @version     1.0.2
// @grant       GM_addStyle
// @author      Mops
// @downloadURL https://update.greasyfork.org/scripts/492225/Gartic%20chat%20with%20avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/492225/Gartic%20chat%20with%20avatars.meta.js
// ==/UserScript==

GM_addStyle(`
#screenRoom .ctt #interaction #chat .history .msg {
  --avatar-size: 24px;
}

#screenRoom .ctt #interaction #chat .history .msg div:not(.avatar) > strong + span {
  display: block;
}

#screenRoom .ctt #interaction #chat .history .msg .avatar {
  display: block !important;
  width: var(--avatar-size);
  height: var(--avatar-size);
  min-width: var(--avatar-size);
  background-size: contain;
}

#screenRoom .ctt #interaction #chat .history .msg:has(.avatar) {
  display: flex;
  gap: 5px;
}
`)