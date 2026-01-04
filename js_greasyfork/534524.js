// ==UserScript==
// @name         AI Решатель Yaklass
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Решает задания через Mistral AI для yaklass.ru с возможностью множественных проверок
// @author       wwmaxik
// @match        https://www.yaklass.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534524/AI%20%D0%A0%D0%B5%D1%88%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%20Yaklass.user.js
// @updateURL https://update.greasyfork.org/scripts/534524/AI%20%D0%A0%D0%B5%D1%88%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%20Yaklass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Подключаем Tailwind CSS
    const tailwindLink = document.createElement('link');
    tailwindLink.rel = 'stylesheet';
    tailwindLink.href = 'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css';
    document.head.appendChild(tailwindLink);

    // Подключаем marked.js для Markdown
    const markedScript = document.createElement('script');
    markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    document.head.appendChild(markedScript);

    // API-ключ для Mistral AI
    const MISTRAL_API_KEY = '2Ey4J0nmcmTcIEjqGnz7q4UXpOrQjOjU';
    const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

    // Задержка для ограничения запросов
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Сбор данных задачи
    function collectTaskData() {
        const taskBlock = document.querySelector('.block.sm-easy-header');
        if (!taskBlock) return 'Задача не найдена.';

        const taskHTML = taskBlock.querySelector('.taskhtmlwrapper')?.innerHTML.trim() || 'HTML задачи не найден.';
        const points = taskBlock.querySelector('.obj-points')?.innerText.trim() || 'Баллы не указаны';
        const dateCreated = taskBlock.querySelector('meta[itemprop="dateCreated"]')?.content || 'Дата создания неизвестна';
        const dateModified = taskBlock.querySelector('meta[itemprop="dateModified"]')?.content || 'Дата изменения неизвестна';

        return JSON.stringify({
            taskHTML,
            points,
            dateCreated,
            dateModified,
            currentDate: new Date().toLocaleDateString('ru-RU')
        }, null, 2);
    }

    // Обработка текста решения (Markdown -> HTML + выделение ответов)
    function processSolutionText(text) {
        return marked.parse(text).replace(/\[answer\](.*?)\[\/answer\]/g, '<span class="answer-text">$1</span>');
    }

    // Запрос к Mistral AI
    async function getMistralResponse(prompt) {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        let retries = 3;
        while (retries > 0) {
            try {
                const response = await fetch(proxyUrl + MISTRAL_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${MISTRAL_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'mistral-small-latest',
                        messages: [{ role: 'user', content: prompt }]
                    })
                });

                if (response.status === 429) {
                    console.warn('Слишком много запросов, ждем 5 секунд...');
                    await delay(5000);
                    retries--;
                    continue;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data.choices[0].message.content.trim();
            } catch (error) {
                console.error('Ошибка при запросе к Mistral AI:', error);
                if (retries === 1) {
                    window.open('https://cors-anywhere.herokuapp.com/corsdemo', '_blank');
                    alert('Не удалось выполнить запрос. На открывшейся странице нажмите "Request temporary access to the demo server", затем вернитесь и заново нажмите "Решить".');
                    throw error;
                }
                await delay(5000);
                retries--;
            }
        }
    }

    // Создание кнопок и области решения
    function createSolveButtonAndSolutionArea() {
        const taskButtons = document.querySelector('.task-buttons');
        const taskBlock = document.querySelector('.blockbody');
        if (!taskButtons || !taskBlock || document.getElementById('solve-button')) return;

        // Кнопка "Решить"
        const solveButton = document.createElement('button');
        solveButton.id = 'solve-button';
        solveButton.type = 'button';
        solveButton.classList.add('btn', 'exerc-action-btn', 'needWait');
        solveButton.style.fontFamily = 'Arial, sans-serif';
        solveButton.style.fontSize = '14px';
        solveButton.style.marginLeft = '8px';
        solveButton.textContent = 'Решить';
        taskButtons.appendChild(solveButton);

        // Кнопка переключения режима
        let isAdvanced = false;
        const modeButton = document.createElement('button');
        modeButton.id = 'mode-button';
        modeButton.type = 'button';
        modeButton.classList.add('btn', 'exerc-action-btn', 'needWait');
        modeButton.style.fontFamily = 'Arial, sans-serif';
        modeButton.style.fontSize = '14px';
        modeButton.style.marginLeft = '8px';
        modeButton.textContent = 'Режим: Обычный';
        modeButton.onclick = () => {
            isAdvanced = !isAdvanced;
            modeButton.textContent = isAdvanced ? 'Режим: Продвинутый' : 'Режим: Обычный';
        };
        taskButtons.appendChild(modeButton);

        // Область решения
        const solutionArea = document.createElement('div');
        solutionArea.id = 'solution-response';
        solutionArea.classList.add('mt-4', 'p-3', 'bg-gray-50', 'border', 'border-gray-200', 'rounded', 'text-sm', 'text-gray-800', 'min-h-[80px]', 'max-h-[250px]', 'overflow-y-auto', 'transition-opacity', 'duration-500', 'opacity-100');
        solutionArea.style.fontFamily = 'Arial, sans-serif';
        solutionArea.style.wordWrap = 'break-word';
        solutionArea.innerHTML = 'Нажми "Решить" для решения...';
        taskBlock.appendChild(solutionArea);

        // Обработчик кнопки "Решить"
        solveButton.onclick = async () => {
            solveButton.disabled = true;
            solveButton.textContent = 'Решаю...';
            solutionArea.innerHTML = 'Жду решения...';
            solutionArea.classList.add('opacity-50');

            const taskData = collectTaskData();
            const normalPrompt = `Данные задачи (включают HTML-разметку):\n${taskData}\n\nРеши задачу пошагово и укажи правильный ответ в текстовом формате, без LaTeX. Не используй апострофы (' или ") и угловые скобки (< или >). Оберни каждый ответ в квадратные скобки [answer]...[/answer].`;

            try {
                if (!isAdvanced) {
                    // Нормальный режим
                    const fullResponse = await getMistralResponse(normalPrompt);
                    const solutionText = processSolutionText(fullResponse);
                    solutionArea.innerHTML = solutionText;
                } else {
                    // Продвинутый режим
                    let currentSolution = await getMistralResponse(normalPrompt);
                    let steps = [`Первичное решение:<br>${processSolutionText(currentSolution)}`];
                    let finalSolutionText;
                    let isCorrect = false;
                    let iteration = 1;
                    while (iteration < 3 && !isCorrect) {
                        const verificationPrompt = `Проверьте это решение для следующей задачи: ${taskData}. Решение и рассуждения: ${currentSolution}. Если решение правильное, ответьте 'Правильно'. Если нет, предоставьте правильное решение с рассуждениями, оберните ответ в [answer]...[/answer].`;
                        let verificationResponse = await getMistralResponse(verificationPrompt);
                        steps.push(`Проверка ${iteration}:<br>${verificationResponse.trim() === 'Правильно' ? 'Правильно' : processSolutionText(verificationResponse)}`);
                        if (verificationResponse.trim() === 'Правильно') {
                            isCorrect = true;
                            finalSolutionText = processSolutionText(currentSolution);
                        } else {
                            currentSolution = verificationResponse;
                            iteration++;
                            if (iteration < 3) {
                                await delay(5000);
                            }
                        }
                    }
                    if (!isCorrect) {
                        finalSolutionText = processSolutionText(currentSolution);
                        steps.push(`Финальное решение (после ${iteration} проверок):<br>${finalSolutionText}`);
                    } else {
                        steps.push(`Финальное решение:<br>${finalSolutionText}`);
                    }
                    solutionArea.innerHTML = steps.map(step => `<div>${step}</div>`).join('');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                solutionArea.innerHTML = 'Ошибка при получении решения.';
            } finally {
                solutionArea.classList.remove('opacity-50');
                solveButton.disabled = false;
                solveButton.textContent = 'Решить';
                await delay(1000);
            }
        };

        // Подсветка ответов
        const style = document.createElement('style');
        style.textContent = `
            .answer-text {
                background-color: #ffff99;
                cursor: pointer;
                padding: 2px 4px;
                border-radius: 3px;
            }
            .answer-text:hover {
                background-color: #ffff66;
            }
        `;
        document.head.appendChild(style);

        solutionArea.addEventListener('click', (event) => {
            if (event.target.classList.contains('answer-text')) {
                const text = event.target.textContent;
                navigator.clipboard.writeText(text);
            }
        });
    }

    // Инициализация
    setTimeout(() => {
        createSolveButtonAndSolutionArea();
        setInterval(createSolveButtonAndSolutionArea, 5000);
    }, 2000);
})();