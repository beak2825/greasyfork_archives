// ==UserScript==
// @name         Feedly - Open in Background Tab
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Open the selected link in another tab
// @author       JackNUMBER
// @match        *://*.feedly.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/389793/Feedly%20-%20Open%20in%20Background%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/389793/Feedly%20-%20Open%20in%20Background%20Tab.meta.js
// ==/UserScript==
// Based on Aaron Saray's code, with the fix by henley-regatta: https://github.com/aaronsaray/feedlybackgroundtab/blob/2e828c763f9002d04ea9b1f7fdf79f864d86e7ef/src/js/keypress.js

// code '59' is ';'
const _triggerKeyCode = 59;

(function() {
  'use strict';
/*
  const selectors = [
    '.list-entries .entry--selected a.entry__title', // Additional selector for recent Feedly changes
    'div.selectedEntry a.title',                     // title bar for active entry, collapsed or expanded
    '.selectedEntry a.visitWebsiteButton',           // the button square button on list view
    '.list-entries .inlineFrame--selected a.visitWebsiteButton', // the button square button on list view
    'a.visitWebsiteButton',   				        // the floating one for card view
    '.entry.selected a.title'                       // title bar for active entry in React-based collapsed list view
  ];
*/
  const selectors = [
    '.TitleOnlyLayout--selected a.EntryTitleLink--selected', // title bar for active entry, collapsed (2024-05-01)
    'a.visitWebsiteButton'                                   // the floating one for card view
  ];
  /**
  * Main feedlybackgroundtab constructor
  */
  const FBT = function() {

    /**
    * handler for key press - must be not in textarea or input and must be not altered
    * Then it sends extension request
    * @param e
    */
    this.keyPressHandler = function(e) {
      const tag = e.target.tagName.toLowerCase();
      console.log('tag', e.target);
      if (tag != 'input' && tag != 'textarea') {
        if ((!e.altKey && !e.ctrlKey) && e.keyCode == _triggerKeyCode) {
          let url;
          for (var x in selectors) {
            url = document.querySelector(selectors[x]);
            console.log(url);
            if (url) {
              break;
            }
          }
          if (url) {
            GM_openInTab(url.href);
          } else {
            console.log("Could not find any selectors from: " + selectors.join());
          }
        }
      }
    }
  };

  if (window == top) {
    const fbt = new FBT();
    window.addEventListener('keypress', fbt.keyPressHandler, false);
  }
})();