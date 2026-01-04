// ==UserScript==
// @name         Ferritte Anti-Deauth V2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Combinação de bloqueio de requisições GraphQL e substituição de botão com redirecionamento
// @author       Mtazione
// @match        https://beta.app.professorferretto.com.br/*
// @match        https://app.professorferretto.com.br/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/525286/Ferritte%20Anti-Deauth%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/525286/Ferritte%20Anti-Deauth%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Parte 1: Bloquear requisições GraphQL
    const originalFetch = window.fetch;

    function alterarCorElementoXPath() {
        const xpath = "/html/body/div[1]/div[3]/aside/div[1]";  // XPath fornecido
        const node = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (node) {
            console.log('Elemento encontrado, tentando alterar a cor...');
            const svgElement = node.querySelector('svg');  // Encontra o <svg> dentro do <div>

            if (svgElement) {
                const pathElement = svgElement.querySelector('path');  // Encontrando o <path> dentro do <svg>

                if (pathElement) {
                    pathElement.setAttribute('fill', '#7CABF9');
                    console.log('Cor alterada para #7CABF9');
                } else {
                    console.log('Elemento <path> não encontrado dentro do <svg>');
                }
            } else {
                console.log('Elemento SVG não encontrado dentro do <div>');
            }
        } else {
            console.log('Elemento não encontrado com o XPath fornecido.');
        }
    }

    window.fetch = async function(...args) {
        if (args[0].includes('/graphql')) {
            console.log('[Tampermonkey] Interceptação de fetch para GraphQL.');

            const response = await originalFetch(...args);

            const clonedResponse = response.clone();
            const json = await clonedResponse.json();

            if (json.errors && json.errors.some(err => err.code === 'NOT_AUTHENTICATED')) {
                console.log('[Tampermonkey] Bloqueando resposta com NOT_AUTHENTICATED.');

                alterarCorElementoXPath();

                return new Response(JSON.stringify({ data: null }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            return response;
        }

        return originalFetch(...args);
    };

    console.log('[Tampermonkey] Fetch interceptado.');

    // Parte 2: Substituir o botão "Ok" e redirecionar automaticamente
    function substituirEBotaoERedirecionar() {
        const xpathButton = "/html/body/div[4]/div/div/div/div/div/button";  // XPath fornecido para o botão "Ok"
        const nodeButton = document.evaluate(xpathButton, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (nodeButton) {
            console.log('Botão encontrado, substituindo e redirecionando automaticamente...');

            const novoBotao = document.createElement('button');
            novoBotao.textContent = 'Refresh';
            novoBotao.className = nodeButton.className;

            nodeButton.parentNode.replaceChild(novoBotao, nodeButton);

            window.location.href = 'https://app.professorferretto.com.br/aulas';  // Redireciona para a URL especificada
        }
    }

    const intervalId = setInterval(function() {
        substituirEBotaoERedirecionar();
    }, 500);

    setTimeout(function() {
        clearInterval(intervalId);
        console.log('[Tampermonkey] Verificação interrompida após 10 segundos.');
    }, 10000);

    console.log('[Tampermonkey] Verificação contínua iniciada.');
})();
