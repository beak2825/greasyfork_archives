// ==UserScript==
// @name         Gerenciador de chats ChatGPT (Substitui Botão Upgrade)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Gerencia conversas em massa e substitui o botão "Upgrade" pelo painel de controle.
// @author       luascfl
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @icon         https://cdn-icons-png.flaticon.com/512/16459/16459818.png
// @home         https://github.com/luascfl/manage-chats-chatgpt
// @supportURL   https://github.com/luascfl/manage-chats-chatgpt/issues
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531381/Gerenciador%20de%20chats%20ChatGPT%20%28Substitui%20Bot%C3%A3o%20Upgrade%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531381/Gerenciador%20de%20chats%20ChatGPT%20%28Substitui%20Bot%C3%A3o%20Upgrade%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[ChatManager v2.1] Script iniciado.');

    // Função auxiliar para logs de depuração
    const logDebug = (message, selector, result) => {
        if (result === null || (result.length !== undefined && result.length === 0)) {
            console.log(`[ChatManager Debug] ❌ ${message}: '${selector}'`, '-> Não encontrado');
        } else {
            const count = result.length !== undefined ? `(${result.length} encontrados)` : '';
            console.log(`[ChatManager Debug] ✔️ ${message}: '${selector}' ${count}`, '->', result);
        }
    };

    const PLATFORMS = {
        'chat.openai.com': {
            name: 'ChatGPT',
            selectors: {
                entryPoint: 'nav',
                chatItems: 'a[href^="/c/"]',
                chatLink: 'a[href^="/c/"]',
                chatTitle: 'div.truncate',
                upgradeButtonContainer: '.__menu-item' // Seletor para os itens do menu
            },
            api: {
                base: window.location.origin,
                tokenEndpoint: '/api/auth/session',
                conversationEndpoint: '/backend-api/conversation/',
                tokenExtractor: (data) => data.accessToken
            },
            priorityEmoji: '❗',
            upgradeButtonText: 'Fazer upgrade do plano'
        },
    };

    const PLATFORM = PLATFORMS[window.location.hostname] || PLATFORMS['chat.openai.com'];
    const SELECTOR = PLATFORM.selectors;
    const PRIORITY_EMOJI = PLATFORM.priorityEmoji;
    const API_BASE = PLATFORM.api.base;

    class UIManager {
        constructor() {
            this.addStyles();
        }

        addStyles() {
            if (document.getElementById('chat-manager-styles')) return;
            const styleEl = document.createElement('style');
            styleEl.id = 'chat-manager-styles';
            styleEl.innerHTML = `
              .mass-actions { padding: 8px; margin: 2px 8px; border-radius: 8px; background-color: var(--surface-secondary); }
              .mass-actions-title { font-weight: bold; margin-bottom: 10px; font-size: 14px; text-align: center; color: var(--text-primary); }
              .mass-actions-btn { width: 100%; justify-content: center; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; border: 1px solid var(--border-medium); margin-bottom: 5px; background-color: var(--surface-primary); display: flex; align-items: center; }
              .mass-actions-btn:hover { background-color: var(--surface-tertiary); }
              .btn-delete { background-color: rgba(255, 76, 76, 0.1); color: #ff4c4c; }
              .btn-delete:hover { background-color: rgba(255, 76, 76, 0.2); }
              .dialog-checkbox { cursor: pointer; }
              .chat-action-status { position: fixed; top: 20px; right: 20px; padding: 12px 16px; background: var(--surface-primary); border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 2000; display: flex; align-items: center; font-size: 14px; }
              .status-icon { margin-right: 8px; font-size: 18px; }
              .status-success { color: #4caf50; } .status-error { color: #f44336; } .status-loading { color: #2196f3; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              .loading-spinner { animation: spin 1s linear infinite; display: inline-block; }
              .select-count { font-size: 12px; color: var(--text-secondary); text-align: center; margin-top: 4px; display: block; }
            `;
            document.head.appendChild(styleEl);
        }

        showStatus(message, type = 'loading') {
            const existingStatus = document.querySelector('.chat-action-status');
            logDebug("Buscando status existente", '.chat-action-status', existingStatus);
            if(existingStatus) existingStatus.remove();

            const statusEl = document.createElement('div');
            statusEl.className = 'chat-action-status';
            let icon = '';
            if (type === 'loading') icon = '<span class="status-icon status-loading"><span class="loading-spinner">⟳</span></span>';
            else if (type === 'success') icon = '<span class="status-icon status-success">✓</span>';
            else if (type === 'error') icon = '<span class="status-icon status-error">✕</span>';
            statusEl.innerHTML = `${icon}${message}`;
            document.body.appendChild(statusEl);
            if (type !== 'loading') setTimeout(() => statusEl.remove(), 3000);
            return statusEl;
        }

        createCheckbox(chatItem) {
            const existingCheckbox = chatItem.querySelector('.dialog-checkbox-container');
            if (existingCheckbox) return;

            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'dialog-checkbox-container flex items-center pr-2';
            checkboxContainer.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                const checkbox = e.currentTarget.querySelector('.dialog-checkbox');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'dialog-checkbox h-4 w-4 rounded';
            checkbox.addEventListener('change', () => this.updateSelectedCount());
            checkboxContainer.appendChild(checkbox);
            chatItem.prepend(checkboxContainer);
        }

        updateSelectedCount() {
            const selectedCheckboxes = document.querySelectorAll('.dialog-checkbox:checked');
            logDebug("Atualizando contagem - Buscando checkboxes marcados", '.dialog-checkbox:checked', selectedCheckboxes);
            const selectedCount = selectedCheckboxes.length;

            const countElement = document.querySelector('.selected-count');
            logDebug("Atualizando contagem - Buscando elemento do contador", '.selected-count', countElement);
            if (countElement) countElement.textContent = selectedCount > 0 ? `${selectedCount} selecionado${selectedCount > 1 ? 's' : ''}` : 'Nenhum selecionado';
        }

        setupControlPanel() {
            const upgradeButtonText = PLATFORM.upgradeButtonText;
            let upgradeButton = null;

            const menuItems = document.querySelectorAll(SELECTOR.upgradeButtonContainer);
            logDebug("Buscando todos os itens de menu para achar o de 'Upgrade'", SELECTOR.upgradeButtonContainer, menuItems);

            for (const item of menuItems) {
                if (item.textContent.includes(upgradeButtonText)) {
                    upgradeButton = item;
                    break;
                }
            }
            logDebug("Resultado da busca pelo botão 'Upgrade' pelo texto", upgradeButtonText, upgradeButton);

            if (!upgradeButton) {
                return;
            }

            const existingPanel = document.querySelector('.mass-actions');
            logDebug("Verificando se painel de controle já existe", '.mass-actions', existingPanel);
            if (existingPanel) {
                this.updateSelectedCount();
                return;
            }

            const controls = this.createControlsElement();
            upgradeButton.parentNode.replaceChild(controls, upgradeButton);
            this.updateSelectedCount();
        }

        createControlsElement() {
            const controls = document.createElement('div');
            controls.className = 'mass-actions';
            controls.innerHTML = `
              <div class="mass-actions-title">Gerenciamento em Massa</div>
              <button class="mass-actions-btn btn-select-all">Selecionar Tudo</button>
              <button class="mass-actions-btn btn-select-without-emoji">Sel. sem ${PRIORITY_EMOJI}</button>
              <button class="mass-actions-btn btn-deselect-all">Desmarcar Tudo</button>
              <hr class="my-2 border-token-border-light">
              <button class="mass-actions-btn btn-archive">Arquivar Selecionados</button>
              <button class="mass-actions-btn btn-delete">Excluir Selecionados</button>
              <span class="selected-count"></span>`;
            this.setupButtonHandlers(controls);
            return controls;
        }

        setupButtonHandlers(controls) {
            const handlers = {
                '.btn-select-all': () => this.toggleAllCheckboxes(true),
                '.btn-select-without-emoji': () => window.chatManager.selectChatsWithoutPriorityEmoji(),
                '.btn-deselect-all': () => this.toggleAllCheckboxes(false),
                '.btn-archive': () => { if (confirm('Deseja arquivar as conversas selecionadas?')) window.chatManager.updateChats({ is_archived: true }); },
                '.btn-delete': () => { if (confirm('Deseja excluir permanentemente as conversas selecionadas?')) window.chatManager.updateChats({ is_visible: false }); }
            };
            for (const [selector, handler] of Object.entries(handlers)) {
                const button = controls.querySelector(selector);
                logDebug("Configurando botão no painel", selector, button);
                if(button) button.addEventListener('click', handler);
            }
        }

        toggleAllCheckboxes(state) {
            const chatItems = document.querySelectorAll(SELECTOR.chatItems);
            logDebug("Selecionando/Deselecionando tudo - Buscando itens de chat", SELECTOR.chatItems, chatItems);
            chatItems.forEach(item => {
                const cb = item.querySelector('.dialog-checkbox');
                if (cb) cb.checked = state;
            });
            this.updateSelectedCount();
        }
    }

    class ChatManager {
        constructor(uiManager) {
            this.ui = uiManager;
        }

        async getAccessToken() {
            try {
                const response = await fetch(`${API_BASE}${PLATFORM.api.tokenEndpoint}`);
                if (!response.ok) throw new Error(`A resposta da rede não foi OK: ${response.statusText}`);
                const data = await response.json();
                return PLATFORM.api.tokenExtractor(data);
            } catch (error) {
                console.error('Erro ao obter token:', error);
                this.ui.showStatus(`Erro de token: ${error.message}`, 'error');
                return null;
            }
        }

        getChatId(element) {
            const chatLink = element.closest(SELECTOR.chatLink);
            logDebug("Obtendo ID - Buscando link do chat", SELECTOR.chatLink, chatLink);
            return chatLink ? new URL(chatLink.href).pathname.split('/').pop() : null;
        }

        hasPriorityEmoji(chatItem) {
            const titleDiv = chatItem.querySelector(SELECTOR.chatTitle);
            logDebug("Verificando emoji - Buscando título do chat", SELECTOR.chatTitle, titleDiv);
            return titleDiv && titleDiv.textContent.includes(PRIORITY_EMOJI);
        }

        selectChatsWithoutPriorityEmoji() {
            const chatItems = document.querySelectorAll(SELECTOR.chatItems);
            logDebug("Selecionando sem emoji - Buscando itens de chat", SELECTOR.chatItems, chatItems);
            chatItems.forEach(item => {
                const checkbox = item.querySelector('.dialog-checkbox');
                if (checkbox) checkbox.checked = !this.hasPriorityEmoji(item);
            });
            this.ui.updateSelectedCount();
        }

        async updateChats(body) {
            const checkedItems = Array.from(document.querySelectorAll('.dialog-checkbox:checked'));
            logDebug("Processando chats - Buscando checkboxes marcados", '.dialog-checkbox:checked', checkedItems);
            if (checkedItems.length === 0) {
                this.ui.showStatus('Nenhuma conversa selecionada', 'error');
                return;
            }
            const action = body.is_archived ? 'arquivando' : 'excluindo';
            this.ui.showStatus(`${action} ${checkedItems.length} conversas...`);
            const accessToken = await this.getAccessToken();
            if (!accessToken) return;

            const promises = checkedItems.map(async (checkbox) => {
                const chatItem = checkbox.closest(SELECTOR.chatItems);
                logDebug("Processando chat individualmente - Buscando item de chat pai", SELECTOR.chatItems, chatItem);
                const chatId = this.getChatId(chatItem);
                if (!chatId) return Promise.reject('Chat ID não encontrado');
                const response = await fetch(`${API_BASE}${PLATFORM.api.conversationEndpoint}${chatId}`, {
                    method: 'PATCH',
                    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                if (!response.ok) return Promise.reject(`HTTP ${response.status}`);
                if (chatItem) chatItem.style.opacity = '0.5';
                return Promise.resolve();
            });

            const results = await Promise.allSettled(promises);
            const processed = results.filter(r => r.status === 'fulfilled').length;

            if (processed > 0) {
                this.ui.showStatus(`${processed} conversas ${body.is_archived ? 'arquivadas' : 'excluídas'} com sucesso!`, 'success');
                setTimeout(() => window.location.reload(), 1500);
            } else {
                this.ui.showStatus(`Erro ao processar conversas.`, 'error');
            }
        }
    }

    class ChatManagerApp {
        constructor() {
            this.uiManager = new UIManager();
            this.chatManager = new ChatManager(this.uiManager);
            window.chatManager = this.chatManager;
            this.debounceTimeout = null;
        }

        run() {
            this.uiManager.setupControlPanel();
            const chatItems = document.querySelectorAll(SELECTOR.chatItems);
            logDebug("Execução principal (run) - Buscando todos os itens de chat", SELECTOR.chatItems, chatItems);
            chatItems.forEach(item => {
                this.uiManager.createCheckbox(item);
            });
        }

        setupObserver() {
            const observer = new MutationObserver(() => {
                if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(() => {
                    console.log("[ChatManager Debug] Observador detectou mudança no DOM, executando novamente...");
                    this.run();
                }, 500);
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    function waitForElement(selector, callback) {
        console.log(`[ChatManager Debug] Aguardando pelo ponto de entrada: '${selector}'...`);
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                logDebug("Ponto de entrada encontrado!", selector, element);
                clearInterval(interval);
                callback();
            }
        }, 500);
    }

    waitForElement(SELECTOR.entryPoint, () => {
        const app = new ChatManagerApp();
        app.run();
        app.setupObserver();
    });
})();
