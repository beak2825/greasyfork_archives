// ==UserScript==
// @name         Google Line Spacing
// @namespace    http://fergonez.net/
// @version      0.1
// @description  Corrige espacamento dos resultados da busca
// @author       Fergo
// @match        https://www.google.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/428478/Google%20Line%20Spacing.user.js
// @updateURL https://update.greasyfork.org/scripts/428478/Google%20Line%20Spacing.meta.js
// ==/UserScript==
 
GM_addStyle(`
    #search .g {
        line-height: 1.4;
    }
`);