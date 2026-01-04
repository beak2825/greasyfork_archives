// ==UserScript==
// @name         crowdin.com: highlight non-breaking spaces in input
// @description  Highlight non-breaking spaces - improve your work experience
// @version      1.0.2
// @license      MIT
// @author       Konf
// @namespace    https://greasyfork.org/users/424058
// @include      /^http(s|):\/\/crowdin.com\/translate\/.*$/
// @include      /^http(s|):\/\/valve.crowdin.com\/translate\/.*$/
// @require      https://greasyfork.org/scripts/415669-observer/code/Observer.js?version=866817
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/428857/crowdincom%3A%20highlight%20non-breaking%20spaces%20in%20input.user.js
// @updateURL https://update.greasyfork.org/scripts/428857/crowdincom%3A%20highlight%20non-breaking%20spaces%20in%20input.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* globals $, Observer */

(function() {
  'use strict';

  const NBSpacesRegex = /[\u202F\u00A0]/g; // non-breaking spaces

  const GMstyles = GM_addStyle(`
    .HWT {
      background-color: ${GM_getValue('highlightColor') || 'lawngreen'};
      color: #555 !important;
    }
  `);

  // GM_registerMenuCommand(menuName, callbackFunction, accessKey)
  GM_registerMenuCommand("Set highlight color", setHighlightColorPrompt, "S");

  const mutObsEntities = {
    'textareas': {
      query: 'textarea#translation',
      subs: {
        'highlighting': {
          enabled: true,
          scanTypes: {
            DOMfirstScan: true,
            DOMchanges: true
          },
          cb: handleTextArea
        }
      }
    }
  }

  const mutObs = new Observer(document.body, mutObsEntities);


  // utils --------------------------------------------------------------------

  function handleTextArea() {
    const $textArea = $('textarea#translation');

    $textArea.highlightWithinTextarea({
      highlight: [{
        // highlight: /[\u0020]/g, // usual spaces (for testing)
        highlight: NBSpacesRegex,
        className: 'HWT'
      }]
    });

    // bugfix...
    const fakeArea = $textArea[0].parentElement.querySelector('.hwt-backdrop');
    fakeArea.classList.replace('undefined', 'backdrop-comfortable-view');
  }

  function setHighlightColorPrompt() {
    const promptMsg = [
      'Enter a highlight color in HEX, RGB or word format',
      'Leave blank to keep the old one',
      'New color should apply immediately'
    ];
    const newColor = prompt(promptMsg.join('. '));

    if (newColor) {
      const oldColor = GM_getValue('highlightColor');

      GM_setValue('highlightColor', newColor);

      GMstyles.innerHTML = GMstyles.innerHTML.replace(
        `background-color: ${oldColor}`, `background-color: ${newColor}`
      );
    }
  }

  // --------------------------------------------------------------------------
})();
