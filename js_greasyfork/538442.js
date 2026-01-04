// ==UserScript==
// @name         kone Gallery View
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  kone.gg wide mode
// @author       arcjay
// @match        https://kone.gg/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kone.gg
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/538442/kone%20Gallery%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/538442/kone%20Gallery%20View.meta.js
// ==/UserScript==
//'use strict';
//


/* 딜레이 */
const FIRST_DELAY = 1200;
const OBSERVER_DELAY = 1200

window.addEventListener("load", ()=>setTimeout(()=>{extendContentWrapper();}, FIRST_DELAY));

function extendContentWrapper() {
    const contentWrapper = document.querySelector("main>.max-w-7xl");
    contentWrapper.classList.remove('max-w-7xl');
    contentWrapper.style.maxWidth = '95dvw'
    contentWrapper.children[0].classList.remove('md:container');

}
