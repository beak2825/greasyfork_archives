// ==UserScript==
// @name         Popmundo Scheduler ( In Development )
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adiciona um calendário com eventos salvos usando GM_setValue e GM_getValue
// @author       Você
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @license      MIT
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @downloadURL https://update.greasyfork.org/scripts/512534/Popmundo%20Scheduler%20%28%20In%20Development%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512534/Popmundo%20Scheduler%20%28%20In%20Development%20%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
 // Função para verificar eventos do dia atual e adicionar notificações
    function checkTodayEvents() {
        let today = new Date();
        let todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`; // Formata a chave da data

        let events = getEventsForDay(todayKey);

        if (events.length > 0) {
            events.forEach(event => {
                let notification = `<div class="notification-real notification-normal">Atenção! Evento de hoje : ${event.description}</div>`;
                $('#notifications').append(notification); // Adiciona a notificação à div de ID "notifications"
            });
        }
    }
  // Função para gerar um UID único
function generateUID() {
    return Math.random().toString(36).substr(2, 9); // Gera um UID aleatório com 9 caracteres
}

  checkTodayEvents();
    // Salvar ou recuperar eventos do localStorage (via GM_setValue e GM_getValue)
    function getEventsForDay(dateKey) {
        let events = GM_getValue(dateKey, []);
        return Array.isArray(events) ? events : [];  // Garante que 'events' seja sempre um array
    }

    function saveEventForDay(dateKey, eventDescription, uid) {
        let events = getEventsForDay(dateKey);
        if (events.length < 4) {
            events.push({ description: eventDescription, uid: uid });
            GM_setValue(dateKey, events);
        }
    }

    function deleteEventForDay(dateKey, eventIndex) {
        let events = getEventsForDay(dateKey);
        events.splice(eventIndex, 1);
        GM_setValue(dateKey, events);
    }

    function deleteSeries(uid) {
        let allKeys = GM_listValues();
        allKeys.forEach(key => {
            let events = getEventsForDay(key);
            if (Array.isArray(events)) {
                events = events.filter(event => event.uid !== uid); // Filtra apenas eventos com UIDs diferentes
                GM_setValue(key, events);
            }
        });
    }

    // Função para gerar o HTML do calendário com divs e grid
    function generateCalendar(year, month) {
        let daysInMonth = new Date(year, month + 1, 0).getDate();
        let firstDay = new Date(year, month, 1).getDay();
        let $calendar = $('<div class="calendar-grid"></div>');

        // Adicionar os dias da semana
        let daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            $calendar.append(`<div class="calendar-header">${day}</div>`);
        });

        // Adicionar dias em branco até o primeiro dia da semana
        for (let i = 0; i < firstDay; i++) {
            $calendar.append('<div class="calendar-day empty"></div>');
        }

        // Adicionar os dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
            let dateKey = `${year}-${month + 1}-${day}`;
            let events = getEventsForDay(dateKey);
            let eventsHtml = events.map((e, index) => `
                <div class="event-tag">
                    ${e.description}
                    <button class="delete-event" data-date="${dateKey}" data-index="${index}" data-uid="${e.uid}" title="Remover evento">🗑️</button>
                </div>`).join('');
            let $dayDiv = $(`<div class="calendar-day" data-date="${dateKey}">${day}<div class="events">${eventsHtml}</div></div>`);

            $calendar.append($dayDiv);
        }

        return $calendar.prop('outerHTML');
    }

    // Função para abrir o popup para adicionar evento
    function openEventPopup(dateKey, $dayDiv) {
        Swal.fire({
            title: 'Adicionar Evento',
            html: `
                <input type="text" id="eventDescription" class="swal2-input" placeholder="Descrição do evento">
                <label>Recorrente?</label>
                <input type="checkbox" id="isRecurring" class="swal2-checkbox">
                <div id="recurringOptions" style="display:none;">
                    <label>A cada quantos dias?</label>
                    <input type="number" id="recurringInterval" class="swal2-input" min="1">
                    <label>Data de término</label>
                    <input type="date" id="endDate" class="swal2-input">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Agendar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                let eventDescription = $('#eventDescription').val();
                let isRecurring = $('#isRecurring').is(':checked');
                let recurringInterval = $('#recurringInterval').val();
                let endDate = $('#endDate').val();
                if (eventDescription) {
                    return { eventDescription, isRecurring, recurringInterval, endDate };
                } else {
                    Swal.showValidationMessage('Por favor, insira uma descrição para o evento.');
                    return false;
                }
            }
        }).then(result => {
            if (result.isConfirmed) {
                let { eventDescription, isRecurring, recurringInterval, endDate } = result.value;
                let uid = generateUID();

                if (isRecurring && recurringInterval > 0 && endDate) {
                    scheduleRecurringEvents(dateKey, eventDescription, recurringInterval, endDate, uid);
                } else {
                    saveEventForDay(dateKey, eventDescription, uid);
                }

                updateDayWithEvent(dateKey, $dayDiv); // Atualizar o dia com o evento
            }
        });

        $('#isRecurring').on('change', function() {
            if ($(this).is(':checked')) {
                $('#recurringOptions').show();
            } else {
                $('#recurringOptions').hide();
            }
        });
    }

    // Função para agendar eventos recorrentes até a data de término
    function scheduleRecurringEvents(startDateKey, eventDescription, interval, endDate, uid) {
        let [year, month, day] = startDateKey.split('-').map(Number);
        let currentDate = new Date(year, month - 1, day);
        let endRecurringDate = new Date(endDate);

        while (currentDate <= endRecurringDate) {
            let dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
            saveEventForDay(dateKey, eventDescription, uid);

            // Adicionar o intervalo de dias
            currentDate.setDate(currentDate.getDate() + parseInt(interval));
        }
    }

    // Função para atualizar o dia com novos eventos
    function updateDayWithEvent(dateKey, $dayDiv) {
        let events = getEventsForDay(dateKey);
        let eventsHtml = events.map((e, index) => `
            <div class="event-tag">
                ${e.description}
                <button class="delete-event" data-date="${dateKey}" data-index="${index}" data-uid="${e.uid}" title="Remover evento">🗑️</button>
            </div>`).join('');
        $dayDiv.find('.events').html(eventsHtml); // Atualizar a lista de eventos no dia
        attachDeleteEventHandlers(); // Reanexar os eventos de clique da lixeira
    }

    // Função para remover eventos com confirmação
    function attachDeleteEventHandlers() {
        $('.delete-event').on('click', function() {
            let dateKey = $(this).data('date');
            let eventIndex = $(this).data('index');
            let uid = $(this).data('uid');

            Swal.fire({
                title: 'Remover Evento?',
                text: "Você quer remover apenas este evento ou a série inteira?",
                icon: 'warning',
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonText: 'Remover único',
                denyButtonText: 'Remover série inteira',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteEventForDay(dateKey, eventIndex);
                    updateDayWithEvent(dateKey, $(`.calendar-day[data-date="${dateKey}"]`)); // Atualizar o dia após remoção
                } else if (result.isDenied) {
                    deleteSeries(uid); // Remover toda a série de eventos
                    showCalendar(); // Recarregar o calendário
                }
            });
        });
    }

    // Função para abrir o SweetAlert com o calendário
    function showCalendar() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();

        function updateCalendar(newYear, newMonth) {
            $('#calendarTitle').text(new Date(newYear, newMonth).toLocaleString('default', { month: 'long', year: 'numeric' }));
            $('#calendarContainer').html(generateCalendar(newYear, newMonth));
            attachEventHandlers(newYear, newMonth); // Reanexar os eventos de clique após renderizar
            attachDeleteEventHandlers(); // Reanexar os eventos de deletar
        }

        Swal.fire({
            title: 'Scheduler',
            html: `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <button id="prevMonth">&lt;</button>
                    <span id="calendarTitle">${date.toLocaleString('default', { month: 'long' })} ${year}</span>
                    <button id="nextMonth">&gt;</button>
                </div>
                <div id="calendarContainer">${generateCalendar(year, month)}</div>
            `,
            heightAuto: true,
            customClass: {
                popup: 'custom-height-popup'
            },
            showConfirmButton: false,
            didOpen: function() {
                attachEventHandlers(year, month); // Inicializa os eventos ao abrir o calendário
                attachDeleteEventHandlers(); // Inicializar os eventos de deletar

                // Navegação entre meses
                $('#prevMonth').on('click', function() {
                    month = (month === 0) ? 11 : month - 1;
                    year = (month === 11) ? year - 1 : year;
                    updateCalendar(year, month);
                });

                $('#nextMonth').on('click', function() {
                    month = (month === 11) ? 0 : month + 1;
                    year = (month === 0) ? year + 1 : year;
                    updateCalendar(year, month);
                });
            }
        });
    }

    // Função para reanexar os eventos de clique após o calendário ser renderizado
    function attachEventHandlers(year, month) {
        $('.calendar-day').on('dblclick', function() {
            let dateKey = $(this).data('date');
            openEventPopup(dateKey, $(this));
        });
    }

    // Adicionar o botão "Scheduler" ao menu
    let careerMenu = $('div.menu ul').eq(1);
    if (careerMenu.length) {
        let newMenuItem = $('<li><a href="#">Scheduler</a></li>');
        careerMenu.prepend(newMenuItem);

        newMenuItem.on('click', function(e) {
            e.preventDefault();
            showCalendar();
        });
    }

    // Estilos para o calendário e a janela SweetAlert
    let calendarStyle = `
        <style>
            .calendar-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 5px;
                margin-top: 10px;
            }
            .calendar-header, .calendar-day {
                padding: 15px;
                text-align: center;
                border: 1px solid #ddd;
                min-height: 60px; /* Aumenta o tamanho das células para caberem 4 eventos */
                position: relative;
            }
            .calendar-header {
                background-color: #f2f2f2;
                font-weight: bold;
            }
            .calendar-day {
                background-color: #fff;
                cursor: pointer;
            }
            .calendar-day:hover {
                background-color: #007bff;
                color: white;
            }
            .calendar-day.empty {
                background-color: transparent;
                border: none;
            }
            .events {
                display: flex;
                flex-direction: column;
                gap: 3px;
                margin-top: 5px;
            }
            .event-tag {
                background-color: #28a745;
                color: white;
                padding: 3px;
                border-radius: 3px;
                font-size: 12px;
                text-align: center;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .delete-event {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: 10px;
            }
            #prevMonth, #nextMonth {
                background-color: #007bff;
                color: white;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
            }
            #prevMonth:hover, #nextMonth:hover {
                background-color: #0056b3;
            }
            .custom-height-popup {
                height: 800px;
                width:850px;
            }
        </style>
    `;
    $('head').append(calendarStyle); // Injetar o CSS no documento
})();

