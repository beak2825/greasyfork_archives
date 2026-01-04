// ==UserScript==
// @name        Close Zoom Tabs
// @namespace   Violentmonkey Scripts
// @match       https://*.zoom.us/j/*
// @grant       none
// @version     1.0
// @author      Matthew Eagar <meagar@hey.com>
// @description Close the tabs Zoom spawns
// @homepage    https://gist.github.com/meagar/9c902cf83d464c0572ea8dd37a7faa00
// @downloadURL https://update.greasyfork.org/scripts/419904/Close%20Zoom%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/419904/Close%20Zoom%20Tabs.meta.js
// ==/UserScript==

setInterval(() => {
  // When the Zoom website has successfully launched the Zoom client, it updates the URL with `#success`
  if (window.location.hash.indexOf("success") != -1) {
    window.close()
  }
}, 1000)