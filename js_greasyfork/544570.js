// ==UserScript==
// @name         mirapolis-auto100 v33
// @match        *://lms.central-ppk.ru/mirads/lmscontent/*/quiz.html*
// @match        *://lms.central-ppk.ru/mirads/*/question_*
// @match        *://lms.central-ppk.ru/mirads/courseitem/courseitem.do*
// @all_frames   true
// @run-at       document-start
// @grant        none
// @description  mirapolis-auto100
// @version 0.0.1.20250804015410
// @namespace https://greasyfork.org/users/1501369
// @downloadURL https://update.greasyfork.org/scripts/544570/mirapolis-auto100%20v33.user.js
// @updateURL https://update.greasyfork.org/scripts/544570/mirapolis-auto100%20v33.meta.js
// ==/UserScript==

(() => {
    console.log('[Mirapolis-Auto] Скрипт запущен. Ожидание запуска.');
    const bank = new Map(); // Ключ: текст вопроса, Значение: информация об ответе
    const solvedQuestions = new Set(); // Хранит тексты уже решенных вопросов
    const seenUrls = new Set(); // Хранит уже загруженные URL, чтобы избежать спама
    let isAutoModeActive = false; // Флаг для контроля автопрохождения
    let isExpressMode = false; // Флаг для режима без задержек

    // --- Переменные для контроля прохождения ---
    let totalQuestions = 0;
    let questionsToSolveCorrectly = 0;
    let questionsAnsweredCorrectly = 0;
    let currentQuestionIndex = 0; // Счетчик текущего вопроса (начиная с 0)
    let incorrectAnswerIndices = new Set(); // Индексы вопросов, на которые нужно ответить неверно

    // --- Функция для получения случайной задержки от 8 до 20 секунд ---
    const getRandomDelay = () => Math.floor(Math.random() * (20000 - 8000 + 1)) + 8000;

    // --- Функция для парсинга количества вопросов и ПЛАНИРОВАНИЯ неверных ответов ---
    const initializeTestParameters = () => {
        const infoElement = document.querySelector('.quiz-title .info');
        if (!infoElement) {
            console.warn('[Mirapolis-Auto] Не удалось найти элемент с информацией о количестве вопросов. Будут решены все.');
            totalQuestions = 0; // Неизвестно
            questionsToSolveCorrectly = Infinity;
            return;
        }

        const infoText = infoElement.getAttribute('title') || infoElement.textContent;
        const match = infoText.match(/(\d+)\s+вопро[сc]/);

        if (match && match[1]) {
            totalQuestions = parseInt(match[1], 10);
            const randomPercent = Math.random() * (0.98 - 0.88) + 0.88;
            questionsToSolveCorrectly = Math.floor(totalQuestions * randomPercent);
            const questionsToAnswerIncorrectlyCount = totalQuestions - questionsToSolveCorrectly;

            // Создаем массив индексов от 0 до totalQuestions - 1
            const allIndices = Array.from({ length: totalQuestions }, (_, i) => i);

            // Перемешиваем массив (алгоритм Фишера-Йетса)
            for (let i = allIndices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
            }

            // Выбираем первые N индексов для неверных ответов
            incorrectAnswerIndices = new Set(allIndices.slice(0, questionsToAnswerIncorrectlyCount));

            console.log(`[Mirapolis-Auto] Всего вопросов в тесте: ${totalQuestions}`);
            console.log(`[Mirapolis-Auto] Цель: решить правильно ${questionsToSolveCorrectly} из ${totalQuestions}.`);
            if (questionsToAnswerIncorrectlyCount > 0) {
                console.log(`[Mirapolis-Auto] Планируется дать неверный ответ на вопросы с индексами (начиная с 0): ${[...incorrectAnswerIndices].join(', ')}`);
            }
        } else {
            console.warn(`[Mirapolis-Auto] Не удалось определить количество вопросов из текста: "${infoText}". Будут решены все.`);
            totalQuestions = 0; // Неизвестно
            questionsToSolveCorrectly = Infinity;
        }
    };

    // --- Функция для создания кнопок запуска ---
    const createCustomButtons = () => {
        if (document.getElementById('custom-solver-button')) return;

        // Общая функция для старта процесса
        const startProcess = (express = false) => {
            if (isAutoModeActive) return;

            console.log(`[Mirapolis-Auto] Автопрохождение активировано! ${express ? '(Экспресс-режим)' : ''}`);
            isAutoModeActive = true;
            isExpressMode = express;

            initializeTestParameters();

            const normalButton = document.getElementById('custom-solver-button');
            const expressButton = document.getElementById('custom-express-button');
            const finishButton = document.getElementById('custom-finish-button');

            const progressText = totalQuestions > 0 ? `(0/${totalQuestions})` : '';
            if (normalButton) {
                normalButton.textContent = `В процессе... ${progressText}`;
                normalButton.style.backgroundColor = '#f0ad4e';
                normalButton.disabled = true;
            }
            if (expressButton) {
                expressButton.textContent = `Экспресс... ${progressText}`;
                expressButton.style.backgroundColor = '#f0ad4e';
                expressButton.disabled = true;
            }
            if(finishButton) finishButton.disabled = true;

            act();
        };

        // Обычная кнопка
        const normalButton = document.createElement('button');
        normalButton.id = 'custom-solver-button';
        normalButton.textContent = 'Пройти залупу';
        Object.assign(normalButton.style, {
            position: 'fixed', top: '10px', right: '10px', zIndex: '9999',
            padding: '10px 20px', backgroundColor: '#5cb85c', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer',
            fontSize: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        });
        normalButton.addEventListener('click', () => startProcess(false));
        document.body.appendChild(normalButton);

        // Кнопка "Экспресс"
        const expressButton = document.createElement('button');
        expressButton.id = 'custom-express-button';
        expressButton.textContent = 'Экспресс';
        Object.assign(expressButton.style, {
            position: 'fixed', top: '60px', right: '10px', zIndex: '9999',
            padding: '10px 20px', backgroundColor: '#337ab7', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer',
            fontSize: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        });
        expressButton.addEventListener('click', () => startProcess(true));
        document.body.appendChild(expressButton);

        // Кнопка "Завершить курс"
        const finishCourseButton = document.createElement('button');
        finishCourseButton.id = 'custom-finish-button';
        finishCourseButton.textContent = 'Завершить курс';
        Object.assign(finishCourseButton.style, {
            position: 'fixed', top: '110px', right: '10px', zIndex: '9999',
            padding: '10px 20px', backgroundColor: '#d9534f', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer',
            fontSize: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        });

        finishCourseButton.addEventListener('click', () => {
            console.log('[Mirapolis-Auto] Попытка принудительно завершить курс...');
            try {
                const API = window.top.API_1484_11 || window.parent.API_1484_11;
                if (!API) {
                    console.error('[Mirapolis-Auto] SCORM API не найдено!');
                    alert('[Mirapolis-Auto] SCORM API не найдено!');
                    return;
                }

                API.Initialize("");

                const max = +API.GetValue("cmi.score.max") || 100;
                API.SetValue("cmi.score.min", "0");
                API.SetValue("cmi.score.max", String(max));
                API.SetValue("cmi.score.raw", String(max));
                API.SetValue("cmi.score.scaled", "1");

                const m = Math.floor(Math.random() * (15 - 8 + 1)) + 8;
                const s = Math.floor(Math.random() * 60);
                API.SetValue("cmi.session_time", `PT${m}M${s}S`);

                API.SetValue("cmi.success_status", "passed");
                API.SetValue("cmi.completion_status", "completed");

                API.Commit("");
                API.Terminate("");
                console.log(`[Mirapolis-Auto] ✅ Курс завершен со 100% за ${m} мин ${s} сек`);
                alert(`[Mirapolis-Auto] ✅ Курс завершен со 100% за ${m} мин ${s} сек`);
                finishCourseButton.textContent = 'Завершено!';
                finishCourseButton.disabled = true;
            } catch (e) {
                console.error('[Mirapolis-Auto] Ошибка при завершении курса:', e);
                alert(`[Mirapolis-Auto] Ошибка при завершении курса: ${e.message}`);
            }
        });
        document.body.appendChild(finishCourseButton);


        console.log('[Mirapolis-Auto] Все кнопки управления добавлены.');
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createCustomButtons);
    } else {
        createCustomButtons();
    }

    /* normalize txt */
    const clean = t => {
        const decoder = document.createElement('div');
        decoder.innerHTML = t;
        const decodedText = decoder.textContent;
        return decodedText
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/["'«»„“]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    /* ── parse xml */
    function add(url, xml) {
        const dom = new DOMParser().parseFromString(xml, 'text/xml');
        const promptNode = dom.querySelector('prompt');
        if (!promptNode) {
            console.error('[Mirapolis-Auto] Не найден текст вопроса (prompt) в XML:', url);
            return;
        }
        const questionText = clean(promptNode.textContent);
        if (bank.has(questionText)) return;

        const rights = [...dom.querySelectorAll('correctResponse > value')].map(v => v.textContent.trim());
        let questionData;
        if (dom.querySelector('responseDeclaration')?.getAttribute('cardinality') === 'ordered') {
            questionData = { type: 'order', rights };
        } else {
            const dict = Object.fromEntries(
                [...dom.querySelectorAll('simpleChoice')].map(ch => [ch.getAttribute('identifier'), clean(ch.textContent)])
            );
            questionData = { type: 'choice', rights, dict };
        }
        bank.set(questionText, questionData);
    }

    /* ── resource observer */
    new PerformanceObserver(o => {
        o.getEntries().forEach(e => {
            if (/question_TQ\$/.test(e.name)) {
                if (seenUrls.has(e.name)) return;
                seenUrls.add(e.name);
                fetch(e.name).then(r => r.text()).then(t => add(e.name, t));
            }
        });
    }).observe({ type: 'resource', buffered: true });

    /* ── finish button checker */
    function checkForFinishButton() {
        if (!isAutoModeActive) return;

        const potentialButtons = document.querySelectorAll('.ui-button.click_place .button_caption');
        for (const caption of potentialButtons) {
            if (caption.textContent.trim() === 'Завершить и показать результаты') {
                const clickableButton = caption.closest('.ui-button.click_place');
                if (clickableButton) {
                    console.log('[Mirapolis-Auto] Найдена кнопка "Завершить и показать результаты". Нажимаю...');
                    isAutoModeActive = false;

                    setTimeout(() => {
                        clickableButton.click();
                        const normalButton = document.getElementById('custom-solver-button');
                        const expressButton = document.getElementById('custom-express-button');
                        const finishButton = document.getElementById('custom-finish-button');
                        if (normalButton) {
                            normalButton.textContent = 'Завершено!';
                            normalButton.style.backgroundColor = '#5cb85c';
                            normalButton.disabled = true;
                        }
                        if (expressButton) {
                            expressButton.textContent = 'Завершено!';
                            expressButton.style.backgroundColor = '#5cb85c';
                            expressButton.disabled = true;
                        }
                        if (finishButton) finishButton.disabled = false;
                    }, 1000);
                }
                break;
            }
        }
    }

    /* ── dom watch */
    const next = 'button[type=submit], .next-button, .btn-next, .ui-button.click_place';
    new MutationObserver(() => {
        // Запускаем act только если есть вопросы
        if (document.querySelector('.question-text')) {
            setTimeout(act, 500);
        }
        checkForFinishButton();
    }).observe(document, { childList: true, subtree: true });

    /* ── solve */
    function act() {
        if (!isAutoModeActive) return;

        const questionElement = document.querySelector('.question-text');
        if (!questionElement) return;

        const currentQuestionText = clean(questionElement.innerText);
        if (!currentQuestionText || solvedQuestions.has(currentQuestionText)) return;

        const info = bank.get(currentQuestionText);
        if (!info) {
            console.log(`[Mirapolis-Auto] act(): Информация для вопроса "${currentQuestionText.slice(0,50)}..." еще не загружена.`);
            return;
        }

        let wasAnsweredIncorrectly = false;

        // Проверяем, нужно ли ответить на этот вопрос неверно
        if (incorrectAnswerIndices.has(currentQuestionIndex)) {
            console.log(`[Mirapolis-Auto] Плановый неверный ответ на вопрос №${currentQuestionIndex + 1}.`);
            selectIncorrectAnswer(info);
            wasAnsweredIncorrectly = true;
        } else {
            // Отвечаем правильно
            console.log(`[Mirapolis-Auto] Запуск решения для вопроса №${currentQuestionIndex + 1}: "${currentQuestionText.slice(0,50)}..."`);
            if (info.type === 'choice') selectChoice(info);
            else if (info.type === 'order') selectOrder(info);
            questionsAnsweredCorrectly++;
        }

        solvedQuestions.add(currentQuestionText);
        currentQuestionIndex++;

        // Обновляем текст кнопок
        const normalButton = document.getElementById('custom-solver-button');
        const expressButton = document.getElementById('custom-express-button');
        const progressText = totalQuestions > 0 ? `(${currentQuestionIndex}/${totalQuestions})` : '';
        if (normalButton && normalButton.disabled) normalButton.textContent = `В процессе... ${progressText}`;
        if (expressButton && expressButton.disabled) expressButton.textContent = `Экспресс... ${progressText}`;

        console.log(`[Mirapolis-Auto] Вопрос обработан. ${wasAnsweredIncorrectly ? 'Дан неверный ответ.' : 'Дан верный ответ.'} Всего правильных: ${questionsAnsweredCorrectly}.`);

        const delay = isExpressMode ? 150 : getRandomDelay();
        console.log(`[Mirapolis-Auto] Переход к следующему вопросу через ${delay / 1000} секунд.`);
        setTimeout(() => {
            const nextBtn = document.querySelector(next);
            if (nextBtn) nextBtn.click();
        }, delay);
    }

    // --- НОВАЯ ФУНКЦИЯ для выбора случайного НЕПРАВИЛЬНОГО ответа ---
    function selectIncorrectAnswer(info) {
        if (info.type !== 'choice') {
            console.log('[Mirapolis-Auto] Пропуск вопроса на упорядочивание для неверного ответа (нажатие "Далее" без действий).');
            return; // Просто пропускаем вопросы на порядок, не трогая их
        }

        const { rights, dict } = info;
        const allAnswerElements = [...document.querySelectorAll('.choice_answer')];

        // Находим все ID вариантов ответа, которые есть на странице
        const allAvailableIds = allAnswerElements.map(el => {
            const label = el.querySelector('.check-label');
            if (!label) return null;
            const labelText = clean(label.innerText);
            return Object.keys(dict).find(key => dict[key] === labelText);
        }).filter(id => id);

        // Находим ID неправильных ответов
        const incorrectAnswerIds = allAvailableIds.filter(id => !rights.includes(id));

        if (incorrectAnswerIds.length > 0) {
            // Выбираем случайный ID из неправильных
            const randomIncorrectId = incorrectAnswerIds[Math.floor(Math.random() * incorrectAnswerIds.length)];
            const incorrectText = dict[randomIncorrectId];
            console.log(`[Mirapolis-Auto] Выбран случайный неверный ответ: "${incorrectText.slice(0, 50)}..."`);

            // Находим элемент этого ответа и кликаем
            for (const answer of allAnswerElements) {
                const label = answer.querySelector('.check-label');
                if (label && clean(label.innerText) === incorrectText) {
                    const clickable = answer.querySelector('.check-control') || answer;
                    if (clickable) {
                        clickable.click();
                        ['input', 'change'].forEach(ev => clickable.dispatchEvent(new Event(ev, { bubbles: true })));
                    }
                    break;
                }
            }
        } else {
            console.log('[Mirapolis-Auto] Не найдено неверных вариантов ответа для выбора. Вопрос будет пропущен.');
        }
    }


    function simulateDragDrop(sourceNode, destinationNode) {
        try {
            const dataTransfer = new DataTransfer();
            sourceNode.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }));
            destinationNode.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer }));
            destinationNode.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }));
            sourceNode.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true }));
            if (!destinationNode.contains(sourceNode)) {
                destinationNode.appendChild(sourceNode);
            }
        } catch (e) {
            console.error('[Mirapolis-Auto] simulateDragDrop: Ошибка при симуляции перетаскивания.', e);
            destinationNode.appendChild(sourceNode);
        }
    }

    function selectOrder({ rights }) {
        const targets = [...document.querySelectorAll('.order_answer.dropable')];
        const draggables = [...document.querySelectorAll('.dragable[data-quiz-answer-id]')];
        if (!targets.length || !draggables.length) {
            console.error('[Mirapolis-Auto] selectOrder: Не найдены элементы для перетаскивания или ячейки.');
            return;
        }
        const draggableMap = new Map(draggables.map(d => [d.dataset.quizAnswerId, d]));
        rights.forEach((answerId, correctIndex) => {
            const sourceEl = draggableMap.get(answerId);
            const destinationEl = targets[correctIndex];
            if (sourceEl && destinationEl && !destinationEl.contains(sourceEl)) {
                simulateDragDrop(sourceEl, destinationEl);
            }
        });
    }

    function selectChoice({ rights, dict }) {
        rights.forEach(id => {
            const correctText = dict[id];
            if (!correctText) return;

            const allAnswers = [...document.querySelectorAll('.choice_answer')];
            let targetAnswerContainer = null;

            for (const answer of allAnswers) {
                const label = answer.querySelector('.check-label');
                if (label && clean(label.innerText) === correctText) {
                    targetAnswerContainer = answer;
                    break;
                }
            }

            if (!targetAnswerContainer) {
                const partialText = correctText.slice(0, 30);
                for (const answer of allAnswers) {
                    const label = answer.querySelector('.check-label');
                    if (label && clean(label.innerText).includes(partialText)) {
                        targetAnswerContainer = answer;
                        break;
                    }
                }
            }

            if (targetAnswerContainer) {
                const clickable = targetAnswerContainer.querySelector('.check-control') || targetAnswerContainer;
                if (clickable) {
                    clickable.click();
                    ['input', 'change'].forEach(ev => clickable.dispatchEvent(new Event(ev, { bubbles: true })));
                }
            }
        });
    }
})();
