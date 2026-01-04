// ==UserScript==
// @name         Zotero Web - Botão "Abrir no Desktop"
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Adiciona um botão 'Abrir no Desktop' ao lado das outras abas em páginas de itens do Zotero Web, usando o protocolo zotero://. Usa MutationObserver.
// @author       luascfl
// @match        https://www.zotero.org/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV_MA7Vf6pToxR-d07GVMKROpt6L0Zwg479w&s
// @home            https://github.com/luascfl/zotero-web-open-in-desktop
// @supportURL      https://github.com/luascfl/zotero-web-open-in-desktop/issues
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534217/Zotero%20Web%20-%20Bot%C3%A3o%20%22Abrir%20no%20Desktop%22.user.js
// @updateURL https://update.greasyfork.org/scripts/534217/Zotero%20Web%20-%20Bot%C3%A3o%20%22Abrir%20no%20Desktop%22.meta.js
// ==/UserScript==

(function() {

    'use strict';

    const logPrefix = '[Zotero Desktop]:';
    // Regex para extrair collectionKey e itemKey da URL da página de item do Zotero
    const itemUrlRegex = /https:\/\/www\.zotero\.org\/(?:[^/]+|(?:groups|users)\/[^/]+(?:\/[^/]+)?)\/collections\/([A-Z0-9]+)\/items\/([A-Z0-9]+)/;
    // Seletor CSS para encontrar o container das abas (Ex: Notas, Anexos, etc.)
    const tabContainerSelector = 'div.nav.tabs[role="tablist"]';
    // ID único para o link 'Protocolo' que será adicionado dinamicamente
    const protocolLinkId = 'dynamic-zotero-protocol-link';

    // Variável para guardar a referência do MutationObserver ativo, se houver
    let currentObserver = null;

    /**
     * Analisa uma URL para extrair as chaves da coleção e do item Zotero.
     * @param {string} url A URL a ser analisada.
     * @returns {object|null} Um objeto { collectionKey, itemKey } se a URL corresponder, caso contrário null.
     */
    function parseZoteroUrl(url) {
        // console.log(logPrefix, 'Parsing URL:', url); // Descomente para debug
        const match = url.match(itemUrlRegex);
        if (match && match[1] && match[2]) {
            // console.log(logPrefix, 'URL PARSED:', { collectionKey: match[1], itemKey: match[2] }); // Descomente para debug
            return { collectionKey: match[1], itemKey: match[2] };
        }
        // console.log(logPrefix, 'URL NOT an item page.'); // Descomente para debug
        return null;
    }

    /**
     * Adiciona um link 'Protocolo' (zotero://) ao container de abas na página do item.
     * @param {Element} tabContainer O elemento DIV que contém as abas.
     * @param {string} collectionKey A chave da coleção Zotero.
     * @param {string} itemKey A chave do item Zotero.
     */
    function addProtocolLink(tabContainer, collectionKey, itemKey) {
        console.log(logPrefix, '>>> Tentando adicionar link no container:', tabContainer);

        // 1. Verifica se o link já existe DENTRO do container especificado para evitar duplicatas
        if (tabContainer.querySelector(`#${protocolLinkId}`)) {
            console.log(logPrefix, 'Link Protocolo já existe neste container. Nada a fazer.');
            return; // Link já presente
        }

        // 2. Cria o novo elemento de link (<a>)
        const protocolUrl = `zotero://select/library/collections/${collectionKey}/items/${itemKey}`;
        const protocolLink = document.createElement('a');
        protocolLink.href = protocolUrl;
        protocolLink.id = protocolLinkId; // Define o ID para fácil remoção posterior
        protocolLink.textContent = 'Zotero Desktop'; // Texto visível do link
        protocolLink.setAttribute('target', '_blank'); // Abre em nova aba/app (boa prática para protocolos)
        protocolLink.title = `Abrir no Zotero: ${protocolUrl}`; // Tooltip informativo

        // 3. Aplica estilos e atributos para que se pareça com as outras abas
        protocolLink.classList.add('tab'); // Usa a mesma classe CSS das outras abas
        protocolLink.setAttribute('role', 'tab'); // Define a role ARIA como as outras abas
        protocolLink.style.textDecoration = 'none'; // Remove sublinhado padrão de links
        protocolLink.style.cursor = 'pointer'; // Indica que é clicável
        protocolLink.setAttribute('aria-selected', 'false'); // Não está selecionado por padrão
        // Tenta usar o mesmo tabindex das outras abas não selecionadas (se aplicável)
        protocolLink.setAttribute('tabindex', '-2'); // Baseado no HTML fornecido anteriormente

        // 4. Adiciona (append) o link criado ao final do container de abas
        console.log(logPrefix, '>>> ADICIONANDO o link Protocolo ao container:', protocolLink);
        tabContainer.appendChild(protocolLink);
        console.log(logPrefix, '>>> Link Protocolo adicionado com sucesso.');
    }

    /**
     * Remove o link 'Protocolo' customizado da página, caso ele exista.
     * Útil ao navegar para fora de uma página de item ou antes de adicionar um novo.
     */
    function removeProtocolLink() {
        const protocolLink = document.getElementById(protocolLinkId);
        if (protocolLink) {
            console.log(logPrefix, 'Removendo link Protocolo customizado (ID: ' + protocolLinkId + ').');
            protocolLink.remove();
        }
    }

    /**
     * Cria e ativa um MutationObserver para observar a adição do container de abas ao DOM.
     * Quando o container é encontrado, chama addProtocolLink e desconecta o observer.
     * @param {string} collectionKey A chave da coleção Zotero para o link.
     * @param {string} itemKey A chave do item Zotero para o link.
     */
    function observeForTabContainer(collectionKey, itemKey) {
        // Se já existe um observer ativo, desconecta-o primeiro
        if (currentObserver) {
            // console.log(logPrefix, "Desconectando observer anterior."); // Descomente para debug
            currentObserver.disconnect();
        }

        // Observa o 'body' para capturar adições em qualquer parte da árvore DOM
        const targetNode = document.body;
        console.log(logPrefix, `Iniciando observer no ${targetNode.tagName} para encontrar '${tabContainerSelector}'...`);
        const config = { childList: true, subtree: true }; // Observa adições de nós filhos e em sub-árvores

        // Função callback que será executada quando mutações forem detectadas
        const callback = function(mutationsList, observer) {
            for (const mutation of mutationsList) {
                // Verifica se nós foram adicionados
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        // Processa apenas nós do tipo ELEMENT_NODE
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            let tabContainer = null;
                            // Verifica se o próprio nó adicionado é o container que procuramos
                            if (typeof node.matches === 'function' && node.matches(tabContainerSelector)) {
                                tabContainer = node;
                                console.log(logPrefix, `Observer: Container de abas ADICIONADO diretamente.`);
                            }
                            // Verifica se o container que procuramos está DENTRO do nó adicionado
                            else if (typeof node.querySelector === 'function') {
                                tabContainer = node.querySelector(tabContainerSelector);
                                if (tabContainer) {
                                    console.log(logPrefix, `Observer: Container de abas encontrado DENTRO de nó adicionado (${node.tagName}).`);
                                }
                            }

                            // Se encontramos o container de abas...
                            if (tabContainer) {
                                console.log(logPrefix, '>>> CONTAINER DE ABAS ENCONTRADO VIA OBSERVER! Chamando addProtocolLink...');
                                addProtocolLink(tabContainer, collectionKey, itemKey); // Adiciona o link
                                console.log(logPrefix, 'Desconectando observer após encontrar container.');
                                observer.disconnect(); // Para de observar, já que o objetivo foi atingido
                                currentObserver = null; // Limpa a referência do observer
                                return; // Sai do loop e da função callback
                            }
                        }
                    }
                }
            }
        };

        // Cria e inicia o observer
        currentObserver = new MutationObserver(callback);
        currentObserver.observe(targetNode, config);
        console.log(logPrefix, `Observer ATIVO no ${targetNode.tagName}. Aguardando container "${tabContainerSelector}"...`);

        // Verificação Inicial: O container já existe na página quando o script é executado?
        // Isso pode acontecer se o script rodar após o carregamento completo do DOM inicial.
        const existingContainer = targetNode.querySelector(tabContainerSelector);
        if (existingContainer) {
            console.log(logPrefix, 'Container de abas encontrado na VERIFICAÇÃO INICIAL. Chamando addProtocolLink...');
            addProtocolLink(existingContainer, collectionKey, itemKey);
            // Se já encontramos, não precisamos mais do observer para esta visualização
            console.log(logPrefix, 'Desconectando observer após sucesso inicial (container já existia).');
            currentObserver.disconnect();
            currentObserver = null;
        } else {
            console.log(logPrefix, 'Container de abas não encontrado na verificação inicial. Observer continua ativo.');
        }
    }

    /**
     * Função principal que verifica a URL atual e decide a ação a ser tomada.
     * Chamada no carregamento inicial e em mudanças de URL (navegação SPA).
     */
    function checkUrlAndApply() {
        console.log(logPrefix, '>>> checkUrlAndApply EXECUTANDO para URL:', window.location.href);

        // 1. SEMPRE remove qualquer link 'Protocolo' existente de uma visualização anterior
        removeProtocolLink();

        // 2. SEMPRE desconecta qualquer observer ativo de uma visualização anterior
        if (currentObserver) {
            console.log(logPrefix, "Desconectando observer existente em checkUrlAndApply.");
            currentObserver.disconnect();
            currentObserver = null;
        }

        // 3. Analisa a URL atual para verificar se é uma página de item Zotero
        const currentUrl = window.location.href;
        const parsed = parseZoteroUrl(currentUrl);

        // 4. Se for uma URL de item, inicia a observação pelo container de abas
        if (parsed) {
            console.log(logPrefix, 'URL é de item. Iniciando observeForTabContainer...');
            // Chama a função que configura o MutationObserver para esperar pelo container
            observeForTabContainer(parsed.collectionKey, parsed.itemKey);
        } else {
            // Se não for uma página de item, apenas garante que tudo foi limpo (feito nos passos 1 e 2)
            console.log(logPrefix, 'URL NÃO é de item. Limpeza feita.');
        }
        console.log(logPrefix,'<<< checkUrlAndApply CONCLUÍDA.');
    }

    // --- Monitoramento de Mudanças de URL (Histórico da API / SPA Navigation) ---
    // O site do Zotero usa navegação SPA (Single Page Application),
    // então precisamos ouvir eventos que indicam mudança de URL sem recarregar a página.

    // Guarda as funções originais
    const historyPushState = history.pushState;
    const historyReplaceState = history.replaceState;

    // Sobrescreve history.pushState para disparar um evento customizado
    history.pushState = function() {
        historyPushState.apply(history, arguments); // Chama a função original
        // Dispara um evento customizado que podemos ouvir
        window.dispatchEvent(new CustomEvent('locationchange_pushstate'));
    };

    // Sobrescreve history.replaceState para disparar um evento customizado
    history.replaceState = function() {
        historyReplaceState.apply(history, arguments); // Chama a função original
        // Dispara um evento customizado que podemos ouvir
        window.dispatchEvent(new CustomEvent('locationchange_replacestate'));
    };

    // Adiciona listeners para os eventos customizados e para o 'popstate' (botões voltar/avançar do navegador)
    window.addEventListener('locationchange_pushstate', checkUrlAndApply);
    window.addEventListener('locationchange_replacestate', checkUrlAndApply);
    window.addEventListener('popstate', checkUrlAndApply); // Evento padrão para navegação no histórico

    // --- Execução Inicial ---
    // Verifica o estado do carregamento do documento para rodar a verificação inicial.
    if (document.readyState === 'loading') {
        // Se o DOM ainda está carregando, espera pelo evento DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => {
            console.log(logPrefix, 'DOM carregado, executando checkUrlAndApply inicial.');
            checkUrlAndApply();
        });
    } else {
        // Se o DOM já está carregado, executa imediatamente
        console.log(logPrefix, 'DOM já carregado, executando checkUrlAndApply inicial.');
        checkUrlAndApply();
    }

    console.log(logPrefix, '<<<<< Script (v3 - Add Button) carregado e pronto >>>>>');

})(); // Fim da IIFE (Immediately Invoked Function Expression)
