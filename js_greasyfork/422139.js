// ==UserScript==
// @name         Litcharts Remove Blur
// @namespace    http://tampermonkey.net/
// @version      69.420
// @description  Remove the blur
// @author       You
// @match        https://www.litcharts.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422139/Litcharts%20Remove%20Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/422139/Litcharts%20Remove%20Blur.meta.js
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

    $(document.body).find('div').each(function (i) {
    var c = $(this).attr('class');
    if(c !== undefined){
        c = c.replace(/translation-content paywall/g,'Ttranslation-content')
        $(this).removeClass().addClass(c);
    }

        addGlobalStyle('.summary-sections.show .view .summary-analysis .summary .analysis.blur .analysis-text {color: black ; text-shadow: none; -webkit-user-select: auto;-ms-user-select: auto; user-select: auto; } .a-plus.a-plus-btn-container.a-plus-dialog--unlock {display: none;} .analysis-text.highlightable-content.paywall {color: black; text-shadow: none;} .analysis.blur {color: black ; text-shadow: none;} .analysis-dialog {display: none;} .summary-sections.show .view .summary-analysis .summary .analysis.blur .themes {-webkit-filter:blur(0px);-moz-filter:blur(0px);-ms-filter:blur(0px);-o-filter:blur(0px);filter:blur(0px);-webkit-touch-callout:auto;-khtml-user-select:auto;-moz-user-select:auto;-ms-user-select:auto; color: initial;} .summary-sections.show .view .summary-analysis .summary .analysis.blur .themes .theme {cursor: auto} .summary-sections.show .view .summary-analysis .summary .analysis.blur .themes .theme-icon i {color: initial;} .theme-4-color {color: #269E79} .analysis-text-dialog{width:0; height:0;}');
});
})();