// ==UserScript==
// @name           anti kahoot notifications
// @version        1.0
// @description    removes kahoot notifications (hide annoying player limit)
// @author         epicmines33
// @match          *://play.kahoot.it/*
// @exclude        *://play.kahoot.it/v2/assets/*
// @grant          none
// @run-at         document-start
// @namespace https://greasyfork.org/users/292729
// @downloadURL https://update.greasyfork.org/scripts/469688/anti%20kahoot%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/469688/anti%20kahoot%20notifications.meta.js
// ==/UserScript==

setInterval(() => {
  var closeButton = document.querySelector(`[data-functional-selector="notification-bar-close-button"]`)
  if (closeButton) {closeButton.click()}
}, 1000)