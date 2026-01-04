// ==UserScript==
// @name     Corrigindo o G1
// @description Corrige o problema da seleção do G1 no Firefox
// @version 0.1
// @include  *g1.globo.com*
// @grant    GM_addStyle
// @run-at   document-start
// @namespace https://greasyfork.org/users/570212
// @downloadURL https://update.greasyfork.org/scripts/403880/Corrigindo%20o%20G1.user.js
// @updateURL https://update.greasyfork.org/scripts/403880/Corrigindo%20o%20G1.meta.js
// ==/UserScript==

GM_addStyle ( `
    .mc-body ::selection {
    background: rgba(196, 23, 12, 0.2) !important ;
}
.mc-body ::selection {
    background: rgba(196, 23, 12, 0.2) !important ;
}
` );