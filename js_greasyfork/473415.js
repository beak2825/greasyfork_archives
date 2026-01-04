// ==UserScript==
// @name        Brief answer and direct tone as default - zzzcode.ai
// @namespace   Violentmonkey Scripts
// @include     https://zzzcode.ai
// @match       https://zzzcode.ai/answer-question
// @grant       none
// @version     1.1
// @author      K33p_Qu13t
// @license     MIT
// @description Sets brief answer and direct tone as default options for submit | 27.06.2023, 20:48:00
// @downloadURL https://update.greasyfork.org/scripts/473415/Brief%20answer%20and%20direct%20tone%20as%20default%20-%20zzzcodeai.user.js
// @updateURL https://update.greasyfork.org/scripts/473415/Brief%20answer%20and%20direct%20tone%20as%20default%20-%20zzzcodeai.meta.js
// ==/UserScript==

// Find "I want" selector
const iWantSelector = document.querySelector("select.form-control#uiOption1");
// Delete current selected
let selectedOption = iWantSelector.querySelector("option[selected]");
selectedOption.removeAttribute("selected");
// Select brief answer
const briefAnswerNode = iWantSelector.querySelector(
  'option[value="2 - A brief answer"]'
);
briefAnswerNode.setAttribute("selected", "selected");

// Find "Tone" selector
const toneSelector = document.querySelector("select.form-control#uiOption2");
// Delete current selected
selectedOption = toneSelector.querySelector("option[selected]");
selectedOption.removeAttribute("selected");
// Select direct tone
const directNode = toneSelector.querySelector('option[value="Direct"]');
directNode.setAttribute("selected", "selected");