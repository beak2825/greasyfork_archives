// ==UserScript==
// @name Pizza Hut Survey automator
// @description Automate Pizza Hut Surveys
// @version 1.0.0
// @description 
// @namespace Violentmonkey Scripts
// @match *://*.*pizzahut*.*/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/391984/Pizza%20Hut%20Survey%20automator.user.js
// @updateURL https://update.greasyfork.org/scripts/391984/Pizza%20Hut%20Survey%20automator.meta.js
// ==/UserScript==

if (document.body.innerText.includes("Please enter the code printed on your survey invitation:") == false)
{
  document.getElementById("NextButton").click();
}