// ==UserScript==
// @name         MTurk Footer Fix
// @namespace    https://greasyfork.org/en/users/434272-realalexz
// @version      0.2
// @description  Removes MTurk footer on HIT pages.
// @author       RealAlexZ
// @icon         https://i.imgur.com/NouzJ6b.jpg
// @include      https://worker.mturk.com/projects/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/416971/MTurk%20Footer%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/416971/MTurk%20Footer%20Fix.meta.js
// ==/UserScript==

// Thanks to @slothbear for the idea!

GM_addStyle(`.work-pipeline-bottom-bar, .sticky-footer { display: none; }`);
