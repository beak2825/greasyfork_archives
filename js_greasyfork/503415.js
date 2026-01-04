// ==UserScript==
// @name         Omsk обж
// @namespace    https://greasyfork.org/ru/users/1177272-vlad-kolamer
// @version      1.2
// @description  Скрипт для ЗГА По вопросам обратная связь в Вк: https://vk.toppocikgg
// @author       Vladislav_Sokol
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://cdn.icon-icons.com/icons2/2249/PNG/512/script_outline_icon_139224.png
// @grant        Sokol
// @license 	 Sokol
// @downloadURL https://update.greasyfork.org/scripts/503415/Omsk%20%D0%BE%D0%B1%D0%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/503415/Omsk%20%D0%BE%D0%B1%D0%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному Администратору"
    const buttons = [
        {
           title: '---------------------------------------------------------------> Амнистии <---------------------------------------------------------------',
        },
                {
                    title: 'Свой ответ',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE]  <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
            prefix: 123,
            status: 123,
        },
        {
            title: 'Не по форме',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований : [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Нажмите сюда*[/URL]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Обжалованию не подлежит',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Выданное вам наказание не подлежит обжалованию. <br>"+
            "Нарушения, по которым заявка на обжалование не рассматривается: <br>"+
            "[ISPOILER] 4.1. различные формы слива 4.2. продажа игровой валюты 4.3. махинации <br> 4.4. целенаправленный багоюз 4.5. продажа, передача аккаунта 4.6. сокрытие ошибок, багов системы <br> 4.7. использование стороннего программного обеспечения 4.8. распространение конфиденциальной информации 4.9. обман администрации. [/ISPOILER]  <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Отказано',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] В обжаловании отказано <br>"+
            "[ICODE]1.6. Каждая заявка на обжалование рассматривается индивидуально. <br> 1.7. Оформленная заявка на обжалование не означает гарантированного одобрения со стороны руководства сервера, она может быть отклонена без объяснения причин.[/ICODE]  <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'ОБЖ на рассмотрении',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Ваше обжалование было взято на рассмотрение. <br> Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Передано ГА обж',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Обжалование передано Главному Администратору.<br> Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Наказание полностью снято',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] После рассмотрения темы было принято решение о снятии вашего наказания полностью.<br>Наказание будет снято в течении 24 часов. <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
            prefix: ACCEPT_PREFIX,
	        status: true,
        },
        {
            title: 'Наказание сокращено',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] После рассмотрения темы было принято решение о сокращении вашего наказания.<br>Наказание будет заменено в течении 24 часов. <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Руководителю Модераторов',
	        content:
		    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=RED] Ваше обжалование передано на [/COLOR][COLOR=Yellow]рассмотрение[/COLOR][COLOR=BLUE] @sakaro.<br>Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=RED]С уважением Заместитель Главного Администратора .[/COLOR]<br>",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'В другой раздел',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Ваше обращение относится к другому разделу <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: 'Недостаточно док-ев',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Недостаточно доказательств для корректного [/COLOR][COLOR=Yellow]рассмотрения[/COLOR][COLOR=RED] вашего обращения. <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: 'Отсутствуют док-ва',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] В вашем обжаловании отсутствуют доказательства.<br>Следовательно обжалование [/COLOR][COLOR=Yellow]рассмотрению[/COLOR][COLOR=RED] не подлежит. <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: 'Смена NikName',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Ваш аккаунт разблокирован на 24 часа. Чтобы сменить никнейм - /mm - 8 или через /donate <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'NonRP Обман(от обманутой стороны)',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Аккаунт игрока будет разблокирован на 24 часа,за это время игрок должен вернуть обманутое имущество.<br>"+
            "[B][CENTER][COLOR=WHITE] После возращения имущества,оставьте доказательства в этой теме <br>"+
            "[B][CENTER][COLOR=WHITE] Ожидаю ответа в этой теме<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Отсутствует /time',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] В ваших доказательствах отсутствует /time.<br>Следовательно, обжалование [/COLOR][COLOR=Yellow]рассмотрению[/COLOR][COLOR=RED] не подлежит. <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: 'Невозврат ущерба',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] У вас было 24 часа на возмещение ущерба, за это время вы не вернули обманутое имущество,аккаунт будет заблокирован навсегда <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: 'Док-ва в соц. сетях',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Доказательства в социальных сетях (VK,Instagram,FaceBook) не принимаются.<br>Загрузите доказательства на фохостинг (Imgur,Yapix,Youtube). <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: 'Окно бана',
	        content:
		    '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Создайте новое обжалование прикрепив в доказательствах окно блокировки при входе <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT][/COLOR]<br>",
            prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: 'Ошиблись сервером',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE]Вы ошиблись сервером, напишите обжалование на сервере на котором вы получили блокировку <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT] [/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
         },
         {
                    title: 'Запрос ВК',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Прикрепите ссылку на вашу страницу в VK.[/COLOR] <br> [COLOR=#FFA500] На рассмотрении [/COLOR] <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT] [/COLOR]<br>",
        	prefix: PIN_PREFIX,
            status: 178
         },
         {
                    title: 'ссылку на жб',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Прикрепите ссылку на жалобу на данного игрока.[/COLOR] <br> [COLOR=#FFA500] На рассмотрении [/COLOR] <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT] [/COLOR]<br>",
        	prefix: PIN_PREFIX,
            status: 178
         },
          {
                    title: 'На рассмотрении(жб)',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Запросил доказательства у администратора. <br> Ожидайте, ответа от администрации и не нужно создавать копии этой темы. [/COLOR] <br> [COLOR=#FFA500] На рассмотрении [/COLOR] <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT] [/COLOR]<br>",
        	prefix: PIN_PREFIX,
            status: true
         },
             {
                    title: 'Наказание верное',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Администратор предоставил доказательства. <br> Наказание выдано верно. [/COLOR] <br> [COLOR=#8B0000] Закрыто [/COLOR] <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT] [/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
         },
                     {
                    title: 'Наказание неверное',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] С администратором будет проведена работа. <br> Наказание будет снято в течении 24-х часов. [/COLOR] <br> [COLOR=#00FF00] Одобрено [/COLOR] <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT] [/COLOR]<br>",
        	prefix: ACCEPT_PREFIX,
            status: false
         },
                             {
                    title: '48 часов',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению. [/COLOR] <br> [COLOR=#8B0000] Закрыто [/COLOR] <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT] [/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
         },
                                  {
                    title: 'В жб на теха',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Вы ошиблись разделом. <br> Вам было выдано наказание Техническим Специалистом [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Нажмите сюда*[/URL]  [/COLOR] <br> [COLOR=#8B0000] Закрыто [/COLOR] <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора .[/FONT] [/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
         },
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('Меню', 'selectAnswer');


        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));

        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));

        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if(id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 10px 10px; border-color: red; border-style: ridge groove ; margin-right: 0px; margin-bottom: 0px; background: red; text-decoration-style: dotted;">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="border-radius: 4px 0px; border-color: black red; border-style: ridge groove ; margin-right: 5px; margin-bottom: 5px; background: ; text-decoration-style: dotted">${btn.title}</span></button>`,
        )
            .join('')}</div>`;
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