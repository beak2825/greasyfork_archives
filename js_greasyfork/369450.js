// ==UserScript==
// @name         SubmitJobspotter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @include        https://jobspotter.indeed.com*
// @include    https://jobspotter-mturk.indeed.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369450/SubmitJobspotter.user.js
// @updateURL https://update.greasyfork.org/scripts/369450/SubmitJobspotter.meta.js
// ==/UserScript==
window.onkeydown = function (event) {
 if(event.which == 13){
        document.querySelector(`#content > div > div.submit-button-container > button`).click();}};