// ==UserScript==
// @name         Switch CharacterID
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Switch Characters ID by Ctrl + arrow buttons in panel.php
// @author       grin3671
// @match        https://myanimelist.net/panel.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405990/Switch%20CharacterID.user.js
// @updateURL https://update.greasyfork.org/scripts/405990/Switch%20CharacterID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('keyup', (event) => {
      // No extra action w/o modifier
      if (event.getModifierState('Control')) {
        let params, linkID, newCID;
        // Get current url parameters
        params = new URLSearchParams(document.location.search.substring(1));
        // Get current Character ID (CID)
        linkID = parseInt(params.get('character_id'), 10);
        // Open character page if pressed Arrow UP
        if (!isNaN(linkID) && event.code === 'ArrowUp') {
          // NOTE: "href" create new history entry so we can return to panel.php
          window.location.href = 'https://myanimelist.net/character/' + linkID.toString();
        }
        // Set new CID but don't change it if used any other button
        newCID = event.code === 'ArrowLeft' ? linkID - 1 : event.code === 'ArrowRight' ? linkID + 1 : linkID;
        if (!isNaN(newCID) && linkID !== newCID) {
          // Set new url parameters
          params.set('character_id', newCID);
          // Change current url
          // NOTE: "replace" doesn't create new history entry so we can return to start point faster
          window.location.replace(window.location.origin + window.location.pathname + '?' + params.toString());
        }
      }
    });
})();