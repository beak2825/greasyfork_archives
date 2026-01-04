// ==UserScript==
// @name        WaniKani Consistent Correct Color
// @namespace   Violentmonkey Scripts
// @match       https://www.wanikani.com/subjects/review
// @grant       none
// @version     1.0
// @license     Apache, https://www.apache.org/licenses/LICENSE-2.0
// @author      skatefriday
// @description Makes the correct label color the same color as the correct text entry background
// @downloadURL https://update.greasyfork.org/scripts/462724/WaniKani%20Consistent%20Correct%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/462724/WaniKani%20Consistent%20Correct%20Color.meta.js
// ==/UserScript==

document.documentElement.style.setProperty('--color-quiz-srs-correct-background', '#88cc00')