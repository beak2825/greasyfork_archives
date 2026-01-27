// ==UserScript==
// @name         Botão Copiar e Colar complemento no INFODIP (Refatorado) 22/01/2026
// @namespace    https://greasyfork.org/pt-BR/scripts/542953
// @version      2.7.0
// @description  Botão funcional que copia o número da comunicação e cola no complemento do INFODIP, evitando duplicação.
// @author       Ramon Machado
// @match        https://infodip.tse.jus.br/infodip/*
// @match        https://infodiphmg.tse.jus.br/infodip/*
// @exclude      https://infodip.tse.jus.br/infodip/comunicacao/consulta/
// @exclude      https://infodip.tse.jus.br/infodip/comunicacao/consulta/index.jsp
// @grant        none
// @icon         https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/128px/1f4cb.png
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/542953/Bot%C3%A3o%20Copiar%20e%20Colar%20complemento%20no%20INFODIP%20%28Refatorado%29%2022012026.user.js
// @updateURL https://update.greasyfork.org/scripts/542953/Bot%C3%A3o%20Copiar%20e%20Colar%20complemento%20no%20INFODIP%20%28Refatorado%29%2022012026.meta.js
// ==/UserScript==

// Atualizado em 22/01/2026, com refatoração do GEMINI

(function() {
    'use strict';

    const SELECTORS = {
        comunicacao: 'span.fontBlackBold',
        complemento: '#complemento',
        botao: '#btnInfodipRemoverDuplicacao'
    };

    const CONFIG = {
        maxLength: 70,
        retryDelay: 500,
        maxRetries: 5,
        feedbackDelay: 2000,
        errorDelay: 3000,
        enableLogs: true,
        upperCase: true,
        excludedPages: [
            '/infodip/comunicacao/consulta/detalhes.jsp',
            '/infodip/comunicacao/consulta/comunicacao.jsp'
        ]
    };

    const MESSAGES = {
        success: '✔️ Número da comunicação colado!',
        duplicate: '⚠️ Número da comunicação já colado.',
        tooLong: '⚠️ Excede 70 caracteres! Não colado.',
        clipboardError: '⚠️ Erro ao copiar'
    };

    const Logger = {
        prefix: '[INFODIP Script]',
        log(level, msg, data = '') {
            if (!CONFIG.enableLogs) return;
            const logFn = console[level.toLowerCase()] || console.log;
            logFn(`${this.prefix} [${new Date().toLocaleTimeString()}] [${level}] ${msg}`, data);
        },
        info: (m, d) => Logger.log('INFO', m, d),
        warn: (m, d) => Logger.log('WARN', m, d),
        error: (m, d) => Logger.log('ERROR', m, d),
        debug: (m, d) => Logger.log('DEBUG', m, d)
    };

    const Utils = {
        normalize: (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase(),

        stripPunctuation: (text) => text.replace(/[.\-]/g, ''),

        removeDuplication(text) {
            const parts = text.split('/');
            if (parts.length < 4) return text;

            const lastTwo = parts.slice(-2).join('/');
            const base = parts.slice(0, -2).join('/');

            return this.normalize(base).endsWith(this.normalize(lastTwo)) ? base : text;
        },

        isPageExcluded: () => CONFIG.excludedPages.some(page => window.location.pathname.includes(page))
    };

    const FeedbackManager = {
        show(element, message, isError = false) {
            Logger.info(`Feedback: ${message}`);
            element.textContent = message;
            element.style.color = isError ? '#d32f2f' : '#2e7d32';

            setTimeout(() => {
                element.textContent = '';
            }, isError ? CONFIG.errorDelay : CONFIG.feedbackDelay);
        },

        highlight(input) {
            const original = input.style.backgroundColor;
            input.style.backgroundColor = '#b2f2bb';
            setTimeout(() => input.style.backgroundColor = original, CONFIG.feedbackDelay);
        }
    };

    const DOMManager = {
        createButton() {
            const btn = document.createElement('button');
            btn.id = SELECTORS.botao.replace('#', '');
            btn.textContent = 'Copiar e Colar';
            Object.assign(btn.style, {
                marginLeft: '10px', padding: '4px 8px', fontSize: '12px',
                cursor: 'pointer', fontWeight: 'bold'
            });
            return btn;
        },

        createFeedback() {
            const span = document.createElement('span');
            Object.assign(span.style, {
                marginLeft: '8px', fontWeight: 'bold', fontSize: '12px', userSelect: 'none'
            });
            return span;
        }
    };

    class InfodipProcessor {
        constructor(comElement, compInput, feedback) {
            this.comElement = comElement;
            this.compInput = compInput;
            this.feedback = feedback;
        }

        async process() {
            Logger.info('Iniciando processamento...');

            const rawValue = this.compInput.value.trim();
            const currentValue = Utils.removeDuplication(rawValue);
            const commNumber = this.comElement.textContent.trim();

            if (currentValue.includes(commNumber)) {
                return FeedbackManager.show(this.feedback, MESSAGES.duplicate, true);
            }

            const textToAppend = `INFODIP ${commNumber}`;
            let finalResult = `${currentValue} ${textToAppend}`.trim();

            if (finalResult.length > CONFIG.maxLength) {
                Logger.warn('Excedeu limite, tentando simplificar...');
                finalResult = `${Utils.stripPunctuation(currentValue)} ${textToAppend}`.trim();
            }

            if (finalResult.length > CONFIG.maxLength) {
                return FeedbackManager.show(this.feedback, MESSAGES.tooLong, true);
            }

            await this.updateDOM(CONFIG.upperCase ? finalResult.toUpperCase() : finalResult);
        }

        async updateDOM(text) {
            try {
                await navigator.clipboard.writeText(text);
                this.compInput.value = text;
                FeedbackManager.highlight(this.compInput);
                FeedbackManager.show(this.feedback, MESSAGES.success);
                Logger.info('Sucesso!');
            } catch (err) {
                Logger.error('Erro no Clipboard', err);
                FeedbackManager.show(this.feedback, MESSAGES.clipboardError, true);
            }
        }
    }

    let retries = 0;
    function init() {
        if (Utils.isPageExcluded()) return Logger.info('Página excluída.');

        const comSpan = document.querySelector(SELECTORS.comunicacao);
        const compInput = document.querySelector(SELECTORS.complemento);

        if (!comSpan || !compInput) {
            if (retries++ < CONFIG.maxRetries) {
                setTimeout(init, CONFIG.retryDelay);
            } else {
                Logger.warn('Elementos não encontrados após tentativas.');
            }
            return;
        }

        if (document.querySelector(SELECTORS.botao)) return;

        const btn = DOMManager.createButton();
        const feed = DOMManager.createFeedback();
        const processor = new InfodipProcessor(comSpan, compInput, feed);

        btn.onclick = () => processor.process();

        comSpan.parentNode.insertBefore(btn, comSpan.nextSibling);
        btn.parentNode.insertBefore(feed, btn.nextSibling);

        Logger.info('Script pronto.');
    }

    init();
})();