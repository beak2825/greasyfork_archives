// ==UserScript==
// @name        WaniKani Less Obtrusive Input Focus
// @namespace   Violentmonkey Scripts
// @match       https://www.wanikani.com/subjects/review
// @grant       GM_addStyle
// @run-at      document-start
// @version     1.1.1
// @license     Apache, https://www.apache.org/licenses/LICENSE-2.0
// @author      skatefriday
// @description Makes the text input focus outline less obtrusive.
// @downloadURL https://update.greasyfork.org/scripts/462727/WaniKani%20Less%20Obtrusive%20Input%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/462727/WaniKani%20Less%20Obtrusive%20Input%20Focus.meta.js
// ==/UserScript==

// For no border at all simply remove the line containing border-bottom below. 

GM_addStyle(`
    .quiz-input__input:focus,
    .quiz-input__input:active {
      border-color: transparent !important;
      border-bottom: 2px solid #b7e0f4 !important
    }
`);
