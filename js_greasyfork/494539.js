// ==UserScript==
// @name         CloudFlare Challenge
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cloudflare
// @author       Keno Venas
// @match        https://challenges.cloudflare.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cloudflare.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494539/CloudFlare%20Challenge.user.js
// @updateURL https://update.greasyfork.org/scripts/494539/CloudFlare%20Challenge.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var fraseParaDetectar = "Confirme que é humano";
    function clicarComAtraso(botao) {
        setTimeout(function() {
            botao.click();
        }, 500);
    }
    function clicarQuandoDetectado() {
        var botao = document.querySelector('.cb-lb-t');
        if (botao) {
            clicarComAtraso(botao);
        }
    }
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                var nodes = Array.from(mutation.addedNodes);
                nodes.forEach(function(node) {
                    if (node.textContent.includes(fraseParaDetectar)) {
                        clicarQuandoDetectado();
                    }
                });
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();