// ==UserScript==
// @name         THE IDOLMASTER SHINY COLORS - background sound enabler
// @namespace    https://twitter.com/_uyza_
// @version      0.1
// @description  Playing sound when browser loses focus
// @author       Azyu
// @match        https://shinycolors.enza.fun/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404824/THE%20IDOLMASTER%20SHINY%20COLORS%20-%20background%20sound%20enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/404824/THE%20IDOLMASTER%20SHINY%20COLORS%20-%20background%20sound%20enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("blur", function (e) {
        e.stopImmediatePropagation();
    }, false);

})();