// ==UserScript==
// @name         Zoltar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38818/Zoltar.user.js
// @updateURL https://update.greasyfork.org/scripts/38818/Zoltar.meta.js
// ==/UserScript==

if(!document.referrer.includes("3OLDKDGFDMCAL1390YMGJJF96JYODN")) {return;}

document.querySelector("a[ng-href]").click();

document.querySelector("input[ng-model='baseQuestionController.value']").focus();

document.addEventListener("keydown", e => {

    if(e.key === "Enter") {
        e.preventDefault();
        document.querySelector("input[type='submit']").click();
    }
    else if(e.key === "Delete") {
        e.preventDefault();
        document.querySelector("div.md-ink-ripple").click();
        document.querySelector("input[type='submit']").click();
    }

}, true);