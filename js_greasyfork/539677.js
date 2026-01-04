// ==UserScript==
// @name         Plurall Auto Responder
// @namespace    http://tampermonkey.net/
// @version      6.6
// @description  Responde questões do Plurall. Inicia com 'P', para com 'O'
// @author       Hitler
// @match        https://atividades.plurall.net/*
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/539677/Plurall%20Auto%20Responder.user.js
// @updateURL https://update.greasyfork.org/scripts/539677/Plurall%20Auto%20Responder.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // ===== CONFIGURAÇÕES =====
    const CONFIG = {
        delays: {
            short: 20,
            medium: 1000,
            long: 2000,
            typing: 20,
            beforeAnswering: 1500, // Delay antes de marcar questão
            afterNavigation: 2000,   // Delay após navegação
            afterFirstAnswer: 1500,  // Delay depois da primeira resposta
            betweenAttempts: 1500    // Delay entre tentativas de alternativas
        },
        timeouts: {
            nextQuestion: 10000,
            submitButton: 5000,
            checkCorrectAnswer: 3000  // Tempo para verificar se acertou
        },
        taskCheckInterval: 5000,
        maxAttempts: 3,
        maxNextButtonFailures: 1,
        defaultResponse: 'me ne frego me ne frego me ne frego'
    };

    // ===== ESTADO GLOBAL =====
    const state = {
        running: false,
        stopped: false,
        readCount: 0,
        lastTaskCheck: 0,
        nextButtonFailures: 0,
        currentUrl: window.location.href,
        currentAttempt: 0,
        usedAlternatives: [] // Track de alternativas já usadas
    };

    // ===== UTILITÁRIOS =====
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const notify = (title, text, timeout = 3000) => {
        GM_notification({ title, text, timeout });
        console.log(`[Auto Responder] ${title}: ${text}`);
    };

    const safeClick = (element, eventName = 'Elemento') => {
        if (!element || element.disabled) {
            notify('Erro', `${eventName} não disponível para clique.`);
            return false;
        }

        return simulateRealMouseClick(element, eventName);
    };

    // Simula um clique real do mouse com todos os eventos
    const simulateRealMouseClick = (element, eventName = 'Elemento') => {
        try {
            // Garante que o elemento está visível e focável
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Coordenadas do elemento
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            // Configurações base do evento
            const eventOptions = {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: x,
                clientY: y,
                screenX: x + window.screenX,
                screenY: y + window.screenY,
                button: 0, // Botão esquerdo
                buttons: 1, // Botão esquerdo pressionado
                detail: 1, // Número de cliques
                which: 1,
                pointerId: 1,
                pointerType: 'mouse',
                isPrimary: true
            };

            // Sequência completa de eventos de mouse
            const events = [
                new PointerEvent('pointerdown', eventOptions),
                new MouseEvent('mousedown', eventOptions),
                new PointerEvent('pointerup', eventOptions),
                new MouseEvent('mouseup', eventOptions),
                new MouseEvent('click', eventOptions),
                new PointerEvent('pointerclick', eventOptions)
            ];

            // Dispara todos os eventos
            events.forEach(event => {
                try {
                    element.dispatchEvent(event);
                } catch (e) {
                    console.log(`[Auto Responder] Evento ${event.type} não suportado`);
                }
            });

            // Foca o elemento se possível
            if (element.focus && typeof element.focus === 'function') {
                element.focus();
            }

            // Trigger change e input para elementos de formulário
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
            }

            console.log(`[Auto Responder] Clique real simulado em ${eventName}`);
            return true;

        } catch (error) {
            console.error(`[Auto Responder] Erro ao simular clique em ${eventName}:`, error);

            // Fallback para clique simples
            try {
                element.click();
                return true;
            } catch (fallbackError) {
                console.error(`[Auto Responder] Fallback também falhou:`, fallbackError);
                return false;
            }
        }
    };

    // Função para verificar se a URL mudou
    const hasUrlChanged = () => {
        const currentUrl = window.location.href;
        const changed = currentUrl !== state.currentUrl;
        if (changed) {
            console.log(`[Auto Responder] URL mudou de ${state.currentUrl} para ${currentUrl}`);
            state.currentUrl = currentUrl;
        }
        return changed;
    };

    // ===== SELETORES =====
    const selectors = {
        options: 'li.option span.Option-module_option__ZNKeW',
        nextButton: 'div.Paginator-module_next__pSZDQ',
        textArea: 'textarea[data-test-id="response-textarea"]',
        submitButton: 'button',
        confirmButton: 'button.css-sakhm0',
        backButton: 'div.backButton button',
        readingButton: 'div.MediaTask-module_subtask-title__ePGb3',
        taskButton: 'div[data-test-id="exercise-card-wrapper"]',
        taskLinks: 'a[href*="/tarefa/"]:not([href*="/material-de-apoio"])',
        // Botão de resolução em vídeo que aparece quando acerta
        videoResolutionButton: 'div.SupportCard-module_card-wrapper__vCboD div[data-test-id="video_external_res"]',
        // Elementos que devem ser EVITADOS
        chapterButton: 'div.SupportCard-module_card-wrapper__vCboD a[href*="/material-de-apoio"]',
        supportCardWrapper: 'div.SupportCard-module_card-wrapper__vCboD',
        completionMessages: [
            'div[class*="completion"]',
            'div[class*="finished"]',
            'p[class*="concluído"]',
            'p[class*="finalizado"]'
        ].join(', '),
        // Indicadores de resposta correta
        correctIndicators: [
            'div[class*="correct"]',
            'div[class*="right"]',
            'span[class*="correct"]',
            '.correct',
            '[data-correct="true"]'
        ].join(', ')
    };

    // ===== FUNÇÕES DE DETECÇÃO =====
    const getOptions = () => document.querySelectorAll(selectors.options);

    const getTextArea = () => document.querySelector(selectors.textArea);

    const isCompleted = () => document.querySelector(selectors.completionMessages);

    const hasChapterButton = () => document.querySelector(selectors.chapterButton);

    const getSubmitButton = () => {
        const buttons = document.querySelectorAll(selectors.submitButton);
        return Array.from(buttons).find(btn =>
            btn.innerText.trim().toLowerCase() === 'enviar resposta' && !btn.disabled
        );
    };

    // Verifica se o botão de resolução em vídeo está disponível
    const hasVideoResolutionButton = () => {
        const button = document.querySelector(selectors.videoResolutionButton);
        if (button) {
            console.log('[Auto Responder] Botão de resolução em vídeo detectado - resposta correta!');
            return true;
        }
        return false;
    };

    // Verifica se a resposta está correta
    const isAnswerCorrect = () => {
        // Verifica botão de resolução em vídeo
        if (hasVideoResolutionButton()) {
            return true;
        }

        // Verifica outros indicadores de resposta correta
        const correctIndicator = document.querySelector(selectors.correctIndicators);
        if (correctIndicator) {
            console.log('[Auto Responder] Indicador de resposta correta encontrado');
            return true;
        }

        // Verifica se há feedback visual de acerto
        const correctFeedback = document.querySelector('[class*="success"], [class*="correct"], .text-green');
        if (correctFeedback && correctFeedback.textContent.toLowerCase().includes('correct')) {
            console.log('[Auto Responder] Feedback de acerto encontrado');
            return true;
        }

        return false;
    };

    // Aguarda e verifica se acertou a resposta
    const waitAndCheckCorrectAnswer = async (timeoutMs = CONFIG.timeouts.checkCorrectAnswer) => {
        console.log(`[Auto Responder] Aguardando ${timeoutMs}ms para verificar se acertou...`);

        const startTime = Date.now();
        while (Date.now() - startTime < timeoutMs) {
            if (state.stopped) return false;

            if (isAnswerCorrect()) {
                console.log('[Auto Responder] Resposta correta detectada!');
                return true;
            }

            await delay(CONFIG.delays.short);
        }

        console.log('[Auto Responder] Timeout - resposta provavelmente incorreta');
        return false;
    };

    // ===== FUNÇÕES DE AÇÃO =====
    const selectRandomOption = (options, usedIndices = []) => {
        const availableIndices = Array.from(options.keys())
            .filter(i => !usedIndices.includes(i));

        if (availableIndices.length === 0) return null;

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        return { element: options[randomIndex], index: randomIndex };
    };

    const clickNextButton = async () => {
        const nextButton = document.querySelector(selectors.nextButton);
        if (nextButton && !nextButton.classList.contains('disabled')) {
            console.log('[Auto Responder] Clicando no botão "próxima"');

            // Salva a URL atual antes de clicar
            const urlBeforeClick = window.location.href;

            // Usa simulação de clique real
            const clicked = simulateRealMouseClick(nextButton, 'Botão próxima');
            if (!clicked) return false;

            // Aguarda um tempo maior para a página carregar
            console.log('[Auto Responder] Aguardando navegação...');
            await delay(CONFIG.delays.afterNavigation + 1000);

            // Verifica se a URL mudou (indicando navegação bem-sucedida)
            const urlAfterClick = window.location.href;
            const navigationSuccessful = urlAfterClick !== urlBeforeClick;

            if (navigationSuccessful) {
                console.log(`[Auto Responder] Navegação bem-sucedida - URL mudou de ${urlBeforeClick} para ${urlAfterClick}`);
                state.nextButtonFailures = 0; // Reset contador de falhas
                state.currentUrl = urlAfterClick; // Atualiza URL atual
                // Reset estado das alternativas para nova questão
                state.usedAlternatives = [];
                state.currentAttempt = 0;
                return true;
            } else {
                console.log('[Auto Responder] Navegação falhou - URL não mudou');
                state.nextButtonFailures++;
                console.log(`[Auto Responder] Falhas consecutivas do botão próxima: ${state.nextButtonFailures}/${CONFIG.maxNextButtonFailures}`);
                return false;
            }
        }

        console.log('[Auto Responder] Botão "próxima" não disponível');
        state.nextButtonFailures++;
        return false;
    };

    const waitForCondition = async (conditionFn, timeout, errorMsg) => {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (state.stopped) return false;
            if (conditionFn()) return true;
            await delay(CONFIG.delays.short);
        }
        notify('Erro', errorMsg);
        return false;
    };

    const waitForNextQuestion = async () => {
        return waitForCondition(
            () => {
                const hasOptions = getOptions().length > 0;
                const hasTextArea = !!getTextArea();
                const isTaskCompleted = !!isCompleted();

                return hasOptions || hasTextArea || isTaskCompleted;
            },
            CONFIG.timeouts.nextQuestion,
            'Tempo limite atingido ao esperar nova questão'
        );
    };

    const waitForSubmitButton = async () => {
        return waitForCondition(
            () => getSubmitButton(),
            CONFIG.timeouts.submitButton,
            'Botão "Enviar resposta" não habilitado'
        );
    };

    const simulateTyping = async (textArea, text) => {
        try {
            textArea.focus();
            textArea.value = '';
            textArea.dispatchEvent(new Event('input', { bubbles: true }));

            for (let i = 0; i < text.length; i++) {
                if (state.stopped) return false;

                textArea.setRangeText(text[i], textArea.selectionStart, textArea.selectionEnd, 'end');
                textArea.dispatchEvent(new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertText',
                    data: text[i],
                }));
                await delay(CONFIG.delays.typing);
            }

            textArea.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        } catch (err) {
            notify('Erro', `Erro ao digitar: ${err.message}`);
            return false;
        }
    };

    // Verifica se a tarefa foi finalizada baseado nas falhas do botão próxima
    const isTaskFinished = () => {
        const finished = state.nextButtonFailures >= CONFIG.maxNextButtonFailures;
        if (finished) {
            console.log(`[Auto Responder] Tarefa considerada finalizada após ${state.nextButtonFailures} tentativas falhadas do botão próxima`);
        }
        return finished;
    };

    // ===== HANDLERS ESPECÍFICOS =====
    const handleMultipleChoice = async () => {
        const options = getOptions();
        console.log(`[Auto Responder] Questão múltipla escolha: ${options.length} alternativas`);

        // Delay antes de responder
        console.log(`[Auto Responder] Aguardando ${CONFIG.delays.beforeAnswering}ms antes de marcar questão`);
        await delay(CONFIG.delays.beforeAnswering);

        if (state.stopped) return false;

        // Reset estado se for uma nova questão
        if (state.currentAttempt === 0) {
            state.usedAlternatives = [];
        }

        const maxAttempts = Math.min(CONFIG.maxAttempts, options.length);

        // Continua de onde parou ou inicia nova tentativa
        for (let attempt = state.currentAttempt + 1; attempt <= maxAttempts; attempt++) {
            if (state.stopped) return false;

            state.currentAttempt = attempt;

            const currentOptions = getOptions();
            const option = selectRandomOption(currentOptions, state.usedAlternatives);

            if (!option) {
                notify('Aviso', 'Sem alternativas disponíveis');
                break;
            }

            console.log(`[Auto Responder] Tentativa ${attempt}: Clicando na alternativa ${option.index + 1}`);

            // Clique mais realístico com delay adicional
            const clickSuccess = safeClick(option.element, `Alternativa ${attempt}`);

            if (clickSuccess) {
                state.usedAlternatives.push(option.index);
                notify('Sucesso', `Alternativa ${attempt} marcada`);

                // CORRIGIDO: Aguarda mais tempo e verifica se acertou
                const answeredCorrectly = await waitAndCheckCorrectAnswer();

                if (answeredCorrectly) {
                    console.log(`[Auto Responder] Resposta correta na tentativa ${attempt}!`);
                    // Reset para próxima questão
                    state.currentAttempt = 0;
                    state.usedAlternatives = [];
                    return true;
                }

                // Se não acertou e ainda há tentativas disponíveis
                if (attempt < maxAttempts) {
                    console.log(`[Auto Responder] Tentativa ${attempt} incorreta. Preparando próxima tentativa...`);
                    await delay(CONFIG.delays.betweenAttempts);
                } else {
                    console.log(`[Auto Responder] Todas as tentativas esgotadas (${maxAttempts})`);
                    // Reset para próxima questão mesmo sem acertar
                    state.currentAttempt = 0;
                    state.usedAlternatives = [];
                }
            } else {
                console.log(`[Auto Responder] Falha ao clicar na alternativa ${attempt}`);
                // Não conta como tentativa se o clique falhou
                state.currentAttempt = attempt - 1;
            }
        }

        return true;
    };

    const handleOpenQuestion = async () => {
        console.log('[Auto Responder] Questão aberta detectada');

        // Delay antes de responder
        console.log(`[Auto Responder] Aguardando ${CONFIG.delays.beforeAnswering}ms antes de responder questão aberta`);
        await delay(CONFIG.delays.beforeAnswering);

        if (state.stopped) return false;

        const textArea = getTextArea();
        if (!textArea) {
            notify('Erro', 'Caixa de texto não encontrada');
            return false;
        }

        const success = await simulateTyping(textArea, CONFIG.defaultResponse);
        if (!success) return false;

        notify('Sucesso', 'Texto preenchido');

        const submitAvailable = await waitForSubmitButton();
        if (!submitAvailable) return false;

        const submitButton = getSubmitButton();
        if (!safeClick(submitButton, 'Enviar resposta')) return false;

        notify('Sucesso', 'Resposta enviada');

        // Blur textarea e confirmar
        textArea.blur();
        await delay(CONFIG.delays.medium);

        const confirmButton = document.querySelector(selectors.confirmButton);
        if (confirmButton) {
            safeClick(confirmButton, 'Confirmar');
        }

        // CORRIGIDO: Aguarda processamento da resposta antes de continuar
        await delay(CONFIG.delays.long);

        return true;
    };

    const tryClickTask = async () => {
        const now = Date.now();
        if (now - state.lastTaskCheck < CONFIG.taskCheckInterval) {
            return false;
        }
        state.lastTaskCheck = now;

        // Busca links de tarefa que NÃO sejam de material de apoio
        const taskLinks = document.querySelectorAll(selectors.taskLinks);
        const validTaskLinks = Array.from(taskLinks).filter(link =>
            !link.href.includes('/material-de-apoio') &&
            !link.closest('.SupportCard-module_card-wrapper__vCboD')
        );

        if (validTaskLinks.length > 0) {
            console.log(`[Auto Responder] Tarefa válida encontrada: ${validTaskLinks.length} links`);
            safeClick(validTaskLinks[0], 'Tarefa');
            notify('Tarefa', 'Clicando na tarefa');
            await delay(CONFIG.delays.long);
            state.nextButtonFailures = 0; // Reset contador ao entrar numa nova tarefa
            // Reset estado das alternativas
            state.currentAttempt = 0;
            state.usedAlternatives = [];
            return true;
        }

        console.log('[Auto Responder] Nenhuma tarefa válida encontrada (excluindo material de apoio)');
        return false;
    };

    const handleInitialSetup = async () => {
        try {
            // Verifica se não estamos em uma página de material de apoio
            if (window.location.href.includes('/material-de-apoio')) {
                console.log('[Auto Responder] Em página de material de apoio - pulando setup');
                return false;
            }

            // Pula leitura se já foi feita
            if (state.readCount > 0) {
                console.log('[Auto Responder] Leitura já realizada, pulando');
                return true;
            }

            const readingButton = document.querySelector(selectors.readingButton);
            if (readingButton) {
                console.log('[Auto Responder] Processando leitura');
                safeClick(readingButton, 'Leitura');
                state.readCount++;
                notify('Sucesso', 'Leitura processada');
                await delay(CONFIG.delays.long);

                const backButton = document.querySelector(selectors.backButton);
                if (backButton) {
                    safeClick(backButton, 'Voltar');
                    await delay(CONFIG.delays.long);
                }
            }

            // Busca botões de tarefa que NÃO sejam de material de apoio
            const taskButtons = document.querySelectorAll(selectors.taskButton);
            const validTaskButtons = Array.from(taskButtons).filter(button =>
                !button.closest('.SupportCard-module_card-wrapper__vCboD')
            );

            if (validTaskButtons.length > 0) {
                console.log('[Auto Responder] Iniciando tarefa válida');
                safeClick(validTaskButtons[0], 'Tarefa');
                await delay(CONFIG.delays.medium);
                state.nextButtonFailures = 0; // Reset contador ao iniciar tarefa
                // Reset estado das alternativas
                state.currentAttempt = 0;
                state.usedAlternatives = [];
            }

            return true;
        } catch (err) {
            notify('Erro', `Erro no setup inicial: ${err.message}`);
            return false;
        }
    };

    const returnToHome = async () => {
        console.log('[Auto Responder] Retornando à página inicial');

        const backButton = document.querySelector(selectors.backButton);
        if (!backButton) {
            notify('Erro', 'Botão voltar não encontrado');
            return false;
        }

        // Primeiro clique para voltar
        console.log('[Auto Responder] Primeiro clique no botão voltar');
        safeClick(backButton, 'Voltar (1)');
        await delay(CONFIG.delays.long + 500);

        // Segundo clique para voltar
        const backButton2 = document.querySelector(selectors.backButton);
        if (backButton2) {
            console.log('[Auto Responder] Segundo clique no botão voltar');
            safeClick(backButton2, 'Voltar (2)');
            await delay(CONFIG.delays.long + 500);
            notify('Sucesso', 'Retornado à página inicial (2 cliques)');
        } else {
            notify('Aviso', 'Segundo botão voltar não encontrado');
        }

        // Reset estados para próxima tarefa
        state.readCount = 0;
        state.nextButtonFailures = 0;
        state.currentUrl = window.location.href;
        state.currentAttempt = 0;
        state.usedAlternatives = [];

        return true;
    };

    // NOVA FUNÇÃO: Verifica se há mais questões ou se deve continuar
    const shouldContinueProcessing = async () => {
        // Verifica se há questões de múltipla escolha
        const options = getOptions();
        if (options.length > 0) {
            console.log('[Auto Responder] Questões de múltipla escolha encontradas');
            return true;
        }

        // Verifica se há questão de texto
        const textArea = getTextArea();
        if (textArea) {
            console.log('[Auto Responder] Questão de texto encontrada');
            return true;
        }

        // Verifica se a tarefa está completa
        if (isCompleted()) {
            console.log('[Auto Responder] Tarefa marcada como completa');
            return false;
        }

        // Aguarda um pouco para verificar se mais questões aparecem
        console.log('[Auto Responder] Aguardando para verificar se há mais questões...');
        await delay(CONFIG.delays.medium);

        // Verifica novamente após delay
        const optionsAfterDelay = getOptions();
        const textAreaAfterDelay = getTextArea();

        if (optionsAfterDelay.length > 0 || textAreaAfterDelay) {
            console.log('[Auto Responder] Questões encontradas após delay');
            return true;
        }

        console.log('[Auto Responder] Nenhuma questão adicional encontrada');
        return false;
    };

    // ===== FUNÇÃO PRINCIPAL =====
    const main = async () => {
        if (state.running || state.stopped) return;
        state.running = true;

        try {
            console.log('[Auto Responder] Iniciando execução');

            // Verifica se não estamos em página de material de apoio
            if (window.location.href.includes('/material-de-apoio')) {
                console.log('[Auto Responder] Em página de material de apoio - retornando ao início');
                if (await returnToHome()) {
                    state.running = false;
                    return main();
                } else {
                    state.stopped = true;
                    return;
                }
            }

            // 1. Tenta clicar em tarefas pendentes
            if (await tryClickTask()) {
                await delay(CONFIG.delays.long + 500);
                state.running = false;
                return main(); // Recursão otimizada
            }

            // 2. Setup inicial (leitura e tarefas)
            const setupSuccess = await handleInitialSetup();
            if (!setupSuccess || state.stopped) {
                console.log('[Auto Responder] Setup falhou ou foi interrompido');
                state.stopped = true;
                return;
            }

            await delay(CONFIG.delays.medium + 500);
            if (state.stopped) return;

            // 3. CORRIGIDO: Verifica se deve continuar processando
            const shouldContinue = await shouldContinueProcessing();
            if (!shouldContinue) {
                console.log('[Auto Responder] Sem questões para processar - tentando navegar ou retornar');

                const navigationSuccess = await clickNextButton();
                if (navigationSuccess) {
                    if (await waitForNextQuestion()) {
                        state.running = false;
                        return main();
                    }
                }

                // Se navegação falhou, considera tarefa finalizada
                if (isTaskFinished()) {
                    notify('Aviso', 'Tarefa finalizada - retornando ao início');
                    if (await returnToHome()) {
                        state.running = false;
                        return main();
                    }
                }

                state.stopped = true;
                return;
            }

            // 4. Processa questões
            const options = getOptions();
            const textArea = getTextArea();

            console.log(`[Auto Responder] Processando questões - Opções: ${options.length}, TextArea: ${!!textArea}`);

            let success = false;

            if (options.length > 0) {
                console.log('[Auto Responder] Processando questão de múltipla escolha');
                success = await handleMultipleChoice();
            } else if (textArea) {
                console.log('[Auto Responder] Processando questão aberta');
                success = await handleOpenQuestion();
            } else {
                console.log('[Auto Responder] Nenhuma questão detectada - tentando procurar tarefas');
                notify('Aviso', 'Nenhuma questão detectada');
                success = false;
            }

            if (!success || state.stopped) {
                console.log('[Auto Responder] Processamento de questão falhou ou foi interrompido');
                state.stopped = true;
                return;
            }

            await delay(CONFIG.delays.long);

            // 5. Navega para próxima questão ou retorna ao início
            const navigationSuccess = await clickNextButton();

            if (navigationSuccess) {
                // Navegação bem-sucedida - aguarda próxima questão
                if (await waitForNextQuestion()) {
                    state.running = false;
                    return main(); // Continua para próxima questão
                } else {
                    notify('Fim', 'Sem mais questões após navegação');
                    state.stopped = true;
                }
            } else {
                // Navegação falhou - verifica se tarefa foi finalizada
                if (isTaskFinished()) {
                    notify('Aviso', `Tarefa finalizada após ${CONFIG.maxNextButtonFailures} tentativas falhadas. Retornando ao início.`);
                    if (await returnToHome()) {
                        state.running = false;
                        return main(); // Retorna ao início para procurar mais tarefas
                    } else {
                        state.stopped = true;
                    }
                } else {
                    // Ainda não atingiu o limite de falhas, tenta novamente
                    notify('Aviso', `Falha na navegação (${state.nextButtonFailures}/${CONFIG.maxNextButtonFailures}). Tentando novamente...`);
                    await delay(CONFIG.delays.long);
                    state.running = false;
                    return main();
                }
            }

        } catch (err) {
            notify('Erro geral', err.message);
            console.error('[Auto Responder] Erro:', err);
            state.stopped = true;
        } finally {
            state.running = false;
        }
    };

    // ===== CONTROLES DE TECLADO =====
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();

        if (key === 'p') {
            if (state.stopped) {
                state.stopped = false;
                state.nextButtonFailures = 0; // Reset contador
                state.currentAttempt = 0;     // Reset tentativas
                state.usedAlternatives = []; // Reset alternativas usadas
                notify('Reiniciado', 'Auto responder reiniciado');
            }
            if (!state.running) {
                main();
                notify('Iniciado', 'Auto responder em execução...');
            }
        }

        if (key === 'o') {
            state.stopped = true;
            notify('Parado', 'Auto responder interrompido');
        }
    });

    // ===== INICIALIZAÇÃO =====
    console.log('[Auto Responder] Script carregado. Pressione "P" para iniciar, "O" para parar.');
    notify('Pronto', 'Pressione "P" para iniciar');

})();