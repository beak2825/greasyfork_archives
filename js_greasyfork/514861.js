// ==UserScript==
// @name         Chatbot Arena Token Maximizer
// @namespace    https://github.com/Brunexgmaer09/SSHPLUS/blob/main/imarena%20modifier
// @version      2.6.0
// @description  Enhanced token and temperature control for LMSYS Chat with a beautiful interface
// @author       BrunexCoder
// @match        *://lmarena.ai/*
// @match        *://arena.lmsys.org/*
// @match        *://chat.lmsys.org/*
// @match        https://lmarena.ai/
// @icon         https://chat.lmsys.org/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514861/Chatbot%20Arena%20Token%20Maximizer.user.js
// @updateURL https://update.greasyfork.org/scripts/514861/Chatbot%20Arena%20Token%20Maximizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configurações globais
    const CONFIG = {
        initialTokens: 2048, // Valor inicial do site
        defaultTokens: 4096, // Alterado para iniciar com 4K
        defaultTemp: 0.7,
        panelId: 'token-maximizer-controls',
        tokenOptions: [
            { value: 4096, label: '4K' },
            { value: 8192, label: '8K' },
            { value: 12000, label: '12K' },
            { value: 56000, label: '56K' },
            { value: 70000, label: '70K' },
            { value: 130000, label: '130K' },
            { value: 180000, label: '180K' },
            { value: 200000, label: '200K' }
        ],
        // Sem restrições de modelos - todos podem usar qualquer token
        firstRunKey: 'tokenMaximizer_firstRun_v5',
        styles: {
            colors: {
                primary: '#3b82f6',
                primaryDark: '#2563eb',
                primaryLight: '#60a5fa',
                background: 'var(--background-fill-primary)',
                secondaryBg: 'var(--background-fill-secondary)',
                border: 'var(--border-color-primary)',
                text: 'var(--body-text-color)',
                accent: 'var(--link-text-color)',
                slider: {
                    track: '#e2e8f0',
                    thumb: '#3b82f6',
                    progress: '#3b82f6'
                },
                tutorial: {
                    arrow: '#3b82f6',
                    background: '#3b82f6',
                    text: '#ffffff'
                }
            },
            fontSize: {
                small: '12px',
                medium: '13px',
                large: '14px'
            },
            tutorial: {
                arrow: '#3b82f6',
                background: '#3b82f6',
                text: '#ffffff'
            }
        }
    };

    // Classe principal do Token Maximizer
    class TokenMaximizer {
        constructor() {
            this.initialized = false;
            this.debugMode = /Android/.test(navigator.userAgent);

            // Inicializa com o valor padrão do site, mas será ajustado
            this.currentTokenValue = CONFIG.initialTokens;

            // Armazena o modelo selecionado atualmente
            this.currentModel = null;
        }

        log(message, type = 'info') {
            if (this.debugMode) {
                const logElement = document.createElement('div');
                logElement.style.cssText = `
                    position: fixed;
                    top: ${document.querySelectorAll('.debug-log').length * 30}px;
                    left: 10px;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    z-index: 9999;
                    font-size: 12px;
                `;
                logElement.className = 'debug-log';
                logElement.textContent = `[${type}] ${message}`;
                document.body.appendChild(logElement);

                // Remove o log após 5 segundos
                setTimeout(() => logElement.remove(), 5000);

                console.log(`[TokenMaximizer] ${message}`);
            }
        }

        // Inicializa o Token Maximizer
        init() {
            if (this.initialized) return;
            this.initialized = true;

            this.log('Iniciando Token Maximizer...');
            this.log(`User Agent: ${navigator.userAgent}`);

            this.setupInitialLoad();
            this.setupMutationObserver();
            this.showCredits();
            this.setupModelObserver();

            setTimeout(() => {
                this.syncInitialValues();
                this.showTutorialArrow();
            }, 2000);
        }

        // Sincroniza os valores iniciais com os do site
        syncInitialValues() {
            // Verifica o valor atual de tokens no site
            const tokenInputs = document.querySelectorAll('input[aria-label*="Max output tokens"], input[data-testid*="token"], input[placeholder*="token"]');
            if (tokenInputs.length > 0) {
                // Pega o valor do primeiro input de tokens encontrado
                const actualValue = parseInt(tokenInputs[0].value);
                if (!isNaN(actualValue) && actualValue > 0) {
                    this.log(`Valor inicial de tokens no site: ${actualValue}`);
                    this.currentTokenValue = actualValue;

                    // Se o valor for menor que o padrão que queremos, ajusta para o nosso padrão
                    if (actualValue < CONFIG.defaultTokens) {
                        this.setTokenValue(CONFIG.defaultTokens);
                    }
                }
            }

            // Detecta o modelo atual
            this.detectCurrentModel();
        }

        // Detecta o modelo atual e ajusta os tokens
        detectCurrentModel() {
            // Procura pelos dropdowns de seleção de modelo
            const modelDropdowns = Array.from(document.querySelectorAll('input[role="listbox"]'));

            if (modelDropdowns.length > 0) {
                // Pega o valor do primeiro dropdown
                const modelValue = modelDropdowns[0].value;
                if (modelValue) {
                    this.log(`Modelo detectado: ${modelValue}`);
                    this.currentModel = modelValue;
                }
            }
        }

        // Configura observer para mudanças de modelo
        setupModelObserver() {
            // Observer para detectar mudanças nos dropdowns de modelo
            const modelObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                        const target = mutation.target;
                        if (target.getAttribute('role') === 'listbox') {
                            const modelValue = target.value;
                            if (modelValue && modelValue !== this.currentModel) {
                                this.log(`Modelo alterado para: ${modelValue}`);
                                this.currentModel = modelValue;
                            }
                        }
                    }
                }
            });

            // Configuração para observer ficar atento à mudanças nos dropdowns
            setTimeout(() => {
                const modelDropdowns = document.querySelectorAll('input[role="listbox"]');
                modelDropdowns.forEach(dropdown => {
                    modelObserver.observe(dropdown, {
                        attributes: true,
                        attributeFilter: ['value']
                    });
                });
            }, 3000);
        }

        // Atualiza o estado visual dos botões
        updateActivateButtonState() {
            const buttonsContainer = document.querySelector(`#${CONFIG.panelId} div[style*="display: flex"][style*="gap: 8px"]`);
            if (buttonsContainer) {
                const buttons = buttonsContainer.querySelectorAll('button');
                buttons.forEach(btn => {
                    const tokenValue = parseInt(btn.dataset.value);
                    const isActive = tokenValue === this.currentTokenValue;

                    btn.style.background = isActive ? CONFIG.styles.colors.primary : 'transparent';
                    btn.style.color = isActive ? '#ffffff' : CONFIG.styles.colors.text;
                    btn.style.borderColor = isActive ? CONFIG.styles.colors.primary : CONFIG.styles.colors.border;
                });

                // Atualiza o valor exibido
                const valueLabel = buttonsContainer.closest('div').querySelector('span:last-of-type');
                if (valueLabel) {
                    valueLabel.textContent = this.currentTokenValue.toLocaleString();
                }
            }
        }

        // Configura o carregamento inicial
        setupInitialLoad() {
            const attempts = [0, 500, 1000, 2000];
            attempts.forEach(delay => setTimeout(() => {
                // Procura especificamente pelo container do Direct Chat
                const directChatButton = document.querySelector('button[aria-controls][class*="svelte"][role="tab"]:not([aria-disabled="true"]):not([aria-selected="false"])');
                if (directChatButton && directChatButton.textContent.includes('Direct Chat')) {
                    const directChatId = directChatButton.getAttribute('aria-controls');
                    const chatContainer = document.getElementById(directChatId);

                    if (chatContainer) {
                        this.insertControls(chatContainer);
                    }
                }
            }, delay));
        }

        // Configura o observer para mudanças na página
        setupMutationObserver() {
            const observer = new MutationObserver(() => {
                // Procura especificamente pelo container do Direct Chat
                const directChatButton = document.querySelector('button[aria-controls][class*="svelte"][role="tab"]:not([aria-disabled="true"]):not([aria-selected="false"])');
                if (directChatButton && directChatButton.textContent.includes('Direct Chat')) {
                    const directChatId = directChatButton.getAttribute('aria-controls');
                    const chatContainer = document.getElementById(directChatId);

                    if (chatContainer && !document.getElementById(CONFIG.panelId)) {
                        setTimeout(() => this.insertControls(chatContainer), 100);
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['aria-selected', 'style', 'class']
            });
        }

        insertControls(targetElement) {
            const existingControls = document.getElementById(CONFIG.panelId);
            if (existingControls) existingControls.remove();

            const controlsContainer = document.createElement('div');
            controlsContainer.id = CONFIG.panelId;
            controlsContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px;
                margin: 8px 0;
                border-radius: 12px;
                background: ${CONFIG.styles.colors.background};
                border: 1px solid ${CONFIG.styles.colors.border};
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            `;

            // Título com ícone e estilo do site
            const titleContainer = document.createElement('div');
            titleContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                padding-right: 16px;
                border-right: 1px solid ${CONFIG.styles.colors.border};
            `;

            const titleIcon = document.createElement('span');
            titleIcon.textContent = '🔧';
            titleIcon.style.fontSize = '16px';

            const titleText = document.createElement('span');
            titleText.textContent = 'Token Controls';
            titleText.style.cssText = `
                font-size: ${CONFIG.styles.fontSize.medium};
                font-weight: 600;
                color: ${CONFIG.styles.colors.text};
            `;

            titleContainer.append(titleIcon, titleText);

            // Container para os controles
            const controlsWrapper = document.createElement('div');
            controlsWrapper.style.cssText = `
                display: flex;
                align-items: center;
                gap: 16px;
                flex-grow: 1;
            `;

            // Criar controles de tokens com botões de seleção rápida
            const tokenControl = this.createTokenControl();

            // Criar controle de temperatura com novo estilo
            const tempControl = this.createCompactControl(
                'Temperature',
                'range',
                {min: 0, max: 1, value: CONFIG.defaultTemp, step: 0.1},
                this.modifyTemperature.bind(this)
            );

            controlsWrapper.append(tokenControl, tempControl);
            controlsContainer.append(titleContainer, controlsWrapper);
            targetElement.insertBefore(controlsContainer, targetElement.firstChild);

            // Detecta o modelo atual
            setTimeout(() => this.detectCurrentModel(), 500);
        }

        createTokenControl() {
            const container = document.createElement('div');
            container.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 8px;
                padding: 8px 12px;
                background: ${CONFIG.styles.colors.secondaryBg};
                border-radius: 8px;
                flex: 1;
            `;

            const labelRow = document.createElement('div');
            labelRow.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
            `;

            const labelElement = document.createElement('label');
            labelElement.textContent = 'Max Tokens';
            labelElement.style.cssText = `
                font-size: ${CONFIG.styles.fontSize.small};
                color: ${CONFIG.styles.colors.text};
                font-weight: 500;
            `;

            const valueLabel = document.createElement('span');
            valueLabel.style.cssText = `
                font-size: ${CONFIG.styles.fontSize.small};
                color: ${CONFIG.styles.colors.text};
                font-family: var(--font-mono);
                transition: all 0.3s ease;
                font-weight: 500;
            `;
            valueLabel.textContent = this.currentTokenValue.toLocaleString();

            labelRow.append(labelElement, valueLabel);

            // Cria os botões de seleção rápida
            const buttonsRow = document.createElement('div');
            buttonsRow.style.cssText = `
                display: flex;
                gap: 8px;
                margin-top: 4px;
            `;

            CONFIG.tokenOptions.forEach(option => {
                const button = document.createElement('button');
                const isActive = this.currentTokenValue === option.value;

                button.style.cssText = `
                    flex: 1;
                    padding: 4px 0;
                    border-radius: 6px;
                    font-size: ${CONFIG.styles.fontSize.small};
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: ${isActive ? CONFIG.styles.colors.primary : 'transparent'};
                    color: ${isActive ? '#ffffff' : CONFIG.styles.colors.text};
                    border: 1px solid ${isActive ? CONFIG.styles.colors.primary : CONFIG.styles.colors.border};
                    outline: none;
                `;

                button.textContent = option.label;

                button.addEventListener('mouseover', () => {
                    if (!isActive) {
                        button.style.background = `${CONFIG.styles.colors.primaryLight}20`;
                    }
                });

                button.addEventListener('mouseout', () => {
                    if (!isActive) {
                        button.style.background = 'transparent';
                    }
                });

                button.addEventListener('click', () => {
                    this.setTokenValue(option.value);

                    // Atualiza a aparência de todos os botões
                    buttonsRow.querySelectorAll('button').forEach(btn => {
                        const isNowActive = parseInt(btn.dataset.value) === this.currentTokenValue;
                        btn.style.background = isNowActive ? CONFIG.styles.colors.primary : 'transparent';
                        btn.style.color = isNowActive ? '#ffffff' : CONFIG.styles.colors.text;
                        btn.style.borderColor = isNowActive ? CONFIG.styles.colors.primary : CONFIG.styles.colors.border;
                    });

                    // Atualiza o valor exibido
                    valueLabel.textContent = this.currentTokenValue.toLocaleString();

                    // Adiciona uma animação ao valor
                    valueLabel.style.transform = 'scale(1.1)';
                    valueLabel.style.color = CONFIG.styles.colors.primary;
                    setTimeout(() => {
                        valueLabel.style.transform = 'scale(1)';
                        valueLabel.style.color = CONFIG.styles.colors.text;
                    }, 200);
                });

                button.dataset.value = option.value;
                buttonsRow.appendChild(button);
            });

            container.append(labelRow, buttonsRow);
            return container;
        }

        setTokenValue(value) {
            this.currentTokenValue = value;
            this.modifyInputs(value);
        }

        createCompactControl(label, type, options, onChange) {
            const container = document.createElement('div');
            container.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 12px;
                background: ${CONFIG.styles.colors.secondaryBg};
                border-radius: 8px;
                flex: 1;
            `;

            const labelElement = document.createElement('label');
            labelElement.textContent = label;
            labelElement.style.cssText = `
                font-size: ${CONFIG.styles.fontSize.small};
                color: ${CONFIG.styles.colors.text};
                font-weight: 500;
                min-width: 80px;
            `;

            const inputWrapper = document.createElement('div');
            inputWrapper.style.cssText = `
                position: relative;
                flex: 1;
                display: flex;
                align-items: center;
                gap: 8px;
            `;

            const input = document.createElement('input');
            input.type = type;
            Object.assign(input, options);
            input.style.cssText = `
                width: 100%;
                height: 4px;
                -webkit-appearance: none;
                background: ${CONFIG.styles.colors.border};
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;

                &::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: ${CONFIG.styles.colors.primary};
                    border: 2px solid white;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
                }

                &::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
                }

                &::-webkit-slider-thumb:active {
                    transform: scale(0.95);
                    box-shadow: 0 1px 2px rgba(59, 130, 246, 0.4);
                }

                &::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 4px;
                    background: linear-gradient(to right, ${CONFIG.styles.colors.primary} var(--value-percent, 50%), rgba(59, 130, 246, 0.1) var(--value-percent, 50%));
                    border-radius: 4px;
                    transition: background 0.3s ease;
                }

                &:focus {
                    outline: none;
                }

                &:hover::-webkit-slider-runnable-track {
                    background: linear-gradient(to right, ${CONFIG.styles.colors.primary} var(--value-percent, 50%), rgba(59, 130, 246, 0.2) var(--value-percent, 50%));
                }
            `;

            // Adiciona efeito de brilho ao passar o mouse
            input.addEventListener('mouseover', () => {
                input.style.filter = 'brightness(1.1)';
            });

            input.addEventListener('mouseout', () => {
                input.style.filter = 'brightness(1)';
            });

            input.addEventListener('input', (e) => {
                const min = parseFloat(e.target.min);
                const max = parseFloat(e.target.max);
                const val = parseFloat(e.target.value);
                const percent = ((val - min) * 100) / (max - min);
                e.target.style.setProperty('--value-percent', `${percent}%`);

                // Adiciona efeito de pulso ao mover o slider
                e.target.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    e.target.style.transform = 'scale(1)';
                }, 100);
            });

            const initialPercent = ((options.value - options.min) * 100) / (options.max - options.min);
            input.style.setProperty('--value-percent', `${initialPercent}%`);

            const valueLabel = document.createElement('span');
            valueLabel.style.cssText = `
                font-size: ${CONFIG.styles.fontSize.small};
                color: ${CONFIG.styles.colors.text};
                font-family: var(--font-mono);
                min-width: 45px;
                text-align: right;
                transition: all 0.3s ease;
            `;
            valueLabel.textContent = options.value;

            input.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                valueLabel.textContent = type === 'range' && label === 'Max Tokens'
                    ? Math.round(value).toLocaleString()
                    : value.toFixed(1);

                // Anima o valor ao mudar
                valueLabel.style.transform = 'scale(1.1)';
                valueLabel.style.color = CONFIG.styles.colors.primary;
                setTimeout(() => {
                    valueLabel.style.transform = 'scale(1)';
                    valueLabel.style.color = CONFIG.styles.colors.text;
                }, 200);

                onChange(value);
            });

            inputWrapper.append(input, valueLabel);
            container.append(labelElement, inputWrapper);
            return container;
        }

        // Modifica os inputs de token
        modifyInputs(targetValue) {
            const inputs = document.querySelectorAll('input[aria-label*="Max output tokens"], input[aria-label*="max tokens"], input[data-testid*="token"], input[placeholder*="token"]');
            inputs.forEach(input => {
                if (input.max < targetValue) input.max = targetValue;
                if (parseInt(input.value) !== targetValue) {
                    input.value = targetValue;
                    if (input.type === 'range') {
                        input.style.backgroundSize = '100% 100%';
                    }
                    // Dispara eventos nativos e eventos personalizados
                    ['input', 'change', 'blur'].forEach(eventType => {
                        input.dispatchEvent(new Event(eventType, { bubbles: true }));
                    });
                    // Tenta atualizar o React state se existir
                    if (input._valueTracker) {
                        input._valueTracker.setValue('');
                    }
                }
            });
        }

        // Modifica a temperatura
        modifyTemperature(value) {
            const inputs = document.querySelectorAll('input[aria-label*="Temperature"], input[aria-label*="temperatura"], input[data-testid*="temp"], input[placeholder*="temp"]');
            inputs.forEach(input => {
                input.value = value;
                if (input.type === 'range') {
                    input.style.backgroundSize = `${value * 100}% 100%`;
                }
                // Dispara eventos nativos e eventos personalizados
                ['input', 'change', 'blur'].forEach(eventType => {
                    input.dispatchEvent(new Event(eventType, { bubbles: true }));
                });
                // Tenta atualizar o React state se existir
                if (input._valueTracker) {
                    input._valueTracker.setValue('');
                }
            });
        }

        // Encontra e clica em botões
        findAndClickButton(action) {
            const buttonTexts = {
                regenerate: ['regenerate', 'retry', 'reset'],
                clear: ['clear', 'new chat']
            };

            const texts = buttonTexts[action] || [];
            const buttons = Array.from(document.querySelectorAll('button'));

            const button = buttons.find(btn => {
                const btnText = btn.textContent.toLowerCase();
                return texts.some(text => btnText.includes(text));
            });

            if (button) {
                button.click();
                return true;
            }
            return false;
        }

        showCredits() {
            const credits = document.createElement('div');
            credits.textContent = 'Token Maximizer desenvolvido por BrunexCoder';

            // Adiciona um container para o efeito de borda
            const creditsContainer = document.createElement('div');
            creditsContainer.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 2px; /* Espaço para a borda RGB */
                border-radius: 10px;
                background: linear-gradient(90deg, #ff0000, #00ff00, #0000ff, #ff0000);
                background-size: 400% 400%;
                animation: gradientBorder 3s ease infinite;
                z-index: 9999;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            `;

            credits.style.cssText = `
                background: ${CONFIG.styles.colors.background};
                color: ${CONFIG.styles.colors.text};
                padding: 10px 15px;
                border-radius: 8px;
                font-size: ${CONFIG.styles.fontSize.small};
                font-weight: bold;
                text-align: center;
            `;

            // Adiciona a animação do gradiente
            const style = document.createElement('style');
            style.textContent = `
                @keyframes gradientBorder {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `;
            document.head.appendChild(style);

            creditsContainer.appendChild(credits);
            document.body.appendChild(creditsContainer);

            setTimeout(() => {
                creditsContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                creditsContainer.style.opacity = '0';
                creditsContainer.style.transform = 'translateY(20px)';
                setTimeout(() => creditsContainer.remove(), 500);
            }, 5000);
        }

        showTutorialArrow() {
            // Verifica se é a primeira execução desta versão
            if (localStorage.getItem(CONFIG.firstRunKey)) return;

            // Observa cliques especificamente no botão Direct Chat
            const directChatButton = document.querySelector('button[aria-controls][class*="svelte"][role="tab"]:not([aria-disabled="true"]):not([aria-selected="false"])');
            if (directChatButton && directChatButton.textContent.includes('Direct Chat')) {
                directChatButton.addEventListener('click', () => {
                    setTimeout(() => {
                        // Encontra o texto "Token Controls" ou o container
                        const tokenControlsText = Array.from(document.querySelectorAll('span')).find(
                            span => span.textContent === 'Token Controls'
                        );

                        const controlsContainer = document.getElementById(CONFIG.panelId);

                        if (!tokenControlsText && !controlsContainer) return;

                        const targetElement = tokenControlsText || controlsContainer;
                        const textRect = targetElement.getBoundingClientRect();
                        const messageWidth = 220;

                        const arrowContainer = document.createElement('div');
                        arrowContainer.style.cssText = `
                            position: fixed;
                            top: ${textRect.top - 18}px;
                            left: ${textRect.left - messageWidth + 60}px;
                            transform: translateY(-50%);
                            z-index: 9999;
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            animation: bounceArrow 2s infinite;
                            pointer-events: none;
                        `;

                        // Atualiza o estilo da mensagem
                        const message = document.createElement('div');
                        message.style.cssText = `
                            background: ${CONFIG.styles.colors.tutorial.background};
                            color: ${CONFIG.styles.colors.tutorial.text};
                            padding: 12px 16px;
                            border-radius: 8px;
                            font-size: ${CONFIG.styles.fontSize.medium};
                            font-weight: 500;
                            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                            max-width: ${messageWidth}px;
                            line-height: 1.4;
                            text-align: right;
                            letter-spacing: 0.3px;
                            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        `;
                        message.textContent = '🎉 O Token Maximizer agora permite usar 56K tokens em qualquer modelo!';

                        // Atualiza a seta
                        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        arrow.setAttribute('width', '40');
                        arrow.setAttribute('height', '40');
                        arrow.setAttribute('viewBox', '0 0 24 24');
                        arrow.style.cssText = `
                            fill: none;
                            stroke: #ffffff;
                            stroke-width: 2.5;
                            stroke-linecap: round;
                            stroke-linejoin: round;
                            filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
                        `;

                        const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        arrowPath.setAttribute('d', 'M5 12h14m-7-7l7 7-7 7');
                        arrow.appendChild(arrowPath);

                        // Atualiza a animação
                        const style = document.createElement('style');
                        style.textContent = `
                            @keyframes bounceArrow {
                                0%, 100% { transform: translateX(0); }
                                50% { transform: translateX(10px); }
                            }


                            @keyframes fadeOut {
                                from { opacity: 1; transform: translateY(0); }
                                to { opacity: 0; transform: translateY(-10px); }
                            }
                        `;
                        document.head.appendChild(style);

                        arrowContainer.append(message, arrow);
                        document.body.appendChild(arrowContainer);

                        // Remove o tutorial após 10 segundos
                        setTimeout(() => {
                            arrowContainer.style.animation = 'fadeOut 0.5s ease forwards';
                            setTimeout(() => arrowContainer.remove(), 500);
                        }, 10000);

                        // Marca como já exibido
                        localStorage.setItem(CONFIG.firstRunKey, 'true');
                    }, 500); // Delay para garantir que os elementos estejam carregados
                }, { once: true }); // Garante que o evento só seja disparado uma vez
            }
        }

        resetTutorial() {
            localStorage.removeItem(CONFIG.firstRunKey);
            this.log('Tutorial reset realizado com sucesso');
        }
    }

    // Inicializa o Token Maximizer quando a página carregar
    if (document.readyState === 'loading') {
        window.addEventListener('load', () => new TokenMaximizer().init());
    } else {
        new TokenMaximizer().init();
    }
})();