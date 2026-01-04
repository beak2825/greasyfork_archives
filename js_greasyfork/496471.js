// ==UserScript==
// @name         Скрипт для Кураторов форума // NOVOSIBIRSK
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Скрипт для Кураторов Форума
// @author       Nekit Regis with Snickers Forbes
// @match        https://forum.blackrussia.online/threads/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license    MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/496471/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%20NOVOSIBIRSK.user.js
// @updateURL https://update.greasyfork.org/scripts/496471/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%20NOVOSIBIRSK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const UNACCСEPT_PREFIX = 4; // префикс отказано
    const ACCСEPT_PREFIX = 8; // префикс одобрено
    const PINN_PREFIX = 2; //  префикс закрепить
    const SPECADM_PREFIX = 11; // Специальному администратору
    const GA_PREFIX = 12; // Главному адамнистратору
    const CLOSE_PREFIX = 7;
    const TEXY_PREFIX = 13;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const OJIDANIE_PREFIX = 14;
    const OTKAZBIO_PREFIX = 4;
    const ODOBRENOBIO_PREFIX = 8;
    const NARASSMOTRENIIBIO_PREFIX = 2;
    const PREFIKS = 0;
    const KACHESTVO = 15;
    const RASSMOTRENO_PREFIX = 9;
    const OTKAZRP_PREFIX = 4;
    const ODOBRENORP_PREFIX = 8;
    const NARASSMOTRENIIRP_PREFIX = 2;
    const OTKAZORG_PREFIX = 4;
    const ODOBRENOORG_PREFIX = 8;
    const NARASSMOTRENIIORG_PREFIX = 2;
    const buttons = [
        {
            title: '------------------------------------------------- Свой ответ ----------------------------------------------------',
            dpstyle: 'oswald: 3px;     color: #000; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
        },
        {
            title: 'СВОЙ ОТВЕТ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER] .[/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix:  UNACCСEPT_PREFIX ,
            status: false,
        },
        {
            title: '------------------------------------------------- Передача тем на рассмотрение ----------------------------------------------------',
            dpstyle: 'oswald: 3px;     color: #000; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
        },
        {
            title: 'На рассмотрении',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Ваша жалоба взята [COLOR=rgb(255, 255, 0)]на рассмотрение.[/CENTER][/COLOR]<br>" +
            "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
            prefix: PINN_PREFIX,
            status: true,
        },
        {
            title: 'ГКФ|ЗГКФ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Ваша жалоба передана на рассмотрение Главному / Заместителю кураторов форума [/CENTER]<br>" +
            "[CENTER]Убедительная просьба не создавать копий данной темы.[/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',
            prefix: PINN_PREFIX,
            status: true,
        },
        {
            title: 'Техническому специалисту',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Ваша жалоба передана [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(0, 0, 255)]Техническому Специалисту.[/CENTER][/COLOR]<br>" +
            "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
            prefix: TEXY_PREFIX,
            status: true,
        },
        {
            title: '------------------------------------------------------- Правила RolePlay Процесса --------------------------------------------------------',
            dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
        },
        {
            title: 'nRP повидение',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },

        {
            title: 'NonRP охрана Казино',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.03 Охраннику казино запрещено выгонять игрока без причины| [COLOR=rgb(255, 0, 0)]| Увольнение с должности | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Уход от RP',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'NonRP Drive',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix:ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Помеха работягам',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [COLOR=rgb(255, 0, 0)]Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'nRP обман :(',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.05.Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(255, 0, 0)]PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },

        {
            title: ' Не вернул долг😔',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.57.Запрещается брать в долг игровые ценности и не возвращать их | [COLOR=rgb(255, 0, 0)] Ban 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/COLOR][/SIZE][/FONT]<br>" +
            "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
            "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
            "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=green]NOVOSIBIRSK[/COLOR].<br><br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' RP Отыгровки в личных целях ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.06. Запрещены любые Role Play отыгровки в свою сторону или пользу | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Аморальные действия',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Слив склада',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
            "[CENTER]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]<br>",
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Затягивание RP',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.12. Запрещено целенаправленное затягивание Role Play процесса | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix:  ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'DB ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'RK ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'TK ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства).[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'SK ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn (за два и более убийства).[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'PG',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | [COLOR=rgb(255, 0, 0)]Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix:ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'MG',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [COLOR=rgb(255, 0, 0)]Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'DM',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Mass DM',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [COLOR=rgb(255, 0, 0)]Warn / Ban 3 - 7 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Постороннее ПО',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Ваша жалоба получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/CENTER][/COLOR]<br>" +
            "[CENTER]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan.[/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]<br>",
            prefix:ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Уход от наказания',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.34. Запрещен уход от наказания | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней (суммируется к общему наказанию дополнительно).[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },

        {
            title: ' OОC угрозы ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.37. Запрещены OOC угрозы, в том числе и завуалированные  | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Злоупотребление нарушениями',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.39. Злоупотребление нарушениями правил сервера | [COLOR=rgb(255, 0, 0)]Ban 7 - 30 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix:  ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Оск проекта',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [COLOR=rgb(255, 0, 0)]Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Продажа промо ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:

            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | [COLOR=rgb(255, 0, 0)]MMute 120 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'ЕПП инко/дальнобощика',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [COLOR=rgb(255, 0, 0)]Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Аресты в интерьере',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней + увольнение из организации.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'nRP аксессуар',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [COLOR=rgb(255, 0, 0)]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: '| Мат в названии (Бизнеса) |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.53. Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности | [COLOR=rgb(255, 0, 0)] Ban 1 день / При повторном нарушении обнуление бизнеса.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Оск адм',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [COLOR=rgb(255, 0, 0)]Mute 180 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Багаюз с аним',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | [COLOR=rgb(255, 0, 0)]Jail 60 / 120 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' П/П/И/В ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | [COLOR=rgb(255, 0, 0)] PermBan с обнулением аккаунта + ЧС проекта.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' П/П/В ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]4.03.  Запрещена совершенно любая передача игровых аккаунтов третьим лицам| [COLOR=rgb(255, 0, 0)] PermBan .[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Обман администрации',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Обход системы ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: '------------------------------------------------------ Правила Текстового Чата -----------------------------------------------------------',
            dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
        },
        {
            title: 'Не русский язык',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.01. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке. | [COLOR=rgb(255, 0, 0)][COLOR=rgb(255, 0, 0)]Устное замечание / Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'CapsLock',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Оск',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Упом/Оск Родни',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            tile: '| Мат в Vip Chat |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',

            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'FLOOD',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Злоуп Символами',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.06. Запрещено злоупотребление знаков препинания и прочих символов | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Оск секс. характера ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Слив Глоб Чатов',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | [COLOR=rgb(255, 0, 0)]PermBan. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Угрозы о наказании',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Выдача себя за адм',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 + ЧС администрации. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Ввод в заблужд командами ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Музыка в Voice ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.14. Запрещено включать музыку в Voice Chat | [COLOR=rgb(255, 0, 0)]Mute 60 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Оск/упом род в Voice ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.15. Запрещено оскорблять игроков или родных в Voice Chat | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Шумы в Voice ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.16. Запрещено создавать посторонние шумы или звуки | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Реклама в Voice ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.17. Запрещена реклама в Voice Chat не связанная с игровым процессом  | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 дней [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Политика/Религия',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 10 дней. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Софт для голоса',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.19. Запрещено использование любого софта для изменения голоса | [COLOR=rgb(255, 0, 0)]Mute 60 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Транслит',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.20. Запрещено использование транслита в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Реклама Промо',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [COLOR=rgb(255, 0, 0)]Ban 30 дней. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'ГОСС обьявления',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)]Mute 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: '------------------------------------------------------- В другие разделы --------------------------------------------------------',
            dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
        },
        {
            title: 'В ЖБ на АДМ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
            "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(255, 0, 0)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/Жалобы-на-администрацию.1570/]'Раздел жалоб на Администрацию'. [/URL][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'В ЖБ на ЛД',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
            "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(255, 0, 0)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/Жалобы-на-лидеров.1571/]'Раздел жалоб на Лидеров'. [/URL][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' В обжалования ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
            "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(255, 0, 0)] Вам нужно обраться в [URL=https://forum.blackrussia.online/forums/Обжалование-наказаний.1573/]'Обжалование наказаний'. [/URL][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]' ,

            prefix: UNACCСEPT_PREFIX,
            status: false,
        },

        {
            title: 'В ЖБ на Тех спец',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
            "[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что[COLOR=rgb(255, 0, 0)] Вам нужно обраться в [URL=]'Раздел жалоб на Технических Специалистов'. [/URL][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: '------------------------------------------------------- Правила ГОСС --------------------------------------------------------',
            dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
        },
        {
            title: ' Работа в форме ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции | [COLOR=rgb(255, 0, 0)]Jail 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Казино в форме ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]1.13. Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции | [COLOR=rgb(255, 0, 0)]Jail 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Т/С в личных целях ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]1.08. Запрещено использование фракционного транспорта в личных целях | [COLOR=rgb(255, 0, 0)]Jail 30 минут. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Военный ДМит ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.02.Наносить урон игрокам, которые находятся вне территории воинской части, запрещено| [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Н/ПРО ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4] 4.01. Запрещено редактирование объявлений, не соответствующих ПРО| [COLOR=rgb(255, 0, 0)]Mute 30 минут [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' nRP эфир ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4] 4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике| [COLOR=rgb(255, 0, 0)]Mute 30 минут [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Редактирование в лич. целях ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4] 4.04.Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | [COLOR=rgb(255, 0, 0)]Ban 7 дней + ЧС организации [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' УМВД ДМит ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.02.Наносить урон игрокам, которые находятся на террторрии УМВД, запрещено| [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' ГИБДД ДМит ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.02.Наносить урон игрокам, которые находятся на террторрии ГИБДД, запрещено| [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' ФСБ ДМит ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]4.02.Наносить урон игрокам, которые находятся на террторрии ФСБ, запрещено| [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' ФСИН ДМит ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]5.02.Наносить урон игрокам, которые находятся на террторрии ФСИН, запрещено| [COLOR=rgb(255, 0, 0)]Jail 60 минут / Warn. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Розыск без причины (УМВД) ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]6.02.Запрещено выдавать розыск без Role Play причины| [COLOR=rgb(255, 0, 0)] Warn. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Розыск/штраф без причины (ГИБДД) ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]7.02.Запрещено выдавать розыск без Role Play причины| [COLOR=rgb(255, 0, 0)] Warn. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Розыск без причины (ФСБ) ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]8.02.Запрещено выдавать розыск без Role Play причины| [COLOR=rgb(255, 0, 0)] Warn. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            status: false,
        },
        {
            title: ' nRP поведение УМВД ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]6.03. Запрещено nRP поведение| [COLOR=rgb(255, 0, 0)] Warn. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' nRP поведение ГИБДД ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]7.03. Запрещено nRP поведение| [COLOR=rgb(255, 0, 0)] Warn. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' nRP поведение ФСБ ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]8.03. Запрещено nRP поведение| [COLOR=rgb(255, 0, 0)] Warn. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Права в погоне (ГИБДД) ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]7.04.  Запрещено отбирать водительские права во время погони за нарушителем| [COLOR=rgb(255, 0, 0)] Warn. [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Одиночный патруль ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]1.11.  Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника| [COLOR=rgb(255, 0, 0)] Jail 30 минут [/SIZE][/QUOTE][/COLOR][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Обыск без отыгровки ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]8.05 Запрещено проводить обыск игрока без Role Play отыгровки  [COLOR=rgb(255, 0, 0)] |  Warn [/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: '------------------------------------------------------- Правила ОПГ --------------------------------------------------------',
            dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
        },
        {
            title: ' Нарушение правил ОПГ ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан за нарушение общих правил криминальных организаций [COLOR=rgb(255, 0, 0)] | Jail  60 минут / Warn  [/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' NonRP В/Ч ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан за нарушение правил нападения на воинскую часть[COLOR=rgb(255, 0, 0)] | Warn  [/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' NonRP В/Ч (не ОПГ) ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан за нарушение правил нападения на воинскую часть[COLOR=rgb(255, 0, 0)] | Jail 30 минут [/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' NonRP огр/похищ ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Нарушитель будет наказан за нарушение правил ограблений и похищений [COLOR=rgb(255, 0, 0)] | Jail  60 минут / Warn  [/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто[/COLOR].[/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: '---------------------------------------------------------------- Отказ жалоб ---------------------------------------------------------------',
            dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
        },
        {
            title: 'Нет нарушений',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]На ваших доказательствах отсутствуют нарушения игрока.<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Адм не возращают деньги ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д..<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Недостаточно доказательств',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]В вашей жалобе недостаточно доказательств на нарушение игрока.<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },{
            title: 'Отсутвуют док-ва',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]В вашей жалобе не загружены доказательства на нарушение игрока. Создайте новую жалобу, загрузив доказательства с нарушениями игрока.<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Доказательства отредактированы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств.<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']с правилами подачи жалоб на игроков[/URL].<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            status: false,
        },
        {
            title: 'Нет тайма',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет таймкодов',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: '3+ дня',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Вашим доказательствам более трёх дней.[/CENTER]<br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Доква в соц сетях',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Условия сделки ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER] На ваших доказательствах отсутствуют условия сделки..[/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нужен фрапс',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]В таких случаях нужен фрапс.<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Промотка чата + фрапс',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]В таких случаях нужен фрапс + промотка чата.<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Фрапс обрывыется',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Доказателства в вашей жалобе обрываются. Загрузите полный фрагмент нарушения игрока на платформу YouTube и создайте новую жалобу.<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Док-ва не открываются ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Ваши доказательства не открываются[/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Жалоба от 3-го лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Ваша жалоба составлена от третьего лица.[/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Ошиблись сервером ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер.[/CENTER]<br>" +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: '------------------------------------------------- RolePlay Биографии ----------------------------------------------------',
            dpstyle: 'oswald: 3px;     color: #000; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
        },
        {
            title: ' Био одобрена ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Ваша Биография получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Био отказ (Форма) ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило нарушение Правила написания RP биографии <br><br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Био отказ (Мало инфы) ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Недостаточно количество RolePlay информации о вашем персонаже <br><br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Био отказ (Скопирована) ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Биография скопирована <br><br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Био отказ (Заголовок) ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Неправильное написание заголовка биографии. <br><br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Био отказ (1-ое лицо) ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Написание Биографии от 1-го лица. <br><br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Био отказ (Возраст не совпал) ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило -  Возраст не совпадает с датой рождения. <br><br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Био отказ (Возраст) ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило -  Возраст слишком мал. <br><br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' Био отказ (Ошибки) ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило большое количество ошибок. <br><br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },

        {
            title: '------------------------------------------------- Неоф. организации ----------------------------------------------------',
            dpstyle: 'oswald: 3px;     color: #000; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
        },

        {
            title: ' Неоф. орг. одобрена ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Ваша организация получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: 'Неоф.орг отказ ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER]Ваша РП организация получает статус - [COLOR=#FF0000]Отказано[/COLOR] <br><br>"+
            "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Неоф.РП организации, закрепленные в данном разделе.<br>"+
            "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=green]NOVOSIBIRSK[/COLOR].<br><br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },
        {
            title: '------------------------------------------------- РП ситуации ----------------------------------------------------',
            dpstyle: 'oswald: 3px;     color: #000; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
        },
        {
            title: ' Рп сит. одобрена ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            "[CENTER]Ваша ситуация получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]',
            prefix: ACCСEPT_PREFIX,
            status: false,
        },
        {
            title: ' RP сит. отказ (Форма) ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
            content:
            '[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            "[CENTER] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило нарушение Правила написания RP ситуации или недостаточно отыгровки. <br><br>"+
            "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]',
            prefix: UNACCСEPT_PREFIX,
            status: false,
        },

    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


        // addButton('На рассмотрение', 'pin');
        // addButton('Тех. спецу', 'tech');
        addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255,165,0, 0.5);');
        addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);')
        addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);')
        addAnswers();

        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
        $('button#tech').click(() => editThreadData(TEXY_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
        $('button#watch').click(() => editThreadData(WATCH_PREFIX, false));
        $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
        $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'ОТВЕТЫ');
            buttons.forEach((btn, id) => {
                if (id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                }
                else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id, style) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
        );
    }
    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
                                       );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
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
            6 < hours && hours <= 12
            ? 'Доброе утро'
            : 12 < hours && hours <= 17
            ? 'Добрый день'
            : 17 < hours && hours <= 6
            ? 'Добрый вечер'
            : 'Добрый вечер',
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