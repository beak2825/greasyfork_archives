// ==UserScript==
// @name         investidor10 - Libera conteúdo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  investidor10 - Libera conteúdo dos rankings
// @author       Fernando Mendes Fonseca
// @match        https://investidor10.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=investidor10.com.br
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/462344/investidor10%20-%20Libera%20conte%C3%BAdo.user.js
// @updateURL https://update.greasyfork.org/scripts/462344/investidor10%20-%20Libera%20conte%C3%BAdo.meta.js
// ==/UserScript==
(function() {
GM_addStyle (`
    .table-responsive-md {
        height: 1900px !important;
    }
` );
})();