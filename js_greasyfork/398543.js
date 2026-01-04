// ==UserScript==
// @name          Google Sheets Advanced Styles
// @description   Adds a few useful properties for Google Sheets.
// @namespace     https://contributor.pw
// @domain        docs.google.com
// @include       https://docs.google.com/spreadsheets/*
// @author        Alex Ivanov <ai@contributor.pw>
// @developer     Alex Ivanov <ai@contributor.pw>
// @version       0.0.0-2
// @grant         none
// @icon          https://raw.githubusercontent.com/contributorpw/my-greasy-fork/master/userscripts/Google%20Sheets%20Styles/ico.png
// @screenshot    https://raw.githubusercontent.com/contributorpw/my-greasy-fork/master/userscripts/Google%20Sheets%20Styles/screenshot.png
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/398543/Google%20Sheets%20Advanced%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/398543/Google%20Sheets%20Advanced%20Styles.meta.js
// ==/UserScript==

// User settings. Be free to change this.
const SETTINGS = Object.freeze({
  "font-size": "21px"
});

/**
 * Observation event manager
 */
const observation = () =>
  [...document.querySelectorAll(".cell-input")].forEach(
    cellInputContainerElement => {
      new MutationObserver(mutationRecords => {
        mutationRecords.forEach(mutationRecord =>
          [
            ...mutationRecord.target.querySelectorAll(".formula-content")
          ].forEach(
            formulaContentContainerElement =>
              (formulaContentContainerElement.style["font-size"] =
                SETTINGS["font-size"])
          )
        );
      }).observe(cellInputContainerElement, {
        childList: true
      });
    }
  );

/**
 * The document event registrator
 */
(function() {
  setTimeout(observation, 3000);
})();
