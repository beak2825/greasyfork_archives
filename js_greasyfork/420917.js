// ==UserScript==
// @name         MicroWork Cloud Advanced
// @namespace    https://github.com/jorgebeserra
// @version      0.0.10
// @description  A simple theme for MicroWork Cloud
// @author       Jorge Souza
// @match        https://microworkcloud.com.br/cloud/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/420917/MicroWork%20Cloud%20Advanced.user.js
// @updateURL https://update.greasyfork.org/scripts/420917/MicroWork%20Cloud%20Advanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( `
div.k-widget {
width: 95% !important;
height: 95% !important;
}
.k-grid-header-wrap > table,
.k-grid-content > table {
    border-right: 1px solid #ccc;
}
div.k-content:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > kendo-grid:nth-child(1) {
height: 750px !important;
}
div.ng-pristine > div:nth-child(6) > div:nth-child(1) > kendo-grid:nth-child(1) {
height: 450px !important;
}
kendo-grid.k-widget {
height: 550px !important;
}
` );
})();