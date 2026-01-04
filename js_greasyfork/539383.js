// ==UserScript==
// @name         Скрипт | СХ & КФ & ЛД/СС
// @namespace    https://forum.blackrussia.online
// @version      1.5
// @description  -
// @author       - Arman (@xapanskiy)
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://i.pinimg.com/736x/00/47/3a/00473a6c4c03c4695fff67e4d5f2cb30.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539383/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%7C%20%D0%A1%D0%A5%20%20%D0%9A%D0%A4%20%20%D0%9B%D0%94%D0%A1%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/539383/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%7C%20%D0%A1%D0%A5%20%20%D0%9A%D0%A4%20%20%D0%9B%D0%94%D0%A1%D0%A1.meta.js
// ==/UserScript==

(async function () {
  `use strict`;
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes - Префикс "Отказано"
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted - Префикс "Одобрено"
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem - Префикс "Решено"
const PIN_PREFIX = 2; // Prefix that will be set when thread pins - "На рассмотрении"
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga Префикс "Главному Администратору"
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team Префикс "Команде Проекта"
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes. Префикс "Закрыто"
const VAJNO_PREFIX = 1; // Префикс "Важно"
const WATCHED_PREFIX = 9; //Префикс "Рассмотрено"
const TEX_PREFIX = 13; //Префикс "Тех Специалисту "
const SPECY_PREFIX = 11; //Префикс "Специальному Администратору"
const OJIDANIE_PREFIX = 14; //Префикс "Ожидание"
const REALIZOVANO_PREFIX = 5; //Префикс "Реализовано"
const PREFIKS = 0; // Нет префикса
const KACHESTVO = 15; //Префикс "Проверено контролем качества"
const OTKAZRP_PREFIX = 4; // Префикс "Отказано"
const ODOBRENORP_PREFIX = 8;  //Префикс "Одобрено"
const NARASSMOTRENIIRP_PREFIX = 2; //"На рассмотрении"
const NARASSMOTRENIIORG_PREFIX = 2;  //"На рассмотрении"
const data = await getThreadData(),
      greeting = data.greeting, // greeting уже строка!
      user = data.user;
const buttons = [
        {
            title: ' ✿❯─────────────────────── ❖ Раздел Агентов Поддержки ❖ ───────────────────────❮✿',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(250, 00, 00, 1);',
        },
        {
            title: ' ✿❯────────────────────── ❖Заявки на Неактив❖ ──────────────────────❮✿ ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);' ,
        },

        {
            title: ' Одобрено ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(34, 255, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Агент Поддержки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Неактив [COLOR=GREEN]Одобрена[/COLOR]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=MAGENTA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Одобрено ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Не является АП ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Игрок [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Неактив [COLOR=RED]Отказана[/COLOR], Вы не являетесь Агентом Поддержки. [/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Не по форме ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
 '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Агент Поддержки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Неактив [COLOR=RED]Отказана[/COLOR], Ваша заявка составлена не по форме. [/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Много Неактивов ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
 '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Агент Поддержки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Неактив [COLOR=RED]Отказана[/COLOR], За последнее время у вас много неактивов. [/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' ✿❯──────────────────── ❖Заявки на Обмен баллов❖ ────────────────────❮✿',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);',
        },
        {
            title: ' Одобрено ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(34, 255, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
             '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Агент Поддержки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Обмен баллов [COLOR=GREEN]Одобрена[/COLOR]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Одобрено ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Не хватает баллов ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
 '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Агент Поддержки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Обмен баллов [COLOR=RED]Отказана[/COLOR], У вас недостаточно Баллов. [/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Не является АП ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
 '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Игрок [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Обмен баллов [COLOR=RED]Отказана[/COLOR], Вы не являетесь Агентом Поддержки. [/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Не по форме ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
 '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Агент Поддержки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Обмен баллов [COLOR=RED]Отказана[/COLOR], Ваша заявка составлена не по форме. [/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },

        {
            title: ' ✿❯──────────────────────── ❖Жалобы на АП❖ ────────────────────────❮✿',
            dpstyle:'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);'
        },
        {
            title: ' Одобрено ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(34, 255, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Игрок [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=GREEN]Одобрена[/COLOR], с Агентом Поддержки будет Проводена Беседа[/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Одобрено ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Не по форме ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Игрок [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба на Агента Поддержки [COLOR=RED]Отказано[/COLOR] Ваша жалоба Составлена Не по форме.[/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Не является АП ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Игрок [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=RED]Отказана[/COLOR], Данный Игрок не Являеться Агентов Поддержки[/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Док-ва не рабочие/редакт. ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Игрок [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=RED]Отказана[/COLOR], У вас Доказательства не Рабочие или Отредактированные. [/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Нет нарушений ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Игрок [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=RED]Отказана[/COLOR], Со стороны Агента Поддержки Нарушений не найдено. [/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: '|  ✿❯────────────────── ❖Заявки на снятие наказаний❖ ──────────────────❮✿',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);',
        },
        {
            title: ' Одобрено ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(34, 255, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Агент Поддержки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Снятие Наказания [COLOR=GREEN]Одобрена[/COLOR]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Одобрено ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Не прошло 24 часа ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Агент Поддержки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Снятие Наказания [COLOR=RED]Отказано[/COLOR] С момента выдачи наказания не прошло 24 Часа.[/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            status: true,
            pin: false,
        },
        {
            title: ' Недостаточ. Баллов ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Агент Поддержки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Снятие Наказания [COLOR=RED]Отказано[/COLOR] Недостаточно баллов для Снятия баллов.[/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Нет наказаний ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Агент Поддержки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Снятие Наказания [COLOR=RED]Отказано[/COLOR] У вас на данный момент нет Наказаний.[/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            status: true,
            pin: false,
        },
        {
            title: ' Не является АП ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Игрок [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Снятие наказания [COLOR=RED]Отказана[/COLOR], Вы не являетесь Агентом Поддержки. [/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Не по форме ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Агент Поддержки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Снятие наказания [COLOR=RED]Отказана[/COLOR], Ваша заявка составлена не по форме. [/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },

        {
            title: '|  ✿❯────────────────── ❖Заявки на Пропуск собрания❖ ──────────────────❮✿',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);',
        },
        {
            title: ' Одобрено ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(34, 255, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Агент Поддержки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Пропуск Собрания [COLOR=GREEN]Одобрена[/COLOR]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Одобрено ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Поздно ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Агент Поддержки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Пропуск Собрания [COLOR=RED]Отказана[/COLOR], Вы подали заявку за 30 минут до начала собрания или после собрания. [/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Не является АП ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Агент Поддержки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            `[B][CENTER][COLOR=lavender]Ваша заявка на |Пропуск собрания| получила статус - [COLOR=#FF0000]Отказано[/COLOR]. <br><br>`+
            `[B][CENTER][COLOR=lavender]Причиной отказа послужило - [COLOR=#F08080]Вы не являетесь Агентом Поддержки.[/COLOR]`+
            `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=#00ffff]SOCHI[/COLOR].<br><br>`+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]<br>' ,
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Не по форме ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Агент Поддержки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка на Пропуск Собрания [COLOR=RED]Отказана[/COLOR], Ваша заявка составлена не по форме. [/SIZE][/FONT]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=AQUA][ICODE]Приятной игры На сервере SOCHI.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
 {
            title: ' ✿❯──────────────────────────── ❖ Раздел Жалоб ❖ ────────────────────────────❮✿',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(250, 00, 00, 1);',
        },
    {
            title: '  ✿❯────────────────── ❖Правило Role Play Ситуаций❖ ──────────────────❮✿',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);',
        },
	{
                        	  title: ' Приветствие ',
                         dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Текст <br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        },
{
	  title: '| NonRP Поведение |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",


        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Уход от RP |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>"+
                "[*][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Примечание: [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее.[/FONT][/SIZE][/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP drive |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
    "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>"+
                "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SIZE][/FONT][/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP Обман |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Долг |',
    dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их. [Color=#ff0000]| Ban 30 дней / permban[/color].[/COLOR]<br><br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/COLOR][/SIZE][/FONT]<br>" +
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| RP отыгровки в свою сторону |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.06.[/color] Запрещены любые Role Play отыгровки в свою сторону или пользу [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Аморал |',
     dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]обоюдное согласие обеих сторон.[/COLOR][/FONT][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив склада |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Затягивание RP |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.12.[/color] Запрещено целенаправленное затягивание Role Play процесса [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]/me начал доставать документы [1/100], начал доставать документы [2/100] и тому подобное.[/COLOR][/FONT][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| DB |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
                "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/COLOR][/FONT][/SIZE][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| RK |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.14.[/color] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| TK |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| SK |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| PG |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.17.[/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| PG |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.17.[/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| MG |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
"[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]телефонное общение также является IC чатом.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| DM |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>"+
"[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
			"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Mass DM |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.20. [/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ff0000]| Warn / Ban 3 - 7 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
			"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
    title: '| Ссторонее ПО |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]запрещено внесение любых изменений в оригинальные файлы игры.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]блокировка за включенный счетчик FPS не выдается.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
         "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Уход от наказания |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.34.[/color] Запрещен уход от наказания [Color=#ff0000]| Ban 15 - 30 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]зная, что в данный момент игроку может быть выдано наказание за какое-либо нарушение, изменение никнейма или передача своего имущества на другие аккаунты и тому подобное.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]выход игрока из игры не является уходом от наказания.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",


        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| OОC угрозы |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.37.[/color] Запрещены OOC угрозы, в том числе и завуалированные [Color=#ff0000]| Mute 120 минут / Ban 7 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",


        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоуп наказаниями |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.39.[/color] Злоупотребление нарушениями правил сервера [Color=#ff0000]| Ban 7 - 30 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск проекта |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]| Mute 300 минут / Ban 30 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Продажа промо |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.43.[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ff0000]| Mute 120 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
    {
	  title: '| ЕПП (фура/инк) |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

            prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Арест на аукционе |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона [Color=#ff0000]| Ban 7 - 15 дней + увольнение из организации[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP аксессуар |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [Color=#ff0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Мат в названии (Бизнеса) |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.53.[/color] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [Color=#ff0000]| Ban 1 день / При повторном нарушении обнуление бизнеса[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]названия семей, бизнесов, компаний и т.д.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск адм |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [Color=#ff0000]Mute 180 минут[/color].[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| багаюз аним |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях [Color=#ff0000]| Jail 60 / 120 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=#ff0000]| Jail 120 минут[/color]. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=#ff0000]| Jail 60 минут[/color].[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| П/П/И/В |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.28.[/color] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [Color=#ff0000]| PermBan с обнулением аккаунта + ЧС проекта[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]официальная покупка через сайт.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| П/П/В |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.03.[/color] Запрещена совершенно любая передача игровых аккаунтов третьим лицам [Color=#ff0000]| PermBan[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обман администрации |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]подделка доказательств, искажение информации в свою пользу, оскорбление администрации в репорт, обвинение администраторов без доказательств и т.д.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                    "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обход системы |',
   dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками. Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками. Банк и личные счета предназначены для передачи денежных средств между игроками. Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
           "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	 title: ' ✿❯──────────────────────── ❖Правила чата❖ ────────────────────────❮✿',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);' ,
},
{
	  title: '| Разговор не на русском |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.01.[/color] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=#ff0000]| Устное замечание / Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
    {
	  title: '| Caps |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.02.[/color] Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут[/color]"+
"[B][CENTER][COLOR=lavender][FONT=times new roman] Пример: ПрОдАм, куплю МАШИНУ.[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оскорбление |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
         "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск/Упом родни |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]термины «MQ», «rnq» расценивается, как упоминание родных.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
              "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
        tile: '| Мат в Vip Chat |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
    contenrt:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
    status: false,
},
{
	  title: '| Flood |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

            prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоуп символами |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск секс. характера |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.07.[/color] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]«дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив гл. чата (СМИ) |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#ff0000]| PermBan[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
         "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Угроза о наказании(адм) |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.09.[/color] Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Выдача себя за администратора |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 7 - 15 + ЧС администрации[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ввод в заблужд командами |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Музыка в Voice |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.14.[/color] Запрещено включать музыку в Voice Chat [Color=#ff0000]| Mute 60 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск/упом род в Voice |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.15.[/color] Запрещено оскорблять игроков или родных в Voice Chat [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
          "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Шумы в Voice |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.16.[/color] Запрещено создавать посторонние шумы или звуки [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать).[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
          "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама в Voice |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.17.[/color] Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]реклама Discord серверов, групп, сообществ, ютуб каналов и т.д.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
           "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Полит/религ пропоганда |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.18.[/color] Запрещено политическое и религиозное пропагандирование [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Изменение голоса софтом |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.19.[/color] Запрещено использование любого софта для изменения голоса [Color=#ff0000]| Mute 60 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
          "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Транслит |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.20[/color] Запрещено использование транслита в любом из чатов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]«Privet», «Kak dela», «Narmalna».[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
          "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама промо |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.21.[/color] ЗЗапрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [Color=#ff0000]| Ban 30 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
          "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обьявления в госс |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=#7b68ee]С уважением [/COLOR][COLOR=#7b68ee]Заместитель Главного Куратора Форума.[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
 {
            title: ' ✿❯─────────────────── ❖Передача на Рассмотрение❖ ───────────────────❮✿',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);' ,
        },

{
	  title: '| На рассмотрение |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба взята на [COLOR=#ffff00]рассмотрение[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: PIN_PREFIX,
	  status: true,
},
{
    	  title: '| ГКФ-у |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба взята на [COLOR=#ffff00]рассмотрение [/COLOR][COLOR=#0000ff]Главному Куратору Форума[/COLOR][COLOR=lavender], пожалуйста ожидайте ответа.<br><br>"+
         "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: PIN_PREFIX,
	  status: true,
},
{
	  title: '| Тех. спецу |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=#0000ff]Техническому специалисту[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
         "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: TEX_PREFIX,
	  status: true,
},
{
    	  title: '| Заместителю ГА |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=#ff0000]Заместителю Главного Администратора [/COLOR], пожалуйста ожидайте ответа.<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

	  prefix: PIN_PREFIX,
	  status: true,
},
{
	  title: '| Главному администратору |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=#ff0000]Главному администратору [/COLOR], пожалуйста ожидайте ответа.<br><br>"+
         "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

	  prefix: GA_PREFIX,
	  status: true,
},
{
            title: ' ✿❯────────────────────────── ❖NickName❖ ──────────────────────────❮✿',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);' ,
        },
{
	  title: '| NonRP Nik |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.06.[/color] Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [Color=#ff0000]| Устное замечание + смена игрового никнейма[/color].[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

     prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Oск Nick |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

     prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Fake |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>"+
         "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

     prefix: ACCEPT_PREFIX,
	  status: false,
},
{
            title:' ✿❯─────────────────────── ❖Перенаправление❖ ───────────────────────❮✿',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);' ,
        },
{
	  title: '| В жб на адм |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на администрацию». <br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

     prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на лд |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на лидеров». <br><br>"+
         "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

     prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В обжалования |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний». <br><br>"+
         "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

     prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В тех раздел |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в технический раздел. <br><br>"+
         "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

     prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на теха |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на технических специалистов». <br><br>"+
          "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

     prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
            title: ' ✿❯─────────────────────── ❖Правила Форума❖ ────────────────────────❮✿',
            dpstyle: 'border-radius: 8px; margin-right: 3px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);' ,
        },
{
	  title: '| Неадекват |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.02.[/color] Запрещено неадекватное поведение в любой возможной форме, от оскорблений простых пользователей, до оскорбления администрации или других членов команды проекта.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Травля пользователя |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.03.[/color] Запрещена массовая травля, то есть агрессивное преследование одного из пользователей данного форума.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
         "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Провокация, розжиг конфликта |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.04.[/color] Запрещены латентные, то есть скрытные (завуалированные), саркастические сообщения/действия, созданные в целях оскорбления того или иного лица, либо для его провокации и дальнейшего розжига конфликта.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                    "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.05.[/color] Запрещена совершенно любая реклама любого направления.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| 18+ |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.06.[/color] Запрещено размещение любого возрастного контента, которые несут в себе интимный, либо насильственный характер, также фотографии содержащие в себе шок-контент, на примере расчленения и тому подобного.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Flood , Offtop |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.07.[/color] Запрещено флудить, оффтопить во всех разделах которые имеют строгое назначение.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Религия/политика |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.09.[/color] Запрещены споры на тему религии/политики.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Помеха развитию проекта |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.09.[/color] Запрещены деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
            "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Попрошайничество |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.16.[/color] Запрещено вымогательство или попрошайничество во всех возможных проявлениях.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
           "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоуп Caps/транслит |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.17.[/color] Запрещено злоупотребление Caps Lock`ом или транслитом.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Дубликат тем |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.18.[/color] Запрещена публикация дублирующихся тем.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Бесмысленный/оск Nik фа |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.02.[/color] Запрещено регистрировать аккаунты с бессмысленными никнеймами и содержащие нецензурные выражения.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Feik Nik фа адм/лд |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил пользования форумом:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.03.[/color] Запрещено регистрировать аккаунты с никнеймами похожими на никнеймы администрации.[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
             "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
            title: ' ✿❯───────────────────── ❖Правила Госс Структур❖ ──────────────────────❮✿',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);' ,
        },
{
	  title: '| Работа в форме |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
			"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Казино в форме |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.13.[/color] Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Т/С в личных целях |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.08.[/color] Запрещено использование фракционного транспорта в личных целях [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

    prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Военный ДМит |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для Министерства Обороны:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.02.[/color] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [Color=#ff0000]| предупреждение (Warn) выдается только в случае Mass DM[/color].[/COLOR]<br><br>"+
"[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]предупреждение (Warn) выдается только в случае Mass DM.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                    "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Н/ПРО |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.01.[/color] Запрещено редактирование объявлений, не соответствующих ПРО [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP эфир |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.02.[/color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Редактирование в лич. целях |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#ff0000]| Ban 7 дней + ЧС организации[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| УМВД ДМит |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для УМВД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории УМВД [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]предупреждение (Warn) выдается только в случае Mass DM.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| ГИБДД ДМит |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]предупреждение (Warn) выдается только в случае Mass DM.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| ФСБ ДМит |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ФСБ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории ФСБ [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]предупреждение (Warn) выдается только в случае Mass DM.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
              "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| ФСИН ДМит |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ФСИН:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]9.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории ФСИН [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]предупреждение (Warn) выдается только в случае Mass DM.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Розыск без причины (УМВД) |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для УМВД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.02.[/color] Запрещено выдавать розыск без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Розыск/штраф без причины (ГИБДД) |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.02.[/color] Запрещено выдавать розыск, штраф без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Розыск без причины (ФСБ) |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ФСБ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.02.[/color] Запрещено выдавать розыск без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
              "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP поведение УМВД |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для УМВД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.03.[/color] Запрещено nRP поведение [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]поведение, не соответствующее сотруднику УМВД.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- открытие огня по игрокам без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- расстрел машин без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- нарушение ПДД без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP поведение ГИБДД |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.03.[/color] Запрещено nRP поведение [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]поведение, не соответствующее сотруднику ГИБДД.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- открытие огня по игрокам без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- расстрел машин без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- нарушение ПДД без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP поведение ФСБ |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ФСБ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.03.[/color] Запрещено nRP поведение [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]поведение, не соответствующее сотруднику ФСБ.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- открытие огня по игрокам без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- расстрел машин без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- нарушение ПДД без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)]- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                       "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Права в погоне (ГИБДД) |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.04.[/color] Запрещено отбирать водительские права во время погони за нарушителем [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
         "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Одиночный патруль |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.11.[/color] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
               "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обыск без отыгровки |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.05.[/color] Запрещено проводить обыск игрока без Role Play отыгровки [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
             "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| NRP Cop |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.03.[/color] Запрещено оказывать задержание без Role Play отыгровки [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
              "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
            title: ' ✿❯────────────────────────── ❖Правила ОПГ❖ ───────────────────────────❮✿',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);' ,
        },
{
	  title: '| Нарушение правил ОПГ |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение общих правил криминальных организаций.<br><br>"+
                "[B][CENTER][Spoiler][/COLOR][COLOR=rgb(209, 213, 216)] Jail (от 10 до 60 минут) / Warn / Ban[/COLOR]<br>"+
"[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]само наказание и его длительность выдаются на усмотрение администратора, размер выдаваемого наказания зависит от степени нарушения со стороны игрока. Строгий или устный выговор лидеру фракции может выдать только главный следящий за бандами или непосредственно его заместитель.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP В/Ч |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Warn[/color].<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP В/Ч (не ОПГ) |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Jail 30 минут[/color].<br><br>"+
                "[B][CENTER][COLOR=#7b68ee]С уважением [/COLOR][COLOR=#7b68ee]Заместитель Главного Куратора Форума.[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

       prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP огр/похищ |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение правил ограблений и похищений.<br><br>"+
                "[B][CENTER][Spoiler][/COLOR][COLOR=rgb(209, 213, 216)] Jail (от 10 до 60 минут) / Warn / Ban[/COLOR]<br>"+
"[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]само наказание и его длительность выдаются на усмотрение администратора, размер выдаваемого наказания зависит от степени нарушения со стороны игрока. Строгий или устный выговор лидеру фракции может выдать только главный следящий за бандами или непосредственно его заместитель.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
            title: ' ✿❯─────────────────────────── ❖Отказ Жалоб❖ ──────────────────────────❮✿',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);' ,
        },
{
	  title: '| Нарушений не найдено |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нарушений со стороны данного игрока не было найдено. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
        "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Возврат средств |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
              "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  недостаточно. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отсутствуют. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отредактированы. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив семьи |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как слив семьи никак не относится к правилам проекта, то есть если Лидер семьи дал игроку роль заместителя, то только он за это и отвечает, Администрация сервера не несет за это ответственность. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
              "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваша жалоба составлена не по форме. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Заголовок не по форме |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как заголовок вашей жалобы составлен не по форме. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как на ваших доказательствах отсутствует /time.  <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов|',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как отсутствует time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как с момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц сеть |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в Ваших доказательствах отсутствуют условия сделки. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств недостаточно. В данной ситуации необходим фрапс(запись экрана). <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
				"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Промотка чата |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нужен фрапс + промотка чата. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,


},
{
	  title: '| Фрапс обрывается |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]" +


{
	  title: '| Жалоба от 3-го лицо |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
		"[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]" ,
     prefix: UNACCEPT_PREFIX,
	  status: false,
},
	  title: '| Ошиблись сервером |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=pink]С уважением администрация [/COLOR][COLOR=BLACK]Black [COLOR=red]Russia .[/COLOR]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
          "[url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url]",

      prefix: UNACCEPT_PREFIX,
	  status: false,

            title: '✿❯──────────────────────── ❖RolePlay Биография❖ ────────────────────────❮✿',
            dpstyle:'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);'


           },
    {

        title: '|РП биография одобрена|',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша [COLOR=RED]RolePlay [COLOR=Lavender] - биография одобрено. <br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+
         '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +

		'[B][CENTER][COLOR=LIME][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',


	  prefix: ACCEPT_PREFIX,

	  status: true,
    },
    {

        title: '|Не по форме|',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша биография написана не по форме. <br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+
         '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +

		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: UNACCEPT_PREFIX,

	  status: false,
    },
    {


        title: '|РП биография не полная |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]В вашей [COLOR=RED]RolePlay [COLOR=Lavender] - биографии недостаточно информации. Даю вам 24 часа на ее дополнение. <br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+
         '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +

		'[B][CENTER][COLOR=YELLOW][ICODE]На рассмотрение[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: PIN_PREFIX,

	  status: true,
    },
    {
        title: '|Рп биография от 3 лица|',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша биография написана от 3-го лица. <br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+
         '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +

		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: UNACCEPT_PREFIX,

	  status: false,
    },
    {
        title: '|Недост-инфо в рп биографии|',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша биография отказана, причиной тому послужило: [color=red] недостаточно информации. <br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+
         '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +

		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: UNACCEPT_PREFIX,

	  status: false,
    },
    {

        title: '| Рп биография не по форме |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:

           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша биография отказана, причиной тому послужило: [color=red] биография не по форме . <br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+
         '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +

		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: UNACCEPT_PREFIX,

	  status: false,


        title: '|граммат ошибки |',
dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 58, 35, 1); font-family: UtromPressKachat',
	  content:

            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]В вашей [COLOR=RED]RolePlay [COLOR=Lavender] - биографии грамматические ошибки. Даю вам 24 часа на ее дополнение. <br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +

		'[B][CENTER][COLOR=YELLOW][ICODE]На рассмотрение[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: PIN_PREFIX,

	  status: true,
    

            title: '✿❯───────────────────────────── ❖СС/ЛД❖ ─────────────────────────────❮✿',
            dpstyle:'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(139, 25, 155, 0.5);'


           },
    {
            title: ' Одобрено ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(34, 255, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый игрок [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявление на должность либо же жалоба была [COLOR=LIME]Одобрена[/COLOR]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=#FF7F50][ICODE]С уважениеи Старший состав данной фракции.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lime][ICODE]✿❯────「 ❖ Одобрено ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
        },
        {
            title: ' Отказано ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый Игрок [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявление на должность либо же жалоба была [COLOR=RED]Отказана[/COLOR]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=#FF7F50][ICODE]С уважениеи Старший состав данной фракции.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]✿❯────「 ❖ Отказано ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
           },
    {
            title: ' Рассмотренно ',
            dpstyle: 'border-radius: 20px; margin-right: 5px; border: 2px solid; border-color: rgb(34, 255, 0, 1); font-family: UtromPressKachat',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/RV6KxHXw/Screenshot-2025-06-13-153142.png[/img][/url][/CENTER]' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемые игроки [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Данная тема была [COLOR=#FFA500]Рассмотрено[/COLOR]"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fb65Fbz/C0ffE.png[/img][/url][/CENTER]<br>' +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=#00BFFF][ICODE]текст/итоги.[/ICODE][/COLOR][/SIZE][/FONT]"+
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=#FF7F50][ICODE]С уважениеи Старший состав данной фракции.[/ICODE][/COLOR][/SIZE][/FONT]"+
            '[CENTER][url=https://postimg.cc/xXbqKHsB][img]https://i.postimg.cc/xXbqKHsB/aojbhgh.gif[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#FFA500][ICODE]✿❯────「 ❖ Рассмотрено ❖ 」────❮✿[/ICODE][/SIZE][/FONT]",
            prefix: PIN_PREFIX,
            status: true,
            pin: false,
       
        },


    ];

    $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
 addButton('Команде Проекта💥', 'teamProject', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
addButton('Теху', 'Texy', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
addButton('Спецу💥', 'Spec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 10);');
addButton('ГА', 'Ga', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(178, 34, 34, 10);');
addButton('📒 ШАБЛОНЧИКИ 📒', 'selectAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	 $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
$('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
$('button#Ga').click(() => editThreadData(GA_PREFIX, true));

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
        4 < hours && hours <= 11 ?
        'Доброе утро' :
        11 < hours && hours <= 15 ?
        'Добрый день' :
        15 < hours && hours <= 21 ?
        'Добрый вечер' :
        'Доброй ночи',
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
