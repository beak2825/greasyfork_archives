// ==UserScript==
// @name         Жалобы на Администрацию | BELGOROD 🗽
// @namespace    https://forum.blackrussia.online 
// @version      0.4
// @description  для Руководства сервера BELGOROD 🗽
// @author       Medrodore
// @match        http://forum.blackrussia.online/index.php?threads/*
// @include      http://forum.blackrussia.online/index.php?threads/
// @icon       https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479659/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E%20%7C%20BELGOROD%20%F0%9F%97%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/479659/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E%20%7C%20BELGOROD%20%F0%9F%97%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const UNACCEPT_PREFIX =4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7 // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному Администратору"
    const buttons = [
        {
            title: '---------------Жалобы на Администрацию---------------'
        },
        {
            title: 'Приветствие',
            content:
            "[CENTER] [FONT=Courier New] Доброго времени суток, уважаемый игрок. [/FONT] [/CENTER] <br><br>"+
            "[CENTER] [FONT=Courier New] текст [/FONT] [/CENTER]",
        },
        {
            title: 'На рассмотрение',
            content:
            "[CENTER] [FONT=Courier New] [FONT=Courier New] Доброго времени суток, уважаемый игрок. <br><br>"+
            "Запросил доказательства у администратора. <br>"+
            "Просьба не создавать копии данной темы. <br>"+
            '[COLOR=orange] На рассмотрении. [/COLOR] [/FONT] [/CENTER]',
            prefix: PIN_PREFIX,
            status: True,
        },
        {
            title: 'Не по форме',
            content:
            "[CENTER] [FONT=Courier New] Доброго времени суток, уважаемый игрок.<br><br>"+
            "Ваша жалоба составлена не по форме, ознакомьтесь с правилами подачи жалоб: [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/]*жмяк*[/URL] <br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто. [/FONT] [/CENTER] ',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не является адм',
            content:
            "[CENTER] [FONT=Courier New] Доброго времени суток, уважаемый игрок. <br>"+
            "Данный игрок не является Администратором. <br>"+
            '[COLOR=RED] Закрыто. [/COLOR] [/FONT] [/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Беседа с адм',
            content:
            "[CENTER] [FONT=Courier New] Доброго времени суток, уважаемый игрок. <br>"+
            "С Администратором будет проведена беседа, просим прощения за доставленные неудобства. <br>"+
            '[COLOR=Green] Одобрено [/COLOR] [/FONT] [/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'передать Кемрану',
            content:
            "[CENTER] [FONT=Courier New] Доброго времени суток, уважаемый игрок. <br>"+
            "Ваша жалоба передана Главному Администратору [URL=https://forum.blackrussia.online/members/kemran_ahmedovich%F0%9F%91%91.190244/'] @Kemran_Ahmedovich [/URL] <br>"+
            '[COLOR=White] Ожидайте ответа. [/COLOR] [/FONT] [/CENTER] ',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Передать ЗГА',
            content:
            "[CENTER] [FONT=Courier New] Доброго времени суток, уважаемый игрок. <br>"+
            "Ваша жалоба передана Заместителю Главного Администратора. <br>"+
            '[COLOR=White] Ожидайте ответа [/COLOR] [/FONT] [/CENTER] ',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Наказание верное',
            content:
            "[CENTER] [FONT=Courier New] Доброго времени суток, уважаемый игрок. <br>"+
            "Проверив доказательства администратора, было принято решение, что наказание выдано верно. <br>"+
            '[COLOR=RED] Закрыто [/COLOR] [/FONT] [/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: '---------------Перенаправление---------------'
        },
        {
         title: 'обжалование',
         content:
         "[CENTER] [FONT=Courier New] Доброго времени суток, уважаемый игрок. <br>"+
            "Если вы согласны с наказанием, напишите в раздел Обжалований [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/'] *жмяк*[/URL] <br>"+
            '[COLOR=RED] Закрыто [/COLOR] [/FONT] [/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'на игроков',
            content:
            "[CENTER] [FONT=Courier New] Доброго времени суток, уважаемый игрок. <br>"+
            "Обратитесь в раздел Жалоб на игроков. <br>"+
            '[COLOR=RED] Закрыто [/COLOR] [/FONT] [/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        }
     ];

 $(document).ready(() => {
     // Загрузка скрипта для обработки шаблонов
     addButton('Меню', 'selectAnswer');
     addButton('Одобрить', 'accepted') ;
     addButton('Отказать', 'unaccept') ;
     addButton('На рассмотрение', 'pin') ;
     addButton('Рассмотрено', 'watched') ;
     addButton('Закрыть', 'closed') ;
     addButton('КП', 'teamProject') ;
     addButton('Спецу', 'specialAdmin') ;
     addButton('ГА', 'mainAdmin') ;


     // Поиск информации о теме
     const threadData = getThreadData() ;
     $('button#pin'). cklick(() =>editThreadData(PIN_PREFIX, true)) ;
     $('button#accepted'). cklick(() =>editThreadData(ACCEPT_PREFIX, false)) ;
     $('button#teamProject'). cklick(() =>editThreadData(COMMAND_PREFIX, true)) ;
     $('button#watched'). cklick (() =>editThreadData(WACHED_PREFIX, false)) ;
     $('button#unaccept'). cklick(() =>editThreadData(UNACCEPT_PREFIX, false)) ;
     $('button#mainAdmin'). cklick(() =>editThreadData (GA_PREFIX, true)) ;

     $('button#specialAdmin'). cklick(() =>editThreadData (SPECIAL_PREFIX, true)) ;

     $('button#unaccept'). click(() =>editThreadData (UNACCEPT_PREFIX, false)) ;

     $('button#selectAnswer'). click(() =>{
         XF. alert(buttonsMarkup(buttons), null, 'Выберите ответ:') ;
         buttons.forEach((btn,id)=> {
             if(id>1){
                 $(`button#answers-${id}`). click(() =>pasteContent(ID, threadData, true)) ;
             } else {
                 $(`button#answers-${id} `). click(() =>pasteContent(ID, threadData, false)) ;
             }
         }) ;
     }) ;
 }) ;
    function addButton(name, id) {
       $('.button--icon--reply').before(
           `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius:30px; margin-right:7px;">${name}</button>`,
      ) ;
    }

    function buttonsMarkup(button) {
        return `<div class="select_answer" >${buttons
        .map(
            (btn,i)=>
            `<button id="answers-${i} class=" button--primary button`+
            `rippleButton " style=" margin:5px"><span class="button-TEST" >${btn, title}</span></button>`,
            )
            .join('')} </div>`;
    }

  function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if(send == true){
            editThreadData(buttons[id].prefix, buttons[id].status);
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

    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

        if(pin == false){
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
        }
        if(pin == true){
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
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