// ==UserScript==
// @name         face script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturkcontent*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/39610/face%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39610/face%20script.meta.js
// ==/UserScript==
noRules();
if(!$('div:contains(Even if there is no human face discernible)')) return;
$('input[value=FALSE]').click();
hotKey(`input#submitButton`, 1);