// ==UserScript==
// @name         KHABAROVSK | Ackerman
// @namespace    https://forum.blackrussia.online/
// @version      1.8.90
// @description  Если нашли баг/недочёт писать: https://vk.com/proocod (ВК)
// @author       Ackerman
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://postimg.cc/hfRNpSgW
// @downloadURL https://update.greasyfork.org/scripts/532445/KHABAROVSK%20%7C%20Ackerman.user.js
// @updateURL https://update.greasyfork.org/scripts/532445/KHABAROVSK%20%7C%20Ackerman.meta.js
// ==/UserScript==

(function () {
'use strict';
const UNACCEPT_MOVE = 2213;
const ACCEPT_MOVE = 2211;
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const GA_PREFIX = 12;
const TECH_PREFIX = 13;
const CLOSE_PREFIX = 7;
const GROUP = 98;
const ANSWER = 16;
const buttons = [
    {
        title: 'На рассмотрении',
        content:
        '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        'Ваша жалоба взята на рассмотрение.<br>' +
        'Ожидайте ответа...<br>' +
        '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
        '[COLOR=#ff9800][ICODE]На рассмотрение[/ICODE][/COLOR][/B][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
        status: true,
        type: ANSWER,
     },
     {
         title: 'Передача обращения',
         type: GROUP,
     },
     {
         title: 'Тех. специалисту',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Жалоба направлена на рассмотрение [COLOR=rgb(44, 130, 201)]Тех. специалисту[/COLOR].<br>' +
         'Ожидайте ответа...<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#ff9800][ICODE]На рассмотрение[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: TECH_PREFIX,
         status: true,
         type: ANSWER,
    },
    {
         title: 'Главному администратору',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Жалоба направлена на рассмотрение [COLOR=#d32f2f]Главному администратору[/COLOR].<br>' +
         'Ожидайте ответа...<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#ff9800][ICODE]На рассмотрение[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: GA_PREFIX,
         status: true,
         type: ANSWER,
    },
    {
         title: 'Команде проекта',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Жалоба направлена на рассмотрение [COLOR=#ffeb3b]Команде проекта[/COLOR].<br>' +
         'Ожидайте ответа...<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#ff9800][ICODE]На рассмотрение[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: COMMAND_PREFIX,
         status: true,
         type: ANSWER,
    },
    {
         title: 'Не по форме',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб, закреплённые в этом разделе.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Более 72часов',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'C момента нарушения игрока прошло более 72 часов.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Дублирование темы',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Дублирование темы.<br>' +
         'При продолжение ваш форумный аккаут будет [COLOR=#d32f2f]заблокирован[/COLOR].<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Ссылка не работает',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Ваша ссылка не кликабельна, либо же она не работает.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Нет док-ов',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Отсутствуют доказательства - следовательно, рассмотрению не подлежит.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'От 3-его лица',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Ваша жалоба написана от 3-его лица.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Не достаточно док-ов',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Жалоба содержит [COLOR=#d32f2f]недостаточное[/COLOR] количество доказательств,<br>предоставьте больше доказательств в следующей жалобе..<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Нецензурная брань в теме',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Жалобы с нецензурной бранью рассмотрению не подлежат.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Видео отредактировано',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Доказательства были подвергнуты редактированию.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Нарушений не найдено',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Нарушений со стороны данного игрока не было найдено.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Нарушений не найдено (Слив фамы)',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Нарушений со стороны данного игрока не было найдено.<br>' +
         'Так как лидер сам несёт ответственность за выданные доступа.<br> Игрок вправе взять столько, сколько ему разрешили.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Неполный фрапс',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Ваша видеозапись обрывается.<br>Загрузите полную видеозапись на видео-хостинг YouTube.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Нужен фрапс',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'В данных случаях нужна видеофиксация.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Нет /time',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'В ваших доказатествах нет /time.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Жалобы на адм',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Вы ошиблись разделом.<br>Обратитесь в раздел «Жалобы на администрацию».<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Обжалование',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Вы ошиблись разделом.<br>Обратитесь в раздел «Обжалование наказаний».<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Жалобы на сотрудников',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Вы ошиблись разделом.<br>Обратитесь в раздел «Жалобы на сотрудников» в разделе Гос. организаций.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Укажите таймкоды',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'Укажите таймкоды.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Нет условий сделки',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'В данных доказательствах отсутствуют условия сделки.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Док-ва через соц.сети',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=red]3.6.[/COLOR] Прикрепление доказательств обязательно.<br>' +
         '[COLOR=red]Примечание:[/COLOR] загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается,<br>доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Нужен фрапс + промотка чата',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         'В таких случаях нужна видеозапись + промотка чата.<br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#d32f2f][ICODE]Отказано[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
        title: "Основные правила",
        type: GROUP,
    },
    {
         title: 'Нонрп поведение',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено поведение, нарушающее нормы процессов Role Play режима игры. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Уход от РП',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запещено целенаправленно уходить от Role Play процесса всеразличными способами. [COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/COLOR][COLOR=rgb(209, 213, 216)][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'nRP Drive',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.03.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'nRP обман',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики. [COLOR=rgb(255, 0, 0)]| PermBan [/COLOR][COLOR=rgb(209, 213, 216)][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
         important: true,
    },
    {
         title: 'Role Play отыгровки в свою сторону',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.06.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые Role Play отыгровки в свою сторону или пользу  Запрещены любые Role Play отыгровки в свою сторону или пользу. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Аморальные действия',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.08.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена любая форма аморальных действий сексуального характера в сторону игроков. [COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Слив склада',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.09.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Использование фракц. т/с в лич. целях',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.11.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование рабочего или фракционного транспорта в личных целях. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Затягивание Role Play процесса',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.12.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено целенаправленное затягивание Role Play процесса. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'DB',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.13.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта. [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'TK',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.15.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины. [COLOR=rgb(255, 0, 0)]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'MG',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.18.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: UNACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'DM',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.19.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины. [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Mass DM',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.20.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более. [COLOR=rgb(255, 0, 0)]| Warn / Ban 3 - 7 дней[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Обход системы',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.21.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено пытаться обходить игровую систему или использовать любые баги сервера. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Стороннее ПО',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.22.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Действия вредящие репутации проекта',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.25.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены попытки или действия, которые могут навредить репутации проекта. [COLOR=rgb(255, 0, 0)]| PermBan + ЧС проекта[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Нанесение вреда ресурсам проекта',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.26.[/COLOR][COLOR=rgb(209, 213, 216)]  Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее). [COLOR=rgb(255, 0, 0)]| PermBan + ЧС проекта[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Распространение инфы админ-работ',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.27.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта. [COLOR=rgb(255, 0, 0)]| PermBan + ЧС проекта[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Трансфер имущества',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.29.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен трансфер имущества между серверами проекта. [COLOR=rgb(255, 0, 0)]| PermBan с обнулением аккаунта[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },{
         title: 'Реклама',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.31.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное. [COLOR=rgb(255, 0, 0)]| Ban 7 дней / PermBan [/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },{
         title: 'Обман администрации',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.32.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта. [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 дней[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },{
         title: 'Пользование уязвимостью правил',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.33.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено пользоваться уязвимостью правил. [COLOR=rgb(255, 0, 0)]| Ban 15 дней[/COLOR][COLOR=rgb(209, 213, 216)][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Запрещен уход от наказания',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.34.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен уход от наказания. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'IC и OOC конфликты о национальности/религии',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.35.[/COLOR][COLOR=rgb(209, 213, 216)] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате. [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Перенос конфликта из IC в OOC и наоборот',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.36.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено переносить конфликты из IC в OOC, и наоборот. [COLOR=rgb(255, 0, 0)]| Warn[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'OOC угрозы',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.37.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены OOC угрозы, в том числе и завуалированные. [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней [/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Распространение лич.инфы игроков и их родственников',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.38.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено распространять личную информацию игроков и их родственников. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Многократные нарушения',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.39.[/COLOR][COLOR=rgb(209, 213, 216)] Злоупотребление нарушениями правил сервера. [COLOR=rgb(255, 0, 0)]| Ban 7 - 30 дней[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Деструктивные действия по отношению к проекту',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.40.[/COLOR][COLOR=rgb(209, 213, 216)]  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе. [COLOR=rgb(255, 0, 0)]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'ЕПП',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.46.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено ездить по полям на любом транспорте. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'ЕПП на фуре',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.47.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора). [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Продажа/покупка репутации семьи',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.48.[/COLOR][COLOR=rgb(209, 213, 216)] Продажа или покупка репутации семьи любыми способами. [COLOR=rgb(255, 0, 0)]| Обнуление рейтинга семьи[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Многократная продажа/покупка репутации семьи',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.49.[/COLOR][COLOR=rgb(209, 213, 216)] Многократная продажа или покупка репутации семьи любыми способами. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan + удаление семьи[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Арест в аукционе',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.50.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона. [COLOR=rgb(255, 0, 0)]|  Ban 7 - 15 дней + увольнение из организации[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Помеха РП',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.51.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'nRP Аксессуар',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][QUOTE][COLOR=rgb(255, 0, 0)]2.52.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=rgb(255, 0, 0)]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Оск администрации, неуважение, неадекват.поведение',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.54.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации. [COLOR=rgb(255, 0, 0)]| Mute 180 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Багоюз анимации',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]2.55.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Помеха ИП',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=red]2.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [COLOR=rgb(255, 0, 0)] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
        title: "Игровые чаты",
        type: GROUP
    },
    {
         title: 'CapsLock',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]3.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'ОСК/УПОМ РОДНИ',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]3.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC). [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
         important: true,
    },
    {
         title: 'Флуд',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]3.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Злоуп знаками',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]3.06.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено злоупотребление знаков препинания и прочих символов. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Оскорбление',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]3.07.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Слив СМИ',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]3.08.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые формы «слива» посредством использования глобальных чатов. [COLOR=rgb(255, 0, 0)]| Ban 30 дней[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'nRP edit',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]04.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено нарушение правил редактирования обьявления, а также правил проведения эфира [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Выдача себя за адм',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]3.10.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена выдача себя за администратора, если таковым не являетесь. [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 + ЧС администрации[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Ввод в заблуждение командами',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]3.11.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Капс или оффтоп в репорт',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=red]3.12.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено подавать репорт с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее)[COLOR=rgb(255, 0, 0)] | Report Mute 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Политика',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]3.18.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено политическое и религиозное пропагандирование. [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 10 дней[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Транслит',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]3.20.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование транслита в любом из чатов. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Реклама/упом промокодов',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]3.21.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=rgb(255, 0, 0)]| Ban 30 дней[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'мат в VIP',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]3.23.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
        title: "Сторонние",
        type: GROUP
    },
    {
         title: 'фейк ник',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]4.10.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию. [COLOR=rgb(255, 0, 0)]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'Оскорбительный NickName',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]4.09.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные). [COLOR=rgb(255, 0, 0)]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
        title: "Правила организаций",
        type: GROUP
    },
    {
         title: 'Одиночный патруль',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]1.11.[/COLOR][COLOR=rgb(209, 213, 216)]  Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'nRP в/ч',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]1.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено нарушение правил нападения на Войсковую Часть | [COLOR=rgb(255, 0, 0)]Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },
    {
         title: 'нРП Коп',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]6.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено nRP поведение. [COLOR=rgb(255, 0, 0)]| Warn[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
         important: true,
    },
    {
         title: 'ЗАМЕНА ТЕКСТА',
         content:
         '[CENTER][FONT=courier new][B][COLOR=rgb(84, 172, 210)]Приветствую, уважаемый(-ая) {{ user.mention }}.[/COLOR]<br><br>' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '⇙ Игроку будет выдано [COLOR=red]наказание[/COLOR] за нарушение данного пункта правил ⇘<br>' +
         '[QUOTE][COLOR=rgb(255, 0, 0)]1.11.[/COLOR][COLOR=rgb(209, 213, 216)]  Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/QUOTE]' +
         '[IMG width="600px"]https://i.ibb.co/4FnVsC8/image.png[[IMG]https://ibb.co/51gRYCr[/IMG]<br>' +
         '[COLOR=#4caf50][ICODE]Одобрено[/ICODE][/COLOR][/B][/FONT][/CENTER]',
         prefix: ACCEPT_PREFIX,
         status: false,
         type: ANSWER,
    },

];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('Ответы', 'selectAnswer');
addButton('Одобрено', 'accept');
addButton('На рассмотрение', 'watched');
addButton('Закрыто', 'close');
addButton('Отказано', 'unaccept');

// Поиск информации о теме
const threadData = getThreadData();

$('button#accept').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#watched').click(() => editThreadData(PIN_PREFIX, false));


$(`button#selectAnswer`).click(() => {
    XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
    buttons.forEach((btn, id) => {
        if(id > 0) {
            $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
        } else {
            $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
        }
    });
});
});

function addButton(name, id) {
$('.button--icon--reply').before(
   `<button type="button" class="button rippleButton" id="${id}" style="margin-right: 6px; top: -2px; background-color: none; border: 3px solid green;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons.map((btn, i) => {
    if (btn.type == 98) {
        return `<button id="answers-0" class="button--primary button ` +`rippleButton" style="margin:5px; width: 96.5%; display: flex; justify-content: space-between;"><span class="button-text">📌</span><span class="button-text">${btn.title}</span><span class="button-text">📌</span></button>`
    } else {
        if (btn.important == true) {
            return `<button id="answers-${i}" class="button--primary button ` +`rippleButton" style="margin:5px; background: #31343b; border: 1px solid red"><span class="button-text">${btn.title}</span></button>`
        } else {
            return `<button id="answers-${i}" class="button--primary button ` +`rippleButton" style="margin:5px; background: #31343b;"><span class="button-text">${btn.title}</span></button>`
        }
    }}).join('')}</div>`;
}

function pasteContent(id, data = {}, send = false) {
const template = Handlebars.compile(buttons[id].content);
if ($('.fr-element.fr-view p').text() === ' ') $('.fr-element.fr-view p').empty();

    $('.fr-element.fr-view > p').empty();
    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view > p').last().append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if (send == true) {
      editThreadData(buttons[id].prefix, buttons[id].status);
      moveThread(buttons[id].move, buttons[id].prefix);
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
    const threadTitle =
          $('.p-title-value')[0].lastChild.textContent;

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

function moveThread(type, prefix) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;

    fetch(`${document.URL}move`, {
        method: 'POST',
        body: getFormData({
            title: threadTitle,
            prefix: prefix,
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