// ==UserScript==
// @name         AliExpress - Imagens grandes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script para abrir as imagens do aliexpress em tamanho máximo
// @author       You
// @match        https://ae01.alicdn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395242/AliExpress%20-%20Imagens%20grandes.user.js
// @updateURL https://update.greasyfork.org/scripts/395242/AliExpress%20-%20Imagens%20grandes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var count = (window.location.href.match(/.jpg/g) || []).length;
    if (count > 1) {
        window.location.href=window.location.href.slice(0,window.location.href.indexOf(".jpg")+4);
    }

})();