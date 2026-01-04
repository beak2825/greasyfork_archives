// ==UserScript==
// @name         litcharts.comBlurRemove
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  try to take over the world!
// @author       You
// @match        https://www.litcharts.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405389/litchartscomBlurRemove.user.js
// @updateURL https://update.greasyfork.org/scripts/405389/litchartscomBlurRemove.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}


(function() {
    'use strict';
    // Your code here...
    addGlobalStyle('.summary-sections.show .view .summary-analysis .summary .analysis.blur .analysis-text {color: black ; text-shadow: none; -webkit-user-select: auto;-ms-user-select: auto; user-select: auto; } .a-plus.a-plus-btn-container.a-plus-dialog--unlock {display: none;} .analysis-text.highlightable-content.paywall {color: black; text-shadow: none;} .analysis.blur {color: black ; text-shadow: none;} .analysis-dialog {display: none;} .summary-sections.show .view .summary-analysis .summary .analysis.blur .themes {-webkit-filter:blur(0px);-moz-filter:blur(0px);-ms-filter:blur(0px);-o-filter:blur(0px);filter:blur(0px);-webkit-touch-callout:auto;-khtml-user-select:auto;-moz-user-select:auto;-ms-user-select:auto; color: initial;} .summary-sections.show .view .summary-analysis .summary .analysis.blur .themes .theme {cursor: auto} .summary-sections.show .view .summary-analysis .summary .analysis.blur .themes .theme-icon i {color: initial;} .theme-4-color {color: #269E79} .analysis-text-dialog{width:0; height:0;}');
})();