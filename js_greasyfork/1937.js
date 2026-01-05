// ==UserScript==
// @name Next survey page Mturk
// @version 1.0
// @description Hit the "{" (left curly brace) key, submit the survey page
// @updateurl 
// @include https://*.qualtrics.com/*
// @include http://*.qualtrics.com/*
// @copyright 
// @namespace https://greasyfork.org/users/2165
// @downloadURL https://update.greasyfork.org/scripts/1937/Next%20survey%20page%20Mturk.user.js
// @updateURL https://update.greasyfork.org/scripts/1937/Next%20survey%20page%20Mturk.meta.js
// ==/UserScript==

content = document.getElementById("SurveyEngineBody");
content.tabIndex = "0";
content.focus();

document.onkeydown = showkeycode;
function showkeycode(evt){
var keycode = evt.keyCode;
switch (keycode) {
    case 123: // {
document.getElementById("NextButton").click();
break;
}
}