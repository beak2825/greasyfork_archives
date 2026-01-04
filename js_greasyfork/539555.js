// ==UserScript==
// @name         Скрипт для Руководства Сервера by I. Forest.
// @namespace    https://forum.blackrussia.online
// @version      2.0.2
// @description  Специально для BlackRussia || by I.Forest.
// @author       I.Forest
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      none
// @copyright    2024,
// @downloadURL
// @updateURL
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/539555/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20by%20I%20Forest.user.js
// @updateURL https://update.greasyfork.org/scripts/539555/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20by%20I%20Forest.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const DECLINED_PREFIX = 4;
    const APPROVED_PREFIX = 8;
    const WAIT_PREFIX = 2;
    const TECH_PREFIX = 13;
    const WATCHED_PREFIX = 9;
    const CLOSED_PREFIX = 7;
    const HA_PREFIX = 12;

    const START_COLOR_1 = `<font color=#00FFFF>`
    const START_COLOR_2 = `<font color=#F0FFFF>`
    const START_COLOR_3 = `<font color=#00FF00>`
    const START_COLOR_4 = `<font color=#FF0000>`
    const START_COLOR_5 = `<font color=#FF00FF>`
    const END_COLOR = `</font>`

    const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Times New Roman';font-size: 14px">`
    const END_DECOR = `</span></div>`

  const buttons = [
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Рассмотрение жалоб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
         title: 'Приветствие',
         content:
         `${START_DECOR}<img src="https://i.postimg.cc/mrhcH5vR/1621526767066.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
         `${START_COLOR_2}*Ваш текст*${END_COLOR}<br><br>` +
         `${START_COLOR_1}На рассмотрении${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          open: true,
          move: 0,
      },
      {
        title: 'Жалобу на рассмотрение',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/FRb3z3Xw/RLwzo.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба взята${END_COLOR} ${START_COLOR_1}на рассмотрение${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
          `${START_DECOR}<img src="https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,
      },
      {
        title: 'У администратора было запрошено опровержение(remastered)',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/FRb3z3Xw/RLwzo.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба взята${END_COLOR} ${START_COLOR_1}на рассмотрение${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
          `${START_DECOR}<img src="https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png"><br>` +
          `${START_COLOR_1}Ожидайте ответа${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобрение жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
         title: 'Будет проведена беседа с админом',
         content:
          `${START_DECOR}<img src="https://i.postimg.cc/FRb3z3Xw/RLwzo.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба${END_COLOR} ${START_COLOR_3}одобрена${END_COLOR} и будет проведена беседа с администратором${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_5}Наказание будет снято в течении часа.${END_COLOR}<br><br>` +
          `${START_DECOR}<img src="https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png"><br>` +
          `${START_COLOR_3}Одобрена${END_COLOR}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,
        },
      {
    title: 'Будет проведена работа с админом',
         content:
          `${START_DECOR}<img src="https://i.postimg.cc/FRb3z3Xw/RLwzo.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ваша жалоба${END_COLOR} ${START_COLOR_3}одобрена${END_COLOR} и будет проведена работа с администратором${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_5}Наказание будет снято в течении часа.${END_COLOR}<br><br>` +
          `${START_DECOR}<img src="https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png"><br>` +
          `${START_COLOR_3}Одобрена${END_COLOR}.${END_COLOR}${END_DECOR}`,
          prefix: WAIT_PREFIX,
          status: true,
          move: 0,

        },
      {
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
      },
      {
         title: 'Ответ в прошлой теме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/FRb3z3Xw/RLwzo.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ответ Вам был дан в одной из${END_COLOR} ${START_COLOR_1}предыдущих жалоб${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="img src="https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
        title: 'Отстутсвуют доказательства о нарушении администратора',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/FRb3z3Xw/RLwzo.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}В вашей жалобе отсутствуют доказательства${END_COLOR} ${START_COLOR_1}о нарушении администратора${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="img src="https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png"><br>` +
          `${START_COLOR_5} Закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
          title: 'Дубликат темы',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/FRb3z3Xw/RLwzo.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Вам уже был дан конкретный ответ в одной из${END_COLOR} ${START_COLOR_1}предыдущих жалоб${END_COLOR}${START_COLOR_2}. За создание дубликатов этой темы Ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="img src="https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
        title: 'Ответ в прошлой теме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/FRb3z3Xw/RLwzo.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ответ Вам был дан в одной из${END_COLOR} ${START_COLOR_1}предыдущих жалоб${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="img src="https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
      },
      {
        title: 'Ответ в прошлой теме',
          content:
          `${START_DECOR}<img src="https://i.postimg.cc/FRb3z3Xw/RLwzo.png"><br>` +
         `${START_COLOR_1}{{ greeting }}, уважаемый(-ая) {{ user.mention}}${END_COLOR + START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Ответ Вам был дан в одной из${END_COLOR} ${START_COLOR_1}предыдущих жалоб${END_COLOR}${START_COLOR_2}.${END_COLOR}<br><br>` +
          `${START_COLOR_2}Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.${END_COLOR}<br><br>` +
        `${START_DECOR}<img src="img src="https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png"><br>` +
          `${START_COLOR_1}Отказано, закрыто${END_COLOR}${START_COLOR_2}.${END_COLOR}${END_DECOR}`,
          prefix: DECLINED_PREFIX,
          status: false,
          move: 0,
},
     ];

  const bgButtons = document.querySelector(".pageContent");
  const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.style = "border-radius: 13px; background-color: #FF4500";
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
    window.location.href = href;
  });
  return button;
};

  const Button51 = buttonConfig("Жалобы на Адм", 'https://forum.blackrussia.online/forums/.2414/');
  const Button52 = buttonConfig("Обжаловоание", 'https://forum.blackrussia.online/forums/.2417/');
  const Button53 = buttonConfig("Жалобы на Игроков", 'https://forum.blackrussia.online/forums/.2416/');
  const Button54 = buttonConfig("Админ раздел", 'https://forum.blackrussia.online/forums/Админ-раздел.2390/');
  const Button55 = buttonConfig("ОПС", 'https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/');

  bgButtons.append(Button51);
  bgButtons.append(Button52);
  bgButtons.append(Button53);
  bgButtons.append(Button54);
  bgButtons.append(Button55);

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        addButton('На рассмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FFA500');
        addButton('Тех. специалисту', 'tech', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #0000FF');
        addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #008000');
        addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #FF0000');
        addButton('Меню жалоб', 'selectComplaintAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #9400D3');
        addButton('Меню биографий', 'selectBiographyAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #E9967A')
        addButton('Меню ситуаций', 'selectSituationsAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #7FFFD4');
        addButton('Меню организаций', 'selectOrganizationsAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid; background-color: #000000; border-color: #7B68EE');

        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(0, WAIT_PREFIX, true));
        $('button#tech').click(() => editThreadData(0, TECH_PREFIX, true));
        $('button#accepted').click(() => editThreadData(0, APPROVED_PREFIX, false));
        $('button#watch').click(() => editThreadData(0, WATCHED_PREFIX, false));
        $('button#close').click(() => editThreadData(0, CLOSED_PREFIX, false));
        $('button#unaccept').click(() => editThreadData(0, DECLINED_PREFIX, false));

        $(`button#selectComplaintAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if (id >= 1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
        $(`button#selectBiographyAnswer`).click(() => {
            XF.alert(buttonsMarkup(biography), null, 'Выберите ответ:');
            biography.forEach((btn, id) => {
                if (id >= 1) {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, false));
                }
            });
        });
        $(`button#selectSituationsAnswer`).click(() => {
            XF.alert(buttonsMarkup(situations), null, 'Выберите ответ:');
            situations.forEach((btn, id) => {
                if (id >= 1) {
                    $(`button#answers-${id}`).click(() => pasteContent3(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent3(id, threadData, false));
                }
            });
        })
        $(`button#selectOrganizationsAnswer`).click(() => {
            XF.alert(buttonsMarkup(organizations), null, 'Выберите ответ:');
            organizations.forEach((btn, id) => {
                if (id >= 1) {
                    $(`button#answers-${id}`).click(() => pasteContent4(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent4(id, threadData, false));
                }
            });
        })
        $(`button#selectMoveTask`).click(() => {
            XF.alert(tasksMarkup(tasks), null, 'Выберите действие:');
            tasks.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => moveThread(tasks[id].prefix, tasks[id].move));
            });
        });
    });

    function addButton(name, id, hex="grey") {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 13px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }

    function tasksMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; border-radius: 13px; margin-right: 5px; border: 1px solid; border-color: #E6E6FA; background-color: ${btn.color || "#000000"}"><span class="button-text">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send == true) {
            editThreadData(buttons[id].move, buttons[id].prefix, buttons[id].status, buttons[id].open);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function pasteContent2(id, data = {}, send = false) {
        const template = Handlebars.compile(biography[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send == true) {
            editThreadData(biography[id].move, biography[id].prefix, biography[id].status);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function pasteContent3(id, data = {}, send = false) {
        const template = Handlebars.compile(situations[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send == true) {
            editThreadData(situations[id].move, situations[id].prefix, situations[id].status, situations[id].open);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function pasteContent4(id, data = {}, send = false) {
        const template = Handlebars.compile(organizations[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send == true) {
            editThreadData(organizations[id].move, organizations[id].prefix, organizations[id].status, organizations[id].open);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
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