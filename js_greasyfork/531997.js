// ==UserScript==
// @name         46-50 | Перемещение тем
// @namespace    https://forum.blackrussia.online
// @version      1.0.12
// @description  -
// @author       Johnathan Kingsman
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license    none
// @copyright 2025,
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/531997/46-50%20%7C%20%D0%9F%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%82%D0%B5%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/531997/46-50%20%7C%20%D0%9F%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%82%D0%B5%D0%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const PIN_PREFIX = 2 // На рассмотрение
    const EXPECTATION_PREFIX = 14 // Ожидание
    const CLOSE_PREFIX = 7 // Закрыто
    
 
  const tasks = [
      {
          title: '======================================> Технический раздел <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'В технический раздел (46)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2052,
      },
      {
          title: 'В технических раздел (47)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2094,
      },
      {   
          title: 'В технический раздел (48)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2136,
      },
      {
          title: 'В технический раздел (49)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2178,
      },
      {
          title: 'В технический раздел (50)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2220,
      },
      {
          title: '======================================> Жалобы на тех. спецов <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'В жалобы на тех. спецов (46)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2051,
      },
      {
          title: 'В жалобы на тех. спецов (47)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2093,
      },
      {
          title: 'В жалобы на тех. спецов (48)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2135,
      },
      {
          title: 'В жалобы на тех. спецов (49)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2177,
      },
      {
          title: 'В жалобы на тех. спецов (50)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2219,
      },
      {
          title: '======================================> Жалобы на администрацию <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'В жалобы на администрацию (46)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2078,
      },
      {
          title: 'В жалобы на администрацию (47)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2120,
      },
      {
          title: 'В жалобы на администрацию (48)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2162,
      },
      {
          title: 'В жалобы на администрацию (49)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2204,
      },
      {
          title: 'В жалобы на администрацию (50)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2246,
      },
      {
          title: '======================================> Жалобы на лидеров <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'В жалобы на лидеров (46)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2079,
      },
      {
          title: 'В жалобы на лидеров (47)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2121,
      },
      {
          title: 'В жалобы на лидеров (48)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2163,
      },
      {
          title: 'В жалобы на лидеров (49)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2205,
      },
      {
          title: 'В жалобы на лидеров (50)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2247,
      },
      {
          title: '======================================> Жалобы на игроков <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'В жалобы на игроков (46)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2080,
      },
      {
          title: 'В жалобы на игроков (47)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2122,
      },
      {
          title: 'В жалобы на игроков (48)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2164,
      },
      {
          title: 'В жалобы на игроков (49)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2206,
      },
      {
          title: 'В жалобы на игроков (50)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2248,
      },
      {
          title: '======================================> Обжалование наказаний <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'В обжалования  наказаний (46)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2081,
      },
      {
          title: 'В обжалования  наказаний (47)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2123,
      },
      {
          title: 'В обжалования  наказаний (48)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2165,
      },
      {
          title: 'В обжалования  наказаний (49)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2207,
      },
      {
          title: 'В обжалования  наказаний (50)',
          prefix: EXPECTATION_PREFIX,
          status: false,
          open: false,
          move: 2249,
      },
      {
          title: '======================================> Прочее <======================================',
          color: 'border-radius: px; margin-right: 5px; border: 1px solid; background-color: #8A2BE2; border-color: #E6E6FA',
      },
      {
          title: 'В заявки с окончательным ответом',
          prefix: CLOSE_PREFIX,
          status: false,
          open: false,
          move: 230,
      }
    ]
  
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        addMoveTasks()
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $(`button#selectMoveTasks`).click(() => {
            XF.alert(tasksMarkup(tasks), null, 'Выберите действие:');
            tasks.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => moveThread(tasks[id].prefix, tasks[id].move));
            });
        });
    });
    
    function addMoveTasks() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectMoveTasks" style="oswald: 3px; margin-left: 5px; margin-top: 1px; border-radius: 13px; background-color: #FF4500; border-color: #E6E6FA">Перемещение</button>`,
        );
    }
    
    function buttonsMarkup(tasks) {
        return `<div class="select_answer">${tasks
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }
 
    function tasksMarkup(tasks) {
        return `<div class="select_answer">${tasks
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }
 
    function getThreadData() {
        const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
        const authorName = $('a.username').html();
        const hours = new Date().getHours();
        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: () =>
            4 < hours && hours <= 11
            ? 'Доброе утро'
            : 11 < hours && hours <= 15
            ? 'Добрый день'
            : 15 < hours && hours <= 21
            ? 'Добрый вечер'
            : 'Доброй ночи',
        };
    }
 
    function editThreadData(move, prefix, pin = false, open = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        } else if(pin == true && open){
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    discussion_open: 1,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        } else {
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json'
                }),
            }).then(() => location.reload());
        }
        if (move > 0) {
            moveThread(prefix, move);
        }
    }
 
    function moveThread(prefix, type) {
        // Функция перемещения тем
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
        fetch(`${document.URL}move`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                target_node_id: type,
                redirect_type: 'none',
                notify_watchers: 1,
                starter_alert: 1,
                starter_alert_reason: "",
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }
 
    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();