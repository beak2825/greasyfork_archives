// ==UserScript==
// @name         Auto-Forum
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Автоматически лайкает все сообщения на форуме Wide Russia
// @author       You
// @match        https://forum-widerussia.hgweb.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hgweb.ru
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546840/Auto-Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/546840/Auto-Forum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация
    const DELAY_BETWEEN_ACTIONS = 2000; // Задержка между действиями
    const MAX_POSTS_PER_PAGE = 10; // Максимальное количество сообщений на странице

    // Состояние скрипта
    let state = {
        processedPosts: GM_getValue('processedPosts', []),
        isProcessing: GM_getValue('isProcessing', false)
    };

    // Функция для сохранения состояния
    function saveState() {
        GM_setValue('processedPosts', state.processedPosts);
        GM_setValue('isProcessing', state.isProcessing);
    }

    // Функция для поиска кнопок лайка
    function findLikeButtons() {
        // Точный селектор для кнопок лайка на основе предоставленного HTML
        return $('a.reaction[data-reaction-id="1"]').filter(function() {
            const postId = $(this).attr('href').match(/posts\/(\d+)\//)[1];
            return !state.processedPosts.includes(postId);
        });
    }

    // Функция для обработки лайков на странице
    function processLikes() {
        console.log('Поиск кнопок лайка...');
        
        const likeButtons = findLikeButtons();
        console.log(`Найдено кнопок лайка: ${likeButtons.length}`);
        
        if (likeButtons.length > 0) {
            likeButtons.each(function(index) {
                setTimeout(() => {
                    const postId = $(this).attr('href').match(/posts\/(\d+)\//)[1];
                    console.log(`Лайкаю сообщение ${index + 1}/${likeButtons.length} (ID: ${postId})`);
                    
                    // Визуальное выделение
                    $(this).css({
                        'border': '2px solid red',
                        'box-shadow': '0 0 5px red'
                    });
                    
                    // Кликаем по кнопке
                    if (this.click) {
                        this.click();
                    } else {
                        const event = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        this.dispatchEvent(event);
                    }
                    
                    // Добавляем в обработанные
                    state.processedPosts.push(postId);
                    saveState();
                    
                }, index * DELAY_BETWEEN_ACTIONS);
            });
            
            return likeButtons.length * DELAY_BETWEEN_ACTIONS;
        }
        
        return DELAY_BETWEEN_ACTIONS;
    }

    // Функция для поиска ссылок на темы
    function findTopicLinks() {
        return $('.structItem-title a').filter(function() {
            const href = $(this).attr('href');
            return href && href.includes('threads/');
        });
    }

    // Функция для обработки страницы
    function processPage() {
        // Если это страница со списком тем
        if (window.location.pathname === '/' || window.location.pathname.includes('index.php')) {
            console.log('На странице со списком тем');
            
            if (!state.isProcessing) {
                state.isProcessing = true;
                saveState();
            }
            
            const topicLinks = findTopicLinks();
            console.log(`Найдено тем: ${topicLinks.length}`);
            
            if (topicLinks.length > 0) {
                // Переходим к первой теме
                const firstTopic = topicLinks.first();
                console.log('Перехожу к теме:', firstTopic.text());
                window.location.href = firstTopic.attr('href');
            }
        }
        // Если это страница темы
        else if (window.location.pathname.includes('threads/')) {
            console.log('На странице темы');
            
            // Обрабатываем лайки
            setTimeout(() => {
                const processingTime = processLikes();
                
                // После обработки возвращаемся к списку тем
                setTimeout(() => {
                    console.log('Возвращаюсь к списку тем');
                    window.history.back();
                }, processingTime + DELAY_BETWEEN_ACTIONS);
            }, DELAY_BETWEEN_ACTIONS);
        }
    }

    // Создаем кнопку управления
    function createControlButton() {
        // Удаляем старую кнопку, если есть
        $('#autoLikeControl').remove();
        
        const button = document.createElement('button');
        button.id = 'autoLikeControl';
        button.innerHTML = state.isProcessing ? '⏸️ Остановить' : '▶️ Автолайк';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = state.isProcessing ? '#ff4444' : '#44ff44';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        
        button.addEventListener('click', function() {
            state.isProcessing = !state.isProcessing;
            saveState();
            
            this.innerHTML = state.isProcessing ? '⏸️ Остановить' : '▶️ Автолайк';
            this.style.backgroundColor = state.isProcessing ? '#ff4444' : '#44ff44';
            
            if (state.isProcessing) {
                processPage();
            }
        });
        
        document.body.appendChild(button);
    }

    // Создаем кнопку сброса
    function createResetButton() {
        const button = document.createElement('button');
        button.innerHTML = '🔄 Сбросить';
        button.style.position = 'fixed';
        button.style.bottom = '60px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#888';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        
        button.addEventListener('click', function() {
            if (confirm('Сбросить прогресс лайкания?')) {
                state.processedPosts = [];
                state.isProcessing = false;
                GM_deleteValue('processedPosts');
                GM_deleteValue('isProcessing');
                alert('Прогресс сброшен!');
            }
        });
        
        document.body.appendChild(button);
    }

    // Запускаем скрипт
    $(document).ready(function() {
        // Добавляем кнопки управления
        createControlButton();
        createResetButton();
        
        console.log('Скрипт автолайка загружен. Нажмите кнопку "Автолайк" для запуска.');
        
        // Если скрипт уже в процессе работы, продолжаем
        if (state.isProcessing) {
            setTimeout(processPage, 2000);
        }
    });
})();