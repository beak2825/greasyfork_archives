// ==UserScript==
// @name         sergey evaluate attributes script
// @namespace    https://greasyfork.org/users/144229
// @version      1.0
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *google.com/evaluation*
// @require      http://code.jquery.com/jquery-latest.min.js
// @require      https://greasyfork.org/scripts/33763-nyquery/code/NyQuery.js
// @downloadURL https://update.greasyfork.org/scripts/39952/sergey%20evaluate%20attributes%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/39952/sergey%20evaluate%20attributes%20script.meta.js
// ==/UserScript==

$('input[value=CAN_UNDERSTAND]').click();
$('input[value=IS_NOT_EVENT]').click();
$('input[value=IS_NOT_PUBLIC_INTEREST]').click();
$('input[value=IS_NOT_MEDIA]').click();
$('input[value=NONE_OF_FORMATS]').click();
$('input[value=MULTIPLE_TOPICS]').click();

setTimeout(function(){$('input#submit').click();},5000);