// ==UserScript==
// @name         Amazon referido Flama
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Script de mendigar para Flama. A todos los enlaces de amazon les añade su link de referido.
// @author       ManitaDeCerdo
// @match        https://www.amazon.com/*/dp/*
// @match        https://www.amzn.com/*/dp/*
// @match        https://www.amazon.co.uk/*/dp/*
// @match        https://www.amazon.de/*/dp/*
// @match        https://www.amazon.fr/*/dp/*
// @match        https://www.amazon.it/*/dp/*
// @match        https://www.amazon.ca/*/dp/*
// @match        https://www.amazon.com.mx/*/dp/*
// @match        https://www.amazon.es/*/dp/*
// @match        https://www.amazon.co.jp/*/dp/*
// @match        https://www.amazon.in/*/dp/*
// @match        https://www.amazon.com.br/*/dp/*
// @match        https://www.amazon.nl/*/dp/*
// @match        https://www.amazon.com.au/*/dp/*
// @match        https://www.amazon.ae/*/dp/*
// @match        https://www.amazon.eg/*/dp/*
// @match        https://www.amazon.pl/*/dp/*
// @match        https://www.amazon.se/*/dp/*
// @match        https://www.amazon.sg/*/dp/*
// @match        https://www.amazon.com.tr/*/dp/*
// @match        https://www.amazon.cn/*/dp/*
// @match        https://www.amazon.sa/*/dp/*
// @match        https://www.amazon.com.be/*/dp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.es
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/476818/Amazon%20referido%20Flama.user.js
// @updateURL https://update.greasyfork.org/scripts/476818/Amazon%20referido%20Flama.meta.js
// ==/UserScript==

(function() {
    var url = window.location.href;
    const referido = '&linkCode=ll1&tag=whichpcbuy-21&linkId=6b7e0de9a10d16894347d4e69ad07b1c&language=es_ES';
    if (!url.includes(referido)){
        var urlFinal = url + referido;
        window.location.href = urlFinal;
    }
})();