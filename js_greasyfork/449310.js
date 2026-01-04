// ==UserScript==
// @name         Clear - Melhora visual
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Clear - Melhora visual reduzindo a coluna de resultados, possibilitando ver a lista de ativos atrás, no homebroker
// @author       Fernando Mendes Fonseca
// @match        https://pro.clear.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clear.com.br
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/449310/Clear%20-%20Melhora%20visual.user.js
// @updateURL https://update.greasyfork.org/scripts/449310/Clear%20-%20Melhora%20visual.meta.js
// ==/UserScript==

(function() {

GM_addStyle (`
    .result {
        width: 540px !important;
    }
    .slidebox-results {
        width: 540px !important;
    }
    .ItemBase
    {
        width: 500px !important;
        height: 50px !important;
        padding-top: 10px !important;
        padding-right: 15px !important;
        padding-bottom: 10px !important;
        padding-left: 15px !important;
    }
    .header-pnl
    {width: 480px;}

    .ItemBase.active {
    height: auto !important;
` );
})();