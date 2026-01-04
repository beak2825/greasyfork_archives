// ==UserScript==
// @name        Twitch Clip Queue: Left Side Queue
// @namespace   floppycopier
// @author      floppycopier
// @match       https://jakemiki.me/twitch-clip-queue*
// @grant       GM_addStyle
// @version     1.0
// @description Puts the clip queue on the left where the Gappy is
// @downloadURL https://update.greasyfork.org/scripts/516178/Twitch%20Clip%20Queue%3A%20Left%20Side%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/516178/Twitch%20Clip%20Queue%3A%20Left%20Side%20Queue.meta.js
// ==/UserScript==

(() => {
  GM_addStyle(`
     .mantine-AppShell-body .mantine-AppShell-main .mantine-Container-root > .mantine-Grid-root > .mantine-Col-root:last-child {
       order: -1;
     }
  `)
})()