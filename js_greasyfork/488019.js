// ==UserScript==
// @name         ASIWEB sem caracteres especiais
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove caracteres especiais ao colar algum patrimonio ou numero de guia nos campos do ASIWEB
// @author       ils94
// @match        https://asiweb.tre-rn.jus.br/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488019/ASIWEB%20sem%20caracteres%20especiais.user.js
// @updateURL https://update.greasyfork.org/scripts/488019/ASIWEB%20sem%20caracteres%20especiais.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('paste', function(e) {
        e.preventDefault();
        var text = e.clipboardData.getData('text/plain');
        var cleanText = text.replace(/[^\w\s]/gi, ''); // Remove all special characters
        document.execCommand('insertText', false, cleanText);
    });
})();
