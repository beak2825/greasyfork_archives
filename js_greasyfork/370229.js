// ==UserScript==
// @name         xHamster Custom "New xHamster" Button
// @namespace    https://greasyfork.org/en/scripts/370229-xhamster-custom-new-xhamster-button
// @version      0.1
// @description  Replaces the "New xHamster" button with your text and link
// @author       Phlegomatic
// @match        https://xhamster.com/*
// @include      https://*.xhamster.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370229/xHamster%20Custom%20%22New%20xHamster%22%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/370229/xHamster%20Custom%20%22New%20xHamster%22%20Button.meta.js
// ==/UserScript==

//------------------------ Customize It!
var TAG = " "; // <--- Your Text Goes Here
var URL = "https://xhamster.com"; // <--- Your Link Goes Here
//------------------------



var cName = "design-switcher no-popunder";

document.getElementsByClassName(cName)[0].innerHTML=TAG;
document.getElementsByClassName(cName)[0].href=URL;

