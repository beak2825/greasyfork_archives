// ==UserScript==
// @name         IGN Avatar Upload Assistant with API Capture and Modify
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Captures, modifies, and resends API requests when the upload button is clicked on IGN
// @author       Your Name
// @match        https://www.ign.com/account/settings
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504717/IGN%20Avatar%20Upload%20Assistant%20with%20API%20Capture%20and%20Modify.user.js
// @updateURL https://update.greasyfork.org/scripts/504717/IGN%20Avatar%20Upload%20Assistant%20with%20API%20Capture%20and%20Modify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para exibir um alerta ao clicar no botão de upload
    function handleUploadButtonClick() {
        alert('Nesta etapa, você precisa enviar qualquer imagem. Isso serve apenas para capturar as informações da API. Tutorial para hospedar seu avatar: https://mamadordeviados.neocities.org/ Copia o link, mas envie o avatar antes de acessar o site. Sou burro se não o script buga kkk se bugar recarrega a página.');
    }

    // Adiciona o listener ao botão de upload
    function addButtonClickListener() {
        const uploadButton = document.querySelector('.jsx-503626215.avatar-picker');
        if (uploadButton) {
            uploadButton.removeEventListener('click', handleUploadButtonClick);
            uploadButton.addEventListener('click', handleUploadButtonClick);
        }
    }

    // Função para monitorar e capturar requisições de API
    function monitorAPIRequests() {
        const originalFetch = window.fetch;

        window.fetch = async function(...args) {
            if (args[0].includes('https://mollusk.apis.ign.com/graphql') && args[1] && args[1].body) {
                console.log('Intercepted API request:');
                console.log('URL:', args[0]);

                // Log dos cabeçalhos e corpo da requisição
                console.log('Original Headers:', args[1].headers);
                console.log('Original Body:', args[1].body);

                try {
                    // Converte o corpo da requisição para JSON e modifica os valores
                    let requestBody = JSON.parse(args[1].body);

                    // Solicita ao usuário novos valores para avatarImageUrl e thumbnailUrl
                    const newUrl = prompt('Digite o novo URL para avatarImageUrl e thumbnailUrl:', '');

                    if (newUrl !== null) {
                        // Modifica apenas os campos necessários, mantendo o restante intacto
                        requestBody.variables.userInput.avatarImageUrl = newUrl;
                        requestBody.variables.userInput.thumbnailUrl = newUrl;

                        // Exibe os novos valores no console
                        console.log('Modified Body:', requestBody);

                        // Envia a requisição com o corpo modificado
                        const response = await originalFetch(args[0], {
                            method: 'POST',
                            headers: {
                                ...args[1].headers,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(requestBody)
                        });

                        // Loga a resposta da requisição modificada
                        const responseBody = await response.json();
                        console.log('Response:', responseBody);

                        // Retorna a resposta da requisição modificada
                        return new Response(JSON.stringify(responseBody), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        });
                    } else {
                        console.error('No URL provided. Request not sent.');
                    }
                } catch (error) {
                    console.error('Error modifying request:', error);
                }
            }

            // Chama o fetch original se a URL não corresponder
            return originalFetch.apply(this, args);
        };
    }

    // Adiciona o listener ao carregar a página
    addButtonClickListener();

    // Inicia a observação do DOM para o botão de upload
    const observer = new MutationObserver(() => addButtonClickListener());
    observer.observe(document.body, { childList: true, subtree: true });

    // Inicia o monitoramento das requisições API
    monitorAPIRequests();

})();