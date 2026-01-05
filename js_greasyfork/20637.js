// ==UserScript==
// @name         WaniKani progress colours
// @namespace    http://tampermonkey.net
// @version      0.1
// @description  Change the progress colours so that they are different from the Kanji/Vocab colours
// @author       Frugal
// @match        https://www.wanikani.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20637/WaniKani%20progress%20colours.user.js
// @updateURL https://update.greasyfork.org/scripts/20637/WaniKani%20progress%20colours.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// Red      #d01916
// Orange   #d07616
// Yellow   #d0ca16
// Green    #73d016


(function() {
    'use strict';
    addGlobalStyle('.dashboard section.srs-progress ul li:first-child { background-color: #d01916; background-image: linear-gradient(-45deg, #cd1818, #d01916)}');
    addGlobalStyle('.dashboard section.srs-progress ul li:nth-child(2) { background-color: #d07616; background-image: linear-gradient(-45deg, #ad6818, #d07616)}');
    addGlobalStyle('.dashboard section.srs-progress ul li:nth-child(3) { background-color: #d0ca16; background-image: linear-gradient(-45deg, #adad18, #d0ca16)}');
    addGlobalStyle('.dashboard section.srs-progress ul li:nth-child(4) { background-color: #73d016; background-image: linear-gradient(-45deg, #63ad18, #73d016)}');

    addGlobalStyle('.apprentice-lattice { background-color: #d01916; }');
    addGlobalStyle('.guru-lattice { background-color: #d07616; }');
    addGlobalStyle('.master-lattice { background-color: #d0ca16; }');
    addGlobalStyle('.enlighten-lattice { background-color: #73d016; }');

    addGlobalStyle('.lattice-single-character .apprentice-lattice, .lattice-multi-character .apprentice-lattice { background-color: #d01916; }');
    addGlobalStyle('.lattice-single-character .guru-lattice, .lattice-multi-character .guru-lattice { background-color: #d07616; }');
    addGlobalStyle('.lattice-single-character .master-lattice, .lattice-multi-character .master-lattice { background-color: #d0ca16; }');
    addGlobalStyle('.lattice-single-character .enlighten-lattice, .lattice-multi-character .enlighten-lattice { background-color: #73d016; }');

    addGlobalStyle('.percentage-0-20 { background-color: #d21414; }');
    addGlobalStyle('.percentage-21-40 { background-color: #d27614; }');
    addGlobalStyle('.percentage-41-60 { background-color: #d2cc14; }');
    addGlobalStyle('.percentage-61-80 { background-color: #99d214; }');
    addGlobalStyle('.percentage-81-100 { background-color: #46d214; }');

    addGlobalStyle('.lattice-single-character .percentage-0-20, .lattice-multi-character .percentage-0-20 { background-color: #d21414; }');
    addGlobalStyle('.lattice-single-character .percentage-21-40, .lattice-multi-character .percentage-21-40 { background-color: #d27614; }');
    addGlobalStyle('.lattice-single-character .percentage-41-60, .lattice-multi-character .percentage-41-60 { background-color: #d2cc14; }');
    addGlobalStyle('.lattice-single-character .percentage-61-80, .lattice-multi-character .percentage-61-80 { background-color: #99d214; }');
    addGlobalStyle('.lattice-single-character .percentage-81-100, .lattice-multi-character .percentage-81-100 { background-color: #46d214; }');
})();