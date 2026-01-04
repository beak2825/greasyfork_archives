// ==UserScript==
// @name         Khan Academy
// @namespace    https://enzopita.com
// @version      1.0.1
// @description  Script do Khan Academy para responder automaticamente as questões
// @author       Enzo Pita
// @match        https://*.khanacademy.org/*
// @icon         https://cdn.kastatic.org/images/favicon.ico
// @license      MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511438/Khan%20Academy.user.js
// @updateURL https://update.greasyfork.org/scripts/511438/Khan%20Academy.meta.js
// ==/UserScript==

function later(delay, value) {
    return new Promise(resolve => setTimeout(resolve, delay, value));
}

class Logger {
    constructor(prefix = '') {
        this.prefix = prefix;
        this.colors = {
            info: 'color: #00BFFF;',
            warn: 'color: #FFD700;',
            error: 'color: #FF4500;',
            debug: 'color: #32CD32;',
        };
    }

    info(...messages) {
        this.#log('INFO', 'info', ...messages);
    }

    warn(...messages) {
        this.#log('WARN', 'warn', ...messages);
    }

    error(...messages) {
        this.#log('ERROR', 'error', ...messages);
    }

    debug(...messages) {
        this.#log('DEBUG', 'debug', ...messages);
    }

    #log(level, colorKey, ...messages) {
        const color = this.colors[colorKey] || '';
        const formattedMessage = this.#formatMessage(level, ...messages);
        console.log(`%c[${level}] %c${this.prefix} %c${formattedMessage}`, color, color, 'color: inherit;');
    }

    #formatMessage(level, ...messages) {
        return messages.join(' ');
    }
}

class Question {
    constructor({ exerciseId, itemData }) {
        this.logger = new Logger(`Question - ${exerciseId}`);

        this.exerciseId = exerciseId;
        this.itemData = itemData;
    }

    async answer() {
        // TODO: Implementar "sorter"

        const blocks = await this.#getBlocks();

        const ignoredTypes = ['image'];
        const handlers = {
            'radio': this.answerRadio.bind(this),
            'numeric-input': this.answerNumericInput.bind(this),
            'input-number': this.answerInputNumber.bind(this),
            'expression': this.answerExpression.bind(this),
            'dropdown': this.answerDropdown.bind(this),
            'categorizer': this.answerCategorizer.bind(this),
            'interactive-graph': this.answerInterativeGraph.bind(this),
            'grapher': this.answerInterativeGraph.bind(this),
        };

        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const handler = handlers[block.type];

            if (!handler) {
                // TODO: Exibir a resposta na interface, para possibilitar que o usuário responda manualmente.
                if (!ignoredTypes.includes(block.type)) {
                    alert(`O script ainda não responde este tipo de questão automaticamente. Se quiser sugerir isso ao desenvolvedor, contate-o informando o tipo "${block.type}" e informe a URL da página atual.`);
                }

                this.logger.warn('Handler para o tipo', block.type, 'não foi encontrado.');
                continue;
            }

            try {
                await handler(block);
                await later(100);

                this.logger.info('Questão do tipo', block.type, 'foi respondido com sucesso.');
            } catch (error) {
                this.logger.error('Não foi possível responder automaticamente o campo do tipo', block.type);
                console.error(error);
            }
        }
    }

    async answerCategorizer(block) {
        const rows = block.element.querySelectorAll('tbody > tr');
        
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const buttonIndex = block.data.options.values[i];

            const columns = row.querySelectorAll('td:not(:first-child)');
            const buttons = Array.from(columns).map(column => column.querySelector('.perseus-interactive'));

            const button = buttons[buttonIndex];

            if (!button) {
                this.logger.warn('Botão não encontrado para o categorizer');
                continue;
            }

            await later(50);
        }
    }

    async answerRadio(block) {
        const options = block.element.querySelectorAll('li');

        for (let i = 0; i < block.data.options.choices.length; i++) {
            const choice = block.data.options.choices[i];
            if (!choice.correct) continue;

            const element = options[i];

            if (!element) {
                throw new Error('Elemento não encontrado.');
            }
    
            const button = element.querySelector('button');
            button.click();
            await later(50);
        }
    }

    async answerNumericInput(block) {
        const acceptedAnswer = block.data.options.answers.find(answer => answer.status === 'correct');

        if (!acceptedAnswer) {
            return this.logger.warn('A questão não tem nenhum valor correto.');
        }

        const input = block.element.querySelector('input');
        this.#simulateLatexPaste(input, acceptedAnswer.value.toString());
    }

    async answerInputNumber(block) {
        const input = block.element.querySelector('input');
        this.#simulateLatexPaste(input, block.data.options.value.toString());
    }

    async answerExpression(block) {
        const textarea = block.element.querySelector('textarea');
        const correctOption = block.data.options.answerForms.find(option => option.considered === 'correct');

        if (!correctOption) {
            throw new Error('Expressão correta não encontrada.');
        }

        this.#simulateLatexPaste(textarea, correctOption.value);
    }

    async answerDropdown(block) {
        const toggleButton = block.element.querySelector('button');
        toggleButton.click();

        const dropdown = await this.#getDropdownPopper();
        const buttons = Array.from(dropdown.querySelectorAll('button[aria-disabled="false"]'));

        const correctOption = block.data.options.choices.find(choice => choice.correct);

        if (!correctOption) {
            throw new Error('Nenhuma opção encontrada.');
        }

        const option = buttons.find(element => {
            const text = element.querySelector('div:last-child > span').innerText;
            return text.trim() === correctOption.content.trim();
        });

        option.click();
    }

    async answerInterativeGraph(block) {
        const coordinates = block.data.options.correct.coords;
        const text = ['Coloque os seguintes pontos no gráfico:'];

        for (const point of coordinates) {
            const [x, y] = point;
            text.push(`x: ${x} / y: ${y}`);
        }

        alert(text.join('\n'));
    }

    #simulateLatexPaste(element, expression) {
        const originalValue = element.value;
        const originalSelectionStart = element.selectionStart;
        const originalSelectionEnd = element.selectionEnd;
    
        const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            clipboardData: new DataTransfer()
        });

        pasteEvent.clipboardData.setData('text/plain', expression);
    
        element.dispatchEvent(pasteEvent);
    
        if (element.value === originalValue) {
            const start = originalSelectionStart;
            const end = originalSelectionEnd;
            element.setRangeText(expression, start, end, 'end');
        }
    
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    #getPerseusWidgets() {
        return new Promise((resolve, reject) => {
            let retries = 0;

            const interval = setInterval(() => {
                if (retries >= 3) {
                    clearInterval(interval);
                    return reject();
                }

                const elements = document.querySelectorAll('.perseus-widget-container');
    
                if (elements) {
                    clearInterval(interval);
                    return resolve(elements);
                }

                retries++;
            });
        });
    }

    #getDropdownPopper() {
        return new Promise((resolve, reject) => {
            let retries = 0;

            const interval = setInterval(() => {
                if (retries >= 3) {
                    clearInterval(interval);
                    return reject();
                }

                const element = document.querySelector('div[data-testid="dropdown-popper"]');
    
                if (element) {
                    clearInterval(interval);
                    return resolve(element);
                }

                retries++;
            });
        });
    }

    async #getBlocks() {
        const { content, widgets } = this.itemData.question;

        const elementsLists = await this.#getPerseusWidgets();
        let i = 0;

        const blockRegex = /\[\[☃ ([\w-]+) (\d+)\]\]/g;
        const blocks = [];

        content.replace(blockRegex, (_, type, position) => {
            const widgetKey = `${type} ${position}`;
            const data = widgets[widgetKey];
            const element = elementsLists[i++];

            blocks.push({
                type,
                data,
                element,
            });
        });

        return blocks;
    }
}

class QuestionManager {
    constructor() {
        this.logger = new Logger(QuestionManager.name);
        this.reset();
    }

    addQuestion(question) {
        this.questions.push(question);
        this.logger.info('Uma nova questão foi adicionada, total de questões:', this.questions.length);
    }

    getQuestion() {
        return this.questions[this.currentIndex];
    }

    nextQuestion() {
        this.currentIndex++;
        this.logger.info('O índice da questão atual foi incrementado. Índice atual:', this.currentIndex);
    }

    reset() {
        this.currentIndex = 0;
        this.questions = [];
        this.logger.info('A lista de questões foi resetada.');
    }
}

class NetworkMonitor {
    constructor({
        onAssessmentItem,
        onAttemptProblem,
        onRestartTask,
    } = {}) {
        this.logger = new Logger(NetworkMonitor.name);
        this.lastQuestionUrl = this.#isTaskUrl() ? location.href : null;

        this.originalFetch = window.fetch;
        this.originalPushState = history.pushState;
        this.originalReplaceState = history.replaceState;

        this.onAssessmentItem = onAssessmentItem;
        this.onAttemptProblem = onAttemptProblem;
        this.onRestartTask = onRestartTask;
    }

    start() {
        const monitorThis = this;

        // Se o usuário sair página de questão, reseta a lista.
        const handleUrlChange = () => {
            if (monitorThis.#isTaskUrl()) {
                // Se a questão mudar, apaga as questões relacionadas da questão anterior
                // Já que o Khan Academy não apaga o cache se eu voltar no histórico
                if (monitorThis.lastQuestionUrl && monitorThis.lastQuestionUrl !== location.href) {
                    monitorThis.onRestartTask();
                }

                monitorThis.lastQuestionUrl = location.href;
            }
        };

        window.history.pushState = function(...args) {
            monitorThis.originalPushState.apply(this, args);
            handleUrlChange();
        };
        
        window.history.replaceState = function(...args) {
            monitorThis.originalReplaceState.apply(this, args);
            handleUrlChange();
        };

        window.fetch = function (request) {
            // Se o parâmetro informado for uma URL, nós permitimos a requisição sem qualquer interceptação
            // Isso acontece porque as requisições de interesse são do client GraphQL, que são enviadas através da classe Request
            if (typeof request === 'string') {
                return monitorThis.originalFetch.apply(this, arguments);
            }

            const requestClone = request.clone();

            return monitorThis.originalFetch.apply(this, arguments).then(async (response) => {
                const responseClone = response.clone();

                const isAssessmentUrl = request.url.includes('/getAssessmentItem');
                const isAttemptUrl = request.url.includes('/attemptProblem');
                const isRestartTaskUrl = request.url.includes('/RestartTask');

                const shouldIntercept = isAssessmentUrl || isAttemptUrl || isRestartTaskUrl;

                if (shouldIntercept) {
                    const requestBody = await monitorThis.#decodeStream(requestClone.body).then(JSON.parse);
                    const responseBody = await responseClone.json();

                    if (isAssessmentUrl && monitorThis.onAssessmentItem) {
                        const itemData = JSON.parse(responseBody.data.assessmentItem.item.itemData);

                        // Atualiza o conteúdo da questão, desativando o randomize e facilitando a correlação
                        const updatedItemData = monitorThis.#updateItemData(itemData);
                        responseBody.data.assessmentItem.item.itemData = JSON.stringify(updatedItemData);

                        const modifiedResponseBody = JSON.stringify(responseBody);
                        const modifiedResponse = new Response(modifiedResponseBody, {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers,
                        });

                        const { exerciseId } = requestBody.variables.input;

                        const question = new Question({
                            exerciseId,
                            itemData: updatedItemData,
                        });

                        // Executa o callback informando a nova questão obtida
                        monitorThis.onAssessmentItem(question);

                        return modifiedResponse;
                    }

                    if (isAttemptUrl && monitorThis.onAttemptProblem) {
                        const { attemptCorrect } = responseBody.data.attemptProblem.result.actionResults;
                        monitorThis.onAttemptProblem(attemptCorrect);
                    }

                    if (isRestartTaskUrl && monitorThis.onRestartTask) {
                        monitorThis.onRestartTask();
                    }
                }

                return response;
            });
        };
    }

    stop() {
        window.fetch = this.originalFetch;
        history.pushState = this.originalPushState;
        history.replaceState = this.originalReplaceState;
    }

    #isTaskUrl(url = location.href) {
        const path = url.replace(/^https?:\/\/[^\/]+\//, '');
        const segments = path.split('/');

        return segments.length > 2 && path.includes('/e/');
    }

    #updateItemData(itemData) {
        const { widgets } = itemData.question;

        for (const key of Object.keys(widgets)) {
            const widget = widgets[key];

            if (widget.type === 'radio') {
                widget.options.randomize = false;
            }

            if (widget.type === 'categorizer') {
                widget.options.randomizeItems = false;
            }
        }

        return itemData;
    }

    async #decodeStream(readableStream) {
        const reader = readableStream.getReader();
        const decoder = new TextDecoder();

        let result = '';
        let done = false;

        while (!done) {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;

            if (value) {
                result += decoder.decode(value, { stream: !done });
            }
        }

        return result;
    }
}

const questionManager = new QuestionManager();
const networkMonitor = new NetworkMonitor({
    onAssessmentItem: (question) => questionManager.addQuestion(question),
    onAttemptProblem: (success) => {
        if (success) {
            questionManager.nextQuestion();
        }
    },
    onRestartTask: () => questionManager.reset(),
});

networkMonitor.start();

// Expõe as variáveis para manipulação no DevTools
window.questionManager = questionManager;
window.networkMonitor = networkMonitor;

// Teclas temporárias
document.addEventListener('keydown', async (event) => {
    if (event.key === 'N' || event.key === 'n') {
        await window.questionManager.getQuestion().answer();
    }
});
