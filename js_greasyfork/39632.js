// ==UserScript==
// @name         serg youtube news script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *google.com/evaluation*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/39632/serg%20youtube%20news%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39632/serg%20youtube%20news%20script.meta.js
// ==/UserScript==

$('input[value=IS_NOT_FACTUAL_REPORT]').click();
$('input[value=IS_PUBLIC_INTEREST]').click();
$('input[value=IS_NOT_TIME_SENSITIVE]').click();
$('input[value=IS_NEWS_NOT_TRADITIONAL]').click();
$('input[value=NONE_OF_FORMATS]').click();
$('input[value=MULTIPLE_TOPICS]').click();
setTimeout(function(){$('#submit').click();}, 4500);