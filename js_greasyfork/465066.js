// ==UserScript==
// @name        gitlab add 'v' shortcut to mark file as read
// @namespace   Violentmonkey Scripts
// @match       https://git.unity.pl/*
// @grant       none
// @version     1.0
// @author      gsobczyk
// @description 4/27/2023, 5:06:16 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465066/gitlab%20add%20%27v%27%20shortcut%20to%20mark%20file%20as%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/465066/gitlab%20add%20%27v%27%20shortcut%20to%20mark%20file%20as%20read.meta.js
// ==/UserScript==
document.onkeyup = async function (e) {
    if (e.key === 'v' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        await $('[data-testid="fileReviewCheckbox"]')[0].click();
    }
}