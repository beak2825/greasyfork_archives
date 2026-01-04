// ==UserScript==
// @name         Arizona-RP Complaint Helper
// @namespace    http://arizona-rp.com/
// @version      4.1
// @description  Генератор ответов на жалобы для Arizona-RP
// @author       YourName
// @match        https://forum.arizona-rp.com/*
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://forum.arizona-rp.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/537794/Arizona-RP%20Complaint%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/537794/Arizona-RP%20Complaint%20Helper.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // Стили для интерфейса
    const styles = `
        .ar-helper-container {
            position: relative;
            display: inline-block;
            margin-left: 10px;
        }
        .ar-helper-btn {
            background: linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(110, 72, 170, 0.4);
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
        }
        .ar-helper-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(110, 72, 170, 0.6);
        }
        .ar-helper-btn i {
            margin-right: 6px;
        }
        .ar-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 9999;
            justify-content: center;
            align-items: center;
        }
        .ar-modal-content {
            background: #2d2d3d;
            border-radius: 12px;
            width: 700px;
            max-width: 95%;
            padding: 0;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .ar-modal-header {
            background: linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%);
            color: white;
            padding: 15px 20px;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 12px 12px 0 0;
        }
        .ar-modal-close {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            line-height: 1;
        }
        .ar-modal-body {
            padding: 20px;
        }
        .ar-tabs {
            display: flex;
            margin-bottom: 20px;
            border-bottom: 1px solid #4a4a5a;
        }
        .ar-tab {
            padding: 10px 20px;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            transition: all 0.3s;
            color: #b8b8d0;
        }
        .ar-tab.active {
            border-bottom-color: #6e48aa;
            color: white;
            font-weight: 500;
        }
        .ar-form-group {
            margin-bottom: 15px;
        }
        .ar-form-label {
            display: block;
            margin-bottom: 8px;
            color: #b8b8d0;
            font-weight: 500;
        }
        .ar-form-input, .ar-form-select, .ar-form-textarea {
            width: 100%;
            padding: 10px 12px;
            background: #3a3a4a;
            border: 1px solid #4a4a5a;
            border-radius: 6px;
            color: #e0e0e0;
            font-family: inherit;
            transition: border 0.3s;
        }
        .ar-form-input:focus, .ar-form-textarea:focus {
            border-color: #6e48aa;
            outline: none;
        }
        .ar-form-textarea {
            min-height: 100px;
            resize: vertical;
        }
        .ar-form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }
        .ar-btn {
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            border: none;
            transition: all 0.3s;
        }
        .ar-btn-primary {
            background: linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%);
            color: white;
        }
        .ar-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(110, 72, 170, 0.4);
        }
        .ar-btn-secondary {
            background: #3a3a4a;
            color: #e0e0e0;
        }
        .ar-btn-secondary:hover {
            background: #4a4a5a;
        }
        .ar-result-textarea {
            margin-top: 20px;
            width: 100%;
            min-height: 150px;
            background: #3a3a4a;
            border: 1px solid #4a4a5a;
            border-radius: 6px;
            color: #e0e0e0;
            padding: 10px;
            font-family: inherit;
        }
    `;

    // Шаблоны ответов
    const templates = {
        admin: {
            default: `Приветствую,\n\nНаказаны согласно пункту:\n[b]Пункт правил:[/b] {rule}\n[b]Доказательства:[/b] {evidence}\n\n{explanation}\n\nОжидайте ответа от главной администрации.`
        },
        player: {
            approve: `Приветствую,\n\nИгрок будет наказан согласно пункту:\n[b]Пункт правил:[/b] {rule}\n\nРассмотрено, закрыто.`,
            deny: `Приветствую,\n\nЖалоба отказана, причина отказа вашей жалобы:\n{reason}\n\nОтказано, закрыто.`
        },
        gov: {
            approve: `Приветствую,\n\nИгрок будет наказан согласно пункту:\n[b]Пункт правил:[/b] {rule}\n\nРассмотрено, закрыто.`,
            deny: `Приветствую,\n\nЖалоба отказана, причина отказа вашей жалобы:\n{reason}\n\nОтказано, закрыто.`
        },
        mafia: {
            approve: `Приветствую,\n\nИгрок будет наказан согласно пункту:\n[b]Пункт правил:[/b] {rule}\n\nРассмотрено, закрыто.`,
            deny: `Приветствую,\n\nЖалоба отказана, причина отказа вашей жалобы:\n{reason}\n\nОтказано, закрыто.`
        }
    };

    // Добавляем стили в документ
    $('<style>').html(styles).appendTo('head');

    // Создаем модальное окно
    function createModal() {
        const modalHTML = `
            <div class="ar-modal" id="arHelperModal">
                <div class="ar-modal-content">
                    <div class="ar-modal-header">
                        <span>Генератор ответов на жалобы</span>
                        <button class="ar-modal-close">&times;</button>
                    </div>
                    <div class="ar-modal-body">
                        <div class="ar-tabs">
                            <div class="ar-tab active" data-type="admin">На админов</div>
                            <div class="ar-tab" data-type="player">На игроков</div>
                            <div class="ar-tab" data-type="gov">На госструктуры</div>
                            <div class="ar-tab" data-type="mafia">На бандитов/мафии</div>
                        </div>
                        
                        <div id="arFormContent"></div>
                        
                        <textarea class="ar-result-textarea" id="arResult" readonly></textarea>
                        
                        <div class="ar-form-actions">
                            <button class="ar-btn ar-btn-secondary" id="arClose">Закрыть</button>
                            <button class="ar-btn ar-btn-primary" id="arCopy">Копировать</button>
                            <button class="ar-btn ar-btn-primary" id="arGenerate">Сгенерировать</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('body').append(modalHTML);

        // Инициализация формы
        updateForm('admin');

        // Обработчики событий
        $('.ar-tab').on('click', function() {
            $('.ar-tab').removeClass('active');
            $(this).addClass('active');
            updateForm($(this).data('type'));
        });

        $('#arClose, .ar-modal-close').on('click', function() {
            $('#arHelperModal').hide();
        });

        $('#arCopy').on('click', function() {
            const text = $('#arResult').val();
            if (text) {
                GM_setClipboard(text);
                alert('Текст скопирован в буфер обмена!');
            } else {
                alert('Сначала сгенерируйте ответ!');
            }
        });

        $('#arGenerate').on('click', generateResponse);
    }

    // Обновление формы в зависимости от типа жалобы
    function updateForm(type) {
        let formHTML = '';

        if (type === 'admin') {
            formHTML = `
                <div class="ar-form-group">
                    <label class="ar-form-label">Пункт правил:</label>
                    <input type="text" class="ar-form-input" id="arRule" placeholder="Например: П.1.1 Правил игрового процесса" required>
                </div>
                <div class="ar-form-group">
                    <label class="ar-form-label">Доказательства:</label>
                    <input type="text" class="ar-form-input" id="arEvidence" placeholder="Видео, скриншоты и т.д." required>
                </div>
                <div class="ar-form-group">
                    <label class="ar-form-label">Объяснение (если требуется):</label>
                    <textarea class="ar-form-textarea" id="arExplanation" placeholder="Дополнительные пояснения"></textarea>
                </div>
            `;
        } else {
            formHTML = `
                <div class="ar-form-group">
                    <label class="ar-form-label">Результат рассмотрения:</label>
                    <select class="ar-form-select" id="arResultType">
                        <option value="approve">Одобрить</option>
                        <option value="deny">Отказать</option>
                    </select>
                </div>
                <div id="arDynamicFields">
                    <div class="ar-form-group">
                        <label class="ar-form-label">Пункт правил:</label>
                        <input type="text" class="ar-form-input" id="arRule" placeholder="Например: П.1.1 Правил игрового процесса" required>
                    </div>
                </div>
            `;

            // Обработчик изменения типа результата
            $('#arResultType').off('change').on('change', function() {
                const resultType = $(this).val();
                let dynamicFields = '';

                if (resultType === 'approve') {
                    dynamicFields = `
                        <div class="ar-form-group">
                            <label class="ar-form-label">Пункт правил:</label>
                            <input type="text" class="ar-form-input" id="arRule" placeholder="Например: П.1.1 Правил игрового процесса" required>
                        </div>
                    `;
                } else {
                    dynamicFields = `
                        <div class="ar-form-group">
                            <label class="ar-form-label">Причина отказа:</label>
                            <textarea class="ar-form-textarea" id="arReason" required placeholder="Укажите причину отказа жалобы"></textarea>
                        </div>
                    `;
                }

                $('#arDynamicFields').html(dynamicFields);
            });
        }

        $('#arFormContent').html(formHTML);
    }

    // Генерация ответа
    function generateResponse() {
        const activeTab = $('.ar-tab.active');
        const complaintType = activeTab.data('type');
        let response = '';

        if (complaintType === 'admin') {
            const rule = $('#arRule').val();
            const evidence = $('#arEvidence').val();

            if (!rule || !evidence) {
                alert('Пожалуйста, заполните обязательные поля!');
                return;
            }

            response = templates.admin.default
                .replace('{rule}', rule.trim())
                .replace('{evidence}', evidence.trim())
                .replace('{explanation}', $('#arExplanation').val().trim() || ' ');
        } else {
            const resultType = $('#arResultType').val();
            const template = templates[complaintType][resultType];

            if (resultType === 'approve') {
                const rule = $('#arRule').val();
                if (!rule) {
                    alert('Пожалуйста, укажите пункт правил!');
                    return;
                }
                response = template.replace('{rule}', rule.trim());
            } else {
                const reason = $('#arReason').val();
                if (!reason) {
                    alert('Пожалуйста, укажите причину отказа!');
                    return;
                }
                response = template.replace('{reason}', reason.trim());
            }
        }

        $('#arResult').val(response);
    }

    // Добавляем кнопку на страницу
    function addHelperButton() {
        // Проверяем, есть ли уже кнопка
        if ($('#arHelperButton').length) return;

        // Ищем кнопку "Ответить" на странице
        const replyBtn = $('a[href*="reply"]').first();
        if (replyBtn.length) {
            // Создаем контейнер для нашей кнопки
            const container = $('<div class="ar-helper-container"></div>').insertAfter(replyBtn);
            
            // Добавляем кнопку
            container.html(`
                <button id="arHelperButton" class="ar-helper-btn">
                    <i class="fas fa-robot"></i> Генератор ответов
                </button>
            `);

            // Обработчик клика
            $('#arHelperButton').on('click', function() {
                $('#arHelperModal').show();
            });
        }
    }

    // Инициализация скрипта
    $(document).ready(function() {
        // Создаем модальное окно
        createModal();

        // Добавляем кнопку
        addHelperButton();

        // Наблюдатель за изменениями DOM (если страница грузится динамически)
        const observer = new MutationObserver(function(mutations) {
            addHelperButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})(jQuery);