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
// @downloadURL https://update.greasyfork.org/scripts/521855/FC.user.js
// @updateURL https://update.greasyfork.org/scripts/521855/FC.meta.js
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
    },
    {
         title: '★----★----★---ПРАВИЛА ROLE-PLAY ПРОЦЕССА---★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'nRP поведение',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=Red]| Jail 30 минут [/color][/FONT][/I][/B][/CENTER] " +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Уход от RP',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.02.[/COLOR] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=Red]| Jail 30 минут / Warn[/color][/CENTER]<br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'nRP drive',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=Red]| Jail 30 минут[/color][/CENTER]<br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Помеха работе (дальнобой/инкассатор)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.04.[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы [Color=Red]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/color][/CENTER]<br>" +
        "[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman]Пример: [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=times new roman]таран дальнобойщиков, инкассаторов под разными предлогами.[/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'nRP Обман',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=Red]| PermBan[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Аморал действия',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=Red]| Jail 30 минут / Warn[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Слив склада',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=Red]| Ban 15 - 30 дней / PermBan[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Обман в /do',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.10.[/color]  Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [Color=Red]| Jail 30 минут / Warn[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Помеха работе блогеров',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.12.[/color]  Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом [Color=Red]| Ban 7 дней[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'DB',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=Red]| Jail 60 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'RK',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.14.[/color] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=Red]| Jail 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'TK',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=Red]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'SK',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=Red]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'PG',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.17.[/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=Red]| Jail 30 минут[/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'MG',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'DM',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=Red]| Jail 60 минут[/color][/CENTER]<br>" +
        "[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman]Примечание: [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=times new roman]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил. [/FONT][/SIZE][/COLOR][/B][/CENTER]<br>" +
        "[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman]Примечание: [/FONT][/SIZE][/COLOR][SIZE=4][FONT=times new roman][COLOR=rgb(255, 255, 255)]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие. [/COLOR][/FONT][/SIZE][/B][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Mass DM',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.20.[/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=Red]| Warn / Ban 3 - 7 дней[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Обход системы/исп. багов',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=Red]| Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Стороннее ПО',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][B][I]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=Red]| Ban 15 - 30 дней / PermBan[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.31.[/color] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=Red]| Ban 7 дней / PermBan[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Обман адм',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=Red]| Ban 7 - 15 дней[/COLOR][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нац/Религ конфликт',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.35.[/color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=Red]| Mute 120 минут / Ban 7 дней[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Угрозы OOC',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.37.[/color] Запрещены OOC угрозы, в том числе и завуалированные [Color=Red]| Mute 120 минут / Ban 7 дней [/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Злоуп нарушениями',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.39.[/color] Злоупотребление нарушениями правил сервера [Color=Red]| Ban 7 - 30 дней [/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск проекта',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=Red]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Продажа промо',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.43.[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=Red]| Mute 120 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'ЕПП Фура, инкассатор',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=Red]| Jail 60 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Задержание в интерьере',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [Color=Red]| Ban 7 - 15 дней + увольнение из организации[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Помеха RP',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.51.[/color] Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса [Color=Red]| Jail 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'nRP акс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [Color=Red]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + Jail 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск адм',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=Red]| Mute 180 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Баг аним',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях [Color=Red]| Jail 60 / 120 минут [/color]<br>" +
            "[Color=Red]Пример:[/color] если нарушитель, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=Red]Jail на 120 минут[/COLOR]. <br>" +
                "Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками. <br>" +
                    "[Color=Red]Пример:[/color] если Нарушитель использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=Red]Jail на 60 минут[/color].[/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Долг',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их [Color=Red]| Ban 30 дней / Permban[/color][/CENTER]<br>" +
            "[Color=Red]Примечание:[/color] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется; <br>" +
            "[Color=Red]Примечание:[/color] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда; <br>" +
            "[Color=Red]Примечание:[/color] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Уже наказан',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель [Color=Red]уже наказан.[/color][/CENTER]<br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Рассмотрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---ИГРОВЫЕ ЧАТЫ-★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'Разговор на другом языке',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.01.[/color] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=Red]| Устное замечание / Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'CAPS',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск в ООС',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>'+
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Упом родни',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан мутом по данному пункту правил:<br> [Color=Red]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=Red]| Mute 120 минут / Ban 7 - 15 дней[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск родни',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан баном по данному пункту правил:<br> [Color=Red]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=Red]| Mute 120 минут / Ban 7 - 15 дней[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Флуд',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Злоуп знаками',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>'+
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск сексуального характера',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.07.[/color] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Угрозы о наказании адм',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Нарушитель будет наказан по пункту правил:<br> [Color=Red]3.09.[/color] Запрещены любые угрозы о наказании игрока со стороны администрации [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Выдача за адм',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=Red]| Ban 7 - 15 + ЧС администрации[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ввод в заблуждение',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=Red]| Ban 15 - 30 дней / PermBan[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Музыка в войс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.14.[/color] Запрещено включать музыку в Voice Chat [Color=Red]| Mute 60 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск/Упом род в войс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.15.[/color] Запрещено оскорблять игроков или родных в Voice Chat [Color=Red]| Mute 120 минут / Ban 7 - 15 дней[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>'+
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Шум в войс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.16.[/color] Запрещено создавать посторонние шумы или звуки [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама в войс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.17.[/color] Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=Red]| Ban 7 - 15 дней[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Религ/полит пропаганда',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.18.[/color] Запрещено политическое и религиозное пропагандирование [Color=Red]| Mute 120 минут / Ban 10 дней[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>'+
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Транслит',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях [Color=Red]| Mute 30 минут[/color][/CENTER]<br>" +
            "[Color=Orange]Пример[/color]: «Privet», «Kak dela», «Narmalna». <br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама промо',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.21.[/color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [Color=Red]| Ban 30 дней[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Торговля на тт госс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>'+
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Мат в VIP',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>'+
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---ИГРОВЫЕ АККАУНТЫ-★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'Fake',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=Red]| Устное замечание + смена игрового никнейма / PermBan[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск nick',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=Red]| Устное замечание + смена игрового никнейма / PermBan[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---ПРАВИЛА ГОС. СТРУКТУР---★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'Казино/БУ в форме госс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил для государственных организаций:<br> [Color=Red]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=Red]| Jail 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Исп. т/с орг в личных целях',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил для государственных организаций:<br> [Color=Red]1.08.[/color] Запрещено использование фракционного транспорта в личных целях [Color=Red]| Jail 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'nRP /edit',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил для государственных организаций:<br> [Color=Red]4.01.[/color] Запрещено редактирование объявлений, не соответствующих ПРО [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'nRP эфир',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил для государственных организаций:<br> [Color=Red]4.02.[/color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Замена текста',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил для государственных организаций:<br> [Color=Red]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=Red]| Ban 7 дней + ЧС организации[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Слив СМИ',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=Red]| PermBan[/color][/CENTER]<br><br>" +
        '[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>' +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---ПРАВИЛА ОПГ-★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'Nrp в/ч',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил нападения на военную часть:<br> За нарушение правил нападения на [Color=Orange]Войсковую Часть[/color] выдаётся предупреждение [Color=Red]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил нападения на военную часть:<br> Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома [Color=Red]| Warn[/color][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'нарушение правил Похищений/Ограблений',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан за Нонрп Ограбление/Похищениее в соответствии с данными правилами - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/']Кликабельно[/URL][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]',
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
        "[CENTER]Нарушений со стороны данного игрока нет.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно доказательств',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Недостаточно доказательств на нарушение от данного игрока. Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=Red][U]правилами подачи жалоб на игроков[/U][/color][/URL].[/CENTER]<br><br>" +
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
      title: 'Более 72 часов',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]С момента нарушения прошло более 72 часов[/CENTER]<br><br>" +
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
      title: 'Нет условий сделки',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В данных доказательствах отсутствуют условия сделки[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужна видеозапись.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Фрапс обрывается',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Видеозапись обрывается, загрузите доказательства на YouTube.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не работают доква',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Не работают доказательства.[/CENTER]<br>" +
        "[CENTER]Убедитесь в том что отправленная вами ссылка рабочая, а к доказательствам открыт доступ.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Доква отредактированы',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваши доказательства отредактированы.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'От 3-го лица',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Жалобы от 3-их лиц не принимаются[/CENTER]<br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Неадекват',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Неадекватное составление жалобы, создайте новую жалобу без использования прямых или заувалированных оскорблений, смайликов подобных оскорблению.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Для написания жалобы на администратора обратитесь сюда - [URL]https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.271/[/URL][/CENTER]<br>" +
        "[CENTER][B][I][FONT=georgia]Не забудьте ознакомиться с [COLOR=rgb(255, 0, 0)]правилами подачи жалоб на администрацию[/COLOR][/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на лд/зам',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Для написания жалобы на лидера/заместителя обратитесь сюда - [URL]https://forum.blackrussia.online/index.php?forums/Жалобы-на-лидеров.272/[/URL][/CENTER]<br>" +
        "[CENTER][B][I][FONT=georgia]Не забудьте ознакомиться с [COLOR=rgb(255, 0, 0)]правилами подачи жалоб на лидеров[/COLOR][/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы орг',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Нарушений от игрока исходя из общих правил серверов нет.[/CENTER]<br>" +
        "[CENTER][B][I][FONT=georgia]Оставьте жалобу в разделе организации игрока.[/CENTER]<br><br>" +
        "[CENTER][B][SIZE=4][FONT=times new roman]Приятной игры на [/FONT][FONT=courier new]Black Russia[/FONT] [/SIZE][COLOR=rgb(238, 119, 0)][SIZE=4][FONT=courier new]Orange[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=courier new]![/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ошиблись разделом серверов',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Жалоба подана в раздел другого сервера.[/CENTER]<br>" +
        "[CENTER][B][I][FONT=georgia]Внимательно изучите список игровых серверов и выберите свой.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Долг через трейд',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Согласно правилам долги выдаются только через банковские счета.[/CENTER]<br>" +
        "[CENTER][B][I][FONT=georgia]Ввиду этого жалоба не может быть одобрена.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
    title: 'Слив склада семьи (база)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Лидер сам виноват в том, что дал разрешение.[/CENTER]<br>" +
        "[CENTER][B][I][FONT=georgia]Ввиду этого жалоба не может быть одобрена.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Оск в рп чат',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Оскорбления в рп чат не наказуемы.[/CENTER]<br>" +
        "[CENTER][B][I][FONT=georgia]Ввиду этого жалоба не может быть одобрена.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Нету док-в',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]У вас отсутствуют доказательства.[/CENTER]<br>" +
        "[CENTER][B][I][FONT=georgia]Ввиду этого жалоба не может быть одобрена.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Видео плохого качества',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваше видео плохого качества.[/CENTER]<br>" +
        "[CENTER][B][I][FONT=georgia]Ввиду этого жалоба не может быть одобрена.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
{
      title: 'Скрин плохого качества',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваш скриншот плохого качества.[/CENTER]<br>" +
        "[CENTER][B][I][FONT=georgia]Ввиду этого жалоба не может быть одобрена.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не виден сервер',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]На ваших доказательствах не видно сервера, на котором происходит действие.[/CENTER]<br>" +
        "[CENTER][B][I][FONT=georgia]Ввиду этого жалоба не может быть одобрена.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'РП процесс',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Данный случай относится к РП процессу.[/CENTER]<br>" +
        "[CENTER][B][I][FONT=georgia]Ввиду этого жалоба не может быть одобрена.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'РП обман',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Данный обман является РП обманом, за который наказание со стороны администрации не выдаётся.[/CENTER]<br>" +
        "[CENTER][B][I][FONT=georgia]Ввиду этого жалоба не может быть одобрена.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '★----★----★---RP био/сит/орг---★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★----★',
    },
    {
      title: 'био +',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Lime]Одобрено[/COLOR].[/I][/CENTER][/FONT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
    },
    {
      title: 'био -',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/Правила-написания-биографии-персонажа-orange.336814/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био - (форма)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило несоответствие форме подачи RolePlay биографий.<br>" +
        "С формой подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-написания-биографии-персонажа-orange.336814/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био - (текст)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило малое количество текста в вашей биографии.<br>" +
        "Дополнительно с формой подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-написания-биографии-персонажа-orange.336814/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био - (оффтоп)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило несоответствие вашего сообщения данному разделу.<br>" +
        "С формой подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-написания-биографии-персонажа-orange.336814/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био - (ошибки)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило большое количество ошибок в вашей биографии.<br>" +
        "С формой подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-написания-биографии-персонажа-orange.336814/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био - (неадекватность)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило неадекватное оформление вашей биографии.<br>" +
        "С формой подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-написания-биографии-персонажа-orange.336814/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био - (копия)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило копирование чужой биографии.<br>" +
        "С формой подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-написания-биографии-персонажа-orange.336814/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био - (несоотв. дат)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило несоответствие дат в вашей биографии.<br>" +
        "С формой подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-написания-биографии-персонажа-orange.336814/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био - (нар. логики)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило нарушение логики в вашей биографии.<br>" +
        "С формой подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-написания-биографии-персонажа-orange.336814/'][Color=Red][U]Правила написания RP биографий[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'сит +',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay ситуация получает статус: [Color=Lime]Одобрено[/COLOR].[/CENTER]<br>" +
        "[CENTER]Вознаграждение за RP ситуацию [Color=Red]не выдаётся[/COLOR].[/I][/CENTER][/FONT]",
      prefix: ODOBRENORP_PREFIX,
      status: false,
    },
    {
      title: 'сит -',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay ситуация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/Правила-написания-rp-ситуаций.3345577/'][Color=Red][U]Правил написания RP ситуаций[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
      status: false,
    },
    {
      title: 'сит - (форма)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay ситуация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило несоответствие форме подачи RolePlay ситуаций.<br>" +
        "С формой подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-написания-rp-ситуаций.3345577/'][Color=Red][U]Правил написания RP ситуаций[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
      status: false,
    },
    {
      title: 'сит - (оффтоп)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay ситуация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причина отказа - несоответствие вашей темы [URL='https://forum.blackrussia.online/index.php?threads/Правила-написания-rp-ситуаций.3345577/'][Color=Red][U]Правилам написания RP ситуаций[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
      status: false,
    },
    {
      title: 'орг +',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay организация получает статус: [Color=Lime]Одобрено[/color].<br><br>" +
        "Если вам понадобится отредактировать информацию, свяжитесь со мной через Форумный Аккаунт или ВКонтакте.[/I][/CENTER][/FONT]",
      prefix: ODOBRENOORG_PREFIX,
      status: false,
    },
    {
      title: 'орг -',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay орагнизация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/Основные-правила-неофициальной-организации.96647/'][Color=Red][U]Основных правил RP организаций[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
      status: false,
    },
    {
      title: 'орг - (форма)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay организация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило несоответствие форме подачи RolePLay организаций.<br>"+
        "С формой подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/index.php?threads/Основные-правила-неофициальной-организации.96647/'][Color=Red][U]Основных правил RP организаций[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
      status: false,
    },
    {
      title: 'орг - (оффтоп)',
      content:
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay организация получает статус: [Color=Red]Отказано[/color].<br><br>" +
        "Причиной отказа послужило несоответствие вашей темы данному разделу.<br>"+
        "С формой подачи Вы можете ознакомиться здесь - [URL='https://forum.blackrussia.online/index.php?threads/Основные-правила-неофициальной-организации.96647/'][Color=Red][U]Основных правил RP организаций[/U][/color][/URL].[/I][/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
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