// ==UserScript==
// @name         Excluir nó na página do Vanced YouTube
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Exclui o nó <span class="gbts">Drive</span> na página do Vanced YouTube
// @include      https://vanced-youtube.neocities.org/2015/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469382/Excluir%20n%C3%B3%20na%20p%C3%A1gina%20do%20Vanced%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/469382/Excluir%20n%C3%B3%20na%20p%C3%A1gina%20do%20Vanced%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var node = document.querySelector('#gb_49 > span:nth-child(2)');
    if (node) {
        node.remove();
    }
})();