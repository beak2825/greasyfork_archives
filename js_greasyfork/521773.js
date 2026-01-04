// ==UserScript==
// @name    FC
// @name:ru ГС/ЗГС
// @version 1.0
// @description  .
// @description:ru .
// @namespace https://forum.blackrussia.online
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @supportURL https://vk.com/maths2286
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/521773/FC.user.js
// @updateURL https://update.greasyfork.org/scripts/521773/FC.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const CLOSE_PREFIX = 7;
const ERWART_PREFIX = 14;
const TEXY_PREFIX = 13;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
    {
     title: '★----★----★---ПЕРЕАДРЕСАЦИЯ---★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'Тех',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба переадресована [COLOR=rgb(65, 105, 255)]Техническому Специалисту[/COLOR].[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте, когда администрация вынесет окончательный вердикт.[/I][/CENTER][/color][/FONT]',
      prefix: TEXY_PREFIX,
      status: false,
    },
    {
      title: 'Га',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба переадресована [COLOR=rgb(255, 0, 0)]Главному Администратору[/COLOR].[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте, когда администрация вынесет окончательный вердикт.[/I][/CENTER][/color][/FONT]',
      prefix: GA_PREFIX,
      status: false,
    },
    {
      title: 'На рассмотрении',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба взята на рассмотрение.[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте, когда администрация вынесет окончательный вердикт.[/I][/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---Одобрено ЛИДЕРЫ---★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'Наказание будет снято',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваша жалоба была рассмотрена и одобрена, с лидером будет проведена профилактическая беседа.[/FONT][/I][/B][/CENTER] " +
        "[CENTER][FONT=georgia][I][B]Ваше наказание будет снято в ближайшее время, если оно еще не снято.[/FONT][/I][/B][/CENTER] " +
        "[CENTER][FONT=georgia][I][B]Приносим извинения за предоставленные неудобства.[/FONT][/I][/B][/CENTER] " +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Одобрено',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваша жалоба была рассмотрена и одобрена, с лидером будет проведена профилактическая беседа.[/FONT][/I][/B][/CENTER] " +
        "[CENTER][FONT=georgia][I][B]Приносим извинения за предоставленные неудобства.[/FONT][/I][/B][/CENTER] " +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
    title: 'Вердикт ЗАЯВЛЕНИЕ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваша жалоба была рассмотрена и одобрена, с лидером будет проведена профилактическая беседа.[/FONT][/I][/B][/CENTER] " +
        "[CENTER][FONT=georgia][I][B]Приносим извинения за предоставленные неудобства.[/FONT][/I][/B][/CENTER] " +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
    title: 'Вердикт ЖАЛОБА',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваша жалоба была рассмотрена и одобрена, с лидером будет проведена профилактическая беседа. Вердикт в вашей жалобе будет изменен.[/FONT][/I][/B][/CENTER] " +
        "[CENTER][FONT=georgia][I][B]Приносим извинения за предоставленные неудобства.[/FONT][/I][/B][/CENTER] " +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
    title: '★----★----★---Отказы-------------★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'Нарушений нет',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны лидера/заместителя нет.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно доказательств',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Недостаточно доказательств на нарушение. Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/'][Color=Red][U]правилами подачи жалоб на лидеров[/U][/color][/URL].[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нет /time',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]На Ваших доказательствах отсутствует /time.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Тайм-кодов нет',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
      title: 'Более 48 часов',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]С момента нарушения прошло более 48 часов[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
      title: 'Доква в соц.сети',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]3.6. Прикрепление доказательств обязательно.<br>" +
            "[Color=Orange]Примечание[/color]: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
     title: 'не лд/9',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Данный игрок не является лидером/заместителем[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
      title: '★----★----★---Отказы ГОСС-------------★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
     },
    {
    title: 'Устав право',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны лидера/заместителя нет. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE-%D0%A3%D1%81%D1%82%D0%B0%D0%B2-%D0%9D%D0%95-%D0%A3%D0%94%D0%90%D0%9B%D0%AF%D0%A2%D0%AC.9827246/'][Color=Red][U]Устав Фракции[/U][/color][/URL].[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
    title: 'Устав фсб',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны лидера/заместителя нет. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%A4%D0%A1%D0%91-%D0%A3%D1%81%D1%82%D0%B0%D0%B2-%D0%9D%D0%95-%D0%A3%D0%94%D0%90%D0%9B%D0%AF%D0%A2%D0%AC.9827259/'][Color=Red][U]Устав Фракции[/U][/color][/URL].[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
     title: 'Устав гибдд',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны лидера/заместителя нет. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%93%D0%98%D0%91%D0%94%D0%94-%D0%A3%D1%81%D1%82%D0%B0%D0%B2-%D0%9D%D0%95-%D0%A3%D0%94%D0%90%D0%9B%D0%AF%D0%A2%D0%AC.9827273/'][Color=Red][U]Устав Фракции[/U][/color][/URL].[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
     title: 'Устав умвд',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны лидера/заместителя нет. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%A3%D0%9C%D0%92%D0%94-%D0%A3%D1%81%D1%82%D0%B0%D0%B2-%D0%9D%D0%95-%D0%A3%D0%94%D0%90%D0%9B%D0%AF%D0%A2%D0%AC.9827284/'][Color=Red][U]Устав Фракции[/U][/color][/URL].[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
    title: 'Устав мо',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны лидера/заместителя нет. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/forums/%D0%90%D1%80%D0%BC%D0%B8%D1%8F.262/'][Color=Red][U]Устав Фракции[/U][/color][/URL].[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
    title: 'Устав цб',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны лидера/заместителя нет. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%91%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0-%D0%A3%D1%81%D1%82%D0%B0%D0%B2.9826113/'][Color=Red][U]Устав Фракции[/U][/color][/URL].[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
        title: 'Устав фсин',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны лидера/заместителя нет. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%A4%D0%A1%D0%98%D0%9D-%D0%A3%D1%81%D1%82%D0%B0%D0%B2.9826145/'][Color=Red][U]Устав Фракции[/U][/color][/URL].[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---Отказы ОПГ-------------★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
     },
    {
    title: 'Устав лыт',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны лидера/заместителя нет. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93-%D0%A3%D1%81%D1%82%D0%B0%D0%B2.4928924/'][Color=Red][U]Устав Фракции[/U][/color][/URL].[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
    title: 'Устав арз',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны лидера/заместителя нет. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93-%D0%A3%D1%81%D1%82%D0%B0%D0%B2.4928924/'][Color=Red][U]Устав Фракции[/U][/color][/URL].[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
     title: 'Устав бат',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны лидера/заместителя нет. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%91%D0%B0%D1%82%D1%8B%D1%80%D0%B5%D0%B2%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93-%D0%A3%D1%81%D1%82%D0%B0%D0%B2.4928962/'][Color=Red][U]Устав Фракции[/U][/color][/URL].[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---еженедельники---★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
        title: '30',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 30 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
          title: '31',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 31 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
          title: '32',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 32 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
          title: '33',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 33 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
          title: '34',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 34 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
          title: '35',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 35 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
          title: '36',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 36 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
          title: '37',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 37 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '38',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 38 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '39',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 39 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '40',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 40 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '41',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 41 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '42',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 42 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '43',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 43 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '44',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 44 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '45',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 45 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '46',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 46 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '47',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 47 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '48',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 48 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '49',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 49 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '50',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 50 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '51',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 51 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '52',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 52 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '53',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 53 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '54',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 54 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '55',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 55 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '56',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 56 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '57',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 57 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '58',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 58 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '59',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 59 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '60',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 60 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '61',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 61 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '62',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 62 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '63',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 63 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '64',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 64 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '65',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 65 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '66',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 66 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '67',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 67 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '68',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 68 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '69',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 69 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '70',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 70 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '71',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 71 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '72',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 72 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '73',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает -73 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '74',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 74 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '75',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 75 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '76',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 76 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '77',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 77 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '78',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 78 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '79',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 79 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '80',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 80 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '81',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 81 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '82',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 82 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '83',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 83 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '84',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 84 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '85',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 85 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '86',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 86 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '87',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 87 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '88',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 88 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '89',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 89 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '90',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 90 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '91',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 91 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '92',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 92 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '93',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 93 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '94',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 94 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '95',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 95 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    { title: '96',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 96 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    { title: '97',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 97 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '98',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 98 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '99',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 99 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '100',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 100 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '101',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 101 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '102',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 102 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '103',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 103 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '104',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 104 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '105',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 105 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '106',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 106 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '107',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 107 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '108',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 108 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '109',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 109 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '110',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 110 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '111',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 111 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '112',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 112 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '113',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 113 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '114',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 114 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '115',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 115 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '116',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 116 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '117',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 117 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '118',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 118 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '119',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 119 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '120',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 120 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    { title: '121',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 121 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '122',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 122 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '123',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 123 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '124',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 124 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '125',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 125 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '126',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 126 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '127',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 127 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '128',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 128 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    { title: '129',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 129 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    { title: '130',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 130 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
               title: '131',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 131 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
          title: '132',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 132 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
          title: '133',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 133 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
          title: '134',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 134 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
          title: '135',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 135 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
          title: '136',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 136 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
          title: '137',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 137 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '138',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 138 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '139',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 139 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '140',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 140 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '141',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 141 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '142',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 142 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '143',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 143 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '144',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 144 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '145',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 145 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '146',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 146 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '147',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 147 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '148',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 148 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '149',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 149 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '150',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 150 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '151',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 151 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '152',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 152 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '153',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 153 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '154',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 154 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '155',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 155 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '156',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 156 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '157',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 157 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '158',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 158 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '159',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 159 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '160',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 160 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '161',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 161 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '162',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 162 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '163',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 163 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '164',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 164 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '165',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 165 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '166',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 166 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '167',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 167 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '168',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 168 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '169',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 169 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '170',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 170 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '171',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 171 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '172',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 172 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '173',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 173 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '174',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 174 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '175',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 175 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '176',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 176 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '177',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 177 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '178',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 178 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '179',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 179 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '180',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 180 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '181',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 181 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '182',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 182 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '183',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 183 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '184',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 184 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '185',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 185 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '186',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 186 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '187',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 187 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '188',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 188 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '189',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 189 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '190',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 190 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '191',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 191 балл.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '192',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 192 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '193',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 193 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '194',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 194 балла.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '195',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 195 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    { title: '196',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 196 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    { title: '197',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 197 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '198',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 198 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '199',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 199 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
         title: '200',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, Уважаемый лидер {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш еженедельный отчет рассмотрен и получает - 200 баллов.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    }
  ];
 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
    // Добавление кнопок при загрузке страницы
    addButton('Ответы', 'selectAnswer');
    // Поиск информации о теме
    const threadData = getThreadData();
    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
      buttons.forEach((btn, id) => {
        if (id > 0) {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
        }
        else {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
        }
      });
    });
  });
  function addButton(name, id) {
    $('.button--icon--reply').before(
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
    } else  {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            pin: 1,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
    }
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
    } else  {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            pin: 1,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
           }
function moveThread(prefix, type) {
// Получаем заголовок темы, так как он необходим при запросе
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
    }
})();