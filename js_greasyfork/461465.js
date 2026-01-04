// ==UserScript==
// @name         Quick Answers for Xenforo Forum
// @namespace    http://tampermonkey-script-example
// @version      1
// @description  Add buttons for quick answers in a Xenforo forum organized into categories and subcategories
// @author       Your Name
// @match       *://*.forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461465/Quick%20Answers%20for%20Xenforo%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/461465/Quick%20Answers%20for%20Xenforo%20Forum.meta.js
// ==/UserScript==

(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
  const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const PIN_PREFIX = 2; // Prefix that will be set when thread pins
  const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
  const WATCHED_PREFIX = 9;
  const CLOSE_PREFIX = 7;
  const SPECADM_PREFIX = 11;
  const DECIDED_PREFIX = 6;
  const MAINADM_PREFIX = 12;
  const TECHADM_PREFIX = 13;
  const CHECKED_PREFIX = 9
    const data = await getThreadData(),
          greeting = data.greeting,
          user = data.user;


    // Create the buttons for each subcategory
    function createButtons(subcategory, answers) {
        const buttons = [];
        answers.forEach((answer, id) => {
            const buttonTitle = `${subcategory}-${id}`;
            const buttonMarkup = `<button id="${buttonTitle}">${answer.title}</button>`;
            buttons.push(buttonMarkup);
            // When button is clicked, paste the answer content
            $(`button#${buttonTitle}`).click(() => {
                XF.alert(answer.content, null, 'Выберите ответ:');
                pasteContent(answer.content, threadData);
            });
        });
        return buttons.join(' ');
    }

    // Paste the selected answer content into the forum post
    function pasteContent(content, threadData) {
        // Replace with your own code to paste the content into the forum post
        console.log(`Selected answer: ${content}`);
    }

    // Define the categories, subcategories, and answers
    const categories = [
        {
            name: 'Report',
            subcategories: [
                {
                    name: 'Opening',
                    answers: [
                        {
                            title: 'Hi',
                            content: '[SIZE=4][FONT=verdana][SIZE=4]Здравствуйте.<br><br>[color=lightgreen] Рассмотрено.[/color][/FONT] [/SIZE]'
                        },
                        {
                            title: 'Hello',
                            content: '[SIZE=4][FONT=verdana][SIZE=4]Привет.<br><br>[color=lightgreen] Рассмотрено.[/color][/FONT] [/SIZE]'
                        }
                    ]
                }
            ]
        },
        {
            name: 'Amnesia',
            subcategories: [
                {
                    name: 'Opening',
                    answers: [
                        {
                            title: 'Bye',
                            content: '[SIZE=4][FONT=verdana][SIZE=4]До свидания.<br><br>[color=lightgreen] Рассмотрено.[/color][/FONT] [/SIZE]'
                        },
                        {
                            title: 'Goodbye',
                            content: '[SIZE=4][FONT=verdana][SIZE=4]Прощай.<br><br>[color=lightgreen] Рассмотрено.[/color][/FONT] [/SIZE]'
                        }
                    ]
                }
            ]
        }
    ];


    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`Ans`, `selectAnswer`);
        addButton(`Pin`, `pin`);
        addButton(`Approved`, `accepted`);
        addButton(`КП`, `teamProject`);
        addButton(`Close`, `closed`);
        addButton (`Spec.A`, `specialAdmin`);
        addButton (`Checked`, `checked`)




        // Поиск информации о теме
        const threadData = getThreadData();

       $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
$(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
$(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
$(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
$(`button#specadm`).click(() => editThreadData(SPECADM_PREFIX, true));
$(`button#mainadm`).click(() => editThreadData(MAINADM_PREFIX, true));
$(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
$(`button#decided`).click(() => editThreadData(DECIDED_PREFIX, false));
$(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
$(`button#techspec`).click(() => editThreadData(TECHADM_PREFIX, true));
        $(`button#specialAdmin`).click(() => editThreadData(SPECADM_PREFIX, true));
        $(`button#checked`).click(() => editThreadData(CHECKED_PREFIX, false));
        $(`button#statusTheme`).click(() => {
            const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;

            let status = threadData.theme_status
            if ( status == false) status = 1
            else status = 0

            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    title: threadTitle,
                    discussion_open: status,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        });

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Select an answer:`);
            buttons.forEach((btn, id) => {
                if (id >1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $(`.button--icon--reply`).before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {

        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
        )
            .join(``)}</div>`;
    }





    $('#input').focus(function() {
        $(this).setCursorPosition(4);
      });

    async function getThreadData() {
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = $(`a.username`).html();
        const theme_status = $(`a.discussion_open`).html();
        const hours = new Date().getHours();
        const greeting = 4 < hours && hours <= 11
        ? `Доброе утро`
    : 11 < hours && hours <= 15
    ? `Добрый день`
       : 15 < hours && hours <= 21
    ? `Добрый вечер`
           : `Доброй ночи`

    return {
        user: {
            id: authorID,
            name: authorName,
            mention: `[USER=${authorID}]${authorName}[/USER]`,
        },
        theme_status,
        greeting: greeting
    };
    }

    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;

        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        }
        if (pin == true) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        }
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();
