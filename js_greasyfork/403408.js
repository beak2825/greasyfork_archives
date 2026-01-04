// ==UserScript==
// @name         QuizDiva skip break
// @namespace    https://bblok.tech/
// @version      1.1
// @description  Simply skips the long and boring break between every question on quizdiva.net
// @author       Theblockbuster1
// @match        https://quizdiva.net/*/questions/break*
// @match        http://quizdiva.net/*/questions/break*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403408/QuizDiva%20skip%20break.user.js
// @updateURL https://update.greasyfork.org/scripts/403408/QuizDiva%20skip%20break.meta.js
// ==/UserScript==

$('#nextbutton').trigger('click');