// ==UserScript==
// @namespace http//:tampermonkey.net
// @name john doe
// @version 1.0
// @description autoselect
// @author SarahAshlee90
// @include https://www.google.com/*
// @grant none
// @require https://code.jquery.com/jquery-3.1.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/33639/john%20doe.user.js
// @updateURL https://update.greasyfork.org/scripts/33639/john%20doe.meta.js
// ==/UserScript==

$('input[value="PLAYABLE"]').eq(0).click();
$('input[value="NOT_SENSITIVE"]').eq(0).click();
$('input[value="NOT_SENSITIVE"]').eq(1).click();













