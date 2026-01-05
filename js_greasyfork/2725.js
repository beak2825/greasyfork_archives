// ==UserScript==
// @name         Auto Steam Age Verifier
// @description  Lets you set your age so you can skip the Steam Age Verification page.
// @version      1.5
// @namespace    VasVadum
// @license      CC-BY-NC
// @include      http://store.steampowered.com/agecheck/*
// @include      https://store.steampowered.com/agecheck/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/2725/Auto%20Steam%20Age%20Verifier.user.js
// @updateURL https://update.greasyfork.org/scripts/2725/Auto%20Steam%20Age%20Verifier.meta.js
// ==/UserScript==

//Do you want a randomized date instead? Set to True if so.  If not, leave as is and edit the values on line 17, 19, and 21.
var random = 'False';

//In the lines below, please enter the correct information in the value spot.  EG "var m = __", any invalid information may result in script failure.
//Month
var m = 6;
//Day
var d = 22;
//Year
var y = 1980;

if (random == 'True') {
    var m = Math.floor((Math.random() * 12) + 1);
    var d = Math.floor((Math.random() * 28) + 1);
    var y = Math.floor((Math.random() * 1996) + 1);
}

//Do not edit below this line.
var mm = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

(function (form) {
    form.ageYear.value = y;
    form.ageMonth.value = mm[m - 1];
    form.ageDay.value = d;
    form.submit();
}(document.querySelector('#agegate_box form')));