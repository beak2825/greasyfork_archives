// ==UserScript==
// @name         ARZAMAS | Скрипт для Кураторов Форума [F] By Richmond_Brooks
// @namespace    https://forum.blackrussia.online
// @version      0.8 FIX
// @description  По всем вопросам/фиксам/улучшениям - https://vk.com/developssh | Улучшенная версия
// @author       Richmond_Brooks | 28.03.24
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://cdn-icons-png.flaticon.com/128/4080/4080314.png
// @grant        none
// @license 	 Brooks
// @collaborator none
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/491357/ARZAMAS%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%5BF%5D%20By%20Richmond_Brooks.user.js
// @updateURL https://update.greasyfork.org/scripts/491357/ARZAMAS%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%5BF%5D%20By%20Richmond_Brooks.meta.js
// ==/UserScript==

// На рассмотрении - '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/gcSnDLQF/download-4.gif[/img][/url]<br>',
// Отказано - '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
// Одобрено - '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>',
// ТЕХУ - 		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/T3Nrgtbz/download-6.gif[/img][/url]<br>',
// ГА -
// https://forum.blackrussia.online/threads/Тесты-скрипта-arzamas.8048117/
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Отказано
const ACCEPT_PREFIX = 8; // Принято
const RESHENO_PREFIX = 6; // Решено
const PIN_PREFIX = 2; // ЗАКРЕПИТЬ
const GA_PREFIX = 12; // ГА
const COMMAND_PREFIX = 10; // Команде проекта
const CLOSE_PREFIX = 7; // Закрыто
const VAJNO_PREFIX = 1; // Префикс ВАЖНО
const WATCHED_PREFIX = 9; // Префикс СМОТРЕНО
const TEX_PREFIX = 13; // Теху
const PREFIKS = 0;
const OTKAZRP_PREFIX = 4; // Отказ РП
const ODOBRENORP_PREFIX = 8; // Одобрено РП
const NARASSMOTRENIIRP_PREFIX = 2; // На рассмотрении
const NARASSMOTRENIIORG_PREFIX = 2; // На рассмотрении ОРГ

const transfer = [
  {
    title: '| ТЕХУ |',
    content:
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' + 
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' + 
      "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
      "[B][CENTER][COLOR=lavender] Ваша жалоба переходит техническому специалисту! Ожидайте ответа от технического специалиста сервера.<br><br>" +
      "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/T3Nrgtbz/download-6.gif[/img][/url]<br>' +
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
    prefix: TEX_PREFIX,
    status: true,
  },
];

  const transferpin = [
    {
        title: '| Рассмотрение |',
        content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' + 
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' + 
          "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          "[B][CENTER][COLOR=lavender] Сейчас ваша жалоба находится на рассмотрении! Ожидайте ответа от старшей администрации сервера, не создавайте дубликаты и не пишите в игре, ВК, ДС, ТГ и т.д о жалобе. Все идет в порядке живой очереди! Будьте терпеливее.<br><br>" +
          "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/gcSnDLQF/download-4.gif[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
        prefix: PIN_PREFIX,
        status: true,
      },
  ];

  const accepted = [
    {
        title: '| Одобрить |',
        content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
          "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          "[B][CENTER][COLOR=lavender] После тщательной проверки вашей темы - Выношу вердикт:<br>"+
         "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
        prefix: ACCEPT_PREFIX,
        status: false,
      },
    ];

  const unaccepted = [
  {
        title: '| Отказать |',
        content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
          "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
          "[B][CENTER][COLOR=lavender] После тщательной проверки вашей темы - Выношу вердикт:<br>"+
        "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт на тему: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' +
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
        prefix: UNACCEPT_PREFIX,
        status: false,
      },
  ];

const paste = [

{
  title: '| Шубка | ',
  content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender] СООБЩЕНИЕ - Выношу на тему вердикт: [ISPOILER][COLOR=lavender]''Вердикт''[/COLOR][/ISPOILER]<br>"+
     "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
}
  ];

const otkazy = [

{
      title: '---(=== Отказы ===)---',
    },

{
      title: ' -|- ',
      content:
         '',
    },
  {
      title: '📝 | Не по форме |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Ваша тема не по форме, ознакомьтесь с правилами подачи жалоб на игроков. <br>"+
        "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт на тему: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
  {
      title: '📰 | Не по форме заголовок |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Заголовок вашей темы не по форме подачи, прочитайте правила подачи жалоб. <br>"+
        "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт на тему: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '👁️ | Не увидел(а) нарушений | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных док-в. Соответственно -  Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '❗ | Нет условий | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] Условия сделки не были и подтверждены, рассмотрению не подлежит. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '🕓 | Нет /time | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] В предоставленных док-вах нет подтверждения времени | /time. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '🔴 | Нет док-в | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] Вы не прикрепили [COLOR=red]доказательства[/COLOR]. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '🚩 | Не работает док-ва | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] Док-ва котрые вы прикрепили не работают. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER] Вы можете загрузить их на Имгур | Япикс <br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '🛑 | Недостаточно док-в | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] В данном случае для полного разбора ситуации нужно больше док-в. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '💻 | Док-ва в Соц-Сети | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] Док-ва в соц-сетях не подлежат рассмотрению. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '📽️ | Нужен Фрапс | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] В данном случае, нужна видео фиксация. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '🎬 | Неполный фрапс | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] Фрапс был обрезан или он не полный. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER] Вы можете создать новую тему уже с полным фрапсом, советуем залить его на видео-хостинг [COLOR=red]You[/COLOR][COLOR=lavender]Tube[/COLOR]<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '🕹️ | Фрапс после нарушения | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] В данном случае фиксация должна была быть ДО нарушения. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '🎞️ | Фрапс отредактирован | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] Фрапс подвергся редактированию. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '🐱‍👤 | ЖБ от 3 лица | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] Жалобу должен подовать непосредственно сам учатсник а не 3 лицо. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '🚧 | Тайм-коды | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] В фрапсе 3+ минут должны присутствовать ' Тайм - Коды '. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '⌛ | Правила 72-ух часов | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] С момента нарушения до момента подачи жалобы прошло 72 часа. Рассмотрению не подлежит. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '💸 | Долг не через банк | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] Долг должен был выдан через банк, рассмотрению не подлежит. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '⚙️ | Системный промо | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] Данный промокод является системным, за них наказаний не установлено. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '✅ | Уже был дан ответ | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] Вам был дан ответ в другой теме. Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER] Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '⛔ | Слив семьи (Кики) | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] Именно Вы дали ему роль ' Заместитель ' в вашей семье, никто вас не подстрикал. Вина лежит на вас так-как именно Вы ' Доверили ' данному игроку семью. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

{
      title: '📢 | Жалоба от ЛД | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] Жалоба на такие действия должна быть подана непосредственно лидером семьи, заявки от 3-их лиц не принимаются.<br>"+
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

{
      title: '📂 | Сборка | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] Сборка не просматривается через логирование.<br>"+
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

{
      title: '👁️ | Не видно НикНейм | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Ник игрока видно размыто/плохо, рассмотрению не подлежит<br>"+
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

{
      title: '👤 | Не правильный НикНейм | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Вы указали не правильный ник нейм игрока.<br>"+
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '📖 | Док-ву на Имгур/Япикс | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Док-ва должны загружатся на фото-видео хостинги по типу Имгур / Япикс / Ютуб. Другие - Не рассматриваются<br>"+
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
{
      title: '🗃️ | В другой раздел | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Этот раздел только для жалоб! Обратитесь в нужный вам раздел.<br>"+
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
  ];

const buttons = [
{
      title: '---(=== Нарушения | Мир ===)---',
    },
{
      title: ' -|- ',
      content:
         '',
    },
{
      title: '⚔️ | DM | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]DM[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.19 | [color=lavender] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины.[color=red]  | Jail 60 минут[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '💥 | MASS DM | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]MASS DM[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.20 | [COLOR=lavender]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=red]| Warn / Ban 3 - 7 дней[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '🚗 | DB | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]DB[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.13 | [COLOR=lavender]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=red]| Jail 60 минут[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '🏡 | SK | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]SK[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.16 |[COLOR=lavender] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=red]| Jail 60 минут / Warn (за два и более убийства)[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '🔄 | RK | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]RK[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.14 | [COLOR=lavender]Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [COLOR=red]| Jail 30 минут[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '🤝🏻 | TK | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]TK[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.15 | [COLOR=lavender]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [COLOR=red]| Jail 60 минут / Warn (за два и более убийства)[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '🦸‍♂ | PG | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]PG[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.17 | [COLOR=lavender]Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [COLOR=red]| Jail 30 минут[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '⛳ | ЕПП | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]ЕПП[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.46 | [COLOR=lavender]Запрещено ездить по полям на любом транспорте [COLOR=red]| Jail 30 минут[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '🏕️ | ЕПП ФУРА | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]ЕПП[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.47 | [COLOR=lavender]Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=red]| Jail 60 минут[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
  title: '✋ | Помеха Фура/Инкос |',
  content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Помеха РП | Дально / Инкос[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
    "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.04 | [COLOR=lavender]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [color=red]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/Spoiler]<br>" +
    "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
     "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
  prefix: ACCEPT_PREFIX,
  status: false,
    },
{
      title: '🤥 | nRP | Обман | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]nRP обман[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.05 | [COLOR=lavender]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=red]| PermBan[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '🏴‍☠️ | nRP | В/Ч | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]nRP В/Ч[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]* | [COLOR=lavender]Запрещено нарушение правил нападения на В/Ч, воровство мат. не по RP и т.д [COLOR=red]| Warn[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '👮 | nRP | Коп | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]nRP коп[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]* | [COLOR=lavender]Запрещено работать без RolePlay отыгровок, просто крутить человека, выдовать розыск не по УК и т.д | Warn [/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '🔎 | nRP | Розыск | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]nRP розыск[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]* | [COLOR=lavender]Запрещено выдовать розыск не по УК - RolePlay причине. | Warn[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '🛡️ | nRP | ФСИН | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]nRP фсин[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]* | [COLOR=lavender]Запрещено вытаскивать людей из деморгана, запрщено брать взятки и т.д [COLOR=red]| Warn[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '🛡️ | nRP | Поведение | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]nRP Поведение[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.01 | [COLOR=lavender]Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=red]| Jail 30 минут[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '🥵 | Аморальные действия | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Аморал[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.08 | [COLOR=lavender]Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=red]| Jail 30 минут / Warn[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '💰 | Ущерб эко | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Ущерб эко[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.30 |[COLOR=lavender] Запрещено пытаться нанести ущерб экономике сервера [COLOR=red]| Ban 15 - 30 дней / PermBan[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '💼 | Уход от РП | ',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Уход от РП[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.02 | [COLOR=lavender]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=red]| Jail 30 минут / Warn[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '🉐 | Слив склада Фама/Орг |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Слив Склада[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.09 | [COLOR=lavender]Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле. [COLOR=red]| Ban 15 - 30 дней / PermBan[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '🤬 | Багаюз в ЗЗ |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Багаюз в ЗЗ[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.55 | Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=red]| Jail 60 / 120 минут. [/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '🚨 | Не отдача долга |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Не отдача долга[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.57 | [COLOR=lavender]Запрещается брать в долг игровые ценности и не возвращать их. [COLOR=red]| Ban 30 дней / permban [/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '📕 | Сокрытие нарушителей |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Сокрытие нарушений[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.24 | [COLOR=lavender]Запрещено скрывать от администрации нарушителей или злоумышленников [COLOR=red]| Ban 15 - 30 дней / PermBan + ЧС проекта [/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '⭕ | Злоуп. нарушениями |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Злоупотребление нарушениями[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.39 | [COLOR=lavender]Злоупотребление нарушениями правил сервера [COLOR=red]| Ban 7 - 30 дней [/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '🎀 | Покупка репутации [ ФАМА ] |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Покупка репутации[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.49 | [COLOR=lavender]Многократная продажа или покупка репутации семьи любыми способами. [COLOR=red]| Ban 15 - 30 дней / PermBan + удаление семьи [/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '💮 | Арест в Казик/Аук/МП |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]nRP Арест[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.50 | [COLOR=lavender]Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=red]| Ban 7 - 15 дней + увольнение из организации.[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
{
      title: '⛩️ | СОФТ |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Посторонее ПО[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.22 | [COLOR=lavender]Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=red]| Ban 15 - 30 дней / PermBan.[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '💀 | Ник |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Посторонее ПО[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.22 | [COLOR=lavender]Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=red]| Ban 15 - 30 дней / PermBan.[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '💊 | Сбив темпа |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Сбив Темпа[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.55 | [COLOR=lavender]Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=lavender]| Jail 60 / 120 минут[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '🏴‍☠️ | Сбив аним / 30 |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Сбив аним без ДМ-а[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.55 | [COLOR=lavender]Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=lavender]| Jail 60 / 120 минут[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '🔫 | Сбив аним / 60 |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Сбив аним ДМ[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]2.55 | [COLOR=lavender]Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=lavender]| Jail 30 если с ДМ-ом 120 минут[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '🤱🏻 | Оск род |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Оскорбление родни[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]3.04 | [color=lavander]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [color=red]| Mute 120 минут / Ban 7 - 15 дней[/Spoiler]<br>" +
        "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '🤱🏻 | Упом род |',
      content:
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
     "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
     "[B][CENTER][COLOR=lavender]После тщательной проверки предоставленных вами док-в, было выявлено нарушение со стороны игрока - [ICODE]Упоминание родни[/ICODE]. Попрошу вас не создавать больше тем с дубликатами. В противном случае, ваш ФА - Форумный Аккаунт может быть заблокирован.<br>"+
     "[B][CENTER][COLOR=red]Игрок получит наказание по пункту: [Spoiler][color=red]3.04 | [color=lavander]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [color=red]| Mute 120 минут / Ban 7 - 15 дней[/Spoiler]<br>" +
     "[B][CENTER][COLOR=lavender]Соответственно - Выношу на тему вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
  ];

const transferAcceptBio = [
{
      title: '🟢 | Одобрить |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender] После тщательной проверки вашей РП Биографии - Выношу вердикт:<br>"+
         "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт: [ISPOILER][COLOR=lime]''Одобрено, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
  ];

const transferBio = [ // TTT - TransferToTheme

{
  title: '🔴 | Отказать |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender] После тщательной проверки вашей РП Биографии - Выношу вердикт:<br>"+
    "[B][CENTER][COLOR=lavender][ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
  prefix: UNACCEPT_PREFIX,
  status: false,
},

{
  title: '📋 | Неграмотно |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender] Ваша РП Биография была написана с граматическими ошибками.<br>"+
    "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт на тему: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
  prefix: UNACCEPT_PREFIX,
  status: false,
},

{
  title: '🗃️ | Не по форме |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша тема не по форме, ознакомьтесь с правилами РП Биографий. <br>"+
    "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт на тему: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
  prefix: UNACCEPT_PREFIX,
  status: false,
},

{
  title: '🖨️ | Скопиравоно |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Рп Биография была скопирована, не пытайтесь обмануть администрацию сервера. Это очень легко проверяется, секунды за 2-3. <br>"+
    "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт на тему: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
  prefix: UNACCEPT_PREFIX,
  status: false,
},

{
  title: '🦸‍♂ | Супергерой |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]РП Биография от СуперГероя которого в жизни быть не может. <br>"+
      "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт на тему: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
  prefix: UNACCEPT_PREFIX,
  status: false,
},

{
  title: '👀 | От 3-лица |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]РП Биография составлена от 3-лица. <br>"+
      "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт на тему: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
  prefix: UNACCEPT_PREFIX,
  status: false,
},

{
  title: '❌ | Недостаточно инфы |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]В вашей РП Биографии недостаточно информации.<br>"+
     "[B][CENTER][COLOR=lavender][ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: '🚫 | Недостаточно инфы | Семья |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]В вашей РП Биографии недостаточно информации о семье. <br>"+
     "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт на тему: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: '👴 | Возраст |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Возраст указанный вами не совпадает с нынешним.<br>"+
  "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт на тему: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: '💼 | NonRP Ник |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]У вас NonRP Ник, рассмотрению не подлежит.<br>"+
  "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт на тему: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: '🙏 | Религия |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]В вашей РП Биографии присутствует религиозная пропоганда, рассмотрению не подлежит.<br>"+
  "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт на тему: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: '🧍‍♂️ | Ник на англ |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ник в вашей РП Биографии написан на английском языке.<br>"+
  "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт на тему: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: '⚠️ | Не дополнил |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Вы не дополнили свою РП Биографию.<br>"+
  "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт на тему: [ISPOILER][COLOR=red]''Отказано, закрыто''[/COLOR][/ISPOILER]. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' + 
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
  prefix: UNACCEPT_PREFIX,
  status: false,
},
]

const DopTransferBio = [
  {
    title: '📌 | На дополнении |',
    content:
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cffXvQ9/image.png[/img][/url]<br>' +
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
      "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
      "[B][CENTER][COLOR=lavender]Ваша РП Биография уходит на доработку, даю вам 24 часа на доработку РП Био..<br>"+
    "[B][CENTER][COLOR=lavender]Соответственно, выношу вердикт на тему: [ISPOILER][COLOR=yellow]''На дополнении, открыто''[/COLOR][/ISPOILER]. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/gcSnDLQF/download-4.gif[/img][/url]<br>' +
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/QN7x3PcR/image.png[/img][/url]<br>',
    prefix: PIN_PREFIX,
    status: true,
  },
]



$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
  addButton('✍🏻 | Шубка ', 'selectShubka', 'border-radius: 13px; margin-right: 7px; margin-bottom: 5px; border: 2px solid;  border-color: rgb(255, 0, 239, 0.5);');
  addButton('- | -', '', 'border-radius: 13px; margin-right: 7px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 255, 255, 0.5);');
  addButton('🟢 | Одобрено', 'accept', 'border-radius: 13px; margin-right: 7px; margin-bottom: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
  addButton('🔴 | Отказано', 'unaccept', 'border-radius: 13px; margin-right: 7px; margin-bottom: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
  addButton('🗃️ | На рассмотрение', 'transferpin', 'border-radius: 13px; margin-right: 7px; margin-bottom: 5px; border: 2px solid; border-color: rgb(247, 255, 0, 0.5);');
  addButton('🛠️ | ТЕХУ', 'transfer', 'border-radius: 13px; margin-right: 7px; margin-bottom: 5px; border: 2px solid; border-color: rgb(119, 0, 255, 0.5);');
  addButton('- | -', '', 'border-radius: 13px; margin-right: 7px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 255, 255, 0.5);');
  addButton('⛔ | Отказы ', 'selectOtk', 'border-radius: 13px; margin-right: 7px; margin-bottom: 5px; border: 2px solid;  border-color: rgb(255, 0, 0, 0.5);');
  addButton('💻 | Наказания ', 'selectAnswer', 'border-radius: 13px; margin-right: 7px; margin-bottom: 5px; border: 2px solid;  border-color: rgb(255, 172, 5, 0.5);');
  addButton('- | -', '', 'border-radius: 13px; margin-right: 7px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 255, 255, 0.5);');
  addButton('✔️ | Одобрить Био', 'acceptTransferBio', 'border-radius: 13px; margin-right: 7px; margin-bottom: 5px; border: 2px solid;  border-color: rgb(0, 255, 9, 0.5);');
  addButton('📌 | На дополнении Био', 'dopTransferBio', 'border-radius: 13px; margin-right: 7px; margin-bottom: 5px; border: 2px solid;  border-color: rgb(247, 255, 0, 0.5);');
  addButton('❌ | Отказать Био', 'selectTransferBio', 'border-radius: 13px; margin-right: 7px; margin-bottom: 5px; border: 2px solid;  border-color: rgb(255, 0, 59, 0.5);');

// Поиск информации о теме
const threadData = getThreadData();

$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
  $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));
  $('button#texy').click(() => editThreadData(TEX_PREFIX, true));
  $('button#transfer').click(() => pasteContentTransfer());
  $('button#transferpin').click(() => pasteContentTransferPin());
  $('button#accept').click(() => pasteContentAccept());
  $('button#unaccept').click(() => pasteContentUnAccept());
  $('button#shubka').click(() => handlePasteShubka());      
  $('button#acceptTransferBio').click(() => pasteContentTransferAcceptBio());    
  $('button#dopTransferBio').click(() => pasteContentTransferDopBio());    

  $(`button#selectTransferBio`).click(() => {
    XF.alert(buttonsMarkup(transferBio, 'rgb(255, 0, 59, 0.5)'), null, 'Выберите ответ:');
    transferBio.forEach((btn, id) => {
        $(`button#answers-${id}`).click(() => pasteContentTransferBio(id, threadData, btn.status));
    });
  });  

  $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons, 'rgb(255, 172, 5, 0.5)'), null, 'Выберите вердикт:');
      buttons.forEach((btn, id) => {
          if(id > 1) {
              $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
          } else {
              $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
          }
      });
  });
  
  $(`button#selectOtk`).click(() => {
      XF.alert(buttonsMarkup(otkazy, 'rgb(255, 0, 0, 0.5)'), null, 'Выберите отказ:');
      otkazy.forEach((btn, id) => {
          if(id > 1) {
              $(`button#answers-${id}`).click(() => pasteContentOtk(id, threadData, true));
          } else {
              $(`button#answers-${id}`).click(() => pasteContentOtk(id, threadData, false));
          }
      });
  });

$(`button#selectShubka`).click(() => {
  XF.alert(buttonsMarkup(paste, 'rgb(255, 0, 123, 0.5)'), null, 'Уверены что хотите исп. шубку?');
  paste.forEach((btn, id) => {
      if(id > 1) {
          $(`button#answers-${id}`).click(() => handlePasteShubka());
      } else {
          $(`button#answers-${id}`).click(() => handlePasteShubka());
      }
  });
});
});

function pasteContentOtk(id, data = {}, send = false) {
  const template = Handlebars.compile(otkazy[id].content);
  if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

  $('span.fr-placeholder').empty();
  $('div.fr-element.fr-view p').append(template(data));
  $('a.overlay-titleCloser').trigger('click');

  if(send == true){
      editThreadData(otkazy[id].prefix, otkazy[id].status);
      $('.button--icon.button--icon--reply.rippleButton').trigger('click');
  }
}

function pasteContentTransferBio(id, data = {}, status) {
  const template = Handlebars.compile(transferBio[id].content);
  if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

  $('span.fr-placeholder').empty();
  $('div.fr-element.fr-view p').append(template(data));
  $('a.overlay-titleCloser').trigger('click');

  const targetForumID = 1537;

  moveThreadToForumBio(targetForumID);

  editThreadData(transferBio[id].prefix, status);
  $('.button--icon.button--icon--reply.rippleButton').trigger('click');
}

function moveThreadToForumBio(targetForumID) {

  const threadTitle = $('.p-title-value')[0].lastChild.textContent;

  fetch(`${document.URL}move`, {
    method: 'POST',
    body: getFormData({
      move: 1,
      target_node_id: targetForumID,
      title: threadTitle,
      _xfToken: XF.config.csrf,
      _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
      _xfWithData: 1,
      _xfResponseType: 'json',
    }),
  }).then(() => location.reload()); // Перезагружаем
}

function pasteContentTransferAcceptBio() {
  const threadData = getThreadData();
  const template = Handlebars.compile(transferAcceptBio[0].content);
  
  if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
  
  $('span.fr-placeholder').empty();
  $('div.fr-element.fr-view p').append(template(threadData));
  $('a.overlay-titleCloser').trigger('click');
  
  const targetForumID = 1535;

  moveThreadToForumAcceptBio(targetForumID);
  
  editThreadData(transferAcceptBio[0].prefix, false); 
  $('.button--icon.button--icon--reply.rippleButton').trigger('click');
}

function moveThreadToForumAcceptBio(targetForumID) {
  
  const threadTitle = $('.p-title-value')[0].lastChild.textContent;

  fetch(`${document.URL}move`, {
    method: 'POST',
    body: getFormData({
      move: 1,
      target_node_id: targetForumID,
      title: threadTitle,
      _xfToken: XF.config.csrf,
      _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
      _xfWithData: 1,
      _xfResponseType: 'json',
    }),
  }).then(() => location.reload()); // Перезагружаем
}

function pasteContentTransferDopBio() {
  const threadData = getThreadData();
  const template = Handlebars.compile(DopTransferBio[0].content);
  
  if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
  
  $('span.fr-placeholder').empty();
  $('div.fr-element.fr-view p').append(template(threadData));
  $('a.overlay-titleCloser').trigger('click');
  
  const targetForumID = 1536;

  moveThreadToForumDopBio(targetForumID);
  
  editThreadData(DopTransferBio[0].prefix, false); 
  $('.button--icon.button--icon--reply.rippleButton').trigger('click');
}

function moveThreadToForumDopBio(targetForumID) {
  
  const threadTitle = $('.p-title-value')[0].lastChild.textContent;

  fetch(`${document.URL}move`, {
    method: 'POST',
    body: getFormData({
      move: 1,
      target_node_id: targetForumID,
      title: threadTitle,
      _xfToken: XF.config.csrf,
      _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
      _xfWithData: 1,
      _xfResponseType: 'json',
    }),
  }).then(() => location.reload()); // Перезагружаем
}

function handlePasteShubka() {
  const threadData = getThreadData();
  const template = Handlebars.compile(paste[0].content);
  
  if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
  
  $('span.fr-placeholder').empty();
  $('div.fr-element.fr-view p').append(template(threadData));
  $('a.overlay-titleCloser').trigger('click');
}


function pasteContentTransfer() {
const threadData = getThreadData();
const template = Handlebars.compile(transfer[0].content);

if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

$('span.fr-placeholder').empty();
$('div.fr-element.fr-view p').append(template(threadData));
$('a.overlay-titleCloser').trigger('click');

editThreadData(transfer[0].prefix, false); 
$('.button--icon.button--icon--reply.rippleButton').trigger('click');

}

function pasteContentTransferPin() {
  const threadData = getThreadData();
  const template = Handlebars.compile(transferpin[0].content);
  
  if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
  
  $('span.fr-placeholder').empty();
  $('div.fr-element.fr-view p').append(template(threadData));
  $('a.overlay-titleCloser').trigger('click');
  
  editThreadData(transferpin[0].prefix, true); // false означает, что не нужно прикреплять тему
  $('.button--icon.button--icon--reply.rippleButton').trigger('click');
}

function pasteContentAccept() {
  const threadData = getThreadData();
  const template = Handlebars.compile(accepted[0].content);
  
  if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
  
  $('span.fr-placeholder').empty();
  $('div.fr-element.fr-view p').append(template(threadData));
  $('a.overlay-titleCloser').trigger('click');
  
  editThreadData(accepted[0].prefix, false); 
  $('.button--icon.button--icon--reply.rippleButton').trigger('click');
}

function pasteContentUnAccept() {
  const threadData = getThreadData();
  const template = Handlebars.compile(unaccepted[0].content);
  
  if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
  
  $('span.fr-placeholder').empty();
  $('div.fr-element.fr-view p').append(template(threadData));
  $('a.overlay-titleCloser').trigger('click');
  
  editThreadData(unaccepted[0].prefix, false);
  $('.button--icon.button--icon--reply.rippleButton').trigger('click');
}

function addButton(name, id, style) {
       $('.button--icon--reply').before(
`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
);
}
  function addAnswers() {
      $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`);
  }
  
  function buttonsMarkup(buttons, color) {
      return `<div class="select_answer">${buttons.map(
          (btn, i) =>
              `<button id="answers-${i}" class="button--primary button rippleButton" style="border-radius: 13px; margin-right: 7px; margin-bottom: 5px; border: 2px solid;  border-color: ${color}; ${btn.dpstyle}">
                  <span class="button-text">${btn.title}</span>
              </button>`
      ).join('')}</div>`;
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