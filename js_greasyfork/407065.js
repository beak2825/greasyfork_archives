// ==UserScript==
// @name         Townsend Press Auto-Continue
// @namespace    https://wolfgang.space/userscript/townsend
// @version      2
// @description  Autoclicks the 'Continue' button on Townsend Press tests/quizzes/whatever, instantly progressing you and GIVING YOU NO TIME TO REVIEW!!!
// @author       Wolfgang de Groot
// @match        https://www.townsendpress.net/class/*/assignment*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        GM_addStyle
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURUxpcZYGLpQCK5QCK5QCK5MAKJUDLJQCK5MBKq9BX+3U29KUpvrz9dysucBqgqAeQmPC8XEAAAAIdFJOUwD+3h8b4YC6di3G+QAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAGtJREFUCNdjYIABFhMXIHB2YEhSAgM1BglBEOhoZOi8CwS3d0ow9L288/LNyj0zGPol9sz4tXDODoaODiBj/Z4XEMa6fRIQxsKODiRG55r9b9ZJdDBIdM6cP3OmRCNDUigYqDGwGIOBA9wVAP52NlV0l66JAAAAAElFTkSuQmCC
// @copyright    2020 Wolfgang de Groot
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/407065/Townsend%20Press%20Auto-Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/407065/Townsend%20Press%20Auto-Continue.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

/* setInterval(function() {document.querySelector('#continue').click()}, 250) */
setInterval(function () {
  if ($('#continue').length > 0) {
    document.querySelector('#continue').click()
  }
  else {
    // Button isn't here. Pass.
  }
}, 100)
