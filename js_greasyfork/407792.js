// ==UserScript==
// @name         NCI - SEER Training Modules
// @namespace    https://xianghongai.github.io/
// @version      0.0.1
// @description  National Cancer Institute SEER Training Modules
// @author       Nicholas Hsiang
// @icon         https://xinlu.ink/favicon.ico
// @match        https://training.seer.cancer.gov/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407792/NCI%20-%20SEER%20Training%20Modules.user.js
// @updateURL https://update.greasyfork.org/scripts/407792/NCI%20-%20SEER%20Training%20Modules.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = `
.qtip.qtip-primer {
z-index: 9!important;
}
`,
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';

    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
})();