// ==UserScript==
// @name         Seguir Redirecionamento 302 Manualmente
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Faz uma requisição HTTP e, se receber 302, segue o redirecionamento manualmente
// @author       Seu Nome
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/537780/Seguir%20Redirecionamento%20302%20Manualmente.user.js
// @updateURL https://update.greasyfork.org/scripts/537780/Seguir%20Redirecionamento%20302%20Manualmente.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL inicial para requisição
    const urlInicial = 'https://httpbin.org/redirect-to?url=https://example.com';

    function fazerRequisicao(url) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 302 || response.status === 301) {
                    // Extrai o cabeçalho Location para seguir o redirecionamento
                    const novaUrl = response.responseHeaders.match(/Location:\s*(.*)/i);
                    if (novaUrl && novaUrl[1]) {
                        const urlRedirecionada = novaUrl[1].trim();
                        console.log('Redirecionando para:', urlRedirecionada);
                        // Chama recursivamente para seguir o redirecionamento
                        fazerRequisicao(urlRedirecionada);
                    } else {
                        console.error('Cabeçalho Location não encontrado.');
                    }
                } else {
                    console.log('Resposta recebida:', response.status, response.responseText);
                    // Aqui você pode processar a resposta normalmente
                }
            },
            onerror: function(err) {
                console.error('Erro na requisição:', err);
            }
        });
    }

    // Executa a requisição inicial
    fazerRequisicao(urlInicial);

})();
