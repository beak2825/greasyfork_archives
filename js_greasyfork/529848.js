// ==UserScript==
// @name         Zendesk Enhancements
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhances Zendesk interface and adds additional functionality
// @author       diogoodev
// @match        https://*.zendesk.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529848/Zendesk%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/529848/Zendesk%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configurações do usuário
    const config = {
        responseMessage: '[Minha resposta ao cliente]\n',
        debounceTime: 300,
        notificationDuration: 3000
    };

    // Cache para elementos DOM
    const domCache = {
        tabToolbar: null,
        getTabToolbar() {
            if (!this.tabToolbar) {
                this.tabToolbar = document.querySelector('div[data-test-id="header-tablist"] > div.sc-19uji9v-0');
            }
            return this.tabToolbar;
        },
        resetCache() {
            this.tabToolbar = null;
        }
    };

    // Estado de ativação do script, persistido no localStorage
    let scriptEnabled = localStorage.getItem('scriptEnabled') === 'true' || true;

    // Traduções
    const translations = {
        'Text copied successfully!': 'Texto copiado com sucesso!',
        'Failed to copy text. Please try again.': 'Falha ao copiar texto. Tente novamente.',
        'Error accessing clipboard': 'Erro ao acessar a área de transferência',
        'No inactive tabs to close': 'Nenhuma aba inativa para fechar',
        'inactive tabs closed': 'abas inativas fechadas',
        'Script enabled': 'Script habilitado',
        'Script disabled': 'Script desabilitado',
        'Opened': 'Aberto',
        'URLs': 'URLs',
        'No URLs found in conversation': 'Nenhum URL encontrado na conversa',
        'Conversation container not found': 'Container da conversa não encontrado'
    };

    // Estilos CSS personalizados
    const customCSS = `
        .custom-button, .djm-task-link, .copy-conversation-button, .open-urls-button {
            padding: 5px 10px;
            background-color: limegreen;
            font-size: 16px;
            color: black;
            border: 1px solid transparent;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            margin: 5px;
            transition: background-color 0.15s ease, color 0.15s ease;
        }

        .custom-button:hover, .djm-task-link:hover, .copy-conversation-button:hover, .open-urls-button:hover {
            background-color: darkgreen;
            color: white;
        }

        .sc-1oduqug-0.jdCBDY {
            margin-top: 30px;
        }

        iframe#web-messenger-container {
            display: none;
        }

        .app_view.app-1019154.apps_ticket_sidebar iframe {
            height: 80vh!important;
        }

        .sc-1nvv38f-3.cjpyOe {
            flex: unset;
        }

        .jGrowl-notification {
            top: 30px;
        }

        .zendesk-custom-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
        }

        .toggle-script-button {
            position: fixed;
            bottom: 10px;
            left: 10px;
            z-index: 9999;
            opacity: 0.7;
        }

        .toggle-script-button:hover {
            opacity: 1;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;

    GM_addStyle(customCSS);

    // Utilitários
    const utils = {
        // Debounce para evitar chamadas excessivas de função
        debounce(func, wait) {
            let timeout;
            return function(...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), wait);
            };
        },

        // Função para extrair URLs de um texto
        extractUrls(text) {
            const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
            return text.match(urlRegex) || [];
        },

        // Verifica se um elemento já foi processado
        isProcessed(element, key = 'processed') {
            return element.dataset[key] === 'true';
        },

        // Marca um elemento como processado
        markAsProcessed(element, key = 'processed') {
            element.dataset[key] = 'true';
        },

        // Obtém um elemento ou array de elementos de forma segura
        safeQuerySelector(selector, parent = document, all = false) {
            try {
                return all
                    ? Array.from(parent.querySelectorAll(selector) || [])
                    : parent.querySelector(selector);
            } catch (e) {
                console.error(`Error selecting "${selector}":`, e);
                return all ? [] : null;
            }
        }
    };

    // Função para notificar o usuário com mensagens traduzidas
    function notifyUser(message) {
        const translatedMessage = translations[message] || message;

        const existingNotification = document.querySelector('.zendesk-custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.textContent = translatedMessage;
        notification.className = 'zendesk-custom-notification';
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.remove();
            }
        }, config.notificationDuration);
    }

    // Função para copiar texto para a área de transferência
    function copyToClipboard(text) {
        try {
            navigator.clipboard.writeText(text)
                .then(() => notifyUser('Text copied successfully!'))
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    notifyUser('Failed to copy text. Please try again.');
                });
        } catch (e) {
            console.error('Error accessing clipboard: ', e);
            notifyUser('Error accessing clipboard');
        }
    }

    // Função para transformar URLs em links clicáveis
    function transformUrlsToLinks() {
        if (!scriptEnabled) return;

        const cells = utils.safeQuerySelector('.beWvMU', document, true);
        if (cells.length === 0) return;

        for (const cell of cells) {
            if (cell.querySelector('a.custom-button')) continue;

            const text = cell.textContent;
            const urls = utils.extractUrls(text);

            if (urls.length === 0) continue;

            let modifiedHtml = text;
            for (const url of urls) {
                modifiedHtml = modifiedHtml.replace(
                    new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                    `<a href="${url}" target="_blank" class="custom-button">${url}</a>`
                );
            }

            cell.innerHTML = modifiedHtml;
        }
    }

    // Função para inicializar links nos campos de entrada
    function initializeInputLinks() {
        if (!scriptEnabled) return;

        const inputElements = utils.safeQuerySelector('.custom_field_14504424601628 input', document, true);
        if (inputElements.length === 0) return;

        for (const inputElement of inputElements) {
            if (utils.isProcessed(inputElement)) continue;
            utils.markAsProcessed(inputElement);

            const parentContainer = inputElement.parentNode.parentNode;
            const existingLink = parentContainer.querySelector('.djm-task-link');

            if (existingLink) {
                existingLink.remove();
            }

            const linkElement = document.createElement('a');
            linkElement.textContent = 'Task';
            linkElement.style.display = 'none';
            linkElement.classList.add('djm-task-link');
            parentContainer.insertBefore(linkElement, inputElement.nextSibling);

            checkForUrl(inputElement, linkElement);

            inputElement.addEventListener('input', utils.debounce(() => {
                checkForUrl(inputElement, linkElement);
            }, 200));
        }
    }

    // Função auxiliar para verificar URLs nos campos de entrada
    function checkForUrl(inputElement, linkElement) {
        if (!inputElement || !linkElement) return;

        const urls = utils.extractUrls(inputElement.value);

        if (urls.length > 0) {
            linkElement.href = urls[0];
            linkElement.setAttribute('target', '_blank');
            linkElement.style.display = 'inline-block';
        } else {
            linkElement.style.display = 'none';
        }
    }

    // Função para fechar abas inativas
    function closeInactiveTabs() {
        if (!scriptEnabled) return;

        const closeButtons = utils.safeQuerySelector(
            'div[role="tab"][data-selected="false"] button[data-test-id="close-button"]',
            document,
            true
        );

        if (closeButtons.length === 0) {
            notifyUser('No inactive tabs to close');
            return;
        }

        for (const btn of closeButtons) {
            btn.click();
        }

        notifyUser(`${closeButtons.length} inactive tabs closed`);
    }

    // Função para adicionar o botão "Fechar tudo"
    function addCloseAllButton() {
        if (!scriptEnabled) return;

        const toolbar = domCache.getTabToolbar();
        if (toolbar && !document.getElementById('close-all-button')) {
            const closeButton = document.createElement('button');
            closeButton.id = 'close-all-button';
            closeButton.textContent = 'Fechar tudo';
            closeButton.className = 'custom-button';
            closeButton.addEventListener('click', closeInactiveTabs);
            toolbar.appendChild(closeButton);
        }
    }

    // Função para adicionar botões "Copiar Conversa" e "Abrir Todos URLs"
    function addCopyButtons() {
        if (!scriptEnabled) return;

        const workspaces = utils.safeQuerySelector('.ember-view.workspace', document, true);
        if (workspaces.length === 0) return;

        for (const workspace of workspaces) {
            const headerElement =
                utils.safeQuerySelector('[data-test-id="conversation-header"]', workspace) ||
                utils.safeQuerySelector('.sc-1nvv38f-3.cjpyOe', workspace);

            if (!headerElement || headerElement.querySelector('.copy-conversation-button')) continue;

            // Botão "Copiar Conversa"
            const copyButton = document.createElement('button');
            copyButton.innerText = 'Copiar Conversa';
            copyButton.style.marginLeft = '10px';
            copyButton.classList.add('copy-conversation-button');
            copyButton.addEventListener('click', () => {
                const conversationContainer =
                    utils.safeQuerySelector('.sc-175iuw8-0.ecaNtR.conversation-polaris.polaris-react-component.rich_text', workspace) ||
                    utils.safeQuerySelector('[data-test-id="conversation-text"]', workspace);

                if (conversationContainer) {
                    const textToCopy = conversationContainer.innerText;
                    const modifiedText = textToCopy + config.responseMessage;
                    copyToClipboard(modifiedText);
                } else {
                    notifyUser('Conversation container not found');
                }
            });
            headerElement.appendChild(copyButton);

            // Botão "Abrir Todos URLs"
            const openUrlsButton = document.createElement('button');
            openUrlsButton.innerText = 'Abrir Todos URLs';
            openUrlsButton.style.marginLeft = '10px';
            openUrlsButton.classList.add('open-urls-button');
            openUrlsButton.addEventListener('click', () => {
                const conversationContainer =
                    utils.safeQuerySelector('.sc-175iuw8-0.ecaNtR.conversation-polaris.polaris-react-component.rich_text', workspace) ||
                    utils.safeQuerySelector('[data-test-id="conversation-text"]', workspace);

                if (conversationContainer) {
                    const text = conversationContainer.textContent;
                    const urls = utils.extractUrls(text);

                    if (urls.length > 0) {
                        // Limitar o número de abas abertas de uma vez para evitar bloqueio do navegador
                        const urlLimit = 10;
                        const openCount = Math.min(urls.length, urlLimit);

                        for (let i = 0; i < openCount; i++) {
                            window.open(urls[i], '_blank');
                        }

                        const message = openCount < urls.length
                            ? `Aberto ${openCount} de ${urls.length} URLs (limitado para evitar bloqueio do navegador)`
                            : `Aberto ${urls.length} URLs`;

                        notifyUser(message);
                    } else {
                        notifyUser('No URLs found in conversation');
                    }
                } else {
                    notifyUser('Conversation container not found');
                }
            });
            headerElement.appendChild(openUrlsButton);
        }
    }

    // Função para aplicar estilos às abas
    function applyTabStyles() {
        if (!scriptEnabled) return;

        const allTabs = utils.safeQuerySelector('div[role="tab"]', document, true);
        for (const tab of allTabs) {
            tab.style.backgroundColor = '';
            tab.style.borderLeft = '';
            tab.removeAttribute('style');
        }

        const selectedTabs = utils.safeQuerySelector('div[role="tab"][data-selected="true"], div[role="tab"][aria-selected="true"]', document, true);
        for (const tab of selectedTabs) {
            tab.style.backgroundColor = 'green';
            tab.style.borderLeft = '3px solid darkgreen';
        }
    }

    // Função para adicionar o botão de alternância do script
    function addToggleButton() {
        if (document.querySelector('.toggle-script-button')) return;

        const button = document.createElement('button');
        button.innerText = 'ZD Script';
        button.className = 'custom-button toggle-script-button';
        button.title = scriptEnabled ? 'Desabilitar script' : 'Habilitar script';
        button.style.backgroundColor = scriptEnabled ? 'limegreen' : '#ff6666';

        button.addEventListener('click', () => {
            scriptEnabled = !scriptEnabled;
            localStorage.setItem('scriptEnabled', scriptEnabled);

            button.style.backgroundColor = scriptEnabled ? 'limegreen' : '#ff6666';
            button.title = scriptEnabled ? 'Desabilitar script' : 'Habilitar script';

            const scriptElements = utils.safeQuerySelector('.custom-button:not(.toggle-script-button), .djm-task-link, .open-urls-button', document, true);
            for (const el of scriptElements) {
                el.style.display = scriptEnabled ? '' : 'none';
            }

            notifyUser(scriptEnabled ? 'Script enabled' : 'Script disabled');

            if (!scriptEnabled) {
                const allTabs = utils.safeQuerySelector('div[role="tab"]', document, true);
                for (const tab of allTabs) {
                    tab.removeAttribute('style');
                }
            } else {
                runAllFunctions();
            }
        });

        document.body.appendChild(button);
    }

    // Função para verificar a URL e executar funções correspondentes
    function checkURLAndRunFunctions() {
        if (!scriptEnabled) return;

        const currentPath = window.location.pathname;

        if (currentPath.startsWith('/agent/tickets/')) {
            initializeInputLinks();
        }

        if (currentPath.startsWith('/agent/filters/')) {
            transformUrlsToLinks();
        }

        applyTabStyles();
        addCloseAllButton();
        addCopyButtons();
    }

    // Cache para evitar refluos desnecessários
    const processedNodes = new WeakSet();

    // Função otimizada para executar todas as funções
    function runAllFunctions() {
        domCache.resetCache();
        checkURLAndRunFunctions();
    }

    // Função de inicialização
    function initialize() {
        runAllFunctions();
        addToggleButton();
        setupObservers();
    }

    // Configuração de observadores para mudanças na página de forma mais eficiente
    function setupObservers() {
        // Observer para mudanças de URL
        let lastUrl = location.href;
        const debouncedRunAll = utils.debounce(runAllFunctions, config.debounceTime);

        // Observador para mudanças críticas na página
        const contentObserver = new MutationObserver((mutations) => {
            // Verificar se houve alguma mudança significativa
            let shouldUpdate = false;

            // Verificar mudanças de URL
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                shouldUpdate = true;
            }

            // Verificar outras mudanças significativas no DOM
            if (!shouldUpdate) {
                for (const mutation of mutations) {
                    // Ignorar mutações em elementos já processados
                    if (processedNodes.has(mutation.target)) continue;

                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Verificar se elementos importantes foram adicionados
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType !== Node.ELEMENT_NODE) continue;

                            // Importante para novos tickets, abas, etc.
                            if (node.matches && (
                                node.matches('.ember-view.workspace') ||
                                node.matches('div[role="tab"]') ||
                                node.querySelector('.ember-view.workspace, div[role="tab"]')
                            )) {
                                shouldUpdate = true;
                                break;
                            }
                        }

                        if (shouldUpdate) break;
                    } else if (mutation.type === 'attributes' &&
                        (mutation.attributeName === 'data-selected' ||
                         mutation.attributeName === 'aria-selected')) {
                        // Para mudanças nas abas
                        applyTabStyles();
                        processedNodes.add(mutation.target);
                    }
                }
            }

            if (shouldUpdate) {
                debouncedRunAll();
            }
        });

        // Observar o documento inteiro
        contentObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-selected', 'aria-selected']
        });

        // Delegação de eventos para cliques em abas
        document.addEventListener('click', (e) => {
            const tabElement = e.target.closest('div[role="tab"]');
            if (tabElement) {
                setTimeout(applyTabStyles, 50);
            }
        }, { capture: true, passive: true });
    }

    // Inicialização do script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();